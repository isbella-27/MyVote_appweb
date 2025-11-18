import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router";
import { concourApi } from "../../api/concours/crud_concours";
import type { Concour } from "../../data/models/concour.model";
import SideBar from "../../Components/Sidebar/Sidebar";

const FILTERS = ["Tous", "En cours", "Terminé", "A venir"] as const;

export default function Home() {
  const [concours, setConcours] = useState<Concour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Tous");

  const navigate = useNavigate();

  // ... (useEffect et fetchConcours restent inchangés) ...
  useEffect(() => {
    const fetchConcours = async () => {
      try {
        const data = await concourApi.getAll();
        setConcours(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les concours.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConcours();
  }, []);

  const goToDetails = (id: number) => navigate(`/concours/${id}/show`);

  if (isLoading) return <div className="loading">Chargement des concours...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <SideBar />

      <h1 className="page-title">Concours disponibles</h1>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="concours-grid">
        {concours.map((concour) => (
          <div key={concour.id} className="concour-card" onClick={() => goToDetails(concour.id)}>
            <div className="image-container">
              {concour.image ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${concour.image}`}
                  alt={concour.name}
                  className="concours-image"
                />
              ) : (
                <div className="no-image">Aucune image</div>
              )}
              <span className={`status-badge ${concour.status?.toLowerCase()}`}>
                {concour.status?.replace("_", " ")}
              </span>
              <div className="concour-name">{concour.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}