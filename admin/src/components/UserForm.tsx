import React from 'react';
import { X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  subscriptionType: 'free' | 'basic' | 'premium';
  joinDate: string;
}

interface UserFormProps {
  user?: User;
  onSubmit: (user: Omit<User, 'id'>) => void;
  onClose: () => void;
}

export function UserForm({ user, onSubmit, onClose }: UserFormProps) {
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [role, setRole] = React.useState<'user' | 'admin'>(user?.role || 'user');
  const [status, setStatus] = React.useState<'active' | 'inactive'>(user?.status || 'active');
  const [subscriptionType, setSubscriptionType] = React.useState<'free' | 'basic' | 'premium'>(
    user?.subscriptionType || 'free'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      role,
      status,
      subscriptionType,
      joinDate: user?.joinDate || new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6">
          {user ? 'Edit User' : 'Add New User'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
              className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Subscription Type
            </label>
            <select
              value={subscriptionType}
              onChange={(e) => setSubscriptionType(e.target.value as 'free' | 'basic' | 'premium')}
              className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-brand-yellow focus:ring-brand-yellow text-white"
            >
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-brand-yellow text-black py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
          >
            {user ? 'Update User' : 'Add User'}
          </button>
        </form>
      </div>
    </div>
  );
}