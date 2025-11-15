import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./EditCandidate.css";
import { candidateApi } from "../../../api/candidates/crud_candidates";

export default function EditCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [original, setOriginal] = useState<any>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    nationality: "",
    full_description: "",
    profile_photo: null as File | null,
  });

  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      const data = await candidateApi.getById(Number(id));

      setOriginal(data); 

      
      setForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        nationality: data.nationality || "",
        full_description: data.full_description || "",
        profile_photo: null,
      });

      
      if (data.profile_photo) {
        setPreview(`${import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000"}${data.profile_photo}`);
      }
    } catch (error) {
      console.error(error);
      setError("Impossible de charger les informations du candidat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCandidate();
    }
  }, [id]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, files } = target;

    if (files && files[0]) {
      
      const file = files[0];
      setForm({ ...form, profile_photo: file });
      setPreview(URL.createObjectURL(file));
    } else {
      
      setForm({ ...form, [name]: value });
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!original) {
      setError("Données originales non chargées");
      return;
    }

    const formData = new FormData();
    let hasChanges = false;

    
    Object.entries(form).forEach(([key, value]) => {
      
      if (key === "profile_photo") return;

      
      if (value !== original[key]) {
        formData.append(key, value as string);
        hasChanges = true;
      }
    });

    
    if (form.profile_photo instanceof File) {
      formData.append("profile_photo", form.profile_photo);
      hasChanges = true;
    }

    
    if (!hasChanges) {
      setError("Aucune modification détectée");
      return;
    }

    try {
      setLoading(true);
      await candidateApi.update(Number(id), formData);
      setSuccess("Candidat modifié avec succès !");
      
      
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la modification.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !original) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="edit-container">
      <button type="button" onClick={() => navigate(-1)} className="back-btn">
        ← Retour
      </button>

      <h1>Modifier le candidat</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="last_name">Nom *</label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="first_name">Prénom(s) *</label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nationality">Nationalité *</label>
          <input
            id="nationality"
            type="text"
            name="nationality"
            value={form.nationality}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="full_description">Description</label>
          <textarea
            id="full_description"
            name="full_description"
            value={form.full_description}
            onChange={handleChange}
            rows={5}
          />
        </div>

        <div className="form-group">
          <label htmlFor="profile_photo">Photo de profil</label>
          <input
            id="profile_photo"
            type="file"
            accept="image/*"
            name="profile_photo"
            onChange={handleChange}
          />
        </div>

        {preview && (
          <div className="preview-container">
            <p>Aperçu :</p>
            <img src={preview} alt="Aperçu" className="preview-image" />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
}