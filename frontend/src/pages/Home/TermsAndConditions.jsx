import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-9 mt-14">
      <header className="text-center mb-5">
        <h1 className="text-3xl font-bold text-black">Terms and Conditions</h1>
      </header>
      <section className="bg-white py-8 mx-3 lg:mx-28 rounded-lg">
        <div className="mb-8">
          <p className="text-gray-600 text-lg mb-5">
            Welcome to Eazzy Store! By registering or using our services, you agree to the following terms:
          </p>
          <ul className="text-gray-600 text-lg list-disc list-inside">
            <li><strong>Account:</strong> You must provide accurate information. You are responsible for all activities under your account.</li>
            <li><strong>Services:</strong> We provide an ecommerce website builder where you can create a store, add products, manage orders, and more.</li>
            <li><strong>Subscription:</strong> Our services are based on subscription plans. Subscriptions renew automatically unless canceled.</li>
            <li><strong>User Responsibilities:</strong> Do not upload illegal, harmful, or infringing content. You must comply with all applicable laws.</li>
            <li><strong>Termination:</strong> Accounts violating these terms may be suspended or terminated.</li>
            <li><strong>Governing Law:</strong> These terms are governed by Indian law.</li>
          </ul>
        </div>

        <Link to="/" className="text-center block">
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">Back to Home</button>
        </Link>
      </section>
    </div>
  );
};

export default TermsAndConditions;
