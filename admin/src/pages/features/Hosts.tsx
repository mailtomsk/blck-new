import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { HostForm } from '../../components/HostForm';
import { Host, HostFormData } from '../../types/host';
import { hostsApi } from '../../services/api/hosts';

export function Hosts() {
  const [hosts, setHosts] = React.useState<Host[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingHost, setEditingHost] = React.useState<Host | undefined>();
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchHosts = async () => {
    try {
      setIsLoading(true);
      const response = await hostsApi.getHosts();
      if (response.ok && response.data) {
        setHosts(response.data);
      }
    } catch (err) {
      setError('Failed to fetch hosts');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHosts();
  }, []);

  const handleAdd = async (hostData: HostFormData) => {
    try {
      const response = await hostsApi.createHost(hostData);
      if (response.ok && response.data) {
        setHosts([...hosts, response.data]);
      } else {
        throw new Error(response.message || 'Failed to create host');
      }
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = async (hostData: HostFormData) => {
    if (editingHost) {
      try {
        const response = await hostsApi.updateHost(editingHost.id, hostData);
        if (response.ok && response.data) {
          setHosts(hosts.map(h => 
            h.id === editingHost.id ? response.data : h
          ));
        } else {
          throw new Error(response.message || 'Failed to update host');
        }
      } catch (err) {
        throw err;
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this host?')) {
      try {
        const response = await hostsApi.deleteHost(id);
        if (response.ok) {
          setHosts(hosts.filter(h => h.id !== id));
        } else {
          setError('Failed to delete host');
        }
      } catch (err) {
        setError('Failed to delete host');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Hosts</h2>
        <button
          onClick={() => {
            setEditingHost(undefined);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-brand-yellow text-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
        >
          <Plus className="h-5 w-5" />
          Add Host
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-xl overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {hosts.map((host) => (
              <div key={host.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{host.name}</h3>
                    {host.bio && (
                      <p className="text-gray-400 mt-1">{host.bio}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingHost(host);
                        setIsFormOpen(true);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(host.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {hosts.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-400">
                No hosts found. Click the "Add Host" button to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {isFormOpen && (
        <HostForm
          host={editingHost}
          onSubmit={editingHost ? handleEdit : handleAdd}
          onClose={() => {
            setIsFormOpen(false);
            setEditingHost(undefined);
          }}
        />
      )}
    </div>
  );
}