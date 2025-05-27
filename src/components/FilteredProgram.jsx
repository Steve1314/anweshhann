import React, { useState, useEffect } from "react";
import { db } from "../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function FilteredPrograms() {
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch programs and articles concurrently
        const [currSnap, upcSnap, artSnap] = await Promise.all([
          getDocs(collection(db, "programs/current/list")),
          getDocs(collection(db, "programs/upcoming/list")),
          getDocs(collection(db, "LeadershipArticles")),
        ]);

        const mapDocs = (snap, type, comingSoon = false) =>
          snap.docs.map((d) => ({
            id: d.id,
            img: d.data().image,
            title: d.data().title,
            desc: d.data().subtitle,
            comingSoon,
            type,
          }));

        const current = mapDocs(currSnap, "program", false);
        const upcoming = mapDocs(upcSnap, "program", true);
        const articles = mapDocs(artSnap, "article");

        setItems([...current, ...upcoming, ...articles]);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredItems([]);
      return;
    }
    const q = searchValue.toLowerCase();
    setFilteredItems(
      items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q)
      )
    );
  }, [searchValue, items]);

  const handleItemClick = (item) => {
    if (item.type === "program") {
      const programType = item.comingSoon ? "upcoming" : "current";
      navigate(`/program/${programType}/${item.id}`);
    } else {
      navigate(`/insights/${item.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <header className="bg-primary text-white py-8 px-4 md:px-0 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-white  mb-4">
          Search Programs &amp; Articles
        </h1>
        <input
          type="text"
          className="w-full md:w-1/2 mx-auto block h-10 rounded-full px-4 text-md md:text-lg text-gray-900"
          placeholder="Search by title or description..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </header>

      <main className="container mx-auto py-6 px-4">
        {searchValue ? (
          filteredItems.length > 0 ? (
            <ul className="grid gap-6">
              {filteredItems.map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  className="flex flex-col md:flex-row items-start bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full md:w-48 h-32 md:h-24 object-cover"
                  />
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                    {item.comingSoon && (
                      <span className="inline-block mt-2 px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 mt-12">
              No matching items found.
            </p>
          )
        ) : (
          <p className="text-center text-gray-600 mt-12">
            Start typing to search programs and articles...
          </p>
        )}
      </main>
    </div>
  );
}
