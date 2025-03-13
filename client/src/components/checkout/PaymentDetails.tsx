import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_KEY;

console.log(STRIPE_PUBLIC_KEY);

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#fff',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#6b7280',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true
};

interface PaymentFormProps {
  total: number;
  handleCheckout: (paymentMethod: any) => Promise<void>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ total, handleCheckout }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message || 'An error occurred with your payment');
        setProcessing(false);
        return;
      }

      await handleCheckout(paymentMethod);
    } catch (err) {
      setError('An error occurred while processing your payment');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-zinc-800 rounded-lg p-4">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-brand-yellow text-black py-2 sm:py-3 rounded mt-4 sm:mt-6 hover:bg-opacity-90 transition font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
          processing ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {processing ? 'Processing...' : `Pay $${(total * 1.1).toFixed(2)}`}
      </button>
    </form>
  );
};

interface PaymentDetailsProps {
  total: number;
  handleCheckout: (paymentMethod: any) => Promise<void>;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({ total, handleCheckout }) => {
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    stripePromise.then((stripeInstance) => {
      if (!stripeInstance) {
        setStripeError('Failed to load Stripe');
      } else {
        setStripe(stripeInstance);
      }
    }).catch(() => {
      setStripeError('Failed to load Stripe');
    });
  }, []);

  if (stripeError) {
    return <div className="text-red-500 text-sm">{stripeError}</div>;
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Payment Details</h2>
      {stripe ? (
        <Elements stripe={stripe}>
          <PaymentForm total={total} handleCheckout={handleCheckout} />
        </Elements>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};