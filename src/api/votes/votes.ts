import type { Transaction } from "../../data/models/transaction.model";
import type { VoteCreateResponse } from "../../data/models/vote.create.response";
import axiosInstance from "../axios_instance";

export const voteApi = {
  createVote: async (payload: any): Promise<VoteCreateResponse> => {
    const res = await axiosInstance.post("/v1/votes", payload);
    return res.data;
  },

  checkStatus: async (tx_ref: string): Promise<Transaction> => {
    const res = await axiosInstance.get(`/v1/transactions/${tx_ref}`);
    return res.data;
  }
};

