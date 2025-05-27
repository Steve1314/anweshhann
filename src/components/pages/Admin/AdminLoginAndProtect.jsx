import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase.config";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate, Navigate } from "react-router-dom";

export default function AdminLoginAndProtect({ children }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loging, setLoging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "admin"), where("email", "==", user.email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty && snapshot.docs[0].data().isAdmin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoging(true);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = cred.user.email;
      const q = query(collection(db, "admin"), where("email", "==", userEmail));
      const snapshot = await getDocs(q);
      if (!snapshot.empty && snapshot.docs[0].data().isAdmin === true) {
        setIsAdmin(true);
        navigate("/admin");
      } else {
        setError("You are not authorized as an admin.");
        setIsAdmin(false);
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoging(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-tr from-red-100 via-white to-red-200">
        <p className="text-red-600 text-lg font-semibold animate-pulse">Checking admin access...</p>
      </div>
    );
  }

  if (isAdmin) {
    return children ? children : <Navigate to="/admin" />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-100 via-white to-red-200">
      <form
        onSubmit={handleLogin}
        className="backdrop-blur-md bg-white/80 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-red-300 transition-transform duration-300 hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-bold text-center text-red-700 mb-2">Admin Panel</h2>
        <p className="text-center text-sm text-red-500 mb-6">
          Sign in with your admin credentials
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-red-200 rounded focus:outline-none focus:ring-2 focus:ring-red-400 text-red-900 placeholder-red-300 bg-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-red-200 rounded focus:outline-none focus:ring-2 focus:ring-red-400 text-red-900 placeholder-red-300 bg-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loging}
          className={`w-full p-3 rounded text-white font-semibold tracking-wide uppercase shadow-md transition duration-300
            ${loging ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
        >
          {loging ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
