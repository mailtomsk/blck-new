import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Film,
  Users,
  BarChart,
  Settings,
  LogOut,
  FolderOpen,
  CreditCard,
} from 'lucide-react';
import { Categories } from './features/Categories';
import { Movies } from './features/Movies';
import { AdminHeader } from '../components/AdminHeader';
import { Users as UsersComponent } from './features/Users';
import { Settings as SettingsComponent } from '../components/Settings';
import { PaymentsList } from '../components/PaymentsList';

export function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [contentTab, setContentTab] = React.useState<'categories' | 'movies'>(
    'categories'
  );

  if (!user) {
    navigate('/login');
    return null;
  }

  const stats = [
    { label: 'Total Users', value: '15.8k', change: '+12%', icon: Users },
    {
      label: 'Active Subscriptions',
      value: '12.4k',
      change: '+8%',
      icon: Film,
    },
    { label: 'Revenue', value: '$458.6k', change: '+15%', icon: BarChart },
  ];

  const recentActivity = [
    {
      user: 'John Doe',
      action: 'Started watching Inception',
      time: '2 minutes ago',
    },
    {
      user: 'Jane Smith',
      action: 'Purchased premium subscription',
      time: '15 minutes ago',
    },
    {
      user: 'Mike Johnson',
      action: 'Added 3 movies to watchlist',
      time: '1 hour ago',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-zinc-900 p-4">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <img
            className="img-fluid logo h-[2.375rem] max-h-[2.375rem]"
            src="https://watch.blck.com/dashboard/images/logo-full-new.png"
            loading="lazy"
            alt="Blck"
          />
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'dashboard'
                ? 'text-brand-yellow'
                : 'text-gray-400 hover:bg-zinc-800'
            }`}
          >
            <BarChart className="h-5 w-5" />
            Dashboard
          </button>
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-400 hover:bg-zinc-800`}
            >
              <Film className="h-5 w-5" />
              Content
            </button>
            {activeTab === 'content' && (
              <div className="ml-4 space-y-1">
                <button
                  onClick={() => setContentTab('categories')}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    contentTab === 'categories'
                      ? 'text-brand-yellow'
                      : 'text-gray-400 hover:bg-zinc-800'
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  Genres
                </button>
                <button
                  onClick={() => setContentTab('movies')}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    contentTab === 'movies'
                      ? 'text-brand-yellow'
                      : 'text-gray-400 hover:bg-zinc-800'
                  }`}
                >
                  <Film className="h-4 w-4" />
                  Movies
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'users'
                ? 'text-brand-yellow'
                : 'text-gray-400 hover:bg-zinc-800'
            }`}
          >
            <Users className="h-5 w-5" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'payments'
                ? 'text-brand-yellow'
                : 'text-gray-400 hover:bg-zinc-800'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            Payments
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'settings'
                ? 'text-brand-yellow'
                : 'text-gray-400 hover:bg-zinc-800'
            }`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-zinc-800 rounded-lg transition"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <AdminHeader
          title={
            activeTab === 'dashboard'
              ? 'Dashboard'
              : activeTab === 'content'
              ? contentTab === 'categories'
                ? 'Categories'
                : 'Movies'
              : activeTab === 'users'
              ? 'User Management'
              : activeTab === 'payments'
              ? 'Payment History'
              : 'Settings'
          }
        />

        {activeTab === 'dashboard' && (
          <div className="px-8 pt-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-zinc-900 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 mb-2">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-white">
                        {stat.value}
                      </h3>
                    </div>
                    <div className="bg-zinc-800 p-3 rounded-lg">
                      <stat.icon className="h-6 w-6 text-brand-yellow" />
                    </div>
                  </div>
                  <p className="text-green-500 text-sm mt-2">
                    {stat.change} from last month
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-900 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                  >
                    <div>
                      <p className="text-white font-medium">{activity.user}</p>
                      <p className="text-gray-400 text-sm">{activity.action}</p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            {contentTab === 'categories' ? <Categories /> : <Movies />}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
            <UsersComponent />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-8">
            <PaymentsList />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <SettingsComponent />
          </div>
        )}
      </div>
    </div>
  );
}
