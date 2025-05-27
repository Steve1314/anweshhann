import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase.config";
import Dashboard from "./Dashboard";

function ManageInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const snapshot = await getDocs(collection(db, "bookings"));
        const bookingsData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setInquiries(bookingsData);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "bookings", id));
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("Failed to delete inquiry.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex  md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-16 md:w-64">
        <div className="sticky top-24 h-screen">
          <Dashboard />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary text-center md:text-left mt-20">Manage Inquiries</h1>

        {inquiries.length === 0 ? (
          <p className="text-center">No inquiries found.</p>
        ) : (
          <>
            {/* Card layout for mobile */}
            <ul className="space-y-4 md:hidden">
              {inquiries.map((inq) => (
                <li key={inq.id} className="bg-white p-4 rounded-lg shadow">
                  <p><strong>Name:</strong> {inq.name}</p>
                  <p><strong>Email:</strong> {inq.email}</p>
                  <p><strong>Phone:</strong> {inq.number}</p>
                  <p><strong>Call Type:</strong> {inq.type}</p>
                  <p><strong>Date:</strong> {inq.date}</p>
                  <p><strong>Time:</strong> {inq.time}</p>
                  {inq.message && <p><strong>Message:</strong> {inq.message}</p>}
                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    {deletingId === inq.id ? 'Deleting...' : 'Delete'}
                  </button>
                </li>
              ))}
            </ul>

            {/* Table layout for md+ */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-primary text-white text-sm uppercase">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Call Type</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Message</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="border-b last:border-0">
                      <td className="px-4 py-2">{inq.name}</td>
                      <td className="px-4 py-2">{inq.email}</td>
                      <td className="px-4 py-2">{inq.number}</td>
                      <td className="px-4 py-2">{inq.type}</td>
                      <td className="px-4 py-2">{inq.date}</td>
                      <td className="px-4 py-2">{inq.time}</td>
                      <td className="px-4 py-2 whitespace-normal">{inq.message}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDelete(inq.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          {deletingId === inq.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ManageInquiries;
