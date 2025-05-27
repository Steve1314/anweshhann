import React from "react";
import { useLocation } from "react-router-dom";

export default function OrderForm() {
  const query = new URLSearchParams(useLocation().search);
  const product = query.get("product");

  return (
    <div className="py-32">
      <form
        action="https://api.web3forms.com/submit"
        method="POST"
        className="max-w-3xl mx-auto p-6 space-y-4 bg-white shadow rounded"
      >
        <input
          type="hidden"
          name="access_key"
          value="1eee8a47-c7e0-407f-9e42-5923b5bf311e"
        />
        <input type="hidden" name="Product Name" value={product || ""} />

        <h2 className="text-2xl font-bold mb-2">Order Now: {product}</h2>

        {/* Name */}
        <input
          name="Name"
          required
          placeholder="Your Name"
          className="w-full border p-2 rounded"
        />

        {/* Email */}
        <input
          name="Email"
          required
          type="email"
          placeholder="Your Email"
          className="w-full border p-2 rounded"
        />

        {/* Phone */}
        <input
          name="Phone"
          required
          type="tel"
          placeholder="Your Phone Number"
          className="w-full border p-2 rounded"
        />

        {/* Address */}
        <textarea
          name="Address"
          required
          placeholder="Full Address"
          className="w-full border p-2 rounded"
        />

        {/* City */}
        <input
          name="City"
          required
          placeholder="City"
          className="w-full border p-2 rounded"
        />

        {/* ZIP Code */}
        <input
          name="ZIP"
          required
          placeholder="ZIP / Postal Code"
          className="w-full border p-2 rounded"
        />

        {/* Quantity */}
        <input
          name="Quantity"
          required
          type="number"
          min="1"
          defaultValue="1"
          placeholder="Quantity"
          className="w-full border p-2 rounded"
        />

   

        {/* Additional Notes */}
        <textarea
          name="Message"
          placeholder="Additional Info (optional)"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
