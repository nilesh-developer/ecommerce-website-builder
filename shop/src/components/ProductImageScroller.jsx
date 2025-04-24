import React, { useState } from 'react';

const ProductImageScroller = ({ product }) => {
  const images = Object.values(product?.images);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to handle left button click
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Function to handle right button click
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="md:hidden w-full p-4 relative">
      {/* Image Container */}
      <div className="relative w-full overflow-hidden">
        <div className="flex transition-transform duration-500">
          {images.map((image, idx) =>
            image ? (
              <div
                key={idx}
                className={`flex-shrink-0 w-full ${idx === currentIndex ? 'block' : 'hidden'}`}
              >
                <img
                  src={image}
                  className="h-[420px] sm:h-[550px] w-full object-cover rounded-xl shadow-lg transition-transform duration-300"
                  alt={product?.name}
                />
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Left Button */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-zinc-100 text-black p-2 rounded-full shadow-lg hover:bg-zinc-200 transition-all"
        onClick={handlePrevClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6"></path>
        </svg>
      </button>

      {/* Right Button */}
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-zinc-100 text-black p-2 rounded-full shadow-lg hover:bg-zinc-200 transition-all"
        onClick={handleNextClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </button>
    </div>
  );
};

export default ProductImageScroller;
