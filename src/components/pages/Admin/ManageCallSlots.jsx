import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase.config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Dashboard from './Dashboard';

const ManageCallSlots = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]);

  // Fetch and clean expired slots
  useEffect(() => {
    const fetchSlots = async () => {
      const snapshot = await getDocs(collection(db, "timeslots"));
      const now = new Date();

      const validSlots = [];
      const deletePromises = [];

      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        const slotDateTime = new Date(`${data.date}T${data.time}`);

        if (slotDateTime > now) {
          validSlots.push({ id: docSnap.id, ...data });
        } else {
          deletePromises.push(deleteDoc(doc(db, "timeslots", docSnap.id)));
        }
      });

      await Promise.all(deletePromises);
      validSlots.sort((a, b) =>
        new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
      );
      setSlots(validSlots);
    };

    fetchSlots();
  }, []);

  // Add single slot
  const addSlot = async () => {
    if (!date || !time) return;
    const newSlotTime = new Date(`${date}T${time}`);
    if (newSlotTime <= new Date()) {
      alert("Cannot add a past time slot.");
      return;
    }

    const newSlot = { date, time };
    const docRef = await addDoc(collection(db, "timeslots"), newSlot);
    setSlots(prev => [...prev, { ...newSlot, id: docRef.id }]);
    setDate('');
    setTime('');
  };

  // Remove slot
  const removeSlot = async (id) => {
    await deleteDoc(doc(db, "timeslots", id));
    setSlots(slots.filter(slot => slot.id !== id));
  };

  // Auto-generate weekday slots for current month
  const generateMonthlySlots = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // current month

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const existingSnapshots = await getDocs(collection(db, "timeslots"));
    const existingSet = new Set(
      existingSnapshots.docs.map(doc => {
        const d = doc.data();
        return `${d.date}T${d.time}`;
      })
    );

    const newSlots = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day === 0 || day === 6) continue; // Skip weekends

      const dateStr = d.toISOString().split('T')[0];

      for (let hour = 10; hour < 18; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        const slotDateTime = new Date(`${dateStr}T${timeStr}`);

        if (slotDateTime > now && !existingSet.has(`${dateStr}T${timeStr}`)) {
          newSlots.push({ date: dateStr, time: timeStr });
        }
      }
    }

    const promises = newSlots.map(slot => addDoc(collection(db, "timeslots"), slot));
    const addedRefs = await Promise.all(promises);

    const slotsWithIds = newSlots.map((slot, index) => ({
      ...slot,
      id: addedRefs[index].id
    }));

    setSlots(prev => [...prev, ...slotsWithIds]);
    alert(`${slotsWithIds.length} new slots added!`);
  };

  return (
    <div className="flex md:flex-row bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-20 md:w-64">
        <div className="sticky top-24 h-screen">
          <Dashboard />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full p-4 md:p-8 md:mt-20 mt-20">
        <h1 className="text-2xl font-bold mb-6 text-primary">Manage Call Slots</h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 flex-wrap">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded px-4 py-2"
          />
          <button
            onClick={addSlot}
            className="w-full sm:w-auto bg-primary text-white px-5 py-2 rounded hover:bg-blue-900 transition"
          >
            Add Slot
          </button>
          <button
            onClick={generateMonthlySlots}
            className="w-full sm:w-auto bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
          >
            Auto Add This Month's Weekday Slots (10AM–6PM)
          </button>
        </div>

        {/* Slot List */}
        <ul className="space-y-3">
          {slots.map(slot => (
            <li
              key={slot.id}
              className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-white shadow-sm rounded px-4 py-3 border"
            >
              <span className="mb-2 sm:mb-0">{slot.date} at {slot.time}</span>
              <button
                onClick={() => removeSlot(slot.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageCallSlots;
