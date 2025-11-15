import { Link } from "react-router";
import { useState } from "react";
import "./Sidebar.css"; // Assurez-vous d'avoir le CSS adéquat

export default function SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 🗑️ Le style inline 'linkStyle' n'est plus utilisé.

  return (
    <>
      {/* Bouton d’ouverture visible uniquement quand la sidebar est fermée */}
      {!sidebarOpen && (
        <button onClick={toggleSidebar} className="toggle-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <div className={`side-bar ${sidebarOpen ? "open" : "closed"}`}>
        {/* Bouton de fermeture intégré dans la sidebar */}
        <button onClick={toggleSidebar} className="close-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <nav className="navigation">
            
          <Link to="/" >Home</Link>
          <Link to="/">Concours en cours</Link>
          <Link to="/">Concours terminé</Link>
          <Link to="/">Concours à venir</Link>
          <Link to="/">Résultats des concours</Link>
          <Link to="/login">Se connecter</Link>
        </nav>
      </div>
    </>
  );
}