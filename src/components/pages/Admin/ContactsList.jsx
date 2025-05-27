import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase.config";
import Dashboard from "./Dashboard";

const ContactList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setSubmissions(data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="flex  md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-16 md:w-64">
        <div className="sticky top-24 h-screen">
          <Dashboard />
        </div>
      </aside>

      {/* Main Section */}
      <section className="flex-1 py-6 px-4 md:px-12 md:pt-24 md:mt-0 mt-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
            Contact Submissions
          </h1>

          {/* Mobile Card List */}
          <ul className="space-y-4 md:hidden">
            {loading ? (
              <li className="p-4 bg-white rounded-lg shadow text-center">
                Loading submissions...
              </li>
            ) : submissions.length === 0 ? (
              <li className="p-4 bg-white rounded-lg shadow text-center italic text-gray-400">
                No submissions found.
              </li>
            ) : (
              submissions.map((item) => (
                <li key={item.id} className="bg-white p-4 rounded-lg shadow">
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Email:</strong> {item.email}</p>
                  <p><strong>Phone:</strong> {item.phone}</p>
                  <p><strong>Subject:</strong> {item.subject}</p>
                  <p className="text-sm mt-2"><strong>Message:</strong> {item.message}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.createdAt?.toDate().toLocaleString() || "-"}
                  </p>
                </li>
              ))
            )}
          </ul>

          {/* Desktop/Table View */}
          <div className="hidden md:block bg-white shadow-xl rounded-2xl p-6 overflow-x-auto">
            <table className="min-w-full text-left border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-primary text-white text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      Loading submissions...
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-400 italic">
                      No submissions found.
                    </td>
                  </tr>
                ) : (
                  submissions.map((item) => (
                    <tr key={item.id} className="border-t border-gray-200 hover:bg-red-50 transition">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.email}</td>
                      <td className="p-3">{item.phone}</td>
                      <td className="p-3">{item.subject}</td>
                      <td className="p-3 text-sm">{item.message}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {item.createdAt?.toDate().toLocaleString() || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactList;
