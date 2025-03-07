import React, { useState } from 'react';

interface UserDetailsProps {
  setUserDetailsValid: (isValid: boolean) => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ setUserDetailsValid }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const validateForm = () => {
    const isValid = name.trim() !== '' && email.trim() !== '' && address.trim() !== '';
    setUserDetailsValid(isValid);
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-4 sm:p-6 mb-4 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">User Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-2 text-sm">Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validateForm();
            }}
            className="w-full bg-zinc-800 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2 text-sm">Email</label>
          <input
            type="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateForm();
            }}
            className="w-full bg-zinc-800 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2 text-sm">Shipping Address</label>
          <input
            type="text"
            placeholder="123 Main St, City, Country"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              validateForm();
            }}
            className="w-full bg-zinc-800 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
            required
          />
        </div>
      </div>
    </div>
  );
};
