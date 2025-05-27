import { GiSpinalCoil } from "react-icons/gi"; 
import { FaSpinner} from "react-icons/fa"; 
import { CgSpinnerTwo } from "react-icons/cg"; 
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase.config";
import { doc, getDoc } from "firebase/firestore";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(data);
          setSelectedImage(data.mainImage || "");
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-96 flex flex-col items-center gap-4 ">Loading product... <GiSpinalCoil  className="animate-spin text-5xl text-center text-primary"/></p>
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 pt-32">
      {/* Image section */}
      <div className="flex gap-4">
        <div className="flex flex-col space-y-2 overflow-x-auto">
          {product.mainImage && (
            <img
              src={product.mainImage}
              alt="Main"
              className={`h-20 w-20 object-cover border rounded cursor-pointer ${
                selectedImage === product.mainImage ? "border-blue-600 border-2" : ""
              }`}
              onClick={() => setSelectedImage(product.mainImage)}
            />
          )}
          {product.otherPics?.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Other ${idx}`}
              onClick={() => setSelectedImage(img)}
              className={`h-20 w-20 object-cover border rounded cursor-pointer ${
                selectedImage === img ? "border-blue-600 border-2" : ""
              }`}
            />
          ))}
        </div>
        <div>
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full h-[500px] object-cover border rounded-lg mb-4"
          />
          <div className="flex w-full mb-8">
            <a
              href={`/order?product=${encodeURIComponent(product.title)}`}
              className="bg-yellow-500 text-white px-16 py-4 rounded-md hover:bg-yellow-600 transition text-lg"
            >
              Buy Now
            </a>
          </div>
        </div>
      </div>

      {/* Product info */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

        <div className="mb-4">
          <span className="text-5xl font-semibold text-gray-900">
            ₹{product.discountedPrice || product.price}
          </span>
          {product.discount && product.discount !== "0" && (
            <span className="ml-2 line-through text-gray-500">
              ₹{product.price}
            </span>
          )}
          <span className="ml-2 text-green-600 font-bold">{product.discount}% Off</span>
        </div>

        <p className="mb-6 text-gray-700 leading-relaxed">
          {product.description}
        </p>

        <div className="bg-gray-100 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Product Details</h2>
          <p className="text-gray-700">{product.details || "No additional details provided."}</p>
        </div>

        {/* Points list */}
        {product.points?.length > 0 && (
          <div className="bg-white p-4 border rounded shadow">
            <h2 className="text-xl font-semibold mb-6">Specifications</h2>
            <ul className="list-disc ml-5 text-gray-800">
              {product.points.map((pt, i) => (
                <li key={i} className="grid grid-cols-[1fr_3fr] mb-4">
                  <strong>{pt.point}:</strong> 
                  <p>{pt.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
