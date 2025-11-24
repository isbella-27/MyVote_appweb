import { Link, useNavigate, useParams } from "react-router"; // Modification: Utiliser "react-router-dom"
import { useEffect, useState } from "react";
import type { Candidate } from "../../../data/models/candidate.model";
import { candidateApi } from "../../../api/candidates/crud_candidates";
import Loader from "../../../Components/Loader/Loader";
import './List.css'

export default function ListCandidates() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<Array<Candidate>>([]);
  const BASE_URL = "http://127.0.0.1:8000"; // URL de base du backend Laravel

  // --- Fonctions de Data Fetching et CRUD ---
  
  const fetchCandidates = async () => {
    try {
      const data = await candidateApi.getAll();
      const filtered = data.filter((c: Candidate) => c.concour_id === Number(id));

      setCandidates(filtered);
    } catch (error) {
      console.error("Erreur de récupération des candidats :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDestroyCandidate = async (candidateId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce candidat ?")) {
      try {
        await candidateApi.destroy(candidateId);
        fetchCandidates();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Erreur lors de la suppression du candidat.");
      }
    }
  };

  const handleEditCandidate = (candidateId: number) => {
    navigate(`/candidates/${candidateId}/edit`);
  };

  const handleShowCandidate = (candidateId: number) => {
    navigate(`/candidates/${candidateId}/show`);
  };

  useEffect(() => {
    if (id) fetchCandidates();
  }, [id]);

  // --- Rendu du Composant ---

  return (
    <div className="list-container">
      <h1 className="list-title">Candidats du concours N° {id}</h1>

      <div className="button-flex">
        <Link to={`/candidates/create?concour_id=${id}`} className="create-link">
          Ajouter un candidat
        </Link>
        {/* Utilisation de .back-link pour la cohérence du style CSS */}
        <Link to="/concours" className="back-link">
          Retour aux concours
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : candidates.length === 0 ? (
        <div className="no-data-message">
          Aucun candidat trouvé pour ce concours.
        </div>
      ) : (
        <div className="candidates-grid">
          {candidates.map((candidate) => {

            const photoPath = candidate.profile_photo || "";
            let imageUrl: string;

            if (photoPath.startsWith('http')) {
              // 1. L'image est déjà une URL complète (ex: CDN)
              imageUrl = photoPath;
            } else if (photoPath.includes('storage/')) {
              // 2. Le chemin stocké en base contient déjà 'storage/' (ex: '/storage/profiles/...')
              // On nettoie le slash initial (s'il existe) et on ajoute la BASE_URL.
              const cleanPath = photoPath.startsWith('/') ? photoPath.substring(1) : photoPath;
              imageUrl = `${BASE_URL}/${cleanPath}`;
            } else {
              // 3. Le chemin est relatif à 'storage/app/public' (ex: 'profiles/...')
              // On ajoute le '/storage/' manquant.
              const cleanPath = photoPath.startsWith('/') ? photoPath.substring(1) : photoPath;
              imageUrl = `${BASE_URL}/storage/${cleanPath}`;
            }

            return (
              <div key={candidate.id} className="candidate-card">
                
                {/* Conteneur de la photo */}
                <div
                  className="profile-photo-container"
                  onClick={() => handleShowCandidate(candidate.id)}
                >
                  <img
                    src={imageUrl} // Utilisation du chemin corrigé et vérifié
                    alt={`${candidate.first_name} ${candidate.last_name}`}
                    // Si l'image ne charge pas, on peut utiliser un fallback
                    onError={(e) => {
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = "/placeholder_default.png"; // Remplacer par un chemin d'image par défaut local
                    }}
                    className="profile-photo"
                  />
                </div>

                {/* Détails de la carte */}
                <div className="card-details">
                  <h3 className="candidate-name">{candidate.last_name} {candidate.first_name}</h3>
                  <p className="candidate-description">
                    {candidate.nationality}
                  </p>

                  {/* Actions (Boutons Modifier/Supprimer/Détails) */}
                  <div className="card-actions">
                    <button onClick={() => handleEditCandidate(candidate.id)} className="action-button edit-button">
                      Modifier
                    </button>
                    <button onClick={() => handleDestroyCandidate(candidate.id)} className="action-button delete-button">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}