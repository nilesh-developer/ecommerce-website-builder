import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/auth';

const HeaderLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const { token } = useAuth()

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-lg border-b border-orange-600/20 shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center">
            <img className="h-10 w-auto" src="/eazzy.png" alt="Eazzy" />
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Home</Link>
          <Link to="/terms-and-conditions" className="text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Terms & Conditions</Link>
          <div className="relative group">
            <button className="inline-flex items-center text-sm font-semibold leading-6 text-zinc-900 group-hover:text-orange-600 transition-colors">
              Policies
              <ChevronDown className="h-5 w-5 ml-1" />
            </button>
            <ul className="absolute hidden group-hover:block mt-2 right-0 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 space-y-1">
              <li><Link to="/privacy-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Shipping Policy</Link></li>
              <li><Link to="/cookie-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Cookie Policy</Link></li>
            </ul>
          </div>
          {/* <Link to="/contact-us" className="text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Contact Us</Link>
          <Link to="/about-us" className="text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">About Us</Link> */}
          <a href="/contact-us" className="text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Contact Us</a>
          <a href="/about-us" className="text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">About Us</a>
          {token ?
            <Link to="/seller/dashboard" className="text-sm font-semibold leading-6 text-orange-600">Account <span aria-hidden="true">&rarr;</span></Link>
            :
            <>
              {/* <Link to="/signup" className="text-sm font-semibold leading-6 text-orange-600">Sign Up <span aria-hidden="true">&rarr;</span></Link> */}
              <Link to="/login" className="text-sm font-semibold leading-6 text-orange-600">Login <span aria-hidden="true">&rarr;</span></Link>
            </>
          }
        </div>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-orange-600/20 shadow-md z-50">
          <div className="px-6 py-4 space-y-4 flex flex-col">
            <Link to="/" className="block text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Home</Link>
            <Link to="/terms-and-conditions" className="block text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Terms & Conditions</Link>
            <div className="relative">
              <button className="inline-flex items-center text-sm font-semibold leading-6 text-zinc-900" onClick={() => setMobileDropdown(!mobileDropdown)}>
                Policies <ChevronDown className="h-5 w-5 ml-1" />
              </button>
              {mobileDropdown && (
                <ul className="mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 space-y-1">
                  <li><Link to="/privacy-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Privacy Policy</Link></li>
                  <li><Link to="/refund-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Refund Policy</Link></li>
                  <li><Link to="/shipping-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Shipping Policy</Link></li>
                  <li><Link to="/cookie-policy" className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-zinc-100 text-zinc-900 hover:text-orange-600">Cookie Policy</Link></li>
                </ul>
              )}
            </div>
            <Link to="/contact-us" className="block text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Contact Us</Link>
            <Link to="/about-us" className="block text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">About Us</Link>
            {token ?
              <Link to="/seller/dashboard" className="block text-sm font-semibold leading-6 text-orange-600">Account <span aria-hidden="true">&rarr;</span></Link>
              :
              <>
                <Link to="/login" className="block text-sm font-semibold leading-6 hover:text-orange-600 transition-colors">Login</Link>
                <Link to="/signup" className="block text-sm font-semibold leading-6 text-orange-600">Sign Up</Link>
              </>
            }
          </div>
        </div>
      )}
    </nav>
  );
};

export default HeaderLanding;
