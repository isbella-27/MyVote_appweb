
import type { user } from "../../data/models/user.model";
import axios_instance from "../axios_instance";

export const userApi = {
    login: async (formData: FormData): Promise<user> => {
        const response = await axios_instance.post('/login', formData);
        return response.data;
    },

}