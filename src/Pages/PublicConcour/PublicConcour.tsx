import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { concourApi } from "../../api/concours/crud_concours";
import type { Concour, Candidate } from "../../data/models/concour.model";
import "./PublicConcour.css";
import VoteModal from "../../Components/VoteModal/VoteModal";

export default function PublicConcour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [concour, setConcour] = useState<Concour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- Gestion modal ----
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);

  const openVoteModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowVoteModal(true);
  };

  const closeVoteModal = () => {
    setSelectedCandidate(null);
    setShowVoteModal(false);
  };

  const handleVoteSuccess = (data: { payment_url: string }) => {
    window.location.href = data.payment_url;
  };

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

  // Déterminer si le vote est autorisé 
  const now = new Date();
  const startAt = concour.start_at ? new Date(concour.start_at) : null;
  const endAt = concour.end_at ? new Date(concour.end_at) : null;
  const votingClosed = (startAt && now < startAt) || (endAt && now > endAt);

  // Trier les candidats par votes décroissants 
  const sortedCandidates = concour.candidates
    ? [...concour.candidates].sort((a, b) => (b.votes_count ?? 0) - (a.votes_count ?? 0))
    : [];

  return (
    <div className="public-concour-container">

      <button className="back-button" onClick={() => navigate(-1)}>← Retour</button>

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
            <span>Début : {concour.start_at ? startAt?.toLocaleDateString() : "N/A"}</span>
            <span>Fin : {concour.end_at ? endAt?.toLocaleDateString() : "N/A"}</span>
          </div>
          {votingClosed && (
            <p className="voting-closed-msg">
              Les votes sont actuellement fermés pour ce concours.
            </p>
          )}
        </div>
      </div>

      <h2>Candidats</h2> <br />

      <div className="candidates-grid">
        {sortedCandidates.length > 0 ? (
          sortedCandidates.map((c, index) => (
            <div key={c.id} className="candidate-card">
              <div
                className="candidate-image-wrapper"
                onClick={() => navigate(`/candidates/${c.id}/show`)}
              >
                <img
                  src={`http://127.0.0.1:8000${c.profile_photo}`}
                  alt={`${c.first_name} ${c.last_name}`}
                  className="candidate-photo"
                />
                <div className="votes-counter">
                  {c.votes_count ?? 0} votes
                </div>
                <div className="rank-badge">#{index + 1}</div>
              </div>

              <div className="candidate-info">
                <h3>{c.first_name} {c.last_name}</h3>
                <p>{c.nationality}</p>
              </div>

              <button
                className="vote-button"
                disabled={votingClosed}
                onClick={() => openVoteModal(c)}
              >
                {votingClosed ? "Vote fermé" : "Voter"}
              </button>
            </div>
          ))
        ) : (
          <p>Aucun candidat inscrit pour ce concours.</p>
        )}
      </div>

      {showVoteModal && selectedCandidate && !votingClosed && (
        <VoteModal
          candidate={selectedCandidate}
          concour={concour}
          onClose={closeVoteModal}
          onSuccess={handleVoteSuccess}
        />
      )}
    </div>
  );
}