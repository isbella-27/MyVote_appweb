import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import "../../Crud/Concours/List/List.css";
import type { Candidate } from "../../../data/models/candidate.model";
import { candidateApi } from "../../../api/candidates/crud_candidates";
import Loader from "../../../Components/Loader/Loader";

export default function ListCandidates() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<Array<Candidate>>([]);

  const fetchCandidates = async () => {
    try {
      const data = await candidateApi.getAll();
      // Filtrer par ID du concours
      const filtered = data.filter((c: Candidate) => c.concour_id === Number(id));

      setCandidates(filtered);
    } catch (error) {
      console.log("Erreur :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDestroyCandidate = async (candidateId: number) => {
    try {
      await candidateApi.destroy(candidateId);
      fetchCandidates();
    } catch (error) {
      console.log(error);
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

  return (
    <div className="list-container">
      <h1 className="list-title">Candidats du concours N° {id}</h1>

      <div className="button-flex">
        <Link to={`/candidates/create?concour_id=${id}`} className="create-link">
          Ajouter un candidat
        </Link>

        <Link to="/concours" className="create-link">
          Retour aux concours
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <table className="concours-table">
          <thead>
            <tr>
              <th>Nom(s)</th>
              <th>Prénom(s)</th>
              <th>Nationalité</th>
              <th>Photo</th>
              <th>Opérations</th>
            </tr>
          </thead>

          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-data">
                  Aucun candidat trouvé pour ce concours.
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.last_name}</td>
                  <td>{candidate.first_name}</td>
                  <td>{candidate.nationality}</td>

                  <td>
                    <img
                      src={`http://127.0.0.1:8000${candidate.profile_photo}`}
                      alt={candidate.last_name}
                      className="concour-image"
                    />
                  </td>

                  <td className="operation-button">
                    <button onClick={() => handleShowCandidate(candidate.id)} className="action-button">
                      Détails
                    </button>

                    <button onClick={() => handleEditCandidate(candidate.id)} className="action-button">
                      Modifier
                    </button>

                    <button onClick={() => handleDestroyCandidate(candidate.id)} className="action-button">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
