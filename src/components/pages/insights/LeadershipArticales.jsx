import React, { useEffect, useState } from "react";
import { db } from "../../../firebase.config"; // Import your Firebase config file
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
function truncateChars(text, charLimit) {
  return text.length > charLimit ? text.slice(0, charLimit) + "…" : text;
}

const LeadershipArticles = () => {
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
  }, []); // Empty dependency array to run the effect only once after the first render



  return (
    <div className="px-4 md:px-24 py-8">
      <h1 className="text-3xl md:text-4xl font-bold  mb-10 text-center mt-24">
        Leadership Articles
      </h1>

      {articles.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              to={`/insights/${article.id}`}
              key={article.id}
            >
              {" "}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300 flex flex-col items-center text-center overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {truncateChars(article.title, 30)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {truncateChars(article.subtitle, 40)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
          <div className="md:h-96  flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-4xl text-primary mr-3" />
        <p className="text-xl text-gray-700">Loading articles...</p>
      </div>
      )}
    </div>
  );
};

export default LeadershipArticles;
