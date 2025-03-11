import { FeaturedContent } from '../components/FeaturedContent';
import { GenreFilter } from '../components/GenreFilter';
import { MovieGrid } from '../components/home/MovieGrid';
import { useMovies } from '../hooks/useMovies';

export function Home() {
  const {
    movies,
    categories,
    selectedCategoryId,
    isLoading,
    error,
    isTransitioning,
    moviesByCategory,
    handleSelectCategory,
  } = useMovies();

  return (
    <>
      <FeaturedContent />
      <GenreFilter 
        categories={categories} 
        selectedCategoryId={selectedCategoryId} 
        onSelectCategory={handleSelectCategory} 
      />
      <div className={`mt-8 transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <MovieGrid
          movies={movies}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          isLoading={isLoading}
          error={error}
          isTransitioning={isTransitioning}
          moviesByCategory={moviesByCategory}
        />
      </div>
    </>
  );
}