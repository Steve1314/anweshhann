import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";


export default function ReflectiveEducatorProgram() {
  const { id, type } = useParams(); // /programs/:type/:id
  const [program, setProgram] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id || !type) return;
      try {
        const docRef = doc(db, `programs/${type}/list`, id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setProgram({ id: snapshot.id, ...snapshot.data() });
        } else {
          console.log("Program not found");
        }
      } catch (err) {
        console.error("Error fetching program:", err);
      }
    };

    fetchProgram();
  }, [id, type]);

  if (!program) {
    return (
         <div className="h-screen flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-4xl text-primary mr-3" />
              <p className="text-xl text-gray-700">Loading program...</p>
            </div>
    );
  }

  return (
    <div className="font-sans text-[#432d26] pt-28 md:pt-0">
      {/* Top Banner */}

      {/* Hero */}
      <div
        className="relative bg-cover bg-center h-[500px]  rounded-lg shadow-lg"
        style={{ backgroundImage: `url(${program.bgImage || program.image})` }}
      >
        <div className="absolute inset-0 bg-[#432d26]/70 flex items-center px-6 md:px-32">
          <div className="text-white max-w-2xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{program.title}</h1>
            <h2 className="text-xl md:text-2xl italic border-b">
              {program.subtitle}
            </h2>
            <p className=" ">By Upasana Bhattacharya</p>
            <p className="text-sm">
              ICF-ACC | Leadership Development Facilitator | Founder, Anweshhann
            </p>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="  rounded-lg px-6 py-10 md:px-32 grid grid-cols-1 md:grid-cols-5 gap-4 -mt-16 z-10 relative">
        {(program.format || []).map((item, index) => (
          <div
            key={index}
            className="bg-[#fffbe6] border-l-4 border-[#ffc905] p-4 rounded shadow"
          >
            <h3 className="font-semibold text">{item.label}</h3>
            {item.value && <p className="text-sm mt-1">{item.value}</p>}
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="px-6 md:px-32 mt-10 ">
        <h2 className=" text-2xl border-b border-[#432d26]">Program Details</h2>
      </div>

      {/* Content & Sidebar */}
      <div className="grid md:grid-cols-3 gap-8 px-6 md:px-32 mt-12">
        <div className="md:col-span-2 space-y-4 text-[#432d26]">
          {/* <h2 className="text-2xl font-bold">The Program  is about </h2> */}
          <p className="text-base">{program.overview}</p>
          <div>
            <h3 className="text-xl font-semibold mt-10">
              What's in this program?
            </h3>
            <ul className="list-disc list-inside text-base space-y-1 mt-2">
              {(program.outcomes || []).map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-[#fff9e0] p-6 rounded-xl shadow-lg text-sm">
          <h3 className="text-lg font-bold mb-2">Who is it for?</h3>
          <ul className="space-y-10 text-sm">
            {(program.audience?.points || []).map((point, index) => (
              <li
                key={index}
                className={
                  index % 2 !== 0
                    ? "bg-[#f7f4ec] text-[#432d26] font-serif px-4 py-3 rounded-lg border-l-4 border-[#ffc905]"
                    : "text-gray-800"
                }
              >
                {index % 2 === 0 ? `${point}` : point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky CTA */}
      <Link></Link>
      <div className="fixed right-4 top-1/3 z-50 hidden md:block">
       <Link to={`/enroll/${type}/${id}`}>
        <button className="bg-[#ffc905] text-[#432d26] font-semibold px-5 py-3 rounded-lg shadow-md hover:bg-[#ffe067] transition">
          Enroll Now
        </button>
        </Link>
      </div>

      {program.differences?.length > 0 && (
        <div className="bg-white px-6 py-10 md:px-32 mt-10 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#432d26] mb-6">
            What Makes Us Different
          </h2>

          <ul className="grid sm:grid-cols-3 gap-4 text-sm text-[#432d26]">
            {program.differences.map((item, index) => (
              <li
                key={index}
                className="bg-[#fff9e0] p-4 rounded-lg border-l-4 border-[#ffc905] shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-20 bg-primary text-white text-center py-10 px-6 md:px-32 rounded-t-xl">
        <h2 className="text-2xl font-bold">{program.title}</h2>
        <p className="mt-2">{program.subtitle}</p>
        <Link to={`/enroll/${type}/${id}`}>
        <button className="mt-4 px-6 py-2 bg-white text-primary  font-semibold rounded shadow hover:brightness-105 transition">
   Enroll Now
        </button>
        </Link>
      </div>
    </div>
  );
}
