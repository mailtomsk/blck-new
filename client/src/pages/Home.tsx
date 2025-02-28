import React, { useEffect, useState } from 'react';
import { FeaturedContent } from '../components/FeaturedContent';
import { ContentRow } from '../components/ContentRow';
import { GenreFilter } from '../components/GenreFilter';
import { Movie } from '../types/movies';
import { 
  getTrendingMovies, 
  getContinueWatching, 
  getPopularMovies, 
  getNewReleases 
} from '../services/api/movies';

export function Home() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  
  const [isLoading, setIsLoading] = useState({
    trending: true,
    continueWatching: true,
    popular: true,
    newReleases: true
  });

  useEffect(() => {
    const fetchMovies = async () => {
      // Fetch trending movies
      try {
        const trendingResponse = await getTrendingMovies();
        if (trendingResponse.ok && trendingResponse.data) {
          setTrendingMovies(trendingResponse.data);
        }
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, trending: false }));
      }

      // Fetch continue watching
      try {
        const continueResponse = await getContinueWatching();
        if (continueResponse.ok && continueResponse.data) {
          setContinueWatching(continueResponse.data);
        }
      } catch (error) {
        console.error('Error fetching continue watching:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, continueWatching: false }));
      }

      // Fetch popular movies
      try {
        const popularResponse = await getPopularMovies();
        if (popularResponse.ok && popularResponse.data) {
          setPopularMovies(popularResponse.data);
        }
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, popular: false }));
      }

      // Fetch new releases
      try {
        const newReleasesResponse = await getNewReleases();
        if (newReleasesResponse.ok && newReleasesResponse.data) {
          setNewReleases(newReleasesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching new releases:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, newReleases: false }));
      }
    };

    fetchMovies();
  }, []);

  return (
    <>
      <FeaturedContent />
      <GenreFilter />
      <div className="mt-8">
        <ContentRow 
          title="New Releases" 
          items={trendingMovies} 
          isLoading={isLoading.trending} 
        />
        <ContentRow 
          title="Continue Watching" 
          items={continueWatching} 
          isLoading={isLoading.continueWatching} 
        />
        <ContentRow 
          title="Popular on BLCK" 
          items={popularMovies} 
          isLoading={isLoading.popular} 
        />
        <ContentRow 
          title="Anime Movies" 
          items={newReleases} 
          isLoading={isLoading.newReleases} 
        />
      </div>
    </>
  );
}