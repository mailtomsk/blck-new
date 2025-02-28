import { PrismaClient, Movie, Category } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// TMDB API configuration
const TMDB_API_KEY = 'your_tmdb_api_key';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const VIDEO_BASE_URL = 'https://api.themoviedb.org/3/movie';

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
}

interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  vote_average: number;
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBVideoResult {
  results: Array<{
    key: string;
    site: string;
    type: string;
  }>;
}

interface TMDBCredits {
  cast: Array<{
    name: string;
    order: number;
  }>;
  crew: Array<{
    name: string;
    job: string;
  }>;
}

async function getVideoUrl(movieId: number): Promise<string | null> {
  try {
    const response = await axios.get<TMDBVideoResult>(
      `${VIDEO_BASE_URL}/${movieId}/videos?api_key=${TMDB_API_KEY}`
    );
    const videos = response.data.results;
    // Try to find a trailer
    const trailer = videos.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );
    if (trailer) {
      return `https://www.youtube.com/watch?v=${trailer.key}`;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching video for movie ${movieId}:`, error);
    return null;
  }
}

interface TMDBResponse<T> {
  results: T[];
}

async function main() {
  try {
    // First, fetch all genres from TMDB
    const genresResponse = await axios.get<{ genres: TMDBGenre[] }>(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    );
    const tmdbGenres: TMDBGenre[] = genresResponse.data.genres;

    // Create or update categories in our database
    for (const genre of tmdbGenres) {
      await prisma.category.upsert({
        where: { id: genre.id },
        update: { name: genre.name },
        create: {
          id: genre.id,
          name: genre.name,
          description: `Movies in the ${genre.name} genre`,
        },
      });
    }

    // Fetch popular movies from TMDB
    const moviesResponse = await axios.get<TMDBResponse<TMDBMovie>>(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
    );
    const movies: TMDBMovie[] = moviesResponse.data.results;

    // Process each movie
    for (const movie of movies) {
      // Get video URL
      const videoUrl = await getVideoUrl(movie.id);

      // Get movie details
      const movieDetailsResponse = await axios.get<TMDBMovieDetails>(
        `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`
      );
      const movieDetails = movieDetailsResponse.data;
      
      const runtime = movieDetails.runtime;
      const hours = Math.floor(runtime / 60);
      const minutes = runtime % 60;
      const duration = `${hours}h ${minutes}m`;

      // Get movie credits (cast and crew)
      const creditsResponse = await axios.get<TMDBCredits>(
        `${TMDB_BASE_URL}/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}`
      );
      const credits = creditsResponse.data;

      // Get director
      const director = credits.crew.find(person => person.job === 'Director')?.name || null;

      // Get top 5 cast members
      const topCast = credits.cast
        .sort((a, b) => a.order - b.order)
        .slice(0, 5)
        .map(actor => actor.name)
        .join(', ');

      // Prepare movie data
      const movieData = {
        title: movie.title,
        description: movie.overview,
        thumbnail_url: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        backdrop_url: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
        video_url: videoUrl,
        release_year: new Date(movie.release_date).getFullYear(),
        duration: duration,
        rating: `${Math.round(movieDetails.vote_average)}/10`,
        director: director,
        cast: topCast,
      };

      // Create the movie
      try {
        const createdMovie = await prisma.movie.create({
          data: {
            tmdb_id: movie.id,
            ...movieData,
          },
        });

        // Connect movie with its categories
        for (const genreId of movie.genre_ids) {
          await prisma.movieCategory.create({
            data: {
              movieId: createdMovie.id,
              categoryId: genreId,
            },
          });
        }

        console.log(`Created movie: ${movie.title}`);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Unique constraint')) {
          console.log(`Skipping existing movie: ${movie.title}`);
          continue;
        }
        throw error;
      }
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error during seeding:', error.message);
    } else {
      console.error('Unknown error during seeding:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 