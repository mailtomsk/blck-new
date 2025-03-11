import { OrderSummary } from "../components/checkout/OrderSummary";
import { PaymentDetails } from "../components/checkout/PaymentDetails";
import { UserDetails } from "../components/checkout/UserDetails";
import { useCheckout } from "../hooks/useCheckout";

export function Checkout() {
  const {
    error,
    setError,
    isUserDetailsValid,
    setUserDetailsValid,
    setUserDetails,
    total,
    handleCheckout
  } = useCheckout();

  return (
    <div className="pt-24 sm:pt-32 min-h-screen px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-8">
        Checkout
      </h1>
      {error && (
        <div className="bg-brand-yellow bg-opacity-10 border border-brand-yellow text-brand-yellow px-4 py-2 rounded text-sm mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <UserDetails 
            setUserDetailsValid={setUserDetailsValid} 
            onUserDetailsChange={setUserDetails}
          />
          <PaymentDetails
            total={total}
            handleCheckout={handleCheckout}
          />
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}