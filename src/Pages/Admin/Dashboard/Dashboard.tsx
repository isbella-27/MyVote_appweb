import { useEffect, useState } from "react";
import SideBar from "../../../Components/Sidebar/Sidebar";
import "./Dashboard.css";
import { Chart } from "react-google-charts";
import { adminApi } from "../../../api/admins/crud_admins";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const [votesByConcour, setVotesByConcour] = useState<any[]>([]);
  const [votesDistribution, setVotesDistribution] = useState<any[]>([]);
  const [paymentSummaryChart, setPaymentSummaryChart] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboard = await adminApi.getDashboardStats();
        const concours = await adminApi.getConcours();
        const paymentSummary = await adminApi.getTransactionSummary();

        setStats(dashboard);

        // ----------------------- Votes par concours -----------------------
        setVotesByConcour([
          ["Concours", "Votes validés"],
          ...concours.map((c: any) => [
            c.name,
            Number(c.validated_votes) || 0,
          ]),
        ]);

        // ----------------------- Répartition des votes -----------------------
        setVotesDistribution([
          ["Type", "Valeur"],
          ["Votes validés", dashboard.validated_votes],
          [
            "Votes non validés",
            Math.max(0, dashboard.total_votes - dashboard.validated_votes),
          ],
        ]);

        // ----------------------- Paiements par moyen -----------------------
        setPaymentSummaryChart([
          ["Moyen de paiement", "Montant (FCFA)"],
          ...paymentSummary.validated.map((p: any) => [
            p.payment_method.toUpperCase(),
            Number(p.amount),
          ]),
        ]);
      } catch (error) {
        console.error("Erreur Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading)
    return <div className="loading-dashboard">Chargement...</div>;
  if (!stats)
    return (
      <div className="error-dashboard">
        Impossible de charger les statistiques.
      </div>
    );

  return (
    <div className="dashboard-container">
      <SideBar />

      <div className="dashboard-content">
        <h1 className="dashboard-title"> Tableau de bord administrateur</h1>

        {/* ------------------------- Cards ------------------------- */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Concours</h3>
            <p>{stats.total_concours}</p>
          </div>

          <div className="stat-card">
            <h3>Candidats</h3>
            <p>{stats.total_candidates}</p>
          </div>

          <div className="stat-card">
            <h3>Total votes</h3>
            <p>{stats.total_votes}</p>
          </div>

          <div className="stat-card revenue">
            <h3>Revenus validés</h3>
            <p>{stats.validated_amount} FCFA</p>
          </div>
        </div>

        {/* ------------------------- Graphiques ------------------------- */}
        <div className="charts-container">
          {/* Votes par concours */}
          <div className="chart-box">
            <h2>Votes validés par concours</h2>
            <Chart
              chartType="BarChart"
              width="100%"
              height="300px"
              data={votesByConcour}
              options={{
                legend: { position: "none" },
                hAxis: { title: "Votes" },
                vAxis: { title: "Concours" },
              }}
            />
          </div>

          {/* Répartition votes */}
          <div className="chart-box">
            <h2>Répartition des votes</h2>
            <Chart
              chartType="PieChart"
              width="100%"
              height="300px"
              data={votesDistribution}
            />
          </div>

          {/* Moyens de paiement */}
          <div className="chart-box">
            <h2>Paiements par moyen</h2>
            <Chart
              chartType="PieChart"
              width="100%"
              height="300px"
              data={paymentSummaryChart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
