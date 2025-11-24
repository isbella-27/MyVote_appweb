import { useEffect, useState } from "react";
import { adminApi } from "../../../api/admins/crud_admins";
import SideBar from "../../../Components/Sidebar/Sidebar";
import "./Transactions.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

type SortOrder = "asc" | "desc";

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await adminApi.getAllTransactions();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors du chargement des transactions :", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  const handleSort = (column: string) => {
    if (sortColumn === column) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getValue = (t: any, col: string) => {
    switch (col) {
      case "tx_ref": return t.tx_ref;
      case "amount": return t.amount;
      case "status": return t.status;
      case "payer_firstName": return t.payer_firstName;
      case "payer_lastName": return t.payer_lastName;
      case "candidate": return t.candidate ? `${t.candidate.first_name} ${t.candidate.last_name}` : "-";
      case "concour": return t.concour?.name ?? "-";
      default: return "";
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = getValue(a, sortColumn).toString().toLowerCase();
    const bVal = getValue(b, sortColumn).toString().toLowerCase();
    return sortOrder === "asc" ? (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) : (aVal > bVal ? -1 : aVal < bVal ? 1 : 0);
  });

  const filteredTransactions = sortedTransactions.filter((t) => {
    const lowerSearch = search.toLowerCase();
    return (
      t.tx_ref.toLowerCase().includes(lowerSearch) ||
      t.payer_firstName.toLowerCase().includes(lowerSearch) ||
      t.payer_lastName.toLowerCase().includes(lowerSearch) ||
      (t.candidate?.first_name ?? "").toLowerCase().includes(lowerSearch) ||
      (t.candidate?.last_name ?? "").toLowerCase().includes(lowerSearch) ||
      (t.concour?.name ?? "").toLowerCase().includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  // === PDF généré avec détails complets ===
  const downloadPDF = (data: any[], fileName: string) => {
    if (!data.length) return alert("Aucune transaction à télécharger");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Transactions MyVote", 14, 15);

    data.forEach((t, index) => {
      const startY = 20;
      doc.setFontSize(12);
      doc.text(`Réf : ${t.tx_ref}`, 14, startY);
      doc.text(`Montant : ${t.amount}`, 14, startY + 6);
      doc.text(`Status : ${t.status}`, 14, startY + 12);
      doc.text(`Paiement par : ${t.payment_method}`, 14, startY + 18);
      doc.text(`Votant : ${t.payer_firstName} ${t.payer_lastName}`, 14, startY + 24);
      doc.text(`Numéro : ${t.payer_phoneNumber ?? "-"}`, 14, startY + 30);
      doc.text(`Email : ${t.payer_email ?? "-"}`, 14, startY + 36);
      doc.text(`Candidat : ${t.candidate?.first_name ?? "-"} ${t.candidate?.last_name ?? "-"}`, 14, startY + 42);
      doc.text(`Concours : ${t.concour?.name ?? "-"}`, 14, startY + 48);
      doc.text(`Nombre de votes : ${t.votes_allocated ?? 0}`, 110, startY + 6);
      doc.text(`Prix par vote : ${t.concour?.price_per_vote ?? 0}`, 110, startY + 12);
      if (index < data.length - 1) doc.addPage();
    });

    doc.save(fileName);
  };

  if (loading) return <p>Chargement...</p>;
  if (!transactions.length) return <p>Aucune transaction trouvée.</p>;

  return (
    <div className="transactions-container">
      <SideBar />
      <div className="transactions-main">
        <h1>Liste des transactions</h1>

        <div className="transactions-actions">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="search-input"
          />
          <button onClick={() => downloadPDF(filteredTransactions, "transactions.pdf")}>
            Télécharger tous les reçus
          </button>
        </div>

        <table className="transactions-table">
          <thead>
            <tr>
              {["tx_ref", "amount", "status", "payer_firstName", "payer_lastName", "candidate", "concour"].map((col) => (
                <th key={col} onClick={() => handleSort(col)} className="sortable">
                  {col === "tx_ref" ? "Réf" :
                   col === "amount" ? "Montant" :
                   col === "status" ? "Status" :
                   col === "payer_firstName" ? "Prénom" :
                   col === "payer_lastName" ? "Nom" :
                   col === "candidate" ? "Candidat" :
                   col === "concour" ? "Concours" : col}
                  {sortColumn === col && (sortOrder === "asc" ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((t) => (
              <tr key={t.id} onClick={() => setSelectedTransaction(t)} className="clickable-row">
                <td>{t.tx_ref}</td>
                <td>{t.amount}</td>
                <td>{t.status}</td>
                <td>{t.payer_firstName}</td>
                <td>{t.payer_lastName}</td>
                <td>{t.candidate ? `${t.candidate.first_name} ${t.candidate.last_name}` : "-"}</td>
                <td>{t.concour?.name ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>Précédent</button>
          <span>Page {currentPage} / {totalPages}</span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>Suivant</button>
        </div>

        {selectedTransaction && (
          <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Détails de la transaction</h2>
              <p><strong>Réf :</strong> {selectedTransaction.tx_ref}</p>
              <p><strong>Montant :</strong> {selectedTransaction.amount}</p>
              <p><strong>Status :</strong> {selectedTransaction.status}</p>
              <p><strong>Paiement par :</strong> {selectedTransaction.payment_method}</p>
              <p><strong>Votant :</strong> {selectedTransaction.payer_firstName} {selectedTransaction.payer_lastName}</p>
              <p><strong>Numéro :</strong> {selectedTransaction.payer_phoneNumber ?? "-"}</p>
              <p><strong>Email :</strong> {selectedTransaction.payer_email ?? "-"}</p>
              <p><strong>Candidat :</strong> {selectedTransaction.candidate?.first_name ?? "-"} {selectedTransaction.candidate?.last_name ?? "-"}</p>
              <p><strong>Concours :</strong> {selectedTransaction.concour?.name ?? "-"}</p>
              <p><strong>Nombre de votes :</strong> {selectedTransaction.votes_allocated ?? 0}</p>
              <p><strong>Prix par vote :</strong> {selectedTransaction.concour?.price_per_vote ?? 0}</p>

              <button onClick={() => downloadPDF([selectedTransaction], `transaction_${selectedTransaction.tx_ref}.pdf`)}>
                Télécharger ce reçu
              </button>
              <button className="close-button" onClick={() => setSelectedTransaction(null)}>Fermer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}