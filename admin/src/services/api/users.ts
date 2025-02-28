import { User } from "../../types/user";
import api from "./axios";

export const usersApi = {
  getUsers: async () => {
    return api.get("/users");
  },

  getUser: async (id: number) => {
    return api.get(`/users/${id}`);
  },

  createUser: async (userData: Partial<User>) => {
    return api.post("/users", userData);
  },

  updateUser: async (id: number, userData: Partial<User>) => {
    return api.put(`/users/${id}`, userData);
  },

  deleteUser: async (id: number) => {
    return api.delete(`/users/${id}`);
  },
};
