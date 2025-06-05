import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-9 mt-14">
      <header className="text-center mb-5">
        <h1 className="text-3xl font-bold text-black">Cookie Policy</h1>
      </header>
      <section className="bg-white py-8 mx-3 lg:mx-28 rounded-lg">
        <div className="text-gray-600 text-lg mb-8">
          <p className="mb-4">
            Eazzy Store uses cookies to enhance your experience on our platform. By continuing to use our website, you consent to our use of cookies as described below:
          </p>
          <ul className="list-disc list-inside">
            <li><strong>Essential Cookies:</strong> Necessary for the platform to function (e.g., user authentication, preferences).</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform, so we can improve the experience.</li>
            <li><strong>Marketing Cookies:</strong> May be used to deliver relevant ads on third-party platforms.</li>
          </ul>
          <p className="mt-4">
            You can control or delete cookies through your browser settings. For more information, consult your browser's help section.
          </p>
        </div>

        <Link to="/" className="text-center block">
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">Back to Home</button>
        </Link>
      </section>
    </div>
  );
};

export default CookiePolicy;
