import {
  Category,
  CategoryResponse,
  CategoriesResponse,
} from "../../types/category";
import api from "./axios";

export const categoriesApi = {
  getCategories: async (): Promise<CategoriesResponse> => {
    return api.get("/category");
  },

  createCategory: async (
    categoryData: Pick<Category, "name" | "description">
  ): Promise<CategoryResponse> => {
    return api.post("/category", categoryData);
  },

  updateCategory: async (
    id: number,
    categoryData: Pick<Category, "name" | "description">
  ): Promise<CategoryResponse> => {
    return api.put(`/category/${id}`, categoryData);
  },

  deleteCategory: async (id: number): Promise<CategoryResponse> => {
    return api.delete(`/category/${id}`);
  },
};
