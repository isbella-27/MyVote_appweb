import { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router";
import { concourApi } from "../../api/concours/crud_concours";
import type { Concour, Candidate } from "../../data/models/concour.model";
import "./PublicConcour.css";

export default function PublicConcour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [concour, setConcour] = useState<Concour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConcour = async () => {
      try {
        const data = await concourApi.getById(Number(id));
        setConcour(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger ce concours.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConcour();
  }, [id]);

  if (isLoading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!concour) return <div>Aucun concours trouvé.</div>;

  const handleVote = (candidate: Candidate) => {
    alert(`Vote pour ${candidate.first_name} ${candidate.last_name} bientôt disponible`);
  };

  const goToCandidateDetails = (candidateId: number) => {
    navigate(`/candidates/${candidateId}/show`);
  };

  return (
    <div className="public-concour-container">
      {/* Bouton retour */}
      <button className="back-button" onClick={() => navigate(-1)}>← Retour</button>

      {/* Header concours */}
      <div className="concour-header">
        {concour.image && (
          <div className="concour-image-wrapper">
            <img
              src={`http://127.0.0.1:8000/storage/${concour.image}`}
              alt={concour.name}
              className="concour-banner"
            />
          </div>
        )}
        <div className="concour-info">
          <h1>{concour.name}</h1>
          {concour.description && <p>{concour.description}</p>}
          <div className="concour-stats">
            <span>Statut : {concour.status}</span>
            <span>Prix par vote : {concour.price_per_vote ?? "N/A"} FCFA</span>
            <span>Début : {concour.start_at ? new Date(concour.start_at).toLocaleDateString() : "N/A"}</span>
            <span>Fin : {concour.end_at ? new Date(concour.end_at).toLocaleDateString() : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Liste des candidats */}
      <h2>Candidats</h2> <br />
      <div className="candidates-grid">
        {concour.candidates && concour.candidates.length > 0 ? (
          concour.candidates.map((c) => (
            <div key={c.id} className="candidate-card" onClick={() => goToCandidateDetails(c.id)}>
              <div className="candidate-image-wrapper">
                <img
                  src={`http://127.0.0.1:8000${c.profile_photo}`}
                  alt={`${c.first_name} ${c.last_name}`}
                  className="candidate-photo"
                />
                <div className="votes-counter">
                  {c.votes_count ?? 0} votes
                </div>
              </div>
              <div className="candidate-info">
                <h3>{c.first_name} {c.last_name}</h3>
                <p>{c.nationality}</p>
              </div>
              <button
                className="vote-button"
                onClick={(e) => { e.stopPropagation(); handleVote(c); }}
              >
                Voter
              </button>
            </div>
          ))
        ) : (
          <p>Aucun candidat inscrit pour ce concours.</p>
        )}
      </div>
    </div>
  );
}
