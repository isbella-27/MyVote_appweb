import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import "./List.css";
import type { Candidate } from "../../../data/models/candidate";
import { candidatApi } from "../../../api/candidates/crud";
import SideBar from "../../../Components/Sidebar/Sidebar";


export default function List() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // 💡 L'état est initialisé en tableau vide
    const [candidates, setCandidates] = useState<Array<Candidate>>([]);
    const [successmessage, setSuccessMessage] = useState<string>("");
    const navigate = useNavigate();
    
    const fetchCandidates = async () => {
        try {
            const data = await candidatApi.getAll();
            
            // 💡 SÉCURISATION : S'assurer que 'data' est un tableau avant de l'assigner
            if (Array.isArray(data)) {
                setCandidates(data);
            } else {
                // Si l'API retourne un objet ou null, on force l'état à être un tableau vide
                console.error("L'API n'a pas renvoyé de tableau valide.", data);
                setCandidates([]); 
            }
        } catch (error) {
            console.error("Erreur de chargement des candidats:", error);
            setCandidates([]); // Gérer l'échec de la requête
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCandidates();
    }, []);

    return (
        <div className="list-page">
            <SideBar /> 
            
            <div className="list-content">
                
                <div className="list-header">
                    <h1 className="page-title">Liste des Candidats</h1>
                    <Link className="create-button" to={"/candidates"}>+ Créer un candidat</Link> 
                </div>
                
                {successmessage && <div className="success-message">{successmessage}</div>}

                {isLoading ? (
                    <p>Chargement...</p>
                ) : (
                    <>
                        
                        {candidates.length === 0 ? (
                            <p className="no-data-message">Aucun candidat n'est encore enregistré.</p>
                        ) : (
                            <div className="candidates-grid">
                                {candidates.map((candidate) => (
                                    
                                    <Link 
                                        to={`/candidates/${candidate.id}/show`} 
                                        key={candidate.id} 
                                        className="candidate-card"
                                    >
                                        
                                        {/* Reste du contenu de la carte... */}
                                        <div className="profile-photo-container">
                                            <img 
                                                src={candidate.profilePhoto} 
                                                alt={`Photo de ${candidate.lastName}`} 
                                                className="profile-photo"
                                                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/120?text=NO+IMG" }}
                                            />
                                        </div>

                                        <div className="card-details">
                                            <h2 className="candidate-name">
                                                {candidate.lastName} 
                                            </h2>
                                            
                                            <p className="candidate-description">
                                                {candidate.fullDescription} 
                                            </p>
                                        </div>

                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}