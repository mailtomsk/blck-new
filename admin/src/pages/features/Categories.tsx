import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { CategoryForm } from '../../components/CategoryForm';
import { Category } from '../../types/category';
import { categoriesApi } from '../../services/api/categories';

export function Categories() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | undefined>();
  const [error, setError] = React.useState('');

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getCategories();
      if (response.ok && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (category: Pick<Category, 'name' | 'description'>) => {
    try {
      const response = await categoriesApi.createCategory(category);
      if (response.ok && response.data) {
        setCategories([...categories, response.data]);
      } else {
        throw new Error(response.message || 'Unable to create category');
      }
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = async (category: Pick<Category, 'name' | 'description'>) => {
    if (editingCategory) {
      try {
        const response = await categoriesApi.updateCategory(editingCategory.id, category);
        if (response.ok && response.data) {
          setCategories(categories.map(c =>
            c.id === editingCategory.id ? response.data : c
          ));
        } else {
          throw new Error(response.message || 'Unable to update category');
        }
      } catch (err) {
        throw err;
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await categoriesApi.deleteCategory(id);
        if (response.ok) {
          setCategories(categories.filter(c => c.id !== id));
        } else {
          setError('Failed to delete category');
        }
      } catch (err) {
        setError('Failed to delete category');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Categories</h2>
        <button
          onClick={() => {
            setEditingCategory(undefined);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-brand-yellow text-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-800">
              <th className="text-left p-4 text-gray-400 font-medium">Name</th>
              <th className="text-left p-4 text-gray-400 font-medium">Description</th>
              <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-zinc-800">
                <td className="p-4 text-white">{category.name}</td>
                <td className="p-4 text-gray-400">{category.description}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setIsFormOpen(true);
                    }}
                    className="text-gray-400 hover:text-white p-2"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-400">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleEdit : handleAdd}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCategory(undefined);
          }}
        />
      )}
    </div>
  );
}