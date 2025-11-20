import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import React from "react";

import "./EditAdmin.css";
import { adminApi } from "../../../../api/admins/crud_admins";

export default function EditAdmins() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [original, setOriginal] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  // Charger l'admin à modifier
  const fetchAdmin = async () => {
    try {
      const admin = await adminApi.read(Number(id));
      setForm({
        name: admin.name,
        email: admin.email,
      });
      setOriginal(admin);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!original) {
      setError("Les données de l'admin n'ont pas été chargées.");
      return;
    }

    const formData = new FormData();
    let hasChanges = false;

    // Vérifier les changements
    Object.entries(form).forEach(([key, value]) => {
      if (value !== original[key]) {
        formData.append(key, value as string);
        hasChanges = true;
      }
    });

    if (!hasChanges) {
      setError("Aucune modification détectée.");
      return;
    }

    try {
      setLoading(true);
      await adminApi.update(Number(id), formData);
      setSuccess("Admin modifié avec succès !");
      setTimeout(() => navigate("/admins"), 1500);
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
    <div className="admin-edit-wrapper">

      <button type="button" onClick={() => navigate(-1)} className="back-btn">
        ← Retour
      </button>

      <h1>Modifier un administrateur</h1>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <form onSubmit={handleSubmit} className="admin-form">

        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>

      </form>
    </div>
  );
}