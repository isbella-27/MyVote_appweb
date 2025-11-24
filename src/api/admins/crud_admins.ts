import type { User } from "../../data/models/user.model";
import axiosInstance from "../axios_instance";

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
}
