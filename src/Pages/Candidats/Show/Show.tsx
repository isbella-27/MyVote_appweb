import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { candidatApi } from "../../../api/candidates/crud";
import './Show.css'
import SideBar from "../../../Components/Sidebar/sidebar";
export default function Show() {
  const navigate = useNavigate();
  const params = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Il est préférable de typer 'candidate' si possible, mais 'any' est conservé pour la flexibilité
  const [candidate, setCandidate] = useState<any>(null);

  const fetchCandidate = async () => {
    if (params.id) {
      try {
        setIsLoading(true);
        const id = parseInt(params.id, 10);
        if (!isNaN(id)) {
          const data = await candidatApi.read(id);
          setCandidate(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du candidat:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [params.id]);

  // Fonction pour naviguer vers la page de modification
  const handleEditCandidate = (id: number) => {
    navigate(`/candidates/${id}/edit`);
  };

  // Fonction pour supprimer le candidat
  const handleDestroyCandidate = async () => {
    // Confirmation de l'utilisateur
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce candidat ? Cette action est irréversible.")) return;

    if (params.id) {
      try {
        setIsLoading(true);
        const id = parseInt(params.id, 10);
        await candidatApi.destroy(id);
        
        // Redirection vers la liste après la suppression réussie
        navigate("/candidates/List"); 
      } catch (error) {
        console.error("Erreur de suppression:", error);
        setIsLoading(false);
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  return (
    <div>
      {<SideBar />}
      <h1>Détails du candidat</h1>

      <Link to="/candidates/List" className="back-button">← Retour à la liste</Link>
      
      <div className="Container">
        {isLoading ? (
          <p>Chargement des détails...</p>
        //   <Loader />
        ) : candidate ? (
          <div className="candidat-card">
            <img
              src={
                candidate.profilePhoto
                  ? `http://127.0.0.1:8000/storage/${candidate.profilePhoto}`
                  : "http://127.0.0.1:8000/default.jpg" // une image par défaut dans /public
              }
              alt={`${candidate.firstName} ${candidate.lastName}`}
              className="profile-photo"
            />

            <h2>
              {candidate.firstName} {candidate.lastName}
            </h2>
            
            <p>
              <strong>Description complète :</strong> {candidate.fullDescription}
            </p>
            <p>
              <strong>Nombre de vote :</strong> {candidate.votesCount}
            </p>
            
            {/* BOUTONS D'ACTION */}
            <div className="button-actions">
              <button 
                onClick={() => handleEditCandidate(candidate.id)} 
                className="btn btn-edit"
              >
                Modifier
              </button>
              <button 
                onClick={handleDestroyCandidate} 
                className="btn btn-delete"
                disabled={isLoading} // Empêche le double-clic pendant le chargement
              >
                Supprimer
              </button>
            </div>
            {/* FIN BOUTONS D'ACTION */}

          </div>
        ) : (
          <p>Aucun candidat trouvé.</p>
        )}
      </div>
    </div>
  );
}