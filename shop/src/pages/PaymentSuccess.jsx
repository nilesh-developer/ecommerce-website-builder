import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <div className="flex justify-center h-screen bg-gradient-to-br from-green-700 to-green-900 text-white">
      <div className="text-center mt-32 lg:mt-52 animate-fade-in">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce-in">
          <span className="text-green-900 text-5xl">✔</span>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-slide-up">
          Order Placed Successfully!
        </h1>

        {/* Sub Message */}
        <p className="text-base md:text-xl opacity-90 animate-slide-up delay-100">
          Thank you for your purchase. We’ll send a confirmation shortly!
        </p>

        {/* Back to Shop Button */}
        <Link to={"/"}>
          <button className="mt-8 px-4 py-2 bg-white text-green-900 rounded-full text-lg font-medium hover:bg-gray-100 transition duration-300 animate-fade-in">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
