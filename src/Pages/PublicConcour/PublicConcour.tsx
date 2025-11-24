import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { concourApi } from "../../api/concours/crud_concours";
import type { Concour, Candidate } from "../../data/models/concour.model";
import "./PublicConcour.css";
import VoteModal from "../../Components/VoteModal/VoteModal";
import { Share2 } from "lucide-react";

export default function PublicConcour() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hooks principaux
  const [concour, setConcour] = useState<Concour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);

  // Recherche + Tri 
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"az" | "za" | "most" | "least">("most");

  // Modal fonctions 
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

  // Partage concours 
  const shareConcour = async () => {
    if (!concour) return;
    const shareData = {
      title: concour.name,
      text: `Découvrez le concours : ${concour.name}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Erreur de partage", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Lien copié !");
    }
  };

  // Partage candidat 
  const shareCandidate = async (candidate: Candidate) => {
    if (!concour) return;
    const url = `${window.location.origin}/concours/${concour.id}/public?candidate=${candidate.id}`;
    const shareData = {
      title: `Votez pour ${candidate.first_name} ${candidate.last_name}`,
      text: `Votez pour ${candidate.first_name} ${candidate.last_name} dans le concours ${concour.name}`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Erreur de partage", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Lien copié !");
    }
  };

  // Récupérer le concours 
  useEffect(() => {
    const fetchConcour = async () => {
      try {
        const data = await concourApi.getById(Number(id));
        setConcour(data);

        // Ouverture modal si ?candidate=ID
        const params = new URLSearchParams(window.location.search);
        const candidateId = params.get("candidate");
        if (candidateId) {
          const candidateToVote = data.candidates?.find(c => c.id === Number(candidateId));
          if (candidateToVote) openVoteModal(candidateToVote);
        }

      } catch (err) {
        console.error(err);
        setError("Impossible de charger ce concours.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConcour();
  }, [id]);

  // Retour si loading / erreur / aucun concours 
  if (isLoading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!concour) return <div>Aucun concours trouvé.</div>;

  // Nombre de votes
  const totalVotes = concour.candidates?.reduce((sum, c) => sum + (c.votes_count ?? 0), 0) ?? 0;

  // Formater le rang
  const formatRank = (rank: number) => {
    if (rank === 1) return "1 er";
    return `${rank} ème`;
  };


  // Vérifier si vote fermé 
  const now = new Date();
  const startAt = concour.start_at ? new Date(concour.start_at) : null;
  const endAt = concour.end_at ? new Date(concour.end_at) : null;
  const votingClosed = (startAt && now < startAt) || (endAt && now > endAt);

  // Filtrer par recherche 
  const filtered = concour.candidates?.filter((c) =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Trier les candidats
  const sortedCandidates = [...filtered].sort((a, b) => {
    if (sortOrder === "most") return (b.votes_count ?? 0) - (a.votes_count ?? 0);
    if (sortOrder === "least") return (a.votes_count ?? 0) - (b.votes_count ?? 0);
    if (sortOrder === "az")
      return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
    if (sortOrder === "za")
      return `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`);
    return 0;
  });

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
            <span>Prix par vote : {concour.price_per_vote} FCFA</span>
            <span>Début : {startAt?.toLocaleDateString() ?? "N/A"}</span>
            <span>Fin : {endAt?.toLocaleDateString() ?? "N/A"}</span>
            <span>Candidats : {concour.candidates?.length ?? 0}</span>
            <span>Total votes : {totalVotes}</span>
          </div>

          {votingClosed && (
            <p className="voting-closed-msg">
              Les votes sont actuellement fermés pour ce concours.
            </p>
          )}
        </div>

        <button className="share-btn" onClick={shareConcour}>Partager</button>
      </div>

      {/* Barre : Recherche | Tri | Partage */}
      <div className="tools-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher un candidat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
        >
          <option value="most">Plus votés</option>
          <option value="least">Moins votés</option>
          <option value="az">Nom A–Z</option>
          <option value="za">Nom Z–A</option>
        </select>
      </div>

      <h2>Candidats</h2> <br />

      <div className="candidates-grid">
        {sortedCandidates.length > 0 ? (
          sortedCandidates.map((c, index) => (
            <div key={c.id} className="candidate-card">
              <div className="candidate-image-wrapper" onClick={() => navigate(`/candidates/${c.id}/show`)}>
                <img
                  src={`http://127.0.0.1:8000${c.profile_photo}`}
                  alt={`${c.first_name} ${c.last_name}`}
                  className="candidate-photo"
                />

                {/* Bouton partager candidat */}
                <button
                  className="candidate-share-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    shareCandidate(c);
                  }}
                >
                  <Share2 size={18} />
                </button>

                <div className="votes-counter">{c.votes_count ?? 0} votes</div>
                <div className="rank-badge">{formatRank(index + 1)}</div>
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
          <p>Aucun candidat trouvé.</p>
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