import { useState } from "react";
import { useNavigate } from "react-router";
import React from "react";
import "./CreateAdmin.css";
import { adminApi } from "../../../../api/admins/crud_admins";

export default function CreateAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("password", form.password);

    try {
      setLoading(true);
      await adminApi.create(data);
      navigate("/admins");
    } catch (error) {
      console.log(error);
      setError("Erreur lors de la création de l'admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-wrapper">
      
      <button type="button" onClick={() => navigate(-1)} className="back-btn">
        ← Retour
      </button>

      <h1>Créer un admin</h1>

      {error && <div className="error-box">{error}</div>}

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

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Création..." : "Créer"}
        </button>

      </form>
    </div>
  );
}