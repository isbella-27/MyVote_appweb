import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Candidate } from "../../../data/models/candidate.model";
import { candidateApi } from "../../../api/candidates/crud_candidates";
import Loader from "../../../Components/Loader/Loader";
import "./List.css";

export default function ListCandidates() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<Array<Candidate>>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("votes_desc");

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

  const sortedCandidates = [...candidates]
    .sort((a, b) => {
      switch (sortBy) {
        case "votes_desc":
          return (b.votes_count || 0) - (a.votes_count || 0);
        case "votes_asc":
          return (a.votes_count || 0) - (b.votes_count || 0);
        case "name":
          return a.last_name.localeCompare(b.last_name);
        case "nationality":
          return a.nationality.localeCompare(b.nationality);
        default:
          return 0;
      }
    })
    .filter(
      (c) =>
        c.first_name.toLowerCase().includes(search.toLowerCase()) ||
        c.last_name.toLowerCase().includes(search.toLowerCase()) ||
        c.nationality.toLowerCase().includes(search.toLowerCase())
    );

  const totalCandidates = candidates.length;
  const totalVotes = candidates.reduce((sum, c) => sum + (c.votes_count || 0), 0);

  return (
    <div className="list-container">
      <h1 className="list-title">Candidats du concours N° {id}</h1>

      <div className="stats-box">
        <p>
          <strong>Total candidats :</strong> {totalCandidates}
        </p>
        <p>
          <strong>Total votes :</strong> {totalVotes}
        </p>
      </div>

      <div className="tools-bar" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher un candidat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="votes_desc">Tri : + votes → - votes</option>
          <option value="votes_asc">Tri : - votes → + votes</option>
          <option value="name">Tri : Nom (A-Z)</option>
          <option value="nationality">Tri : Nationalité (A-Z)</option>
        </select>
      </div>

      <div className="button-flex">
        <Link to={`/candidates/create?concour_id=${id}`} className="create-link">
          Ajouter un candidat
        </Link>
        <Link to="/concours" className="back-link">
          Retour aux concours
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : candidates.length === 0 ? (
        <div className="no-data-message">Aucun candidat trouvé pour ce concours.</div>
      ) : (
        <table className="concours-table">
          <thead>
            <tr>
              <th>Rang</th>
              <th>Nom(s)</th>
              <th>Prénom(s)</th>
              <th>Nationalité</th>
              <th>Votes</th>
              <th>Photo</th>
              <th>Opérations</th>
            </tr>
          </thead>

          <tbody>
            {sortedCandidates.map((candidate, index) => (
              <tr key={candidate.id}>
                <td>
                  <strong>{index + 1}ᵉ</strong>
                </td>
                <td>{candidate.last_name}</td>
                <td>{candidate.first_name}</td>
                <td>{candidate.nationality}</td>
                <td>
                  <strong>{candidate.votes_count || 0}</strong>
                </td>

                <td>
                  <img
                    src={`http://127.0.0.1:8000${candidate.profile_photo}`}
                    alt={candidate.last_name}
                    className="concour-image"
                  />
                </td>

                <td className="operation-button">
                  <button
                    onClick={() => handleShowCandidate(candidate.id)}
                    className="action-button"
                  >
                    Détails
                  </button>

                  <button
                    onClick={() => handleEditCandidate(candidate.id)}
                    className="action-button"
                  >
                    Modifier
                  </button>

                  <button
                    onClick={() => handleDestroyCandidate(candidate.id)}
                    className="action-button delete-button"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}