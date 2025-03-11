import React from 'react';
import { useNavigate } from 'react-router-dom';

export const EmptyCart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 sm:pt-32 min-h-screen text-center px-4">
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4">
        Your Cart is Empty
      </h1>
      <p className="text-gray-400 mb-8">
        Add some movies or TV shows to get started
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-brand-yellow text-black px-6 sm:px-8 py-2 sm:py-3 rounded hover:bg-opacity-90 transition font-semibold"
      >
        Browse Content
      </button>
    </div>
  );
};