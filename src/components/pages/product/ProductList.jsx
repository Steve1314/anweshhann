import React, { useEffect, useState } from "react";
import { db } from "../../../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchProducts();
  }, []);
  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen pt-20">
      <h1 className="text-4xl font-bold mb-6 pt-4"> Our Product </h1>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link to={`/product/${product.id}`}>
            <div
              key={product.id}
              className="border flex items-center flex-col p-4 shadow rounded bg-white hover:shadow-lg transition duration-300"
            >
              <img
                src={product.mainImage}
                alt={product.title}
                className="w-48 h-48 object-cover rounded mb-2"
              />
              <h2 className="text-lg font-semibold">
                {product.title.slice(0, 20)}...
              </h2>
              <p className="text-green-600 font-bold mt-1">₹{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
