import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

const HeaderLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-lg border-b border-orange-600/20 shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="-m-1.5 p-1.5 flex items-center">
            <img className="h-10 w-auto" src="/eazzy.png" alt="Eazzy" />
          </a>
          {/* <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">StoreBuilder</span> */}
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Home</a>
          <a href="/terms-and-conditions" className="text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Terms & Conditions</a>
          <div className="relative group">
            <button className="inline-flex items-center text-sm font-semibold leading-6 text-zinc-900 group-hover:text-orange-600 transition-colors">
              Policies
              <ChevronDown className="h-5 w-5 ml-1" />
            </button>
            <ul className="absolute hidden group-hover:block mt-2 right-0 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 space-y-1">
              <li><a href="/privacy-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Privacy Policy</a></li>
              <li><a href="/refund-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Refund Policy</a></li>
              <li><a href="/shipping-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Shipping Policy</a></li>
              <li><a href="/cookie-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Cookie Policy</a></li>
            </ul>
          </div>
          <a href="/contact-us" className="text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Contact Us</a>
          <a href="/about-us" className="text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">About Us</a>
          <a href="/signup" className="text-sm font-semibold leading-6 text-orange-600">Sign Up <span aria-hidden="true">&rarr;</span></a>
        </div>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-orange-600/20 shadow-md z-50">
          <div className="px-6 py-4 space-y-4 flex flex-col">
            <a href="/" className="block text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Home</a>
            <a href="/terms-and-conditions" className="block text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Terms & Conditions</a>
            <div className="relative">
              <button className="inline-flex items-center text-sm font-semibold leading-6 text-zinc-900" onClick={() => setMobileDropdown(!mobileDropdown)}>
                Policies <ChevronDown className="h-5 w-5 ml-1" />
              </button>
              {mobileDropdown && (
                <ul className="mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 space-y-1">
                  <li><a href="/privacy-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Privacy Policy</a></li>
                  <li><a href="/refund-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Refund Policy</a></li>
                  <li><a href="/shipping-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Shipping Policy</a></li>
                  <li><a href="/cookie-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Cookie Policy</a></li>
                </ul>
              )}
            </div>
            <a href="/contact-us" className="block text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Contact Us</a>
            <a href="/about-us" className="block text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">About Us</a>
            <a href="/signup" className="block text-sm font-semibold leading-6 text-orange-600">Sign Up <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HeaderLanding;
