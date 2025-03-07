import React from 'react';
import { X } from 'lucide-react';
import { Category } from '../types/category';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (category: Pick<Category, 'name' | 'description'>) => Promise<void>;
  onClose: () => void;
}

export function CategoryForm({ category, onSubmit, onClose }: CategoryFormProps) {
  const [name, setName] = React.useState(category?.name || '');
  const [description, setDescription] = React.useState(category?.description || '');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSubmit({ name, description });
      onClose();
    } catch (err) {
      setError('Unable to create category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">
          {category ? 'Edit Category' : 'Add New Category'}
        </h2>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
              rows={3}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-yellow text-black py-2 rounded-lg hover:bg-opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {category ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              category ? 'Update Category' : 'Add Category'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}