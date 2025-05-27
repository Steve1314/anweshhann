import React, { useEffect, useState } from "react";
import { db } from "../../firebase.config";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const Enroll = () => {
  const { programId, programType } = useParams();

  const [programName, setProgramName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    designation: "",
    contact: "",
    email: "",
    expectation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProgramName = async () => {
      try {
        const docRef = doc(db, `programs/${programType}/list`, programId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProgramName(docSnap.data().title || "Unknown Program");
        } else {
          setProgramName("Program not found");
        }
      } catch (err) {
        setProgramName("Error fetching program");
        console.error(err);
      }
    };

    fetchProgramName();
  }, [programId, programType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.organization ||
      !formData.designation ||
      !formData.contact ||
      !formData.email
    ) {
      return "Please fill in all required fields.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const enrollmentsRef = collection(
        db,
        `programs/${programType}/list/${programId}/enrollments`
      );
      await addDoc(enrollmentsRef, {
        ...formData,
        enrolledAt: new Date(),
        programId,
        programType,
        programName,
      });
      setFormData({
        name: "",
        organization: "",
        designation: "",
        contact: "",
        email: "",
        expectation: "",
      });
      setLoading(false);
      alert("Enrollment submitted successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit the form.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-28">
      <div className=" bg-white  rounded-2xl shadow-lg max-w-xl w-full">
        <div className="flex flex-col items-center ">
          {/* Simulated string/rope */}
          <div className="w-1 h-4 bg-gray-500 rounded-full"></div>

          {/* The tag itself */}
          <div className="relative bg-primary border border-gray-300 px-6 py-2 rounded-md shadow-md mt-1">
            <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border border-gray-400 rounded-full z-10"></div>
            <span className="text-white font-semibold text-sm">
              {programType}
            </span>
          </div>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Enroll Now
          </h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={programName}
              readOnly
              className="w-full border border-gray-300 rounded-md p-3 bg-gray-100 text-gray-700 font-semibold"
            />

            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              value={formData.name}
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <input
              type="text"
              name="organization"
              placeholder="Organization"
              onChange={handleChange}
              value={formData.organization}
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <input
              type="text"
              name="designation"
              placeholder="Designation"
              onChange={handleChange}
              value={formData.designation}
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <input
              type="tel"
              name="contact"
              placeholder="Contact Number"
              onChange={handleChange}
              value={formData.contact}
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <textarea
              name="expectation"
              rows="4"
              placeholder="What are you looking for from the course?"
              onChange={handleChange}
              value={formData.expectation}
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-md hover:bg-blue-800 transition-all"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Enroll;
