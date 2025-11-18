import SideBar from "../../../../Components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { adminApi } from "../../../../api/admins/crud_admins";
import Loader from "../../../../Components/Loader/Loader";
import "./ShowAdmin.css";
import { Link, useParams } from "react-router";
import type { User } from "../../../../data/models/user.model";

export default function ShowAdmins() {
  // --- CORRIGÉ : L'état est soit un objet User soit null.
  const [admin, setAdmin] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAdmin = async () => {
      if (params.id) {
        try {
          setIsLoading(true);
          const data = await adminApi.read(parseInt(params.id, 10));
          // data sera l'objet User, pas un tableau
          setAdmin(data);
        } catch (error) {
          console.log(error);
          setAdmin(null); // S'assurer qu'il est null en cas d'erreur
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchAdmin();
  }, [params]);

  return (
    <div className="admin-details-wrapper">
      <div className="admin-details-header">
        <h1 className="admin-details-title">Détails de l'administrateur</h1>
        <SideBar />

        <Link to="/admins" className="btn-secondary">
          ← Retour à la liste des admins
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : admin === null ? ( // --- CORRIGÉ : Vérifie si admin est null (pas .length)
        <p className="admin-empty-text">Aucun administrateur trouvé ou Erreur de chargement.</p>
      ) : (
        // --- CORRIGÉ : Affiche les propriétés de l'objet unique 'admin'
        <table className="admin-table">
          <thead className="admin-table-head">
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {/* L'objet 'admin' est affiché directement, pas mappé */}
            <tr key={admin.id} className="admin-table-row">
              <td className="admin-cell">{admin.id}</td>
              <td className="admin-cell">{admin.name}</td>
              <td className="admin-cell">{admin.email}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}