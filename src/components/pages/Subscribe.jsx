import React from "react";

export default function Contact() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");

    const formData = new FormData(event.target);
    formData.append("access_key", "1eee8a47-c7e0-407f-9e42-5923b5bf311e");

    formData.append("subject", "New Contact Form Submission");
    formData.append("from_name", "My React Website");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("✅ Form Submitted Successfully!");
      event.target.reset();
    } else {
      setResult("❌ " + data.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 py-16">
      <h1 className="text-5xl font-semibold mb-4 text-center">Subscribe</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows="5"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Send Message
        </button>
      </form>
      <p className="text-center text-sm mt-4 text-gray-600">{result}</p>
    </div>
  );
}
