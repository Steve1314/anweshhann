// src/components/Admin/ManageProducts.jsx

import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebase.config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Dashboard from "./Dashboard";

export default function ManageProducts() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    details: "",
    price: "",
    discount: "",
    discountedPrice: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [otherPicFiles, setOtherPicFiles] = useState([]);
  const [pointsList, setPointsList] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pointInput, setPointInput] = useState("");
  const [detailInput, setDetailInput] = useState("");

  // Fetch existing products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  // Handle form field changes
  function onChange(e) {
    const { name, value } = e.target;
    // If we update price or discount, recalc discountedPrice
    if (name === "price" || name === "discount") {
      const price = name === "price" ? value : form.price;
      const discount = name === "discount" ? value : form.discount;
      const discountedPrice =
        price && discount
          ? (price - (price * discount) / 100).toFixed(2)
          : "";
      setForm({ ...form, [name]: value, discountedPrice });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function onImageChange(e) {
    setImageFiles(Array.from(e.target.files));
  }
  function onOtherPicChange(e) {
   const newFiles = Array.from(e.target.files);

    setOtherPicFiles((prev) => [...prev, ...newFiles]);

    // Optional: reset input field
    e.target.value = null;
  }
  console.log(otherPicFiles)

  function addPoint() {
    if (!pointInput.trim() || !detailInput.trim()) return;
    setPointsList(prev => [...prev, { point: pointInput, detail: detailInput }]);
    setPointInput("");
    setDetailInput("");
  }

  function removePoint(i) {
    setPointsList(prev => prev.filter((_, idx) => idx !== i));
  }

  async function uploadAll(files, folder) {
    const urls = [];
    for (let f of files) {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${f.name}`);
      const snap = await uploadBytes(storageRef, f);
      urls.push(await getDownloadURL(snap.ref));
    }
    return urls;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // 1) Upload main images
    const uploadedUrls = await uploadAll(imageFiles, "products/main");
    const mainImage = uploadedUrls[0] || "";
    const thumbnails = uploadedUrls.slice(1);

    // 2) Upload otherPics
    const otherPics = await uploadAll(otherPicFiles, "products/other");

    // Payload
    const payload = {
      ...form,
      mainImage,
      thumbnails,
      otherPics,
      points: pointsList,
    };

    if (editingProductId) {
      // update
      await updateDoc(doc(db, "products", editingProductId), payload);
    } else {
      // add
      await addDoc(collection(db, "products"), payload);
    }

    // Reset
    setForm({
      title: "",
      description: "",
      details: "",
      price: "",
      discount: "",
      discountedPrice: "",
    });
    setImageFiles([]);
    setOtherPicFiles([]);
    setPointsList([]);
    setEditingProductId(null);
    setLoading(false);

    // Refresh list
    fetchProducts();
  }

  async function onDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  }

  function onEdit(p) {
    setForm({
      title: p.title,
      description: p.description,
      details: p.details,
      price: p.price,
      discount: p.discount,
      discountedPrice: p.discountedPrice,
    });
    setPointsList(p.points || []);
    setEditingProductId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
    <div className="flex bg-white min-h-screen">
      <div className="md:w-64 ">
      <aside className="w-64 sticky top-24 h-screen">
        <Dashboard />
      </aside>
      </div>
      <main className="w-full md:w-2/3 md:ml-16 p-6 bg-white shadow-xl rounded-lg my-10 md:mt-28 ">
        <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

        <form onSubmit={handleSubmit} className="space-y-4  rounded ">
          {/* Title, Price, Discount */}
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
            required
          />
          <div className="flex gap-4">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={onChange}
              placeholder="Price"
              className="flex-1 border p-2 rounded"
            />
            <input
              name="discount"
              type="number"
              value={form.discount}
              onChange={onChange}
              placeholder="Discount %"
              className="flex-1 border p-2 rounded"
            />
            <input
              name="discountedPrice"
              value={form.discountedPrice}
              readOnly
              placeholder="Discounted"
              className="flex-1 border p-2 rounded bg-gray-100"
            />
          </div>

          {/* Short Description & Details */}
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Short Description"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="details"
            value={form.details}
            onChange={onChange}
            placeholder="Full Details"
            className="w-full border p-2 rounded"
            rows={4}
          />

          {/* Points */}
          <div>
            <label className="font-medium">Product Specifications</label>
            <div className="flex gap-2 mt-2">
              <input
                value={pointInput}
                onChange={e => setPointInput(e.target.value)}
                placeholder="Point"
                className="flex-1 border p-2 rounded"
              />
              <input
                value={detailInput}
                onChange={e => setDetailInput(e.target.value)}
                placeholder="Detail"
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={addPoint}
                className="bg-red-600 text-white px-4 rounded"
              >
                Add
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {pointsList.map((pt, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-white p-2 rounded shadow"
                >
                  <span>{pt.point} — {pt.detail}</span>
                  <button
                    type="button"
                    onClick={() => removePoint(i)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Images */}
          <div>
            <label className="block font-medium">Main or Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onImageChange}
              className="w-full"
            />
            {imageFiles.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {imageFiles.map((f, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(f)}
                    className="h-24 w-full object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium">Other Pictures</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onOtherPicChange}
              className="w-full"
            />
            {otherPicFiles.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {otherPicFiles.map((f, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(f)}
                    className="h-24 w-full object-contain rounded"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-primary hover:bg-red-600"
            }`}
          >
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
        </form>

        {/* Existing Products */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Existing Products</h2>
          <div className="grid gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 border items-center rounded shadow-sm bg-gray-50 flex justify-between"
              >
                <div className="flex gap-4 items-center">
                  {p.mainImage && (
                    <img
                      src={p.mainImage}
                      className="h-20 w-20 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-gray-600">₹{p.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 h-10">
                  <button
                    onClick={() => onEdit(p)}
                    className="px-3 py-1 border border-blue-600 rounded text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="px-3 py-1 border border-red-600 rounded text-red-600"
                  >
                    Delete
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
