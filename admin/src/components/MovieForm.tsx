import React from 'react';
import { X, Upload, Plus, X as XIcon } from 'lucide-react';
import { Movie, MovieFormData } from '../types/movie';
import { Category } from '../types/category';
import { categoriesApi } from '../services/api/categories';

const RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
const MAX_VIDEO_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
}

export function MovieForm({ movie, onSubmit, onClose }: MovieFormProps) {
  const [formData, setFormData] = React.useState<MovieFormData>({
    title: movie?.title || '',
    categoryId: movie?.categoryId || 0,
    duration: movie?.duration || '',
    release_year: movie?.release_year || new Date().getFullYear(),
    rating: movie?.rating || 'PG-13',
    description: movie?.description || '',
    cast: movie?.cast || '',
    director: movie?.director || '',
    tags: movie?.tags || '',
    video: null as unknown as File,
    thumbnail: null as unknown as File,
  });

  // Initialize selected categories from movie data
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(() => {
    if (movie) {
      // If movie has categories array, use it
      if (movie.categories && Array.isArray(movie.categories)) {
        return movie.categories.map(cat => typeof cat === 'object' ? cat.id : cat);
      }
      // If movie has category object, use its id
      else if (movie.category) {
        return [movie.category.id];
      }
      // Fallback to categoryId
      else if (movie.categoryId) {
        return [movie.categoryId];
      }
    }
    return [];
  });
  
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [videoError, setVideoError] = React.useState('');
  const [thumbnailError, setThumbnailError] = React.useState('');
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const thumbnailInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
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

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle single category selection (for backward compatibility)
    if (name === 'categoryId') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'release_year' ? parseInt(value) : value,
      }));
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const validateFileSize = (file: File, maxSize: number): boolean => {
    return file.size <= maxSize;
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFileSize(file, MAX_VIDEO_SIZE)) {
        setVideoError('Video file size must not exceed 15MB');
        return;
      }
      setVideoError('');
      setFormData(prev => ({ ...prev, video: file }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFileSize(file, MAX_THUMBNAIL_SIZE)) {
        setThumbnailError('Thumbnail file size must not exceed 5MB');
        return;
      }
      setThumbnailError('');
      setFormData(prev => ({ ...prev, thumbnail: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const form = new FormData();
      
      // Add all form data except categoryId
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'categoryId' && value !== null && value !== undefined) {
          form.append(key, value);
        }
      });
      
      // Add primary category (for backward compatibility)
      if (selectedCategories.length > 0) {
        form.append('categoryId', selectedCategories[0].toString());
      } else if (formData.categoryId) {
        form.append('categoryId', formData.categoryId.toString());
      }
      
      // Add all selected categories as a JSON string
      if (selectedCategories.length > 0) {
        form.append('categories', JSON.stringify(selectedCategories));
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6">
          {movie ? 'Edit Movie' : 'Add New Movie'}
        </h2>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="2h 30m"
                className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Director <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleInputChange}
                placeholder="Christopher Nolan"
                className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Cast <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cast"
                value={formData.cast}
                onChange={handleInputChange}
                placeholder="Leonardo DiCaprio, Tom Hardy"
                className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Release Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="release_year"
                value={formData.release_year}
                onChange={handleInputChange}
                className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Rating <span className="text-red-500">*</span>
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                required
              >
                {RATINGS.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Categories <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    selectedCategories.includes(category.id)
                      ? 'bg-brand-yellow text-black'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            {selectedCategories.length === 0 && (
              <p className="mt-1 text-sm text-red-500">Please select at least one category</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Tags
            </label>
            <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="popular, action, adventure"
                className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
                required
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Video File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                ref={videoInputRef}
                onChange={handleVideoChange}
                accept="video/*"
                className="hidden"
                required={!movie}
              />
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="w-full bg-zinc-800 text-white py-2 px-4 rounded-lg hover:bg-zinc-700 transition flex items-center justify-center gap-2"
              >
                <Upload className="h-5 w-5" />
                {formData.video ? formData.video.name : movie?.video_url ? 'Change Video File' : 'Choose Video File'}
              </button>
              {videoError && (
                <p className="mt-1 text-sm text-red-500">{videoError}</p>
              )}
              {formData.video && !videoError && (
                <p className="mt-1 text-sm text-gray-400">
                  Selected: {formData.video.name} ({(formData.video.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
              {!formData.video && movie?.video_url && (
                <p className="mt-1 text-sm text-gray-400">
                  Current video file will be kept if no new file is selected
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Thumbnail <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                ref={thumbnailInputRef}
                onChange={handleThumbnailChange}
                accept="image/*"
                className="hidden"
                required={!movie}
              />
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-full bg-zinc-800 text-white py-2 px-4 rounded-lg hover:bg-zinc-700 transition flex items-center justify-center gap-2"
              >
                <Upload className="h-5 w-5" />
                {formData.thumbnail ? formData.thumbnail.name : movie?.thumbnail_url ? 'Change Thumbnail' : 'Choose Thumbnail'}
              </button>
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
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-zinc-800 rounded-full h-2.5">
              <div
                className="bg-brand-yellow h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !!videoError || !!thumbnailError || selectedCategories.length === 0}
            className="w-full bg-brand-yellow text-black py-2 rounded-lg hover:bg-opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {movie ? 'Updating Movie...' : 'Creating Movie...'}
              </span>
            ) : (
              movie ? 'Update Movie' : 'Add Movie'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}