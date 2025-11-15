import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import "./ShowCandidate.css";
import { candidateApi } from "../../../api/candidates/crud_candidates";

export default function ShowCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<any>(null);

  const fetchCandidate = async () => {
    try {
      const data = await candidateApi.getById(Number(id));
      setCandidate(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, []);

  if (!candidate) return <p>Chargement...</p>;

  return (
    <div className="show-container">
      <h1>Détails du candidat</h1>

      <div className="candidate-card">
        <img
          src={`http://127.0.0.1:8000${candidate.profile_photo}`}
          alt={candidate.first_name}
          className="candidate-photo"
        />

        <h2>{candidate.last_name} {candidate.first_name}</h2>
        <p><strong>Nationalité :</strong> {candidate.nationality}</p>
        <p><strong>Description :</strong> {candidate.full_description}</p>
      </div>

      <button onClick={() => navigate(-1)} className="back-button">Retour</button>
    </div>
  );
}
