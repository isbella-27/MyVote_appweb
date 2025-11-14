import type { AuthResponse, LoginResponse } from "../../data/request/request.model";
import axiosInstance from "../axios_instance";


export const userApi = {
  login: async (formData: FormData): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>("/login", formData);
    return response.data;
  },

    getProfile: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.get('/profile');
    return response.data;
  },
};
