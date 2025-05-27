import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiList,
  FiPhoneCall,
  FiMessageCircle,
  FiFileText,
  FiUsers,
  FiShoppingCart,
} from "react-icons/fi";

export default function Dashboard() {
  const { pathname } = useLocation();

  const desktopLinkClasses = (path) =>
    `flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
      pathname === path
        ? "bg-primary text-white font-semibold"
        : "text-gray-700 hover:bg-red-60"
    }`;

  const mobileLinkClasses = (path) =>
    `flex items-center justify-center my-2 w-full p-3 transition-colors duration-200 ${
      pathname === path
        ? "text-primary bg-primary bg-opacity-10"
        : "text-gray-700 hover:text-primary"
    }`;

  const links = [
    { to: "/admin/manageprogram", icon: <FiList />, label: "Programs" },
    { to: "/admin/managecallslots", icon: <FiPhoneCall />, label: "Call Slots" },
    { to: "/admin/manageinquiries", icon: <FiMessageCircle />, label: "Inquiries" },
    { to: "/admin/managearticales", icon: <FiFileText />, label: "Articles" },
    { to: "/admin/waitinglist", icon: <FiFileText />, label: "Waiting List" },
    { to: "/admin/contactlist", icon: <FiUsers />, label: "Contacts" },
    { to: "/admin/manageproducts", icon:<FiShoppingCart /> , label: "Products" },

  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-full bg-white shadow-md border-r p-6 md:mt-24 sticky top-24">
        <h1 className="text-3xl font-bold text-primary mb-10 text-center">
          Dashboard
        </h1>
        <nav className="space-y-4">
          {links.map(({ to, icon, label }) => (
            <Link key={to} to={to} className={desktopLinkClasses(to)}>
              {icon} <span>{`Manage ${label}`}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 z-50 w-16 bg-white shadow-md flex flex-col items-center mt-20 md:hidden">
        {links.map(({ to, icon, label }) => (
          <Link key={to} to={to} className={mobileLinkClasses(to)}>
            {icon}
            <span className="sr-only">{label}</span>
          </Link>
        ))}
      </aside>
    </>
  );
}
