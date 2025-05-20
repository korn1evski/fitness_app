import "./Layout.css";
import { useState, useEffect } from "react";

function Layout({ children, activePage, setActivePage }) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "exercises", label: "Exercises" },
    { id: "workouts", label: "Workouts" },
  ];

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("navTheme");
    return savedTheme || "light";
  });

  useEffect(() => {
    localStorage.setItem("navTheme", theme);
    document.documentElement.setAttribute("data-nav-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="layout">
      <nav className="nav">
        <div className="nav-brand">Fitness Tracker</div>
        <div className="nav-right">
          <ul className="nav-items">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${
                    activePage === item.id ? "active" : ""
                  }`}
                  onClick={() => setActivePage(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
