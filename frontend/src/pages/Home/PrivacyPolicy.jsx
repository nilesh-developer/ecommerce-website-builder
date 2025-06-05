import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-9 mt-14">
      <header className="text-center mb-5">
        <h1 className="text-3xl font-bold text-black">Privacy Policy</h1>
      </header>
      <section className="bg-white py-8 mx-3 lg:mx-28 rounded-lg">
        <div className="mb-8">
          <p className="text-gray-600 text-lg mb-5">
            We at Eazzy Store respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Information We Collect:</h2>
          <ul className="text-gray-600 text-lg list-disc list-inside">
            <li>Personal information (e.g., name, email) during sign-up.</li>
            <li>Billing and payment details for subscription processing.</li>
            <li>Usage data to improve our platform.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How We Use Your Data:</h2>
          <ul className="text-gray-600 text-lg list-disc list-inside">
            <li>To create and manage your account.</li>
            <li>To process payments securely.</li>
            <li>To send updates and promotional content.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Protection:</h2>
          <p className="text-gray-600 text-lg">
            Your data is protected using modern encryption methods and we do not sell your personal data to third parties.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Third-Party Sharing:</h2>
          <p className="text-gray-600 text-lg">
            Data is shared only with trusted third parties essential for delivering our services, such as payment gateways.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Rights:</h2>
          <p className="text-gray-600 text-lg">
            You may view, update, or delete your data through your account settings. For questions, contact us at mail.eazzystore@gmail.com.
          </p>
        </div>

        <Link to="/" className="text-center block">
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">Back to Home</button>
        </Link>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
