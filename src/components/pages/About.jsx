import React from "react";
import { FaQuoteLeft } from 'react-icons/fa';
import { FaUserTie, FaQuestionCircle, FaBrain, FaRoad } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import img16 from "../../assets/image16.png";
import img20 from "../../assets/image 20.png";
import img19 from "../../assets/image 19.png";
import Upasana from "../../assets/Upasana.jpg";
import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";
import image4 from "../../assets/image4.png";

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const About = () => {


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
  const stats = [
    { value: "10,500+", label: "Registered Students" },
    { value: "2,500", label: "Finished Courses" },
    { value: "90%", label: "Satisfaction Rate" },
    { value: "800", label: "5-Star Reviews" },
  ];

  const cards = [
    { image: image4, label: "Facilitation-first design" },
    { image: image1, label: "Behavioral Science" },
    { image: image2, label: "Coaching psychology" },
    { image: image3, label: "Indian philosophical thought" },
  ];

  const testimonials = [
    {
      text: `Working under the mentorship of Upasana Ma’am at Infinity School has been one of the most transformative experiences of my professional journey. As a coach, she brings a rare blend of clarity, empathy, and strategic insight that truly empowers those she guides. Her approach is deeply reflective and grounded, enabling meaningful shifts not just in skills, but in mindset and behavior.\n\nUpasana Ma’am has a unique ability to see potential even when it is hidden beneath self-doubt or hesitation. Through her guidance, I gained a stronger sense of personal leadership, became more intentional in my decision-making, and developed the resilience to lead through complexity. Her coaching style fosters deep self-awareness, while always encouraging forward movement with purpose. I am deeply grateful for her investment in my growth, and I continue to carry the lessons she taught me into every aspect of my professional life.`,
      author: 'Ritu Mittal',
      role: 'Academic Coordinator, Jaipuria Group of Institutions',
    },
    {
      text: `I had the privilege of working closely with Upasana for over three and a half years, during which I witnessed her unwavering commitment to meaningful transformation—both in individuals and in teams. Her work is grounded in a deep understanding of human behavior, and she brings a rare blend of insight, empathy, and strategic clarity to every engagement.\n\nUpasana has a unique ability to create safe, reflective spaces where people feel seen and empowered to grow. Whether facilitating mindset shifts, coaching for personal leadership, or supporting skill development, she leads with authenticity and purpose. Her approach is not about quick fixes, but about building lasting change—one conversation, one breakthrough at a time.\n\nWhat truly sets Upasana apart is her ability to meet people where they are, while gently but firmly guiding them toward where they need to be. Her influence has helped shape stronger, more conscious leaders across a variety of roles and industries.\n\nWorking with Upasana is not just a professional experience—it’s a personal journey of growth.`,
      author: 'Punita Josan',
      role: 'Head of Early Years, Shiv Nadar School',
    },
    {
      text: `Working alongside Upasana for over five years was one of the most enriching professional collaborations I’ve experienced. Whether she was designing capacity-building sessions for teachers or coaching emerging leaders, her approach consistently blended clarity, empathy, and depth.\n\nUpasana has a rare ability to create reflective, high-trust spaces where people feel both challenged and supported. Her sessions go far beyond training — they inspire real mindset shifts. What stands out most is her coaching-oriented style of leadership development. She doesn’t just transfer knowledge; she facilitates growth. I’ve seen educators, middle leaders, and even senior staff come away from her work more self-aware, grounded, and equipped to lead with purpose.\n\nIf you’re looking for someone who can build leadership capability from the inside out — with intelligence, humility, and heart — I can’t recommend her enough.`,
      author: 'Sangeeta Kapoor',
      role: 'Principal, Manav Rachna International School',
    },
    {
      text: `Collaborating with Upasana over three years was both professionally stimulating and personally transformative. As a school leader myself, I participated in several of her training sessions — each one felt less like a workshop and more like a guided journey inward.\n\nWhat sets Upasana apart is her ability to surface leadership not just as a role, but as a way of being. Her work seamlessly weaves together reflective practice, practical skill-building, and coaching-style facilitation that meets people exactly where they are. Whether she’s working with teachers or middle leaders, the shift is palpable — more clarity, more ownership, more courage in action.\n\nPersonally, I credit many of my own leadership shifts — especially around communication, boundary-setting, and self-regulation — to the spaces she held and the questions she asked. She has a quiet, powerful presence that moves people forward without ever pushing. If you’re looking to grow your team’s leadership capacity in a way that’s real, grounded, and deeply human, Upasana is someone I’d wholeheartedly recommend.`,
      author: 'Shaza Shahab',
      role: 'Head of Senior Wing, Sparsh Global School',
    },
  ];

  return (
    <div className="overflow-hidden bg-red-50 text-gray-900 ">
      {/* Hero */}
      <div
        className="px-4   grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 pt-28  mb-2"
      // style={{
      //   background: "linear-gradient(240deg, red 20%, #ffffff 80%)",
      // }}
      >
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-5xl text-red- md:text-7xl font-bold leading-tight">
            Upasana  Bhattacharya
          </h1>
          <p className="text-base md:text-xl text-gray-900 font-medium">
            Leadership Development Facilitator | ICF-ACC Coach | Founder, Anweshhann
          </p>
          <p>
            Upasana Bhattacharya is a leadership facilitator and ICF-ACC certified coach passionate about building reflective, emotionally intelligent leaders across sectors. With over a decade of experience in education leadership and people development, she brings a unique blend of coaching, behavioral science, and Indian philosophical wisdom into every program she designs and delivers.

          </p>
          <p>
            Through Anweshhann, her leadership and learning practice, Upasana curates high-touch, practice-based learning journeys that help managers and educators lead with clarity, courage, and compassion. Her work sits at the intersection of inner transformation and outer impact — making leadership less about titles, and more about presence.
          </p>
        </div>
        <img
          src={Upasana}
          alt="Upasana Bhattacharya"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>


      <section className="bg-white  py-12 border-4 border-red-600 border-spacing-3  rounded-xl m-4">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8  p-8">
          {featuredReasons.map(({ title, Icon }) => (
            <div key={title} className="flex flex-col items-center text-center space-y-3">
              <Icon className="text-primary w-12 h-12" />
              <p className="text-primary font-medium">{title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <div className="relative bg-white text-gray-900 py-4 px-6 md:px-56  m-6 ">
        <p className="text-center text-xl md:text-2xl font-bold ">
          I’ve spent over 12 years coaching 1,000+ teachers, school leaders,
          and first-time managers
        </p>

      </div>
       {/* Final Thoughts */}
      <div className="flex flex-col md:flex-row gap-16 px-6 md:px-40 py-16">
        <div className="space-y-4 w-full">
          <h3 className="text-xl font-medium">
            Whether a school principal or a product manager, leadership is
            about presence, discernment, and emotional clarity.
          </h3>
          <img
            src={img20}
            alt="Leadership in action"
            className="w-80 rounded-md shadow-md"
          />
        </div>
        <div className="space-y-4 w-full">
          <img
            src={img19}
            alt="Anweshhann Philosophy"
            className="w-80 rounded-md shadow-md"
          />
          <h3 className="text-xl font-medium">
            Anweshhann means “search” or “inquiry.” We help people slow down,
            reflect, and grow into wiser versions of themselves.
          </h3>
        </div>
      </div>
      {/* <div className=" flex flex-wrap justify-center gap-8 px-6 py-8 bg-whitemd:px-28 text-[#432d26] font-bold">
          {stats.map(({ value, label }, idx) => (
            <div key={idx} className="text-center">
              <h2 className="text-2xl md:text-3xl">{value}</h2>
              <p className="text-sm">{label}</p>
            </div>
          ))}
        </div> */}


      {/* Divider */}
      <div className="grid grid-cols-[2fr_2fr] md:grid-cols-[3fr_2fr] items-center gap-2 md:gap-10  ">
        <div className="h-12 md:h-16 w-full bg-primary" />
        <h1 className="text-xl md:text-4xl font-bold text-center md:text-left">
          My approach blends &gt;&gt;
        </h1>
      </div>

      {/* Coaching Cards */}
      <div className="py-10 px-6 md:px-28 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {cards.map(({ image, label }, i) => (
          <div
            key={i}
            className={`flex flex-col items-center text-center  p-2 rounded-lg shadow-2xl ${i % 2 === 1 ? 'bg-primary' : 'bg-white'}`}
          >
            <img src={image} alt={label} className=" mb-4 " />
            <h3 className={`text-sm md:text-2xl font-bold ${i % 2 === 1 ? 'text-white' : 'text-primary'}`}>{label}</h3>
          </div>
        ))}
      </div>
      {/* What Anweshhann Aims to Achieve */}
      <section className="bg-white py-16 px-4 md:px-20 rounded-xl mx-4 my-10 shadow-md">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-primary mb-4">What Anweshhann Aims to Achieve</h1>
          <p className="text-lg text-gray-700 mb-10">
            When individuals or organizations engage with Anweshhann, they walk away with:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            <div className="flex items-start space-x-4">
              <span className="text-red-600 text-2xl">✓</span>
              <p className="text-gray-800 text-base md:text-lg">
                <strong>Deep self-awareness</strong> and reflective leadership identity
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-red-600 text-2xl">✓</span>
              <p className="text-gray-800 text-base md:text-lg">
                <strong>Clarity of purpose</strong> aligned with values-based decision-making
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-red-600 text-2xl">✓</span>
              <p className="text-gray-800 text-base md:text-lg">
                <strong>Emotionally intelligent</strong>, coaching-style leadership skills
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-red-600 text-2xl">✓</span>
              <p className="text-gray-800 text-base md:text-lg">
                <strong>Stronger team engagement</strong> through trust, feedback, and psychological safety
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-red-600 text-2xl">✓</span>
              <p className="text-gray-800 text-base md:text-lg">
                <strong>Strategic thinking</strong> and cross-functional influence beyond day-to-day tasks
              </p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-xl font-semibold text-gray-900 max-w-3xl mx-auto">
              Whether you're a <span className="text-red-700 font-bold">corporate manager</span>,
              <span className="text-red-700 font-bold"> school leader</span>, or
              <span className="text-red-700 font-bold"> educator</span> — the journey through Anweshhann builds not just skills, but a deeper leadership identity.
            </p>
          </div>
        </div>
      </section>


      {/* Final Thoughts */}
      {/* <div className="flex flex-col md:flex-row gap-16 px-6 md:px-40 py-16">
        <div className="space-y-4 w-full">
          <h3 className="text-xl font-medium">
            Whether a school principal or a product manager, leadership is
            about presence, discernment, and emotional clarity.
          </h3>
          <img
            src={img20}
            alt="Leadership in action"
            className="w-80 rounded-md shadow-md"
          />
        </div>
        <div className="space-y-4 w-full">
          <img
            src={img19}
            alt="Anweshhann Philosophy"
            className="w-80 rounded-md shadow-md"
          />
          <h3 className="text-xl font-medium">
            Anweshhann means “search” or “inquiry.” We help people slow down,
            reflect, and grow into wiser versions of themselves.
          </h3>
        </div>
      </div> */}

      {/* Testimonials Slider */}
      <section className="py-16">
        <div className="grid grid-cols-[2fr_2fr] md:grid-cols-[2fr_3fr] items-center gap-2 md:gap-10 ">
          <h1 className="text-title text-primary font-bold text-xl md:text-4xl text-center md:text-right">
            Testimonials &gt;&gt;
          </h1>
          <div className="bg-primary h-12 md:h-16 w-full"></div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-10">


          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 12000, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 1 }
            }}
          >
            {testimonials.map(({ text, author, role }, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white p-8  rounded-lg shadow hover:shadow-lg transition relative h-full flex flex-col">
                  <FaQuoteLeft className="text-red-500 w-6 h-6 mb-4" />
                  <p className="text-sm text-center text-gray-700 whitespace-pre-line mb-6 leading-relaxed flex-grow">
                    {text}
                  </p>
                  <div className="mt-4 text-center">
                    <p className="font-semibold text-gray-900">{author}</p>
                    <p className="text-sm text-gray-600">{role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

    </div>
  );
};

export default About;
