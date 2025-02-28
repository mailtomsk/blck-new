import { AuthResponse } from "../../types/auth";
import api from "./axios";

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return api.post("/user/login", {
      email,
      password,
      type: "ADMIN",
    });
  },

  logout: async () => {
    return api.post("/user/logout");
  },
};
