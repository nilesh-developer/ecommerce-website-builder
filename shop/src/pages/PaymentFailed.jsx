import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const PaymentFailed = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex justify-center h-screen bg-gradient-to-br from-red-700 to-red-900 text-white">
      <div className="text-center mt-32 lg:mt-36 animate-fade-in px-4">
        {/* Failure Icon */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce-in">
          <span className="text-red-900 text-5xl">✕</span>
        </div>

        {/* Failure Message */}
        <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-slide-up">
          Payment Failed
        </h1>

        {/* Sub Message */}
        <p className="text-base md:text-lg max-w-md mx-auto opacity-90 animate-slide-up delay-100">
          Unfortunately, your transaction could not be completed. This may have happened due to a network issue, incorrect payment details, or cancellation by your bank.
        </p>

        <p className="mt-4 text-sm md:text-base text-gray-200 animate-slide-up delay-200">
          You can try again or choose a different payment method.
        </p>

        {/* Back to Shop Button */}
        <Link to={"/"}>
          <button className="mt-8 px-6 py-2 bg-white text-red-900 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 animate-fade-in">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailed;
