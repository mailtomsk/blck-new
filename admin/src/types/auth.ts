export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  date_born: string;
  last_session: string;
  role: string;
}

export interface AuthResponse {
  ok: boolean;
  data?: {
    loggedUser: User;
    token: {
      token: string;
      expiresIn: string;
    };
  };
  message?: string;
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
