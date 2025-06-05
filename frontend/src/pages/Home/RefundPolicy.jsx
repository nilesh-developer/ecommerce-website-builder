import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-9 mt-14">
      <header className="text-center mb-5">
        <h1 className="text-3xl font-bold text-black">Refund and Cancellation Policy</h1>
      </header>
      <section className="bg-white py-8 mx-3 lg:mx-28 rounded-lg">
        <div className="mb-8">
          <p className="text-gray-600 text-lg mb-5">
            At Eazzy Store, we aim for complete customer satisfaction. Here’s our refund and cancellation policy:
          </p>
          <ul className="text-gray-600 text-lg list-disc list-inside">
            <li><strong>Cancellations:</strong> You can cancel your subscription anytime from your account dashboard. Your plan remains active until the end of the billing cycle.</li>
            <li><strong>Refunds:</strong> We offer a 7-day money-back guarantee for first-time subscriptions. Refunds are not applicable for renewals or cancellations after 7 days.</li>
            <li><strong>Processing Time:</strong> Approved refunds are processed within 5–7 working days.</li>
          </ul>
          <p className="text-gray-600 text-lg mt-4">
            To request a refund, please contact us at mail.eazzystore@gmail.com.
          </p>
        </div>

        <Link to="/" className="text-center block">
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">Back to Home</button>
        </Link>
      </section>
    </div>
  );
};

export default RefundPolicy;
