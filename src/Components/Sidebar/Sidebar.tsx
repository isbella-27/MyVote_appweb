import { useState } from "react";
import "./Sidebar.css";
import { Link, useNavigate } from "react-router";
import { logout } from "../../api/users/authentication";
import logo from '../../assets/logo.png'; 


export default function Dashboard() {
    // 💡 CORRECTION APPORTÉE ICI : La sidebar est fermée au départ
    const [isOpen, setIsOpen] = useState(false); 
    
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("token");


    const handleLogout = () => {
        logout();              
        navigate("/");           
    };

    return (
        <>
            {/* Bouton hamburger (mobile + desktop) */}
            <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "✖" : "☰"}
            </button>

            {/* --- Sidebar --- */}
            {/* L'état initial 'false' appliquera la classe "closed" */}
            <aside className={`sidebar ${isOpen ? "open" : "closed"}`}> 
                {!isAuthenticated && (
                    <div className='header-form'>
                    <img src={logo} alt="Logo" width={"50px"} height={"50px"}/>
                    <h2 className="sidebar-title">Votify</h2>
                    </div>
                )}

                {isAuthenticated && (
                    <div className='header-form'>
                    <img src={logo} alt="Logo" width={"50px"} height={"50px"}/>
                    <h2 className="sidebar-title">Dashboard</h2>
                    </div>
                )}
                
        <nav className="sidebar-menu">          

          {/* Visible seulement si NON connecté */}
          {!isAuthenticated && (
            <>
              <Link to="/" className="menu-item active">Home</Link>
              <Link to="/login">Se connecter</Link>
            </>
          )}

          {/* Visible seulement si connecté */}
          {isAuthenticated && (
          <>
            <Link to="/dashboard" className="menu-item active">Accueil</Link>
            <Link to="/concours">Concours & Candidats</Link>
            <Link to="/admins">Administrateurs</Link>
            <Link to="/profile">Profil</Link>
            <Link to="/transactions">Transactions</Link>
            <a className="menu-item logout" onClick={handleLogout}>
              Déconnexion
            </a>
          </> )} 
        </nav>
      </aside>
    </>
  );
}