import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { MovieForm } from '../../components/MovieForm';
import { Movie } from '../../types/movie';
import { moviesApi } from '../../services/api/movies';
import { Category } from '../../types/category';
import { categoriesApi } from '../../services/api/categories';

export function Movies() {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingMovie, setEditingMovie] = React.useState<Movie | undefined>();
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const response = await moviesApi.getMovies();
      if (response.ok && response.data) {
        setMovies(response.data);
      }
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getCategories();
      if (response.ok && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  React.useEffect(() => {
    fetchMovies();
    fetchCategories();
  }, []);

  const handleAdd = async (formData: FormData) => {
    try {
      const response = await moviesApi.createMovie(formData);
      if (response.ok && response.data) {
        setMovies([...movies, response.data]);
      } else {
        throw new Error(response.message || 'Failed to create movie');
      }
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (editingMovie) {
      try {
        const response = await moviesApi.updateMovie(editingMovie.id, formData);
        if (response.ok && response.data) {
          setMovies(movies.map(m => 
            m.id === editingMovie.id ? response.data : m
          ));
        } else {
          throw new Error(response.message || 'Failed to update movie');
        }
      } catch (err) {
        throw err;
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        const response = await moviesApi.deleteMovie(id);
        if (response.ok) {
          setMovies(movies.filter(m => m.id !== id));
        } else {
          setError('Failed to delete movie');
        }
      } catch (err) {
        setError('Failed to delete movie');
      }
    }
  };

  // Function to get category names for a movie
  const getCategoryNames = (movie: Movie) => {
    if (movie.categories) {
      // Handle when categories is an array of objects
      if (Array.isArray(movie.categories) && movie.categories.length > 0 && typeof movie.categories[0] === 'object') {
        return movie.categories.map(cat => cat.name);
      }
      
      // Handle when categories is an array of IDs
      if (Array.isArray(movie.categories)) {
        return movie.categories.map(catId => {
          const category = categories.find(c => c.id === catId);
          return category ? category.name : '';
        }).filter(Boolean);
      }
    }
    
    if (movie.category) {
      return [movie.category.name];
    }
    
    const category = categories.find(c => c.id === movie.categoryId);
    return category ? [category.name] : [];
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Movies</h2>
        <button
          onClick={() => {
            setEditingMovie(undefined);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-brand-yellow text-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
        >
          <Plus className="h-5 w-5" />
          Add Movie
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-zinc-900 rounded-xl overflow-hidden">
              <img
                src={movie.thumbnail_url || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80'}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingMovie(movie);
                        setIsFormOpen(true);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-2">{movie.description}</p>
                <div className="flex flex-col gap-1 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-4">
                    <span>{movie.duration}</span>
                    <span>{movie.release_year}</span>
                    <span>{movie.rating}</span>
                  </div>
                  {movie.director && (
                    <div><span className="text-gray-400">Director:</span> {movie.director}</div>
                  )}
                  {movie.cast && (
                    <div><span className="text-gray-400">Cast:</span> {movie.cast}</div>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {getCategoryNames(movie).map((categoryName, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-zinc-800 text-gray-300 rounded text-xs">
                      {categoryName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {movies.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No movies found. Click the "Add Movie" button to create one.
            </div>
          )}
        </div>
      )}

      {isFormOpen && (
        <MovieForm
          movie={editingMovie}
          onSubmit={editingMovie ? handleEdit : handleAdd}
          onClose={() => {
            setIsFormOpen(false);
            setEditingMovie(undefined);
          }}
        />
      )}
    </div>
  );
}