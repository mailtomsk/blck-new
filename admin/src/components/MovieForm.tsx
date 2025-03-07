import React from 'react';
import { X, Plus } from 'lucide-react';
import { Movie, MovieFormData } from '../types/movie';
import { Category } from '../types/category';
import { Host } from '../types/host';
import { categoriesApi } from '../services/api/categories';
import { hostsApi } from '../services/api/hosts';
import { HostForm } from './HostForm';

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
}

export function MovieForm({ movie, onSubmit, onClose }: MovieFormProps) {
  const [formData, setFormData] = React.useState<MovieFormData>({
    title: movie?.title || '',
    categoryId: movie?.categoryId || 0,
    hostIds: movie?.hosts?.map(host => host.id) || [],
    show: movie?.show || '',
    products_reviewed: movie?.products_reviewed || '',
    key_highlights: movie?.key_highlights || '',
    rating: movie?.rating || '',
    additional_context: movie?.additional_context || '',
    description: movie?.description || '',
    video_url: movie?.video_url || '',
    thumbnail: null as unknown as File,
  });
  
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [hosts, setHosts] = React.useState<Host[]>([]);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [thumbnailError, setThumbnailError] = React.useState('');
  const [isHostFormOpen, setIsHostFormOpen] = React.useState(false);

  const thumbnailInputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getCategories();
        if (response.ok && response.data) {
          setCategories(response.data);
          
          if (movie) {
            const categoryId = movie.category?.id || movie.categoryId;
            if (categoryId) {
              setFormData(prev => ({ ...prev, categoryId }));
            }
          }
        }
      } catch (err) {
        setError('Failed to fetch categories');
      }
    };

    const fetchHosts = async () => {
      try {
        const response = await hostsApi.getHosts();
        if (response.ok && response.data) {
          setHosts(response.data);
        }
      } catch (err) {
        setError('Failed to fetch hosts');
      }
    };

    fetchCategories();
    fetchHosts();
  }, [movie]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'categoryId' ? parseInt(value) : value,
    }));
  };

  const handleHostChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
    setFormData(prev => ({
      ...prev,
      hostIds: selectedOptions
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setThumbnailError('Thumbnail file size must not exceed 5MB');
        return;
      }
      setThumbnailError('');
      setFormData(prev => ({ ...prev, thumbnail: file }));
    }
  };

  const handleHostSubmit = async (formData: FormData) => {
    try {
      const response = await hostsApi.createHost(formData);
      if (response.ok && response.data?.id) {
        const newHost = response.data;
        setHosts([...hosts, newHost]);
        setFormData(prev => ({
          ...prev,
          hostIds: [...prev.hostIds, newHost.id]
        }));
      } else {
        throw new Error(response.message || 'Failed to create host');
      }
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const form = new FormData();
      
      form.append('title', formData.title);
      form.append('categoryId', formData.categoryId.toString());
      form.append('description', formData.description);
      form.append('show', formData.show);
      form.append('products_reviewed', formData.products_reviewed);
      form.append('key_highlights', formData.key_highlights);
      form.append('rating', formData.rating);
      form.append('additional_context', formData.additional_context);
      form.append('video_url', formData.video_url || '');
      form.append('hostIds', JSON.stringify(formData.hostIds));
      
      if (formData.thumbnail) {
        form.append('thumbnail', formData.thumbnail);
      }

      await onSubmit(form);
      onClose();
    } catch (err) {
      setError('Failed to save movie');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto py-10">
      <div 
        ref={formRef}
        className="bg-zinc-900 rounded-xl p-6 w-full max-w-6xl relative my-4 mx-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6">
          {movie ? 'Edit Content' : 'Add New Content'}
        </h2>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-400">
                        Hosts <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsHostFormOpen(true)}
                        className="text-sm text-brand-yellow hover:text-brand-yellow/80 flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" /> Add New Host
                      </button>
                    </div>
                    <select
                      multiple
                      name="hostIds"
                      value={formData.hostIds.map(id => id.toString())}
                      onChange={handleHostChange}
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white h-24"
                      required
                    >
                      {hosts.map((host) => (
                        <option key={host.id} value={host.id}>
                          {host.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Hold Ctrl (or Cmd) to select multiple hosts</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Show <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="show"
                      value={formData.show}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Video URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="video_url"
                      value={formData.video_url}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Product Information Section */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Product Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Products Reviewed <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="products_reviewed"
                    value={formData.products_reviewed}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                    rows={6}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Media Files Section */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Media Files</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Thumbnail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      ref={thumbnailInputRef}
                      onChange={handleThumbnailChange}
                      accept="image/*"
                      required={!movie?.thumbnail_url}
                      className="w-full bg-zinc-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-yellow file:text-black hover:file:bg-brand-yellow/90"
                    />
                    {thumbnailError && (
                      <p className="mt-1 text-sm text-red-500">{thumbnailError}</p>
                    )}
                    {formData.thumbnail && !thumbnailError && (
                      <p className="mt-1 text-sm text-gray-400">
                        Selected: {formData.thumbnail.name} ({(formData.thumbnail.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                    {!formData.thumbnail && movie?.thumbnail_url && (
                      <p className="mt-1 text-sm text-gray-400">
                        Current thumbnail will be kept if no new file is selected
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              {/* Additional Information Section */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Additional Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Key Highlights
                    </label>
                    <textarea
                      name="key_highlights"
                      value={formData.key_highlights}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                      rows={5}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Additional Context
                    </label>
                    <textarea
                      name="additional_context"
                      value={formData.additional_context}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                      rows={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-700 text-white py-2 px-6 rounded-lg hover:bg-zinc-600 transition font-semibold mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !!thumbnailError || !formData.categoryId}
              className="bg-brand-yellow text-black py-2 px-6 rounded-lg hover:bg-opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {movie ? 'Updating Content...' : 'Creating Content...'}
                </span>
              ) : (
                movie ? 'Update Content' : 'Add Content'
              )}
            </button>
          </div>
        </form>
      </div>

      {isHostFormOpen && (
        <HostForm
          onSubmit={handleHostSubmit}
          onClose={() => setIsHostFormOpen(false)}
        />
      )}
    </div>
  );
}