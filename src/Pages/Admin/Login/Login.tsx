import { Link } from "react-router";
import Input from "../../../Components/Input/Input";
import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router";
import "./Login.css";
import Button from "../../../Components/Button/Button";
import { userApi } from "../../../api/users/authentication";
import SideBar from "../../../Components/Sidebar/Sidebar";


const loginSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      const formattedErrors: Record<string, string> = {};

      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value && value.length > 0) formattedErrors[key] = value[0];
      });

      setErrors(formattedErrors);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await userApi.login(formData);

      if (!response.status) {
        setErrors({ global: response.message || "Identifiants invalides." });
        return;
      }

      localStorage.setItem("token", response.token!);
      localStorage.setItem("user", JSON.stringify(response.user));

      navigate("/dashboard");

    } catch (err: any) {
      console.error("Erreur Axios :", err);

      if (err.response && err.response.status === 401) {
        setErrors({ global: err.response.data.message || "Identifiants incorrects." });
      } else {
        setErrors({ global: "Erreur de connexion au serveur." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
        <SideBar />
    <div className="content-contenair">
    <div className="app-container">
      <div className="header-area">
        <h1>VOTINGAPP</h1>
        <p className="subtitle">Bienvenue, connectez-vous pour continuer</p>
      </div>

      <div className="main-content">
        <form onSubmit={onSubmit}>
          <div className="login-card">
            {errors.global && <p className="error-text">{errors.global}</p>}

            <div className="form-group">
              <Input
                label="Email"
                reference="email"
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <Input
                label="Mot de passe"
                reference="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
          </div>

          <Button
            className="connexion-button"
            label={loading ? "Connexion..." : "Se connecter"}
            type="submit"
            disabled={loading}
          />
        </form>

        <div className="text-center">
          <p>
            Pas encore de compte ? <s><Link to="">S’inscrire</Link></s>
          </p>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
