import { useEffect, useState } from "react";
import type { User } from "../../../data/models/user.model";
import { userApi } from "../../../api/users/authentication";
import SideBar from "../../../Components/Sidebar/Sidebar";
// Importez le fichier CSS que nous allons créer
import "./Profile.css"; 

// Fonction utilitaire pour formater la date
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Non précisée";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateString; // Retourne la chaîne brute si le formatage échoue
    }
};

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await userApi.getProfile();
                if (response.user) {
                    setUser(response.user);
                } else {
                    setError("Profil utilisateur introuvable.");
                }
            } catch (err) {
                console.error("Erreur récupération profil", err);
                setError("Impossible de charger les données du profil. Veuillez réessayer.");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);
    
    // --- États de Rendu ---

    if (loading) {
        return (
            <div className="profile-page-container">
                <SideBar />
                <div className="profile-content">
                    <p className="loading-message">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page-container">
                <SideBar />
                <div className="profile-content">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    // Le conteneur principal a été renommé en 'profile-page-container' pour plus de clarté
    return (
        <div className="profile-page-container">
            <SideBar />
            <div className="profile-content">
                <h1 className="welcome-title">Bienvenue, {user?.name ?? "Utilisateur"}</h1>

                <div className="cards-grid">
                    {/* Carte Email */}
                    <div className="card profile-card">
                        <h3 className="card-title">Adresse Email</h3>
                        <p className="card-value">{user?.email}</p>
                    </div>

                    {/* Carte Rôle */}
                    <div className="card profile-card">
                        <h3 className="card-title">Rôle</h3>
                        <p className="card-value role-badge">{user?.role ?? "Utilisateur"}</p>
                    </div>

                    {/* Carte Date de création - Formatage appliqué */}
                    <div className="card profile-card">
                        <h3 className="card-title">Compte Créé le</h3>
                        <p className="card-value">{formatDate(user?.created_at)}</p>
                    </div>
                </div>
                
                {/* Vous pouvez ajouter ici un bouton pour éditer le profil si nécessaire */}
                {/* <button className="edit-button">Modifier le profil</button> */}
                
            </div>
        </div>
    );
}