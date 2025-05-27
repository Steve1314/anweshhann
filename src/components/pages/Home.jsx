import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase.config";
import AboutMainImg from "../../assets/AboutMainImg.png";
import AboutSubImg from "../../assets/AboutSubImg.png";
import HomeHeader from "../../assets/HomeHeader.png";

import img13 from "../../assets/image13.png";

import img24 from "../../assets/Rectangle24.png";

import {
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { FaUserTie, FaQuestionCircle, FaBrain, FaRoad, FaSpinner } from 'react-icons/fa';

import { IoIosArrowDroprightCircle } from "react-icons/io";

function truncateChars(text, charLimit) {
  return text.length > charLimit ? text.slice(0, charLimit) + "…" : text;
}

const Home = () => {

  const featuredReasons = [
    {
      title: 'Lead with more clarity, confidence, and connection — even in high-stakes situations',
      Icon: FaUserTie,            // a leader in a tie
    },
    {
      title: 'Ask better questions, hold deeper conversations, and grow your team without burning out',
      Icon: FaQuestionCircle,     // questions & inquiry
    },
    {
      title: 'Turn self-awareness into leadership action — one conversation, one decision at a time',
      Icon: FaBrain,              // awareness & insight
    },
    {
      title: 'Shift from reactive managing to intentional leading — and see your team shift with you',
      Icon: FaRoad,               // a clear path / direction
    },
  ];

  const [currentPrograms, setCurrentPrograms] = useState([]);
  const [upcomingPrograms, setUpcomingPrograms] = useState([]);
  const [loading, setLoading] = useState(true); // <-- loading state

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Function to fetch articles from Firestore
    const fetchArticles = async () => {
      try {
        const articlesCollection = collection(db, "LeadershipArticles");
        const articlesSnapshot = await getDocs(articlesCollection);
        const articlesList = articlesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesList); // Set articles in the state
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

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
    <div className="relative p-4">
      <div
        key={program.id}
        className="overflow-hidden rounded-lg shadow-lg group aspect-[18/13]"
      >
        {/* full-bleed image */}
        <img
          src={program.image}
          alt={program.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-primary bg-opacity-90 p-4 md:p-6 rounded-b-lg">
          <div className="flex flex-row items-center justify-between">
            <div className="max-w-[70%]">
              <h3 className="text-base md:text-lg font-bold text-white uppercase">
                {program.title}
              </h3>
              {/* subtitle hidden on mobile, visible on md+ */}
              <p className="hidden md:block text-xs md:text-sm text-white mt-1">
                {program.subtitle}
              </p>
            </div>
            <Link
              to={`/program/${program.type}/${program.id}`}
              className="ml-2 flex-shrink-0"
              aria-label={`Learn more about ${program.title}`}
            >
              <IoIosArrowDroprightCircle className="text-3xl md:text-4xl text-white hover:text-yellow-400 transition-colors duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const handleDotClick = (page) => {
    setCurrentPage(page);
  };

  // Slice the articles array to get the current page's articles
  const displayedArticles = articles.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-4xl text-primary mr-3" />
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${HomeHeader})`,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-50" />

        {/* Content */}
        <div className="relative text-center px-6 md:px-12 max-w-2xl">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-wider">
            Building <br /> conscious leaders <br />
            for a <br /> complex world
          </h1>

          {/* Underline */}
          <div className="w-24 h-px bg-white opacity-70 mx-auto my-4" />

          {/* Sub-heading */}
          <p className="text-gray-200 text-sm md:text-base lg:text-lg">
            Programs and coaching for managers, school leaders and educators to
            lead with clarity, calm, and presence.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/programs"
              className="px-6 py-2 bg-white text-gray-800 font-semibold rounded-full hover:bg-gray-100 transition"
            >
              Browse Programs
            </Link>
            <Link
              to="/about"
              className="px-6 py-2 bg-white text-gray-800 font-semibold rounded-full hover:bg-gray-100 transition"
            >
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredReasons.map(({ title, Icon }) => (
            <div key={title} className="flex flex-col items-center text-center space-y-3">
              <Icon className="text-red-600 w-12 h-12" />
              <p className="text-white font-medium">{title}</p>
            </div>
          ))}
        </div>
      </section>


      {/*AboutUS Section */}
      <section className="py-16 px-4 md:px-32 grid grid-cols-1 md:grid-cols-2 ">
        {/* left: image stack */}
        <div className="relative ml-32">
          {/* yellow accent behind */}
          <div className="absolute top-10 -left-4 w-1/3 h-1/3 bg-primary rounded-lg"></div>
          <div className="absolute bottom-5 left-20  w-1/3 h-1/3 bg-primary rounded-lg"></div>
          {/* main image */}
          <img
            src={AboutMainImg}
            alt="Consulting main"
            className="relative w-2/3 rounded-lg  shadow-lg"
          />
          {/* overlay sub-image */}
          <img
            src={AboutSubImg}
            alt="Consulting sub"
            className="absolute -bottom-12 -left-32 w-2/3 rounded-lg shadow-md"
          />

        </div>

        {/* right: text, features, progress, profile */}
        <div className="space-y-6">
          {/* tiny subtitle */}
          <p className="text-sm text-primary  uppercase tracking-wide">
            <strong> About Anweshhann </strong><br />
            Reflect. Ask. Grow.
          </p>

          {/* heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Leadership is human development in action
          </h1>

          {/* paragraph */}
          <p className="text-gray-600">
            Anweshhann is a leadership and learning practice dedicated to building <strong>conscious,
              emotionally intelligent, and people-first leaders</strong> — across education and corporate spaces.

          </p>
          <p className="text-gray-600">
            Rooted in coaching psychology, behavioral science, and timeless Indian wisdom, Anweshhann
            curates immersive learning journeys that go beyond skill-building. Whether it's helping a
            new manager find their leadership voice or empowering a school leader to shape culture, every
            program is designed to spark <strong>clarity, courage, and compassion</strong> in action.
          </p>
          <p className="text-gray-600">
            We don’t believe in one-size-fits-all trainings.
            We believe in <strong>facilitated transformation </strong>— where reflection meets real-world practice.
          </p>
          <p className="text-gray-600">
            At Anweshhann, we partner with organizations to create safe, strong spaces for leaders to grow from within.
            Because leadership is not a role you perform. It’s a way of being you live every day.

          </p>


        </div>
      </section>

      {/* Our Programs section */}
      <div className="grid grid-cols-[2fr_2fr] md:grid-cols-[3fr_2fr] items-center gap-2 md:gap-10">
        <div className="bg-primary h-12 md:h-16 w-full"></div>
        <h1 className="text-title  font-bold text-xl md:text-4xl text-center md:text-left">
          Our offerings &gt;&gt;
        </h1>
      </div>
      <div className="p-6 sm:px-6 md:px-20 ">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-6">
            Current Programs
          </h2>
          {currentPrograms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
              {currentPrograms.map(renderProgramCard)}
            </div>
          ) : (
            <p className="text-gray-600">No current programs available.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-6 ">
            Upcoming Programs
          </h2>
          {upcomingPrograms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {upcomingPrograms.map(renderProgramCard)}
            </div>
          ) : (
            <p className="text-gray-600 mb-16">No upcoming programs available.</p>
          )}
        </section>
      </div>

      {/* Our Articles Section */}
      <div className="grid grid-cols-[2fr_2fr] md:grid-cols-[2fr_3fr] items-center gap-2 md:gap-10">
        <h1 className="text-title text-primary font-bold text-xl md:text-4xl text-center md:text-right">
          Our Articles &gt;&gt;
        </h1>
        <div className="bg-primary h-12 md:h-16 w-full"></div>
      </div>
      <div className="py-10 md:pt-24 md:pb-16 md:px-28 flex flex-col items-center gap-6">
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentPage * 50}%)`,
              width: `${totalPages * 100}%`,
            }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div
                key={pageIndex}
                className="w flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 mx-auto"
              >
                {articles
                  .slice(
                    pageIndex * itemsPerPage,
                    (pageIndex + 1) * itemsPerPage
                  )
                  .map((article) => (
                    <Link
                      to={`/insights/leadership-article/${article.id}`}
                      key={article.id}
                    >
                      {" "}
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl  transition-transform transform hover:scale-105 duration-300 flex flex-col items-center text-center overflow-hidden mb-10">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-5">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2 truncate">
                            {truncateChars(article.title, 40)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {truncateChars(article.subtitle, 40)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full ${index === currentPage ? "bg-primary" : "bg-gray-300"
                }`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>

      {/* Floating Discovery + Newsletter Cards */}
      <div className="relative">
        {/* Background Image with dark overlay */}
        <div className="h-96 relative z-0">
          <img
            src={img13}
            alt="Background"
            className="object-cover w-full h-full"
          />
          <img
            src={img24}
            alt="Overlay"
            className="absolute top-0 left-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-secondary bg-opacity-30 z-10" />
        </div>

        {/* White space below image */}
        <div className="bg-white h-72 z-0"></div>

        {/* Main Call to Action Card */}
        <div className="absolute left-1/2 -translate-x-1/2 top-60 z-20 bg-white rounded-xl shadow-2xl md:w-[90%] md:max-w-5xl flex flex-row overflow-hidden  ">
          <div className="bg-white flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-3 shadow">
                <FaPhoneAlt className="text-primary text-xl md:text-2xl" />
              </div>
              <h1 className="text-primary text-xl md:text-3xl font-bold">
                Book a Discovery Call
              </h1>
            </div>
            <p className="text-primary  text-xs md:text-sm  font-medium max-w-xs">
              Let’s explore how we can support your growth journey — 1:1
              guidance and clarity await.
            </p>
            <Link to="/calendar">
              <button className="mt-3 rounded-full bg-primary text-white font-semibold px-6 py-2 hover:brightness-110 transition">
                Book Now
              </button>
            </Link>
          </div>

          {/* Newsletter Section */}
          <div className="bg-primary flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center border-t md:border-t-0 md:border-l border-[#e5d68a]">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full border border-white p-3">
                <FaEnvelope className="text-primary text-lg md:text-2xl" />
              </div>
              <h1 className="text-white text-base md:text-3xl font-bold">
                Join Our Newsletter
              </h1>
            </div>
            <p className="text-white text-xs md:text-sm font-medium max-w-xs">
              Get updates on our programs, insights, and resources straight to
              your inbox.
            </p>
            <Link to="/subscribe">
              <button className="mt-3 rounded-full bg-white text-red font-semibold px-6 py-2 text-primary transition">
                Subscribe
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
