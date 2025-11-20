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

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

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

  const goToDetails = (id: number) => navigate(`/concours/${id}/public`);

  const filteredConcours = concours.filter((c) => {
    const matchesStatus =
      filter === "Tous" ||
      (filter === "En cours" && c.status === "EN_COURS") ||
      (filter === "Terminé" && c.status === "TERMINE") ||
      (filter === "A venir" && c.status === "A_VENIR");

    const matchesSearch = c.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (isLoading) return <div className="loading">Chargement des concours...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <SideBar />

      <h1 className="page-title">Concours disponibles</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher un concours par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => {
              setFilter(f);
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="concours-grid">
        {filteredConcours.length === 0 ? (
          <div className="empty">
            {searchTerm
              ? `Aucun concours trouvé pour "${searchTerm}".`
              : "Aucun concours trouvé."}
          </div>
        ) : (
          filteredConcours.map((concour) => (
            <div
              key={concour.id}
              className="concour-card"
              onClick={() => goToDetails(concour.id)}
            >
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
          ))
        )}
      </div>
    </div>
  );
}