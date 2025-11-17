import { useEffect, useState } from "react";
import type { User } from "../../../data/models/user.model";
import { userApi } from "../../../api/users/authentication";
import SideBar from "../../../Components/Sidebar/Sidebar";

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchProfile() {
          try {
            const response = await userApi.getProfile();
            if (response.user) setUser(response.user);
          } catch (error) {
            console.error("Erreur récupération profil", error);
          }
        }
        fetchProfile();
      }, []);

  return (
    <div className="card-container">
      <SideBar />
      <h1>Bienvenue, {user?.name ?? "Utilisateur"}</h1>

        <div className="cards">
          <div className="card">
            <h3>Email</h3>
            <p>{user?.email}</p>
          </div>

          <div className="card">
            <h3>Rôle</h3>
            <p>{user?.role ?? "Utilisateur"}</p>
          </div>

          <div className="card">
            <h3>Date de création</h3>
            <p>{user?.created_at}</p>
          </div>
        </div>
    </div>
  )
}
