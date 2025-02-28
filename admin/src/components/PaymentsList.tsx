import React from 'react';
import { Search, Download } from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'succeeded' | 'pending' | 'failed';
  type: 'subscription' | 'movie_purchase';
  createdAt: string;
  paymentMethod: string;
}

export function PaymentsList() {
  const [payments, setPayments] = React.useState<Payment[]>([
    {
      id: 'pi_1234567890',
      userId: '1',
      userName: 'John Doe',
      amount: 14.99,
      status: 'succeeded',
      type: 'movie_purchase',
      createdAt: '2024-03-15T10:30:00Z',
      paymentMethod: 'Visa •••• 4242'
    },
    {
      id: 'pi_0987654321',
      userId: '2',
      userName: 'Jane Smith',
      amount: 19.99,
      status: 'succeeded',
      type: 'subscription',
      createdAt: '2024-03-14T15:45:00Z',
      paymentMethod: 'Mastercard •••• 5555'
    }
  ]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      const paymentDate = new Date(payment.createdAt).toISOString().split('T')[0];
      return matchesSearch && matchesStatus && paymentDate === today;
    }

    if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && matchesStatus && new Date(payment.createdAt) >= weekAgo;
    }

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredPayments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const handleExport = () => {
    const csv = [
      ['Payment ID', 'User', 'Amount', 'Status', 'Type', 'Date', 'Payment Method'],
      ...filteredPayments.map(p => [
        p.id,
        p.userName,
        `$${p.amount.toFixed(2)}`,
        p.status,
        p.type,
        new Date(p.createdAt).toLocaleString(),
        p.paymentMethod
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white px-4 py-2"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-800 border-transparent rounded-lg focus:border-red-500 focus:ring-red-500 text-white px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition"
          >
            <Download className="h-5 w-5" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Revenue Overview</h3>
        <div className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</div>
        <p className="text-gray-400 text-sm">Total from filtered payments</p>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-800">
                <th className="text-left p-4 text-gray-400 font-medium">Payment ID</th>
                <th className="text-left p-4 text-gray-400 font-medium">User</th>
                <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                <th className="text-left p-4 text-gray-400 font-medium">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-t border-zinc-800">
                  <td className="p-4 text-white font-mono text-sm">{payment.id}</td>
                  <td className="p-4 text-white">{payment.userName}</td>
                  <td className="p-4 text-white">${payment.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'succeeded' ? 'bg-green-500/10 text-green-500' :
                      payment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.type === 'subscription' ? 'bg-purple-500/10 text-purple-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {payment.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-400">{payment.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}