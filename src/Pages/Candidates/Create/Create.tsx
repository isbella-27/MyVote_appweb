import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import "./Create.css";
import { candidateApi } from "../../../api/candidates/crud_candidates";

export default function CreateCandidate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const concourId = params.get("concour_id");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    nationality: "",
    full_description: "",
    profile_photo: null as File | null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;

    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!concourId) {
      setError("ID du concours manquant.");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) data.append(key, value as any);
    });

    data.append("concour_id", concourId);

    try {
      setLoading(true);
      await candidateApi.create(data);
      navigate(`/concours/${concourId}/candidates`);
    } catch (error) {
      console.log(error);
      setError("Erreur lors de la création du candidat.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <h1>Créer un candidat</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Nom</label>
          <input type="text" name="last_name" value={form.last_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Prénom(s)</label>
          <input type="text" name="first_name" value={form.first_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Nationalité</label>
          <input type="text" name="nationality" value={form.nationality} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description complète</label>
          <textarea
            name="full_description"
            value={form.full_description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Photo de profil</label>
          <input type="file" accept="image/*" name="profile_photo" onChange={handleChange} required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
