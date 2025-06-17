import React from 'react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <>
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <div className="container mx-auto px-2 py-10 mt-14">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-black">About Us</h1>
        </header>
        <section className="bg-white p-8 rounded-lg lg:mx-28">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg">
              At Eazzy Store, our mission is to empower influncers, creators and businesses of all sizes by providing an easy-to-use, robust e-commerce website builder. We strive to enable our users to create beautiful, functional, and successful online stores with minimal effort.
            </p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
            <p className="text-gray-600 text-lg">
              Our team is composed of seasoned professionals with extensive experience in web development, design, and digital marketing. We are passionate about helping our users succeed in the online marketplace.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg">
              We believe in innovation, integrity, and customer-centricity. Our goal is to constantly improve our platform and provide the best possible service to our users. We value feedback and are committed to creating a supportive and inclusive community for all our customers.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
