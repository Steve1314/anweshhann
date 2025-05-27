import React, { useEffect, useState } from "react";
import { db } from "../../../firebase.config";
import { getDocs, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const Programs = () => {
  const [currentPrograms, setCurrentPrograms] = useState([]);
  const [upcomingPrograms, setUpcomingPrograms] = useState([]);
  const [loading, setLoading] = useState(true); // <-- loading state

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const currentSnapshot = await getDocs(
          collection(db, "programs/current/list")
        );
        const upcomingSnapshot = await getDocs(
          collection(db, "programs/upcoming/list")
        );
   
        const currentPrograms = currentSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            type: "current",
            ...doc.data(),
          }))
          .sort((a, b) => a.order - b.order); // Sort by order
   
        const upcomingPrograms = upcomingSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            type: "upcoming",
            ...doc.data(),
          }))
          .sort((a, b) => a.order - b.order); // Sort by order
   
        setCurrentPrograms(currentPrograms);
        setUpcomingPrograms(upcomingPrograms);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      } finally {
        setLoading(false); // <-- Stop loading once done
      }
    };
   
    fetchPrograms();
  }, []);

  const renderProgramCard = (program) => (
    <div
      key={program.id}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl"
    >
      <img
        src={program.image || null}
        alt={program.title}
        className="w-full h-48 sm:h-56 md:h-96 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{program.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{program.subtitle}</p>
        <Link to={`/program/${program.type}/${program.id}`}>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-blue-700">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-4xl text-primary mr-3" />
        <p className="text-xl text-gray-700">Loading programs...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:px-6 md:px-12 lg:px-24 pt-28 md:pt-0">
      {/* Current Programs */}


      <section className="mb-10 md:mt-20">
        <h1 className="text-center text-4xl  py-4">Our Offerings</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Programs</h2>
        {currentPrograms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {currentPrograms.map(renderProgramCard)}
          </div>
        ) : (
          <p className="text-gray-600">No current programs available.</p>
        )}
      </section>

      {/* Upcoming Programs */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Programs</h2>
        {upcomingPrograms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {upcomingPrograms.map(renderProgramCard)}
          </div>
        ) : (
          <p className="text-gray-600">No upcoming programs available.</p>
        )}
      </section>
    </div>
  );
};

export default Programs;
