import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiSearch, FiX, FiLogOut } from "react-icons/fi";
import Logo from "../assets/Logo.png";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase.config";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const onHomePage = location.pathname === "/";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Insights", path: "/insights" },
    { name: "Contact", path: "/contact" },
    { name: "Products", path: "/products" },
  ];

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    navigate("/");
  };

  // Check admin status on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(
          collection(db, "admin"),
          where("email", "==", user.email)
        );
        const snap = await getDocs(q);
        setIsAdmin(!snap.empty && snap.docs[0].data().isAdmin === true);
      } else {
        setIsAdmin(false);
      }
    });
    return unsubscribe;
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        menuRef.current &&
        overlayRef.current &&
        !menuRef.current.contains(e.target) &&
        !overlayRef.current.contains(e.target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Change navbar style on scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 shadow-xl transition-colors duration-300 ${
        isScrolled ? "bg-primary" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2 md:px-16">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full bg-white p-1 text-2xl font-bold"
        >
          <img src={Logo} alt="Logo" className="w-16 object-contain" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-14 text-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/"}
              onClick={closeMenu}
              className={({ isActive }) => {
                const base = "font-medium transition-colors duration-200";
                const active = isActive ? " text-yellow-500" : "";
                let color = "";
                if (!isActive) {
                  if (onHomePage) {
                    color = "text-white hover:text-yellow-600";
                  } else {
                    color = `${isScrolled ? "text-white" : "text-black"} hover:text-yellow-500`;
                  }
                }
                return `${base}${active} ${color}`;
              }}
            >
              {link.name}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeMenu}
              className={({ isActive }) => {
                const base = "font-medium transition-colors duration-200";
                const active = isActive ? " text-yellow-500" : "";
                let color = "";
                if (!isActive) {
                  if (onHomePage) {
                    color = "text-white hover:text-yellow-600";
                  } else {
                    color = `${isScrolled ? "text-white" : "text-black"} hover:text-primary`;
                  }
                }
                return `${base}${active} ${color}`;
              }}
            >
              Admin
            </NavLink>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/searchProgram">
            <div className="flex h-11 items-center justify-center overflow-hidden rounded-full border-2 border-yellow-500 px-3 shadow-sm bg-white hover:bg-red-500 transition">
              <FiSearch className="w-5 h-5 text-yellow-500 hover:text-white" />
            </div>
          </Link>
          {isAdmin && (
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex w-full items-center gap-1 rounded-full bg-primary px-4 py-2 text-white hover:bg-red-500 transition"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-red-900">
            {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="text-3xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-black opacity-50"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Panel */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 z-50 w-2/3 transform border-r border-gray-200 bg-white py-12 text-center shadow-md transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-center border-b border-gray-200 pb-4">
          <img src={Logo} alt="Logo" className="w-32" />
        </div>

        <Link to="/searchProgram">
          <div className="m-4 mb-5 flex items-center justify-between rounded-full border border-secondary p-2 shadow-sm text-secondary">
            <span>Search here</span>
            <FiSearch className="w-5 h-5 text-secondary" />
          </div>
        </Link>

        <ul className="space-y-4 px-4 py-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block py-2 text-lg font-medium ${
                    isActive
                      ? "text-secondary underline underline-offset-4 decoration-2"
                      : "text-secondary hover:text-yellow-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          {isAdmin && (
            <li>
              <NavLink
                to="/admin"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block py-2 text-lg font-medium ${
                    isActive
                      ? "text-secondary underline underline-offset-4 decoration-2"
                      : "text-secondary hover:text-yellow-700"
                  }`
                }
              >
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        {isAdmin && (
          <button
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
            className="mx-6 mt-6 rounded-full bg-primary px-6 py-2 text-white hover:bg-red-500 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
