import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router";
import { concourApi } from "../../api/concours/crud_concours";
import type { Concour } from "../../data/models/concour.model";
import SideBar from "../../Components/Sidebar/Sidebar";
import { Share2 } from "lucide-react";

const FILTERS = ["Tous", "En cours", "Terminé", "A venir"] as const;

export default function Home() {
  const [concours, setConcours] = useState<Concour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Tous");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");

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

  // ------ FILTER ------
  let filtered = concours.filter((c) => {
    if (filter === "Tous") return true;
    if (filter === "En cours") return c.status === "EN_COURS";
    if (filter === "Terminé") return c.status === "TERMINE";
    if (filter === "A venir") return c.status === "A_VENIR";
    return true;
  });

  // ------ SEARCH (Case-Insensitive) ------
  filtered = filtered.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ------ SORT ------
  if (sort === "az") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort === "za") {
    filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
  }
  if (sort === "recent") {
    filtered = [...filtered].sort(
      (a, b) =>
        new Date(b.start_at ?? "").getTime() -
        new Date(a.start_at ?? "").getTime()
    );
  }
  if (sort === "old") {
    filtered = [...filtered].sort(
      (a, b) =>
        new Date(a.start_at ?? "").getTime() -
        new Date(b.start_at ?? "").getTime()
    );
  }

  // ------ SHARE ------
  const shareConcour = async (concour: Concour) => {
    const url = `${window.location.origin}/concours/${concour.id}/public`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: concour.name,
          text: "Viens voter pour ton candidat préféré !",
          url
        });
      } catch (e) {
        console.log("Share cancelled", e);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Lien copié !");
    }
  };

  if (isLoading) return <div className="loading">Chargement des concours...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <SideBar />

      <h1 className="page-title">Concours disponibles</h1>

      {/* SEARCH + SORT */}
      <div className="top-controls">
        <input
          type="text"
          placeholder="Rechercher..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="none">Trier par...</option>
          <option value="az">Nom (A → Z)</option>
          <option value="za">Nom (Z → A)</option>
          <option value="recent">Début récent</option>
          <option value="old">Début ancien</option>
        </select>
      </div>

      {/* FILTER */}
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

      {/* LIST */}
      <div className="concours-grid">
        {filtered.length === 0 ? (
          <div className="empty">Aucun concours trouvé.</div>
        ) : (
          filtered.map((concour) => (
            <div key={concour.id} className="concour-card">
              
              {/* SHARE ICON */}
              <button
                className="share-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  shareConcour(concour);
                }}
              >
                <Share2 size={18} />
              </button>

              <div onClick={() => goToDetails(concour.id)} className="image-container">
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