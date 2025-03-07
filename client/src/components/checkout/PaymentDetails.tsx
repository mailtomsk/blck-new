import React from 'react';

interface PaymentDetailsProps {
  total: number;
  handleCheckout: () => void;
  error: string | null;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({ total, handleCheckout, error }) => {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Payment Details</h2>
      <div className="space-y-4">
        {error && (
          <div className="bg-brand-yellow bg-opacity-10 border border-brand-yellow text-brand-yellow px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-gray-400 mb-2 text-sm">Card Number</label>
          <input
            defaultValue="4242 4242 4242 4242"
            type="text"
            placeholder="4242 4242 4242 4242"
            className="w-full bg-zinc-800 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Expiry Date</label>
            <input
              defaultValue="12/25"
              type="text"
              placeholder="MM/YY"
              className="w-full bg-zinc-800 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2 text-sm">CVC</label>
            <input
              defaultValue="123"
              type="text"
              placeholder="123"
              className="w-full bg-zinc-800 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
            />
          </div>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-brand-yellow text-black py-2 sm:py-3 rounded mt-4 sm:mt-6 hover:bg-opacity-90 transition font-semibold text-sm sm:text-base"
        >
          Pay ${(total * 1.1).toFixed(2)}
        </button>
      </div>
    </div>
  );
};
