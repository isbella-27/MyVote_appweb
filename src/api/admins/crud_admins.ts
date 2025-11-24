import type { Candidate } from "../../data/models/candidate.model";
import type { Concour } from "../../data/models/concour.model";
import type { User } from "../../data/models/user.model";
import axiosInstance from "../axios_instance";


export interface TransactionSummary {
  validated: {
    payment_method: string;
    amount: number;
  }[];
}


export interface DashboardStats {
  payment_methods: { payment_method: string; amount: number }[];
  concours_status: { EN_COURS: number; TERMINE: number; A_VENIR: number }
  validated_votes: number;
  validated_amount: number;
  total_votes: number;
  total_concours: number;
  total_candidates: number;
  concours_votes: { id: number; name: string; validated_votes: number }[];
}


export interface TransactionDetails {
  id: number;
  amount: number;
  tx_ref: string;
  status: string;
  created_at: string;
  payer_firstName: string;
  payer_lastName: string;
  payer_phoneNumber: string;
  candidate?: Candidate;
  concour?: Concour;
}

export interface ConcourStatusStats {
  total: number;
  stats: {
    EN_COURS: number;
    TERMINE: number;
    A_VENIR: number;
  };
}

export const adminApi = {
    getAll: async (): Promise<User [] > => {
    const response = await axiosInstance.get('/admins');
    return response.data;
    },
    create: async (formData:FormData): Promise<User [] > => {
    const response = await axiosInstance.post('/admins', formData);
    return response.data;
    },
    destroy: async (id: number): Promise<User [] > => {
    const response = await axiosInstance.delete(`/admins/${id}`);
    return  response.data;
    },
    update: async (id: number, formData:FormData): Promise<User [] > => {
    const response = await axiosInstance.put(`/admins/${id}`, formData);
    return  response.data;
    },
    read: async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/admins/${id}`);
    return  response.data;
    },

    // Concours
    getConcours: async (): Promise<Concour[]> => {
    const res = await axiosInstance.get("/v1/admin/concours");
    return res.data;
  },

  getConcourDetails: async (concourId: number): Promise<Concour> => {
    const res = await axiosInstance.get(`/v1/admin/concours/${concourId}`);
    return res.data;
  },

  getConcourCandidates: async (concourId: number): Promise<Candidate[]> => {
    const res = await axiosInstance.get(`/v1/admin/concours/${concourId}/candidates`);
    return res.data;
  },

  getConcourStats: async (concourId: number) => {
    const res = await axiosInstance.get(`/v1/admin/concours/${concourId}/stats`);
    return res.data;
  },

  // Candidates
  getCandidateDetails: async (candidateId: number): Promise<Candidate> => {
    const res = await axiosInstance.get(`/v1/admin/candidates/${candidateId}`);
    return res.data;
  },

  getCandidateStats: async (candidateId: number) => {
    const res = await axiosInstance.get(`/v1/admin/candidates/${candidateId}/stats`);
    return res.data;
  },


  // Transactions
  getTransactionSummary: async (): Promise<TransactionSummary> => {
    const res = await axiosInstance.get("/v1/admin/transactions/summary");
    return res.data;
  },

  getTransactionDetails: async (id: number): Promise<TransactionDetails> => {
    const res = await axiosInstance.get(`/v1/admin/transactions/${id}`);
    return res.data;
  },

  getAllTransactions: async () => {
    const res = await axiosInstance.get("/v1/admin/transactions");
    return res.data.transactions;
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await axiosInstance.get("/v1/admin/dashboard/stats");
    return res.data;
  },

    // Concours Status Stats
  getConcoursStatusStats: async (): Promise<ConcourStatusStats> => {
    const res = await axiosInstance.get("/v1/admin/concours/status-stats");
    return res.data;
  },
}
