import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.config";

const ContactSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contacts"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      alert("Message sent successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <section className="bg-gradient-to-br from-white via-red-50 to-red-100 py-16 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-primary">
          How Can We Help?
        </h2>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto text-lg">
          We'd love to hear from you—whether it’s a question, feedback, or just
          a hello.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 border border-red-200 space-y-6"
        >
          <h2 className="text-2xl font-bold text-primary">Send Us a Message</h2>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name *"
            required
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address *"
            required
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Your Message *"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-primary text-white font-bold rounded-full transition duration-300"
          >
            Send Message
          </button>
        </form>

        {/* Right: Contact Info */}
        <div className="space-y-12">
          <div className="bg-white border border-red-200 p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-3">
              Contact Info
            </h3>
            <p className="text-gray-700 mb-6">
              Reach out to our team anytime—we're happy to help!
            </p>
            <div className="space-y-4 text-primary">
              <div className="flex items-center gap-3">
                <MdEmail className="w-6 h-6" />
                <a
                  href="mailto:info@anweshhan.com"
                  className="hover:underline"
                >
                 info@anweshhan.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="w-6 h-6" />
                <a href="tel:+91 98341 52439" className="hover:underline">
                +91 98341 52439
                </a>
              </div>
            </div>
          </div>
          <hr className="h-1 w-1/2 md:ml-28 bg-yellow-400 border-none my-6" />

          <div className="bg-red-50 border border-red-300 p-8 rounded-xl shadow-md text-primary">
            <h3 className="text-2xl font-bold text-primary mb-3">
              Program Support
            </h3>
            <p className="text-gray-700 mb-6">
              For queries about enrollment or course details, contact:
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MdEmail className="w-6 h-6" />
                <a
                  href="mailto:upasana.anweshan@gmail.com"
                  className="hover:underline"
                >
                  upasana.anweshan@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="w-6 h-6" />
                <a href="tel:+91 98341 52439" className="hover:underline">
                +91 98341 52439
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book a Call */}
      <div className="mt-16 max-w-4xl mx-auto text-center bg-white border border-red-200 rounded-xl shadow-lg p-12">
        <h3 className="text-3xl font-bold text-primary mb-4">
          Prefer to Talk?
        </h3>
        <p className="text-gray-700 mb-6">
          Schedule a 30-minute discovery call to explore how we can support you
          better.
        </p>
        <Link
          to="/calendar"
          className="inline-block bg-yellow-400  hover:bg-yellow-500 text-black font-semibold rounded-full px-8 py-3 transition duration-300"
        >
          Book a Call
        </Link>
      </div>
    </section>
  );
};

export default ContactSection;
