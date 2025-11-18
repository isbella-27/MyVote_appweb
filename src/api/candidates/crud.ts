import type { Candidate } from "../../data/models/candidate";
import axios_instance from "../axios_instance";

// Définition de la structure d'enveloppe (utilisée par getAll, create, update)
interface ResponseWrapper<T> {
    data: T;
}

interface FilterParams {
    concours_id?: string;
}

export const candidatApi = {
    // Méthodes qui retournent l'enveloppe { data: T }
    getAll: async (params?: FilterParams): Promise<ResponseWrapper<Candidate[]>> => {
        const response = await axios_instance.get("/candidates", { params: params });
        return response.data;
    },

    create: async (formData: FormData): Promise<ResponseWrapper<Candidate>> => {
        const response = await axios_instance.post("/candidates", formData);
        return response.data;
    },

    // 🎯 CORRECTION MAJEURE : Type de retour ajusté à Candidate (non enveloppé)
    read: async (id: number): Promise<Candidate> => { // ⬅️ CHANGEMENT ICI
        const response = await axios_instance.get(`/candidates/${id}`);
        // response.data contient l'objet Candidate car Laravel retourne 'response()->json($candidate)'
        return response.data; // ⬅️ ET LÀ, on retourne la propriété 'data' qui est l'objet Candidate
    },

    update: async (id: number, formData: FormData): Promise<ResponseWrapper<Candidate>> => {
        formData.append('_method', 'PUT');
        const response = await axios_instance.post(`/candidates/${id}`, formData);
        return response.data;
    },

    destroy: async (id: number): Promise<void> => {
        await axios_instance.delete(`/candidates/${id}`);
    },
};