import { useState } from "react";
import { voteApi } from "../../api/votes/votes";
import "./VoteModal.css";

type Candidate = {
  id: number;
  first_name: string;
  last_name: string;
};

type Concour = {
  id: number;
  price_per_vote: number;
};

type VoteModalProps = {
  candidate: Candidate;
  concour: Concour;
  onClose: () => void;
  onSuccess: (data: { payment_url: string; tx_ref: string; amount: number; status: string }) => void;
};

export default function VoteModal({ candidate, concour, onClose, onSuccess }: VoteModalProps) {
  const [votesRequested, setVotesRequested] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"tmoney" | "flooz">("tmoney");

  const [payer, setPayer] = useState({
    payer_lastName: "",
    payer_firstName: "",
    payer_email: "",
    payer_phoneNumber: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayer({ ...payer, [e.target.name]: e.target.value });
  };

  const submitVote = async () => {
    setLoading(true);
    setError("");

    try {
      const body = {
        concour_id: concour.id,
        candidate_id: candidate.id,
        votes_requested: votesRequested,
        payment_method: paymentMethod,
        ...payer,
      };

      const data = await voteApi.createVote(body);

      onSuccess(data); // { payment_url, tx_ref, amount, status }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur serveur");
    }

    setLoading(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>Voter pour {candidate.first_name} {candidate.last_name}</h2>
        <p className="price-info">
          Prix par vote : <strong>{concour.price_per_vote} FCFA</strong>
        </p>

        <label className="label">Nombre de votes</label>
        <input
          className="input"
          type="number"
          min={1}
          value={votesRequested}
          onChange={(e) => setVotesRequested(Number(e.target.value))}
        />

        <label className="label">Moyen de paiement</label>
        <select
          className="input"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as "tmoney" | "flooz")}
        >
          <option value="tmoney">TMoney</option>
          <option value="flooz">Flooz</option>
        </select>

        <h3 className="section-title">Informations du votant</h3>

        <input className="input" name="payer_lastName" placeholder="Nom" onChange={handleChange} />
        <input className="input" name="payer_firstName" placeholder="Prénom" onChange={handleChange} />
        <input className="input" name="payer_email" placeholder="Email" onChange={handleChange} />
        <input className="input" name="payer_phoneNumber" placeholder="Téléphone" onChange={handleChange} />

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Annuler</button>
          <button className="pay-btn" onClick={submitVote} disabled={loading}>
            {loading ? "Traitement..." : "Confirmer & Payer"}
          </button>
        </div>
      </div>
    </div>
  );
}