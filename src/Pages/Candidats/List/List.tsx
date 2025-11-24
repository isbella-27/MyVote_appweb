import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import "./List.css";
// L'importation de type 'Candidate' doit correspondre à votre modèle
import type { Candidate } from "../../../data/models/candidate"; 
import { candidatApi } from "../../../api/candidates/crud"; 
import SideBar from "../../../Components/Sidebar/Sidebar";
import axios from "axios";

// Définition des paramètres d'URL
interface RouteParams extends Record<string, string | undefined> {
    id: string; 
}


interface FilterParams {
    concours_id?: string;
}

export default function List() {
    // Récupération de l'ID du concours
    const { id: concours_id } = useParams<RouteParams>(); 

    const [isLoading, setIsLoading] = useState<boolean>(true);
    // 💡 L'état est initialisé en tableau vide
    const [candidates, setCandidates] = useState<Array<Candidate>>([]);
    const [successmessage, setSuccessMessage] = useState<string>("");
    const [errormessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();
    
    // --- Fonction de Récupération des Candidats ---
    const fetchCandidates = async () => {
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            // Création de l'objet paramètres pour le filtrage
            const filterParams: FilterParams | undefined = concours_id ? { concours_id: concours_id } : undefined;
            
            // Appel API : Passage de l'objet de paramètres
            const response = await candidatApi.getAll(filterParams);
            
            const receivedData = response.data || response;
            
            if (Array.isArray(receivedData)) {
                setCandidates(receivedData);
            } else {
                console.error("L'API n'a pas renvoyé de tableau valide.", receivedData);
                setCandidates([]); 
                setErrorMessage("Format de données invalide reçu du serveur.");
            }
        } catch (error) {
            console.error("Erreur de chargement des candidats:", error);
            let msg = "Erreur de chargement des candidats.";
            if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
                msg = "Session expirée ou non autorisé. Veuillez vous reconnecter.";
            }
            setErrorMessage(msg);
            setCandidates([]); 
        } finally {
            setIsLoading(false);
        }
    };
    
    
    
    
    useEffect(() => {
        fetchCandidates();
    }, [concours_id]); 

    // Déterminer la destination des liens
    const createLink = concours_id 
        ? `/concours/${concours_id}/candidates/create` 
        : "/candidates/create";
    
    const backLink = "/concours/List"; // Chemin vers la liste des concours

    return (
        <div className="list-page">
            <SideBar /> 
            
            <div className="list-content">
                
                <div className="list-header">
                    
                    {/* 🎯 Conteneur pour le bouton de retour et le titre (pour le style CSS) */}
                    <div className="list-header-left"> 
                        {concours_id && (
                            <Link to={backLink} className="back-button">
                                ← Retour à la liste des concours
                            </Link>
                        )}
                        
                        <h1 className="page-title">
                            {concours_id 
                                ? `Candidats du Concours #${concours_id}` 
                                : 'Liste globale des Candidats'}
                        </h1>
                    </div>
                    
                    <Link className="create-button" to={createLink}>
                        + Créer un candidat
                    </Link> 
                </div>
                
                {successmessage && <div className="success-message">{successmessage}</div>}
                {errormessage && <div className="error-message">{errormessage}</div>}

                {isLoading ? (
                    <p>Chargement...</p>
                ) : (
                    <>
                        
                        {candidates.length === 0 ? (
                            <p className="no-data-message">
                                Aucun candidat n'est encore enregistré {concours_id ? `pour le concours #${concours_id}` : 'globalement'}.
                            </p>
                        ) : (
                            <div className="candidates-grid">
                                {candidates.map((candidate) => {
                                    
                                    const description = candidate.full_description || "Pas de description disponible.";
                                    const truncatedDescription = description.substring(0, 100);
                                    const needsEllipsis = description.length > 100;
                                    
                                    // 🎯 CORRECTION CRITIQUE DE LA PHOTO: Ajout de l'URL de base
                                    // Remplacez 'http://localhost:8000' par l'URL de votre serveur Laravel
                                    const BASE_URL = "http://localhost:8000"; 
                                    const photoPath = candidate.profile_photo || "";

                                    const photoUrl = photoPath.startsWith('http') 
                                        ? photoPath 
                                        : `${BASE_URL}${photoPath}`; 
                                    
                                    const last_name = candidate.last_name || "Inconnu";
                                    const first_name = candidate.first_name || "";


                                    return (
                                        <div 
                                            key={candidate.id} 
                                            className="candidate-card"
                                        >
                                            <Link 
                                                to={`/candidates/${candidate.id}/show`} 
                                                className="profile-photo-container"
                                            >
                                                <img 
                                                    src={photoUrl} 
                                                    alt={`Photo de ${last_name}`} 
                                                    className="profile-photo"
                                                    // Image de substitution en cas d'échec de chargement
                                                    onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/200x200?text=NO+IMG" }}
                                                />
                                            </Link>

                                            <div className="card-details">
                                                <h2 className="candidate-name">
                                                    {last_name} {first_name}
                                                </h2>
                                                
                                                <p className="candidate-description">
                                                    {truncatedDescription}{needsEllipsis ? '...' : ''}
                                                </p>
                                                
                                            
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}