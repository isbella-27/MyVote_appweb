

export type User = {
  id: number;
  name: string;
  email: string;
  role?: 'user' | 'admin' | 'super_admin';
  created_at?: string;
  updated_at?: string;
};
