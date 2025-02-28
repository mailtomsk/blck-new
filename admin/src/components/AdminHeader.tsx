import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const notifications = [
    { id: 1, text: 'New user registration', time: '2 min ago' },
    { id: 2, text: 'Payment received', time: '5 min ago' },
    { id: 3, text: 'New movie upload completed', time: '10 min ago' }
  ];

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title === 'Categories' ? 'Genres' : title}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Quick search..."
              className="w-64 pl-10 pr-4 py-2 bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white text-sm"
            />
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white transition"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-zinc-800 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-zinc-700">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                </div>
                {notifications.map(notification => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-zinc-700 transition">
                    <p className="text-sm text-white">{notification.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                ))}
                <div className="px-4 py-2 border-t border-zinc-700">
                  <button className="text-sm text-red-500 hover:text-red-400 transition">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=32&h=32&q=80"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}