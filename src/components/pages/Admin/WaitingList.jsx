import React, { useState, useEffect } from "react";
import { db } from "../../../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { FaSpinner, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Dashboard from "./Dashboard";

const WaitingList = () => {
  const [enrolments, setEnrolments] = useState([]);
  const [programType, setProgramType] = useState("current");
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null); // ⬅️ Manage open dropdown

  useEffect(() => {
    const fetchEnrolments = async () => {
      setLoading(true);
      try {
        const programRef = collection(db, "programs", programType, "list");
        const programSnapshot = await getDocs(programRef);
        const programIds = programSnapshot.docs.map((doc) => doc.id);

        let allEnrolments = [];

        for (let programId of programIds) {
          const enrolmentsRef = collection(
            db,
            "programs",
            programType,
            "list",
            programId,
            "enrollments"
          );
          const enrolmentSnapshot = await getDocs(enrolmentsRef);
          const enrolmentList = enrolmentSnapshot.docs.map((doc) => doc.data());
          allEnrolments = [...allEnrolments, ...enrolmentList];
        }

        setEnrolments(allEnrolments);
      } catch (error) {
        console.error("Error fetching enrolments: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolments();
  }, [programType]);

  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex bg-white">
      <div className="w-64">
        <div className="sticky top-24 h-screen">
          <Dashboard />
        </div>
      </div>
      <div className="p-6 bg-white rounded-lg w-5/6 mx-auto mt-20">
        <h1 className="text-3xl font-bold mb-6  text-gray-800 ">
          Program Enrolments
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setProgramType("current")}
            className={`px-2 py-1 rounded-lg text- font-semibold transition-colors duration-300 ${
              programType === "current"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-red-200"
            }`}
          >
            Current Programs
          </button>
          <button
            onClick={() => setProgramType("upcoming")}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 ${
              programType === "upcoming"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-red-200"
            }`}
          >
            Upcoming Programs
          </button>
        </div>

        {/* Loading & Data */}
        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <FaSpinner className="animate-spin text-3xl text-red-400" />
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        ) : enrolments.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No enrolments found.</p>
        ) : (
          <ul className="space-y-6">
            {enrolments.map((enrolment, index) => (
              <li
                key={index}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {enrolment.name}
                  </h3>
                  <button
                    onClick={() => toggleDetails(index)}
                    className="text-gray-600 hover:text-red-600 transition"
                    aria-label="Toggle Details"
                  >
                    {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>

                {/* Details Dropdown */}
                {openIndex === index && (
                  <div className="mt-4 text-gray-700 space-y-2 transition-all">
                    <p>
                      <span className="font-semibold">Program Name:</span>{" "}
                      {enrolment.programName}
                    </p>
                    <p>
                      <span className="font-semibold">Contact:</span>{" "}
                      {enrolment.contact}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {enrolment.email}
                    </p>
                    <p>
                      <span className="font-semibold">Expectation:</span>{" "}
                      {enrolment.expectation}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WaitingList;
