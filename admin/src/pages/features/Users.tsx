import React from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { UserForm } from '../../components/UserForm';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  subscriptionType: 'free' | 'basic' | 'premium';
  joinDate: string;
}

export function Users() {
  const [users, setUsers] = React.useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      subscriptionType: 'premium',
      joinDate: '2024-01-15T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      status: 'active',
      subscriptionType: 'basic',
      joinDate: '2024-02-20T00:00:00.000Z'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      subscriptionType: 'premium',
      joinDate: '2023-12-01T00:00:00.000Z'
    }
  ]);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | undefined>();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleAdd = (user: Omit<User, 'id'>) => {
    setUsers([...users, { ...user, id: Date.now().toString() }]);
  };

  const handleEdit = (user: Omit<User, 'id'>) => {
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...user, id: u.id } : u
      ));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white"
          />
        </div>
        <button
          onClick={() => {
            setEditingUser(undefined);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-brand-yellow text-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-800">
                <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                <th className="text-left p-4 text-gray-400 font-medium">Subscription</th>
                <th className="text-left p-4 text-gray-400 font-medium">Join Date</th>
                <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-zinc-800">
                  <td className="p-4 text-white">{user.name}</td>
                  <td className="p-4 text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.subscriptionType === 'premium' ? 'bg-purple-500/10 text-purple-500' :
                      user.subscriptionType === 'basic' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {user.subscriptionType}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setIsFormOpen(true);
                      }}
                      className="text-gray-400 hover:text-white p-2"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? handleEdit : handleAdd}
          onClose={() => {
            setIsFormOpen(false);
            setEditingUser(undefined);
          }}
        />
      )}
    </div>
  );
}