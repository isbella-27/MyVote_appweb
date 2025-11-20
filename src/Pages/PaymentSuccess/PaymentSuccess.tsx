import { useState, useEffect } from "react";
import { voteApi } from "../../api/votes/votes";
import { jsPDF } from "jspdf";
import "./PaymentSuccess.css";
import logo from "../../assets/logo.png";
import { useNavigate, useSearchParams } from "react-router";

export default function PaymentSuccess() {
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tx_ref = searchParams.get("tx_ref");

  useEffect(() => {
    if (!tx_ref) {
      setError("Référence de transaction manquante");
      setLoading(false);
      return;
    }

    voteApi
      .checkStatus(tx_ref)
      .then(setTransaction)
      .catch(() => setError("Impossible de récupérer la transaction."))
      .finally(() => setLoading(false));
  }, [tx_ref]);

  const downloadPDF = () => {
    if (!transaction) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Reçu de paiement", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Référence : ${transaction.tx_ref}`, 20, 40);
    doc.text(`Montant payé : ${transaction.amount} XOF`, 20, 50);
    doc.text(`Votes alloués : ${transaction.votes_allocated}`, 20, 60);
    doc.text(
      `Candidat : ${transaction.candidate_first_name} ${transaction.candidate_last_name}`,
      20,
      70
    );
    doc.text(`Concours : ${transaction.concour_name}`, 20, 80);
    doc.text(`Prix par vote : ${transaction.concour_price_per_vote} XOF`, 20, 90);
    doc.text(`Payer : ${transaction.payer_firstName} ${transaction.payer_lastName}`, 20, 100);
    doc.text(`Téléphone : ${transaction.payer_phoneNumber}`, 20, 110);
    doc.text(`Email : ${transaction.payer_email}`, 20, 120);
    doc.text(`Méthode de paiement : ${transaction.payment_method}`, 20, 130);
    doc.text(`Statut : ${transaction.status}`, 20, 140);
    doc.text(`Date : ${new Date().toLocaleString()}`, 20, 150);

    doc.save(`recu_${transaction.tx_ref}.pdf`);
  };

  const goToConcour = (id: number | null | undefined) => {
    if (id) {
      navigate(`/concours/${id}/public`);
    } else {
      navigate("/");
    }
  };


  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!transaction) return <p className="text-center mt-10">Transaction introuvable.</p>;

  return (
    <div className="payment-container">
      <div className="payment-header">
        <img src={logo} alt="Logo" />
        <h1>Résultat du paiement</h1>
      </div>

      {transaction.status === "completed" ? (
        <>
          <p className="payment-success">Paiement effectué avec succès !</p>

          <div className="payment-details">
            <div className="row">
              <span>Référence :</span>
              <span>{transaction.tx_ref}</span>
            </div>
            <div className="row">
              <span>Montant payé :</span>
              <span>{transaction.amount} XOF</span>
            </div>
            <div className="row">
              <span>Votes alloués :</span>
              <span>{transaction.votes_allocated}</span>
            </div>
            <div className="row">
              <span>Candidat :</span>
              <span>
                {transaction.candidate_first_name} {transaction.candidate_last_name}
              </span>
            </div>
            <div className="row">
              <span>Concours :</span>
              <span>{transaction.concour_name}</span>
            </div>
            <div className="row">
              <span>Prix par vote :</span>
              <span>{transaction.concour_price_per_vote} XOF</span>
            </div>
            <div className="row">
              <span>Payer par :</span>
              <span>
                {transaction.payer_firstName} {transaction.payer_lastName}
              </span>
            </div>
            <div className="row">
              <span>Téléphone :</span>
              <span>{transaction.payer_phoneNumber}</span>
            </div>
            <div className="row">
              <span>Email :</span>
              <span>{transaction.payer_email}</span>
            </div>
            <div className="row">
              <span>Méthode de paiement :</span>
              <span>{transaction.payment_method}</span>
            </div>
            <div className="row">
              <span>Statut :</span>
              <span>{transaction.status}</span>
            </div>
          </div>

          <div className="button-group">
            <button className="button download-btn" onClick={downloadPDF}>
              Télécharger le reçu PDF
            </button>
            <button className="button back-btn" onClick={() => goToConcour(transaction.concour_id)}>
              Retour au concours
            </button>
          </div>
        </>
      ) : (
        <p className="text-red-600 font-semibold text-center">Paiement non confirmé.</p>
      )}

      <div className="payment-footer">
        © {new Date().getFullYear()} - Powered by Votify
      </div>
    </div>
  );
}