import type { Concour } from "../../data/models/concour.model";
import axiosInstance from "../axios_instance";


export const concourApi = {
    getAll: async (): Promise<Concour [] > => {
    const response = await axiosInstance.get('/concours');
    return response.data;
    },
    create: async (data: FormData) => {
    return axiosInstance.post("/concours", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    },
    destroy: async (id: number): Promise<Concour [] > => {
    const response = await axiosInstance.delete(`/concours/${id}`);
    return  response.data;
    },
    update: async (id: number, formData: FormData): Promise<Concour[]> => {
    // _method pour dire à Laravel que c'est un PUT
    formData.append('_method', 'PUT');
    
    // Utilisation de POST pour que les fichiers fonctionnent
    const response = await axiosInstance.post(`/concours/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
    },
    getById: async (id: number): Promise<Concour> => {
    const response = await axiosInstance.get(`/concours/${id}`);
    return response.data;
    },
    read: async (id: number): Promise<Concour> => {
    const response = await axiosInstance.get(`/concours/${id}`);
    return  response.data;
    },
}