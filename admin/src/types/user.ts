export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  date_born: string;
  last_session: string;
  role: string;
  password?: string;
}

export interface UserResponse {
  ok: boolean;
  data?: User;
  message?: string;
}

export interface UsersResponse {
  ok: boolean;
  data?: User[];
  message?: string;
}
