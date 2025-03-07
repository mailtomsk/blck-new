import { create } from 'zustand';

interface User {
  username: string;
  role: 'user';
  token?: string;
}

interface AuthStore {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Hard-coded user credentials
const USER_CREDENTIALS = {
  username: 'user',
  password: 'user123',
  token: 'mock-jwt-token'
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (username, password) => {
    if (username === USER_CREDENTIALS.username && password === USER_CREDENTIALS.password) {
      set({ user: { username, role: 'user', token: USER_CREDENTIALS.token } });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null })
}));