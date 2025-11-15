import type { Candidate } from "../../data/models/candidate.model";
import axiosInstance from "../axios_instance";

export const candidateApi = {
    getByConcourId: async (concourId: number) => {
    const response = await axiosInstance.get(`/concours/${concourId}/candidates`);
    return response.data;
    },

    getAll: async (): Promise<Candidate [] > => {
    const response = await axiosInstance.get('/candidates');
    return response.data;
    },
    create: async (data: FormData) => {
    return axiosInstance.post("/candidates", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    },
    destroy: async (id: number): Promise<Candidate [] > => {
    const response = await axiosInstance.delete(`/candidates/${id}`);
    return  response.data;
    },
    update: async (id: number, formData: FormData): Promise<Candidate[]> => {
    // _method pour dire à Laravel que c'est un PUT
    formData.append('_method', 'PUT');
    
    // Utilisation de POST pour que les fichiers fonctionnent
    const response = await axiosInstance.post(`/candidates/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
    },
    getById: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.get(`/candidates/${id}`);
    return response.data;
    },
    read: async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.get(`/candidates/${id}`);
    return  response.data;
    },
}
