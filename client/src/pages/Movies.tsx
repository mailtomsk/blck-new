import React from 'react';
import { ContentRow } from '../components/ContentRow';

export function Movies() {
  const actionMovies = [
    '1536440136628-849c177e76a1',
    '1502899576159-f224dc2349fa',
    '1514068154540-8fc3e7f62041',
    '1520342868574-5fa3804e551c',
    '1526660690293-bcd32dc3b123'
  ];

  const dramaMovies = [
    '1533107862482-7e4b0493d5f9',
    '1492144534655-ae79c964c9d7',
    '1478720568477-152d9b164e26',
    '1500462918059-b1a0cb512f1d',
    '1485846234645-a62644f84728'
  ];

  return (
    <div className="pt-32 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8 px-16">Movies</h1>
      <ContentRow title="Action & Adventure" items={actionMovies} />
      <ContentRow title="Drama" items={dramaMovies} />
      <ContentRow title="Comedy" items={actionMovies.slice().reverse()} />
      <ContentRow title="Sci-Fi" items={dramaMovies.slice().reverse()} />
    </div>
  );
}