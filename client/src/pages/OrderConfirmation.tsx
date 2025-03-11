import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface OrderConfirmationState {
  order: {
    id: string;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      title?: string;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    createdAt: string;
  };
}

export function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = (location.state as OrderConfirmationState) || {};

  if (!order) {
    return (
      <div className="pt-24 sm:pt-32 min-h-screen px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4">
          Order Not Found
        </h1>
        <p className="text-gray-400 mb-8">
          We couldn't find the order details you're looking for.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-brand-yellow text-black px-6 sm:px-8 py-2 sm:py-3 rounded hover:bg-opacity-90 transition font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-32 min-h-screen px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-400">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <div className="border-b border-gray-800 pb-4 mb-4">
          <h2 className="text-lg font-semibold text-white mb-2">Order Details</h2>
          <p className="text-gray-400 text-sm">Order ID: {order.id}</p>
          <p className="text-gray-400 text-sm">
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="border-b border-gray-800 pb-4 mb-4">
          <h3 className="text-md font-semibold text-white mb-2">
            Shipping Details
          </h3>
          <p className="text-gray-400 text-sm">{order.customerName}</p>
          <p className="text-gray-400 text-sm">{order.customerEmail}</p>
          <p className="text-gray-400 text-sm">{order.customerAddress}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-md font-semibold text-white mb-2">Order Summary</h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span className="text-gray-400">
                  {item.title || `Product #${item.productId}`} x {item.quantity}
                </span>
                <span className="text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Tax</span>
            <span className="text-white">${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-md font-semibold">
            <span className="text-white">Total</span>
            <span className="text-white">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/')}
          className="bg-brand-yellow text-black px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-opacity-90 transition font-semibold"
        >
          Continue Shopping <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}