import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(weekday);
dayjs.extend(isToday);

const TIMES = Array.from({ length: 9 }, (_, i) => `${(10 + i).toString().padStart(2, '0')}:00`);

const TeamsStyleCalendar = () => {
  const [slots, setSlots] = useState({});
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week
  const navigate = useNavigate();

  const getWeekdays = (offset = 0) => {
    const base = dayjs().weekday(1).add(offset * 7, 'day');
    return Array.from({ length: 5 }, (_, i) => base.add(i, 'day'));
  };

  const weekdays = getWeekdays(weekOffset);

  useEffect(() => {
    const fetchSlots = async () => {
      const snapshot = await getDocs(collection(db, 'timeslots'));
      const now = new Date();
      const cleaned = {};
      const deletions = [];

      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        const date = data.date;
        const time = data.time;
        const slotTime = new Date(`${date}T${time}`);

        if (slotTime <= now) {
          deletions.push(deleteDoc(doc(db, 'timeslots', docSnap.id)));
        } else {
          if (!cleaned[date]) cleaned[date] = [];
          cleaned[date].push(time);
        }
      });

      await Promise.all(deletions);
      setSlots(cleaned);
    };

    fetchSlots();
  }, []);

  const handleBook = (date, time) => {
    navigate('/bookcall', { state: { date, time } });
  };

  return (
    <div className="p-4 mt-20 overflow-x-auto">
      <div className="flex items-center justify-between max-w-6xl mx-auto mb-6">
        <button
          onClick={() => setWeekOffset(prev => Math.max(prev - 1, 0))}
          className={`bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 transition ${
            weekOffset === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={weekOffset === 0}
        >
          &lt;
        </button>
        <h2 className="text-xl font-semibold text-center">Week of {weekdays[0].format('MMM D, YYYY')}</h2>
        <button
          onClick={() => setWeekOffset(prev => prev + 1)}
          className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 transition"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-[80px_repeat(5,1fr)] border-t border-l max-w-6xl mx-auto">
        {/* Header: Days */}
        <div className="bg-gray-100 border-b border-r h-16 flex items-center justify-center font-semibold">
          Time
        </div>
        {weekdays.map((day, i) => (
          <div
            key={i}
            className={`bg-gray-100 border-b border-r h-16 text-center flex items-center justify-center font-semibold ${
              day.isToday() ? 'bg-blue-100 text-blue-700' : ''
            }`}
          >
            {day.format('ddd, MMM D')}
          </div>
        ))}

        {/* Body: Time grid */}
        {TIMES.map((time, i) => (
          <React.Fragment key={i}>
            {/* Time column */}
            <div className="border-r border-b h-20 flex items-center justify-center text-sm font-medium bg-white">
              {time}
            </div>
            {/* Time slots per day */}
            {weekdays.map((day, dIdx) => {
              const dateStr = day.format('YYYY-MM-DD');
              const available = slots[dateStr]?.includes(time);

              return (
                <div
                  key={dIdx}
                  className={`border-r border-b h-20 flex items-center justify-center ${
                    available ? 'bg-green-100 hover:bg-green-200 cursor-pointer' : 'bg-white'
                  }`}
                  onClick={() => available && handleBook(dateStr, time)}
                >
                  {available ? (
                    <span className="text-green-700 font-semibold text-sm">{time}</span>
                  ) : (
                    ''
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TeamsStyleCalendar;
