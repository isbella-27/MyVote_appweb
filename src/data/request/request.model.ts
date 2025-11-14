import type { User } from "../models/user.model";


export type LoginResponse = {
  status: boolean;
  message: string;
  user?: User;
  token?: string;
};


export type AuthResponse = {
  user: User;
};
