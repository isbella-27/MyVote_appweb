

export type Transaction = {
  id: number;
  tx_ref: string;
  concour_id: number;
  candidate_id: number;
  payer_lastName: string;
  payer_firstName: string;
  payer_phoneNumber: string;
  payer_email: string;
  amount: number;
  votes_allocated: number;
  payment_method: 'flooz' | 'tmoney';
  operator_ref?: string | null;
  status?: 'pending' | 'completed' | 'failed';
  webhook_payload?: JSON | null;
  fedapay_transaction_id?: string | null;
};