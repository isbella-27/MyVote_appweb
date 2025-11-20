import SideBar from "../../../../Components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { User } from "../../../../data/models/user.model";
import Loader from "../../../../Components/Loader/Loader";
import "./ListAdmins.css"; 
import { adminApi } from "../../../../api/admins/crud_admins";

export default function ListAdmins() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    try {
      const data = await adminApi.getAll();
      setAdmins(data);
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet admin ?")) return;

    try {
      await adminApi.destroy(id);
      fetchAdmins();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="admins-page">

      <h1 className="list-title">Liste des Administrateurs</h1>

      <SideBar />

      <div className="button-flex">
        <Link to="/admins/create" className="btn-primary">
          + Créer un admin
        </Link>
        <Link to="/dashboard" className="btn-secondary">
          ← Retour Dashboard
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : admins.length === 0 ? (
        <p className="empty">Aucun admin trouvé.</p>
      ) : (
        <table className="table-admins">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td className="actions">
                  <button
                    className="btn-info"
                    onClick={() => navigate(`/admins/${admin.id}/show`)}
                  >
                    Voir
                  </button>

                  <button
                    className="btn-warning"
                    onClick={() => navigate(`/admins/${admin.id}/edit`)}
                  >
                    Modifier
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(admin.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}