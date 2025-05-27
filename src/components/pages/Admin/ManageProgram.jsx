import { useState, useEffect } from "react";
import { db, storage } from "../../../firebase.config";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaEdit, FaTrashAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";
import Dashboard from "./Dashboard";
import { motion, AnimatePresence } from "framer-motion";


export default function AddProgramForm() {
  const [programType, setProgramType] = useState("current");
  const [editId, setEditId] = useState(null);
  const [activeReorder, setActiveReorder] = useState({
    id: null,
    direction: null,
  });

  const [form, setForm] = useState({
    order: 0,
    imageFile: null,
    title: "",
    subtitle: "",
    overview: "",
    content: [""],
    format: [{ label: "", value: "" }],
    outcomes: [""],
    audiencePoints: [""],
    differences: [],
  });

  const [currentPrograms, setCurrentPrograms] = useState([]);
  const [upcomingPrograms, setUpcomingPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
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
    };

    fetchPrograms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, imageFile: file });
  };

  const handleAudienceChange = (index, value) => {
    const updated = [...form.audiencePoints];
    updated[index] = value;
    setForm({ ...form, audiencePoints: updated });
  };

  const addAudiencePoint = () => {
    setForm({ ...form, audiencePoints: [...form.audiencePoints, ""] });
  };

  const removeAudiencePoint = (index) => {
    const updated = [...form.audiencePoints];
    updated.splice(index, 1);
    setForm({ ...form, audiencePoints: updated });
  };

  const handleFormatChange = (index, key, value) => {
    const updated = [...form.format];
    updated[index][key] = value;
    setForm({ ...form, format: updated });
  };

  const addFormatRow = () => {
    setForm({ ...form, format: [...form.format, { label: "", value: "" }] });
  };

  const removeFormatRow = (index) => {
    const updated = [...form.format];
    updated.splice(index, 1);
    setForm({ ...form, format: updated });
  };

  const handleOutcomeChange = (index, value) => {
    const updated = [...form.outcomes];
    updated[index] = value;
    setForm({ ...form, outcomes: updated });
  };

  const addOutcome = () => {
    setForm({ ...form, outcomes: [...form.outcomes, ""] });
  };

  const removeOutcome = (index) => {
    const updated = [...form.outcomes];
    updated.splice(index, 1);
    setForm({ ...form, outcomes: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const collectionRef = collection(db, `programs/${programType}/list`);

    try {
      let imageUrl = "";

      if (form.imageFile) {
        const imageRef = ref(
          storage,
          `programs/${Date.now()}_${form.imageFile.name}`
        );
        const snapshot = await uploadBytes(imageRef, form.imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        overview: form.overview,
        image:
          imageUrl ||
          (programType === "current"
            ? currentPrograms.find((p) => p.id === editId)?.image
            : upcomingPrograms.find((p) => p.id === editId)?.image) ||
          "",
        content: form.content,
        format: form.format,
        outcomes: form.outcomes,
        audience: {
          title: "Who is it for?",
          points: form.audiencePoints,
        },
        differences: form.differences,
        fullDescription: "Your long program description here...",
      };

      if (editId) {
        const docRef = doc(db, `programs/${programType}/list`, editId);
        await updateDoc(docRef, payload);
        alert("Program updated successfully!");
      } else {
        await addDoc(collectionRef, payload);
        alert("Program posted successfully!");
      }

      const currentSnapshot = await getDocs(
        collection(db, "programs/current/list")
      );
      const upcomingSnapshot = await getDocs(
        collection(db, "programs/upcoming/list")
      );

      setCurrentPrograms(
        currentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setUpcomingPrograms(
        upcomingSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      setForm({
        imageFile: null,
        title: "",
        subtitle: "",
        overview: "",
        content: [""],
        format: [{ label: "", value: "" }],
        outcomes: [""],
        audiencePoints: [""],
        differences: [],
      });

      setEditId(null);
    } catch (error) {
      console.error("Error posting/updating program:", error);
      alert("An error occurred.");
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await deleteDoc(doc(db, `programs/${type}/list`, id));
      if (type === "current") {
        setCurrentPrograms((prev) => prev.filter((p) => p.id !== id));
      } else {
        setUpcomingPrograms((prev) => prev.filter((p) => p.id !== id));
      }
      alert("Program deleted successfully!");
    } catch (error) {
      console.error("Error deleting program:", error);
      alert("An error occurred while deleting the program.");
    }
  };

  const handleDifferenceChange = (index, value) => {
    const updated = [...form.differences];
    updated[index] = value;
    setForm({ ...form, differences: updated });
  };

  const addDifference = () => {
    setForm({ ...form, differences: [...form.differences, ""] });
  };

  const removeDifference = (index) => {
    const updated = [...form.differences];
    updated.splice(index, 1);
    setForm({ ...form, differences: updated });
  };

  const swapOrders = async (index1, index2, type) => {
    const programs =
      type === "current" ? [...currentPrograms] : [...upcomingPrograms];
    const setPrograms =
      type === "current" ? setCurrentPrograms : setUpcomingPrograms;

    // Ensure valid indexes
    if (
      index1 < 0 ||
      index2 < 0 ||
      index1 >= programs.length ||
      index2 >= programs.length
    )
      return;

    const item1 = programs[index1];
    const item2 = programs[index2];

    // Swap in Firestore
    const ref1 = doc(db, `programs/${type}/list`, item1.id);
    const ref2 = doc(db, `programs/${type}/list`, item2.id);
    await updateDoc(ref1, { order: item2.order });
    await updateDoc(ref2, { order: item1.order });

    // Swap in local state
    const updated = [...programs];
    updated[index1] = { ...item2, order: item1.order };
    updated[index2] = { ...item1, order: item2.order };

    // Sort again and update state
    setPrograms(updated.sort((a, b) => a.order - b.order));
  };

  const handleOrderUp = async (order, id, type) => {
    const list = type === "current" ? currentPrograms : upcomingPrograms;
    const index = list.findIndex((p) => p.id === id);
    if (index > 0) {
      setActiveReorder({ id, direction: "up" });
      await swapOrders(index, index - 1, type);
      setTimeout(() => setActiveReorder({ id: null, direction: null }), 500);
    }
  };

  const handleOrderDown = async (order, id, type) => {
    const list = type === "current" ? currentPrograms : upcomingPrograms;
    const index = list.findIndex((p) => p.id === id);
    if (index < list.length - 1) {
      setActiveReorder({ id, direction: "down" });
      await swapOrders(index, index + 1, type);
      setTimeout(() => setActiveReorder({ id: null, direction: null }), 500);
    }
  };


  return (
    <div className="flex bg-white  min-h-screen ">
      <div className="md:w-64">
        <div className="sticky top-24 h-screen">
          <Dashboard />
        </div>
      </div>
      <div className="w-full md:w-2/3 md:ml-16 p-6 bg-white shadow-xl rounded-lg my-10 md:mt-28">
        <h2 className="text-3xl font-bold mb-8 text-primary">Manage Program</h2>
        <form onSubmit={handleSubmit} className="space-y-6 ">
          <input
            type="number"
            min="0"
            name="order"
            value={form.order}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded"
            required
          />
          {/* Program Image Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Program Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-3 rounded"
            />
            {form.imageFile && (
              <img
                src={URL.createObjectURL(form.imageFile)}
                alt="Preview"
                className="mt-4 h-40 object-contain rounded shadow"
              />
            )}
          </div>

          {/* Title and Subtitle */}
          <input
            type="text"
            name="title"
            placeholder="Program Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded"
            required
          />
          <input
            type="text"
            name="subtitle"
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded"
          />

          {/* Audience Points */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Who is it for?
            </label>
            {form.audiencePoints.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleAudienceChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 p-2 rounded"
                  placeholder={`Point ${index + 1}`}
                />
                {form.audiencePoints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAudiencePoint(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAudiencePoint}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Audience Point
            </button>
          </div>

          {/* Overview */}
          <textarea
            name="overview"
            placeholder="Program Overview"
            value={form.overview}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded"
            rows={4}
          />

          {/* Differences */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              What Makes It Different?
            </label>
            {form.differences.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleDifferenceChange(index, e.target.value)
                  }
                  className="flex-1 border border-gray-300 p-2 rounded"
                  placeholder={`Point ${index + 1}`}
                />
                {form.differences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDifference(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDifference}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Unique Point
            </button>
          </div>

          {/* Format Section */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Program Format
            </label>
            {form.format.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Mode)"
                  value={item.label}
                  onChange={(e) =>
                    handleFormatChange(index, "label", e.target.value)
                  }
                  className="w-1/3 border border-gray-300 p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="value"
                  value={item.value}
                  onChange={(e) =>
                    handleFormatChange(index, "value", e.target.value)
                  }
                  className="w-2/3 border border-gray-300 p-2 rounded"
                />

                {form.format.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFormatRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFormatRow}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Format Row
            </button>
          </div>

          {/* Outcomes */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Program Outcomes
            </label>
            {form.outcomes.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Outcome ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...form.outcomes];
                    updated[index] = e.target.value;
                    setForm({ ...form, outcomes: updated });
                  }}
                  className="w-full border border-gray-300 p-2 rounded"
                />
                {form.outcomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...form.outcomes];
                      updated.splice(index, 1);
                      setForm({ ...form, outcomes: updated });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, outcomes: [...form.outcomes, ""] })
              }
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Outcome
            </button>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Program Type
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="current"
                  checked={programType === "current"}
                  onChange={(e) => setProgramType(e.target.value)}
                  className="mr-2"
                />
                Current
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="upcoming"
                  checked={programType === "upcoming"}
                  onChange={(e) => setProgramType(e.target.value)}
                  className="mr-2"
                />
                Upcoming
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded font-semibold hover:bg-blue-900 transition"
          >
            {editId ? "Update Program" : "Submit Program"}
          </button>
        </form>

        {/* Programs List */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Current Programs
          </h3>
          <ul className="space-y-4">
            <AnimatePresence>
              {currentPrograms.map((program) => (
                <motion.li
                  key={program.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 p-4 rounded shadow-sm flex justify-between items-center"
                >
                  {/* program content */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {program.title}
                    </h4>
                    <p className="text-sm text-gray-600">{program.subtitle}</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleDelete("current", program.id)}
                      className="text-red-600 font-medium hover:underline"
                    >
                      <FaTrashAlt className="inline-block mr-2 text-2xl" />
                    </button>
                    <button
                      onClick={() => {
                        setForm({
                          ...program,
                          imageFile: null,
                          audiencePoints: program.audience?.points || [],
                        });
                        setEditId(program.id);
                        setProgramType("current");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      <FaEdit className="inline-block mr-2 text-2xl" />
                    </button>
                    <button
                      onClick={() =>
                        handleOrderUp(program.order, program.id, program.type)
                      }
                      disabled={
                        activeReorder.id === program.id &&
                        activeReorder.direction === "up"
                      }
                      className={`text-gray-700 ${
                        activeReorder.id === program.id &&
                        activeReorder.direction === "up"
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <FaArrowUp
                        className={`inline-block mr-2 text-2xl transition-transform ${
                          activeReorder.id === program.id &&
                          activeReorder.direction === "up"
                            ? "animate-bounce"
                            : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={() =>
                        handleOrderDown(program.order, program.id, program.type)
                      }
                      disabled={
                        activeReorder.id === program.id &&
                        activeReorder.direction === "down"
                      }
                      className={`text-gray-700 ${
                        activeReorder.id === program.id &&
                        activeReorder.direction === "down"
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <FaArrowDown
                        className={`inline-block mr-2 text-2xl transition-transform ${
                          activeReorder.id === program.id &&
                          activeReorder.direction === "down"
                            ? "animate-bounce"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Current Programs
          </h3>
          <ul className="space-y-4">
            <AnimatePresence>
              {upcomingPrograms.map((program) => (
                <motion.li
                  key={program.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 p-4 rounded shadow-sm flex justify-between items-center"
                >
                  {/* program content */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {program.title}
                    </h4>
                    <p className="text-sm text-gray-600">{program.subtitle}</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleDelete("current", program.id)}
                      className="text-red-600 font-medium hover:underline"
                    >
                      <FaTrashAlt className="inline-block mr-2 text-2xl" />
                    </button>
                    <button
                      onClick={() => {
                        setForm({
                          ...program,
                          imageFile: null,
                          audiencePoints: program.audience?.points || [],
                        });
                        setEditId(program.id);
                        setProgramType("current");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      <FaEdit className="inline-block mr-2 text-2xl" />
                    </button>
                    <button
                      onClick={() =>
                        handleOrderUp(program.order, program.id, program.type)
                      }
                      disabled={
                        activeReorder.id === program.id &&
                        activeReorder.direction === "up"
                      }
                      className={`text-gray-700 ${
                        activeReorder.id === program.id &&
                        activeReorder.direction === "up"
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <FaArrowUp
                        className={`inline-block mr-2 text-2xl transition-transform ${
                          activeReorder.id === program.id &&
                          activeReorder.direction === "up"
                            ? "animate-bounce"
                            : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={() =>
                        handleOrderDown(program.order, program.id, program.type)
                      }
                      disabled={
                        activeReorder.id === program.id &&
                        activeReorder.direction === "down"
                      }
                      className={`text-gray-700 ${
                        activeReorder.id === program.id &&
                        activeReorder.direction === "down"
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <FaArrowDown
                        className={`inline-block mr-2 text-2xl transition-transform ${
                          activeReorder.id === program.id &&
                          activeReorder.direction === "down"
                            ? "animate-bounce"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}
