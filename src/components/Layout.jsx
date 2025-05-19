import "./Layout.css";

function Layout({ children, activePage, setActivePage }) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "exercises", label: "Exercises" },
    { id: "workouts", label: "Workouts" },
  ];

  return (
    <div className="layout">
      <nav className="nav">
        <div className="nav-brand">Fitness Tracker</div>
        <ul className="nav-items">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${activePage === item.id ? "active" : ""}`}
                onClick={() => setActivePage(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
