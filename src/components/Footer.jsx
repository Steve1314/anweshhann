import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../firebase.config";
import { collection, getDocs } from "firebase/firestore";

export default function Footer() {
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Programs", to: "/programs" },
    { label: "Insights", to: "/insights" },
    { label: "Contact", to: "/contact" },
  ];

  const [currentPrograms, setCurrentPrograms] = useState([]);
  const [upcomingPrograms, setUpcomingPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const currentSnap = await getDocs(
          collection(db, "programs", "current", "list")
        );
        const upcomingSnap = await getDocs(
          collection(db, "programs", "upcoming", "list")
        );

        setCurrentPrograms(
          currentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setUpcomingPrograms(
          upcomingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 relative">
      
      {/* DESKTOP / TABLET */}
      <div className="hidden md:grid container mx-auto px-6 md:px-20 py-12 grid-cols-5 gap-10">
        {/* — About — */}
        <div className="space-y-4">
          <img src={Logo} alt="Anweshhann Logo" className="w-24 h-24" />
          <p className="text-sm leading-relaxed">
            Guided by “inquiry,” we help leaders slow down, reflect, and grow
            into wiser, more purposeful versions of themselves.
          </p>
          {/* <Link to="/admin">
            <button className="bg-yellow-500 text-gray-900 font-bold py-2 px-5 rounded-full uppercase text-xs hover:bg-yellow-400 transition">
              Sign Up
            </button>
          </Link> */}
        </div>

        {/* — Quick Links — */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="hover:text-white transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* — Current Programs — */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Current Programs</h4>
          <ul className="space-y-2 text-sm">
            {currentPrograms.length ? (
              currentPrograms.map(({ id, title, slug }) => (
                <li key={id}>
                  <Link
                    to={`/program/current/${slug || id}`}
                    className="hover:text-white transition"
                  >
                    {title}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Loading…</li>
            )}
          </ul>
        </div>

        {/* — Upcoming Programs — */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Upcoming Programs</h4>
          <ul className="space-y-2 text-sm">
            {upcomingPrograms.length ? (
              upcomingPrograms.map(({ id, title, slug }) => (
                <li key={id}>
                  <Link
                    to={`/program/upcoming/${slug || id}`}
                    className="hover:text-white transition"
                  >
                    {title}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Loading…</li>
            )}
          </ul>
        </div>

        {/* — Contact & Social — */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Get in Touch</h4>
          <div className="space-y-3 text-sm">
            <p>
              <strong className="text-white">Email</strong>
              <br />
              <a
                href="mailto:info@anweshhan.com"
                className="hover:text-white transition"
              >
                info@anweshhan.com
              </a>
            </p>
            <p>
              <strong className="text-white">Phone</strong>
              <br />
              <a
                href="tel:+919834152439"
                className="hover:text-white transition"
              >
                +91 98341 52439
              </a>
            </p>
          </div>
          <div className="mt-6 flex space-x-3">
             <Link to={"https://www.linkedin.com/company/anweshan-innerwork/"}>
              <button className="p-2 rounded-full bg-yellow-500">
                <FaLinkedinIn className="text-white hover:text-yellow-500 transition" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden bg-white text-gray-900 px-4 py-6 space-y-6 text-center">
        <div className="text-sm font-medium space-x-2">
          <Link to="/programs" className="hover:underline">
            Programs
          </Link>
          <span>|</span>
          <Link to="/insights" className="hover:underline">
            Insights
          </Link>
          <span>|</span>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
        </div>

        <img src={Logo} alt="Anweshhann Logo" className="mx-auto w-20 h-20" />

        <div className="flex justify-center space-x-4 text-xl">
          <Link to={"https://www.linkedin.com/company/anweshan-innerwork/"}>
          <button className="py-2 px-5 rounded-full bg-yellow-500">
            <FaLinkedinIn className="  "/></button></Link>
        </div>

        {/* <div className="flex justify-center">
          <Link to="/admin">
            <button className="bg-yellow-500 text-gray-900 font-bold py-2 px-5 rounded-full uppercase text-xs hover:bg-yellow-400 transition">
              Sign Up
            </button>
          </Link>
        </div> */}
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-700 text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} Anweshhann — All rights reserved.
      </div>
    </footer>
  );
}
