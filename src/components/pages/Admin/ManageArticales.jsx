import React, { useState, useEffect, useRef } from "react";
import Dashboard from "./Dashboard";
import { storage, db } from "../../../firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    header: "",
    image: "",
    sections: [],
    overallConclusion: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      const snapshot = await getDocs(collection(db, "LeadershipArticles"));
      setArticles(snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
    };
    fetchArticles();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => setImageFile(e.target.files[0]);

  const handleSectionChange = (idx, field, val) => {
    const sections = [...formData.sections];
    sections[idx][field] = val;
    setFormData(prev => ({ ...prev, sections }));
  };

  const handleBulletChange = (idx, bIdx, val) => {
    const sections = [...formData.sections];
    sections[idx].bullets[bIdx] = val;
    setFormData(prev => ({ ...prev, sections }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { heading: "", main: "", bullets: [""], conclusion: "" }]
    }));
  };

  const addBullet = idx => {
    const sections = [...formData.sections];
    sections[idx].bullets.push("");
    setFormData(prev => ({ ...prev, sections }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        const imgRef = ref(storage, `articles/${Date.now()}_${imageFile.name}`);
        const snap = await uploadBytes(imgRef, imageFile);
        imageUrl = await getDownloadURL(snap.ref);
      }
      const payload = { ...formData, image: imageUrl };
      if (editingId) {
        await updateDoc(doc(db, "LeadershipArticles", editingId), payload);
        setArticles(a => a.map(x => x.id === editingId ? { id: editingId, ...payload } : x));
      } else {
        const docRef = await addDoc(collection(db, "LeadershipArticles"), payload);
        setArticles(a => [...a, { id: docRef.id, ...payload }]);
      }
      setFormData({ title: "", subtitle: "", header: "", image: "", sections: [], overallConclusion: "" });
      setImageFile(null);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Error saving article");
    }
  };

  const handleDelete = async id => {
    await deleteDoc(doc(db, "LeadershipArticles", id));
    setArticles(a => a.filter(x => x.id !== id));
  };

  const handleEdit = art => {
    setFormData({
      title: art.title,
      subtitle: art.subtitle,
      header: art.header,
      image: art.image,
      sections: art.sections || [],
      overallConclusion: art.overallConclusion || ""
    });
    setEditingId(art.id);
    setImageFile(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex  md:flex-row bg-gray-50 min-h-screen">
      <aside className="w-20 md:w-64">
        <div className="sticky top-24 h-screen">
          <Dashboard />
        </div>
      </aside>

      <main className="w-full md:ml-16 md:w-2/3 px-4  md:py-4 mt-20">
        {/* Article Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg space-y-6 mb-10 mt-6"
        >
          <h1 className="text-3xl font-bold mb-8 text-primary text-center md:text-left">
            {editingId ? 'Update Article' : 'Add Article'}
          </h1>

          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Subtitle</label>
            <input
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Header Paragraph</label>
            <textarea
              name="header"
              value={formData.header}
              onChange={handleChange}
              rows="3"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Upload Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <h3 className="text-xl font-semibold mt-6">Sections</h3>

          {formData.sections.map((section, index) => (
            <div key={index} className="border p-4 rounded mb-6 space-y-3 bg-gray-50">
              <div>
                <label className="block text-sm font-medium">Section Heading</label>
                <input
                  type="text"
                  value={section.heading}
                  onChange={e => handleSectionChange(index, 'heading', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Main Paragraph</label>
                <textarea
                  rows="3"
                  value={section.main}
                  onChange={e => handleSectionChange(index, 'main', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Bullet Points</label>
                {section.bullets.map((bullet, bIndex) => (
                  <input
                    key={bIndex}
                    type="text"
                    value={bullet}
                    onChange={e => handleBulletChange(index, bIndex, e.target.value)}
                    className="w-full border p-2 rounded mb-2"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addBullet(index)}
                  className="text-blue-600 text-sm hover:underline mt-1"
                >
                  + Add Bullet
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium">Conclusion Paragraph</label>
                <textarea
                  rows="2"
                  value={section.conclusion}
                  onChange={e => handleSectionChange(index, 'conclusion', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          ))}

          <button type="button" onClick={addSection} className="text-primary text-sm font-semibold hover:underline">
            + Add New Section
          </button>

          <div>
            <label className="block text-sm font-medium">Overall Conclusion</label>
            <textarea
              rows="3"
              name="overallConclusion"
              value={formData.overallConclusion}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 block mt-4 w-full sm:w-auto"
          >
            {editingId ? "Update Article" : "Add Article"}
          </button>
        </form>

        {/* Display Articles */}
        <div className="px-2 py-4 sm:px-4 sm:py-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center md:text-left">Articles</h3>
          <div className="space-y-4">
            {articles.map(article => (
              <div
                key={article.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md"
              >
                {/* IMAGE */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 sm:w-24 sm:h-24 object-cover rounded-md mb-4 sm:mb-0"
                />

                {/* TEXT */}
                <div className="flex-1 sm:ml-4">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800">{article.title}</h4>
                  <p className="text-sm text-gray-600">{article.subtitle}</p>
                </div>

                {/* ACTIONS */}
                <div className="flex space-x-4 mt-4 sm:mt-0">
                  <button onClick={() => handleEdit(article)} className="flex items-center text-blue-600 hover:text-blue-800">
                    <FaEdit className="mr-2 text-xl" /> Edit
                  </button>
                  <button onClick={() => handleDelete(article.id)} className="flex items-center text-red-600 hover:text-red-800">
                    <FaTrashAlt className="mr-2 text-xl" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
export default ManageArticles;