import api from './axios';
import { CategoriesResponse, CategoryResponse } from '../../types/category';

export const getAllCategories = async (): Promise<CategoriesResponse> => {
  try {
    // Update the URL to match the actual API endpoint structure
    const response = await api.get('/category');
    
    // Return the response in the expected format
    return response.data || { ok: true, data: response };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { ok: false, message: 'Failed to fetch categories' };
  }
};

export const getCategoryById = async (id: number): Promise<CategoryResponse> => {
  try {
    const response = await api.get(`/category/${id}`);
    return response.data || { ok: true, data: response };
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    return { ok: false, message: 'Failed to fetch category details' };
  }
};