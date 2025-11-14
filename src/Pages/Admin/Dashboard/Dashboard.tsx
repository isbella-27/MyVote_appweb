import { useEffect, useState } from "react";
import "./Dashboard.css";
import type { User } from "../../../data/models/user.model";
import { userApi } from "../../../api/users/authentication";
import { Link } from "react-router";


export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(true); // sidebar ouverte

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await userApi.getProfile();
        if (response.user) setUser(response.user);
      } catch (error) {
        console.error("Erreur récupération profil", error);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="dashboard-container">

      {/* Bouton hamburger (mobile + desktop) */}
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "☰"}
      </button>

      {/* --- Sidebar --- */}
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <h2 className="sidebar-title">Dashboard</h2>

        <nav className="sidebar-menu">
          <a className="menu-item active">Accueil</a>
          <Link to="/concours">Concours</Link>
          <a className="menu-item">Profil</a>
          <a className="menu-item">Paramètres</a>
          <a className="menu-item logout">Déconnexion</a>
        </nav>
      </aside>

      {/* --- Contenu principal --- */}
      <main className={`main-content ${isOpen ? "shift" : ""}`}>
        <h1>Bienvenue, {user?.name ?? "Utilisateur"}</h1>

        <div className="cards">
          <div className="card">
            <h3>Email</h3>
            <p>{user?.email}</p>
          </div>

          <div className="card">
            <h3>Rôle</h3>
            <p>{user?.role ?? "Utilisateur"}</p>
          </div>

          <div className="card">
            <h3>Date de création</h3>
            <p>{user?.created_at}</p>
          </div>
        </div>
      </main>

    </div>
  );
}
