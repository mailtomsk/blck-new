import React from 'react';
import { ContentRow } from '../components/ContentRow';

export function MyList() {
  const savedContent = [
    '1536440136628-849c177e76a1',
    '1502899576159-f224dc2349fa',
    '1514068154540-8fc3e7f62041',
    '1520342868574-5fa3804e551c',
    '1526660690293-bcd32dc3b123'
  ];

  return (
    <div className="pt-32 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8 px-16">My List</h1>
      <ContentRow title="Saved Movies & Shows" items={savedContent} />
    </div>
  );
}