import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthStore } from "../types/auth";
import { authApi } from "../services/api/auth";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        try {
          const response = await authApi.login(email, password);

          if (!response.ok || !response.data) {
            throw new Error(response.message || "Invalid credentials");
          }

          const { loggedUser, token } = response.data;

          set({
            user: loggedUser,
            token: token.token,
          });
        } catch (error) {
          throw new Error("Invalid credentials");
        }
      },
      logout: () => {
        authApi.logout().finally(() => {
          set({ user: null, token: null });
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

export const getAuthToken = () => useAuthStore.getState().token;
