import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MoviePlayer } from '../components/MoviePlayer';

export function Watch() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <Navigate to="/" replace />;
  }

  return <MoviePlayer movieId={parseInt(id, 10)} />;
}