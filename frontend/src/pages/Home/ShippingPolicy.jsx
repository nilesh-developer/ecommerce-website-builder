import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-9 mt-14">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-black">Shipping Policy</h1>
      </header>
      <section className="bg-white py-8 mx-3 lg:mx-28 rounded-lg">
        <div className="text-gray-600 text-lg mb-8">
          <p className="mb-4">
            Since Eazzy Store is a platform that allows users to create their own online stores, we do not directly ship any physical goods. However, individual stores hosted on our platform are responsible for their own shipping policies.
          </p>
          <p className="mb-4">
            Store owners are advised to clearly communicate shipping methods, charges, timelines, and return policies on their individual websites.
          </p>
          <p>
            Eazzy Store is not responsible for the shipping, delivery, or returns of any products sold through user-created stores.
          </p>
        </div>

        <Link to="/" className="text-center block">
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">Back to Home</button>
        </Link>
      </section>
    </div>
  );
};

export default ShippingPolicy;
