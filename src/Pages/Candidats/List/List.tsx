import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import "./List.css";
import type { Candidate } from "../../../data/models/candidate";
import { candidatApi } from "../../../api/candidates/crud";


export default function List() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [candidates, setCandidates] = useState<Array<Candidate>>([]);
    const [successmessage, setSuccessMessage] = useState<string>("");
    const navigate = useNavigate();
    
    const fetchCandidates = async () => {
        try {
            const data = await candidatApi.getAll();
            setCandidates(data);
        } catch (error) {
            console.error("Erreur de chargement des candidats:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCandidates();
    }, []);

    return (
        <div className="list-page">
            {/* Si vous avez la SideBar, décommentez ceci : */}
            {/* <SideBar /> */} 
            
            <div className="list-content">
                
                {/* 🔑 NOUVEAU CONTENEUR POUR APPLIQUER display: flex */}
                <div className="list-header">
                    <h1 className="page-title">Liste des Candidats</h1>
                    {/* Bouton Créer un candidat */}
                    <Link className="create-button" to={"/candidates"}>+ Créer un candidat</Link> 
                </div>
                
                {successmessage && <div className="success-message">{successmessage}</div>}

                {isLoading ? (
                    /* Si vous avez le Loader, décommentez ceci : */
                    /* <Loader /> */
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
                                        
                                        {/* PHOTO DE PROFIL */}
                                        <div className="profile-photo-container">
                                            <img 
                                                src={candidate.profilePhoto} 
                                                alt={`Photo de ${candidate.lastName}`} 
                                                className="profile-photo"
                                                // Fallback si l'image ne charge pas
                                                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/120?text=NO+IMG" }}
                                            />
                                        </div>

                                        <div className="card-details">
                                            {/* NOM DE FAMILLE */}
                                            <h2 className="candidate-name">
                                                {candidate.lastName} 
                                            </h2>
                                            
                                            {/* DESCRIPTION COMPLÈTE */}
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