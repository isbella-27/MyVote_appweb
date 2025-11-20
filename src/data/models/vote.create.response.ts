

export type VoteCreateResponse = {
  message: string;
  tx_ref: string;
  amount: number;
  payment_url: string;
  status: 'pending';
};