import React from 'react';
import { Search } from 'lucide-react';
import { Order } from '../../types/order';
import { ordersApi } from '../../services/api/orders';

export function Orders() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await ordersApi.getOrders();
      if (response.ok && response.data) {
        setOrders(response.data);
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white"
          />
        </div>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="text-left p-4 text-gray-400 font-medium">Order ID</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Customer</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Items</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Total</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-zinc-800">
                    <td className="p-4 text-white font-mono">#{order.id}</td>
                    <td className="p-4">
                      <div className="text-white">{order.customerName}</div>
                      <div className="text-gray-400 text-sm">{order.customerEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-start gap-3">
                            <img
                              src={item.movie.thumbnail_url || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=100&q=80'}
                              alt={item.movie.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <div className="text-white text-sm">{item.movie.title}</div>
                              <div className="text-gray-400 text-sm">
                                {item.quantity}x @ {formatCurrency(item.price)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">{formatCurrency(order.total)}</div>
                      <div className="text-gray-400 text-sm">
                        Tax: {formatCurrency(order.tax)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.orderStatus.name === 'Payment Accepted' 
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {order.orderStatus.name}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-400">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}