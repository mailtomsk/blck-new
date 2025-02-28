import React from 'react';
import { Bell, Globe, Lock, User, Moon, Sun } from 'lucide-react';

interface SettingsProps {
  onClose?: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const [activeSection, setActiveSection] = React.useState('profile');
  const [darkMode, setDarkMode] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [language, setLanguage] = React.useState('en');

  return (
    <div className="p-6">
      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:border-r border-zinc-800 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeSection === 'profile' ? 'bg-brand-yellow text-black font-semibold' : 'text-gray-400 hover:bg-zinc-800'
                }`}
              >
                <User className="h-5 w-5" />
                Profile Settings
              </button>
              <button
                onClick={() => setActiveSection('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeSection === 'security' ? 'bg-brand-yellow text-black font-semibold' : 'text-gray-400 hover:bg-zinc-800'
                }`}
              >
                <Lock className="h-5 w-5" />
                Security
              </button>
              <button
                onClick={() => setActiveSection('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeSection === 'notifications' ? 'bg-brand-yellow text-black font-semibold' : 'text-gray-400 hover:bg-zinc-800'
                }`}
              >
                <Bell className="h-5 w-5" />
                Notifications
              </button>
              <button
                onClick={() => setActiveSection('preferences')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeSection === 'preferences' ? 'bg-brand-yellow text-black font-semibold' : 'text-gray-400 hover:bg-zinc-800'
                }`}
              >
                <Globe className="h-5 w-5" />
                Preferences
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 p-6">
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"
                    alt="Profile"
                    className="w-20 h-20 rounded-full"
                  />
                  <button className="bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition">
                    Change Avatar
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white"
                    />
                  </div>
                  <button className="bg-brand-yellow text-black px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white"
                    />
                  </div>
                  <button className="bg-brand-yellow text-black px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Email Notifications</h3>
                      <p className="text-gray-400 text-sm">Receive email updates about your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-yellow"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Push Notifications</h3>
                      <p className="text-gray-400 text-sm">Receive push notifications about new content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-yellow"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Dark Mode</h3>
                      <p className="text-gray-400 text-sm">Toggle dark mode on or off</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-yellow"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}