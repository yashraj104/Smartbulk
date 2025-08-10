import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ darkMode, toggleDarkMode }) {
  const location = useLocation();
  const links = [
    { to: "/", label: "Home" },
    { to: "/workout", label: "Workout Planner" },
    { to: "/diet", label: "Diet Planner" },
    { to: "/progress", label: "Progress Tracker" },
    { to: "/exercises", label: "Exercise Library" },
    { to: "/macros", label: "Macro Calculator" },
    { to: "/community", label: "Community Feed" },
    { to: "/challenges", label: "Challenges" },
    { to: "/trainers", label: "Trainer Marketplace" },
    { to: "/ai-coach", label: "AI Chat Coach" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <div
      className="d-flex flex-column p-3 bg-light border-end"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h2 className="text-primary fw-bold mb-4">SmartBulk</h2>

      <ul className="nav nav-pills flex-column mb-auto">
        {links.map((link) => (
          <li key={link.to} className="nav-item">
            <Link
              to={link.to}
              className={`nav-link ${
                location.pathname === link.to ? "active" : "text-dark"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <hr />
      <div className="mt-auto">
        <button className="btn btn-outline-secondary w-100" onClick={toggleDarkMode}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
