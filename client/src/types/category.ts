export interface Category {
    id: number;
    name: string;
    description: string;
  }
  
  export interface CategoryResponse {
    ok: boolean;
    data?: Category;
    message?: string;
  }
  
  export interface CategoriesResponse {
    ok: boolean;
    data?: Category[];
    message?: string;
  }
  