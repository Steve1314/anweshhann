import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase.config";

const LeadershipArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "LeadershipArticles", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such article!");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    const fetchAllArticles = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "LeadershipArticles")
        );
        const articles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllArticles(articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticle();
    fetchAllArticles();
  }, [id]);
  console.log(article);
  if (!article) return <p className="text-center mt-10">Loading article...</p>;

  return (
    <div className="px-4 md:px-10 py-28">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white rounded-xl shadow p-4 max-h-screen overflow-y-auto  top-24">
          <h3 className="text-lg font-semibold mb-4">More Articles</h3>
          <ul className="space-y-3">
            {allArticles.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/insights/${item.id}`}
                  className={`block px-2 py-1 rounded hover:bg-blue-100 ${
                    item.id === id
                      ? "bg-blue-50 font-semibold text-blue-700"
                      : ""
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Article */}
        <div className="md:col-span-3 bg-white rounded-xl shadow-md p-6 space-y-6 ">
         
          <h1 className="text-3xl font-bold">{article.title}</h1>
          <h2 className="text-xl text-gray-600">{article.subtitle}</h2>
           <img
            src={article.image}
            alt={article.title}
            className="w-full  h-auto object-cover rounded-lg"
          />
          <p className="text-gray-700">{article.header}</p>

          {article.sections?.map((section, i) => (
            <div key={i} className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {section.heading}
              </h3>
              <p className="text-gray-700 mt-2">{section.main}</p>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                {section.bullets?.map((bullet, bIndex) => (
                  <li key={bIndex}>{bullet}</li>
                ))}
              </ul>
              <p className="text-gray-700 mt-2">{section.conclusion}</p>
            </div>
          ))}
          {article.overallConclusion && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800">
                Conclusion
              </h3>
              <p className="text-gray-700 mt-2">{article.overallConclusion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadershipArticle;
