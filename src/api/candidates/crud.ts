import type { Candidate } from "../../data/models/candidate";
import axios_instance from "../axios_instance"

export const candidatApi = {
    getAll: async (): Promise<Candidate[]> => {
        const response = await axios_instance.get("/candidates");
        return response.data.data;
    },
    create: async (formData: FormData): Promise<Candidate[]> => {
    const response = await axios_instance.post("/candidates", formData);
    return response.data;
  },

  read: async (id: number): Promise<Candidate> => {
    const response = await axios_instance.get(`/candidates/${id}`);
    return response.data.data;
  },

  update: async (id: number, formData: FormData): Promise<Candidate[]> => {
    const response = await axios_instance.post(`/candidates/${id}`, formData);
    return response.data;
  },

  destroy: async (id: number): Promise<Candidate[]> => {
    const response = await axios_instance.delete(`/candidates/${id}`);
    return response.data;
  },
}