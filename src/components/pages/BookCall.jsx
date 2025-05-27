import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase.config";

const BookCall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDate = location.state?.date;
  const selectedTime = location.state?.time || "";

  const [timeSlots, setTimeSlots] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    type: "Discovery Call",
    message: "",
    time: selectedTime,
  });

  useEffect(() => {
    const fetchTimeSlots = async () => {
      const q = query(collection(db, "timeslots"), where("date", "==", selectedDate));
      const snapshot = await getDocs(q);

      const slots = snapshot.docs.map((doc) => ({
        id: doc.id,
        time: doc.data().time,
      }));
      setTimeSlots(slots);
    };

    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const web3formData = new FormData();
    web3formData.append("access_key", "1eee8a47-c7e0-407f-9e42-5923b5bf311e");
    web3formData.append("name", form.name);
    web3formData.append("email", form.email);
    web3formData.append("number", form.number);
    web3formData.append("type", form.type);
    web3formData.append("message", form.message);
    web3formData.append("time", form.time);
    web3formData.append("date", selectedDate);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3formData,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        alert("Booking successful! Email sent.");
        await addDoc(collection(db, "bookings"), { ...form, date: selectedDate });

        const selectedSlot = timeSlots.find((slot) => slot.time === form.time);
        if (selectedSlot) {
          await deleteDoc(doc(db, "timeslots", selectedSlot.id));
        }

        navigate("/calendar");
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to submit booking and send email.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-28">
      <h1 className="text-2xl font-bold mb-4 text-center ">Book a Call</h1>

      {/* Display selected date */}
      <div className="text-center bg-gray-100 text-gray-800 py-2 rounded mb-4">
        Booking for:{" "}
        <span className="font-semibold text-black">{selectedDate}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="tel"
          name="number"
          placeholder="Phone Number"
          value={form.number}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option>Discovery Call</option>
          <option>Follow-up Call</option>
          <option>Consultation</option>
        </select>

        <select
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Time</option>
          {timeSlots.map((slot) => (
            <option key={slot.id} value={slot.time}>
              {slot.time}
            </option>
          ))}
        </select>

        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          rows="4"
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BookCall;
