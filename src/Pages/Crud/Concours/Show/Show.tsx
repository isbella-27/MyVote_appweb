import { useEffect, useState } from "react";
import "./Show.css";
import { useNavigate, useParams } from "react-router";
import type { Concour } from "../../../../data/models/concour.model";
import { concourApi } from "../../../../api/concours/crud_concours";
import SideBar from "../../../../Components/Sidebar/Sidebar";

export default function ShowConcour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const goToBack = () => navigate(-1);

  const [concour, setConcour] = useState<Concour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConcour = async () => {
      try {
        const data = await concourApi.getById(Number(id));
        setConcour(data);
      } catch (err: any) {
        setError("Impossible de charger les détails du concours.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchConcour();
  }, [id]);

  if (loading) {
    return <div className="show-container"><p>Chargement en cours...</p></div>;
  }

  if (error) {
    return (
      <div className="show-container">
        <div className="message error">{error}</div>
        <button onClick={goToBack}>← Retour</button>
      </div>
    );
  }

  if (!concour) {
    return (
      <div className="show-container">
        <p>Aucun concours trouvé.</p>
        <button onClick={goToBack}>← Retour</button>
      </div>
    );
  }

  return (
    <div className="show-container">
            <SideBar />

      <div className="show-header">
        <button onClick={goToBack}>← Retour</button>
        <h1>Détails du concours</h1>
      </div>

      <div className="show-content">
        {concour.image && (
          <div className="show-image">
            <img src={`http://127.0.0.1:8000/storage/${concour.image}`} alt={concour.name} />
          </div>
        )}

        <h2>{concour.name}</h2>
        <p className="show-description">{concour.description || "Aucune description disponible"}</p>

        <div className="show-infos">
          <p><strong>Statut :</strong> {concour.status === "BROUILLON" ? "Brouillon" : concour.status === "EN_COURS" ? "En cours" : "Terminé"}</p>
          <p><strong>Prix par vote :</strong> {concour.price_per_vote ? concour.price_per_vote + " FCFA" : "Non défini"}</p>
          <p><strong>Date de début :</strong> {concour.start_at ? new Date(concour.start_at).toLocaleDateString() : "Non précisée"}</p>
          <p><strong>Date de fin :</strong> {concour.end_at ? new Date(concour.end_at).toLocaleDateString() : "Non précisée"}</p>
        </div>
      </div>
    </div>
  );
}
