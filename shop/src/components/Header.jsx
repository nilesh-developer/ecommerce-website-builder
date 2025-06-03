import React, { useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../store/customerAuth';
import { useCart } from '../store/CartContext';
import { Search, ShoppingBag, ShoppingBasket, ShoppingCart } from 'lucide-react';

function Header({ store, color1, color2, openSearch, setOpenSearch }) {
  const { cart } = useCart();
  const { customerToken } = useCustomerAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <header className='h-[64px] lg:h-[70px] top-0 sticky bg-white z-50 border-b border-gray-100'>
      <div className='lg:mx-28 mx-3 md:mx-5 flex flex-wrap justify-between items-center h-full'>
        <Link to="/">
          {store?.logo ?
            <img className='h-10 lg:h-12 lg:w-auto max-w-36' src={store?.logo} alt="Logo" loading='lazy' />
            :
            <h2 className='text-3xl font-extrabold' style={{ color: color1 }}>{store?.name}</h2>
          }
        </Link>

        <div data-theme="light" className='bg-zinc-100 rounded-full hidden lg:flex justify-between'>
          <input
            className="h-12 w-[450px] bg-zinc-100 outline-none rounded-full px-4 text-base"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products"
          />
          <button onClick={handleSearch} className={`${query ? "bg-zinc-800" : ""} px-6 rounded-full`}>
            <img className='h-7' src="/search-icon.png" alt="search" />
          </button>
        </div>

        <div className='flex flex-wrap justify-center items-center'>
          {!openSearch ?
            <button onClick={(e) => setOpenSearch(true)} style={{ color: color1 }} className='lg:hidden'>
              {/* <img className='h-6 lg:h-7' src="/search.png" alt="search" /> */}
              {/* <svg className='h-8 lg:h-7 fill-current' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30">
                <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
              </svg> */}
              <Search className='w-6 h-6 lg:w-7 lg:h-7' />
            </button>
            : null}
          <div className='ml-4 lg:ml-7 flex justify-center items-center'>
            <Link to="/cart" style={{ position: 'relative', display: 'inline-block', color: color1 }}>
              {/* <svg className="w-7 h-7 lg:w-8 lg:h-8 font-bold fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 93.81 122.88">
                <path d="M28.98,31.32v-9.74h-0.01c0-4.72,1.94-9.02,5.05-12.13c3.12-3.12,7.41-5.06,12.13-5.06V4.4h0.03V4.39 c4.72,0,9.02,1.94,12.13,5.05c3.12,3.12,5.05,7.41,5.06,12.13h-0.01v9.86c-2.09,0.69-3.6,2.65-3.6,4.97c0,2.89,2.34,5.24,5.24,5.24 c2.89,0,5.24-2.35,5.24-5.24c0-1.88-0.99-3.52-2.47-4.44V21.57h-0.01c-0.01-5.93-2.43-11.32-6.33-15.22 c-3.91-3.91-9.31-6.34-15.24-6.34V0l-0.03,0v0.01c-5.93,0-11.32,2.43-15.22,6.33c-3.91,3.91-6.34,9.31-6.34,15.24h-0.01v10.65 c-1.26,0.96-2.08,2.47-2.08,4.17c0,2.89,2.35,5.24,5.24,5.24c2.89,0,5.24-2.35,5.24-5.24C32.98,33.94,31.27,31.88,28.98,31.32 L28.98,31.32L28.98,31.32z M10.99,31.49h6.56c-0.86,1.61-1.36,3.46-1.36,5.42c0,0.68,0.06,1.34,0.17,1.98h-3.23l-5.56,76.59h78.67 l-5.56-76.59h-4.6c0.11-0.64,0.17-1.31,0.17-1.98c0-1.96-0.49-3.8-1.36-5.42h7.92c1.41,0,2.64,0.57,3.55,1.48 c0.88,0.88,1.44,2.07,1.53,3.36l5.89,81.19c0.01,0.16,0.02,0.28,0.02,0.35c0,1.39-0.59,2.62-1.5,3.52c-0.85,0.83-2,1.38-3.24,1.47 c-0.16,0.01-0.29,0.02-0.36,0.02H5.1c-0.07,0-0.2-0.01-0.36-0.02c-1.23-0.09-2.39-0.63-3.24-1.47c-0.92-0.9-1.5-2.13-1.5-3.53 c0-0.07,0.01-0.18,0.02-0.35l5.89-81.19c0.09-1.29,0.65-2.48,1.53-3.36C8.36,32.06,9.59,31.49,10.99,31.49L10.99,31.49z M37.81,31.49h16.83c-0.86,1.61-1.36,3.46-1.36,5.42c0,0.68,0.06,1.34,0.17,1.98H38.99c0.11-0.64,0.17-1.31,0.17-1.98 C39.17,34.95,38.67,33.11,37.81,31.49L37.81,31.49z" />
              </svg> */}
              <ShoppingBag className='w-6 h-6 lg:w-7 lg:h-7' />
              {cart.length === 0 ?
                ""
                :
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: color1,
                  color: color2,
                  borderRadius: '50%',
                  padding: '0.1em 0.5em',
                  fontSize: '0.65rem',
                  fontWeight: 'bold'
                }}>
                  {cart.length}
                </span>
              }
            </Link>

          </div>
          {customerToken ?
            <div className='ml-1 lg:ml-4 hidden lg:block'>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="lg:w-8 w-7 rounded-full" style={{ color: color1 }}>
                    {/* <img alt="Avatar" src="/profile.svg" /> */}
                    <svg className='h-8 fill-current' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
                      <path d="M 24 4 C 18.494917 4 14 8.494921 14 14 C 14 19.505079 18.494917 24 24 24 C 29.505083 24 34 19.505079 34 14 C 34 8.494921 29.505083 4 24 4 z M 24 7 C 27.883764 7 31 10.116238 31 14 C 31 17.883762 27.883764 21 24 21 C 20.116236 21 17 17.883762 17 14 C 17 10.116238 20.116236 7 24 7 z M 12.5 28 C 10.032499 28 8 30.032499 8 32.5 L 8 33.699219 C 8 36.640082 9.8647133 39.277974 12.708984 41.091797 C 15.553256 42.90562 19.444841 44 24 44 C 28.555159 44 32.446744 42.90562 35.291016 41.091797 C 38.135287 39.277974 40 36.640082 40 33.699219 L 40 32.5 C 40 30.032499 37.967501 28 35.5 28 L 12.5 28 z M 12.5 31 L 35.5 31 C 36.346499 31 37 31.653501 37 32.5 L 37 33.699219 C 37 35.364355 35.927463 37.127823 33.677734 38.5625 C 31.428006 39.997177 28.068841 41 24 41 C 19.931159 41 16.571994 39.997177 14.322266 38.5625 C 12.072537 37.127823 11 35.364355 11 33.699219 L 11 32.5 C 11 31.653501 11.653501 31 12.5 31 z"></path>
                    </svg>
                  </div>
                </div>
                <ul data-theme="light" tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] py-2 shadow rounded-box w-52">
                  <li>
                    <Link to="/account" className="justify-between">
                      Profile
                    </Link>
                  </li>
                  <li><Link to="orders">Orders</Link></li>
                  <li><Link to="logout">Logout</Link></li>
                </ul>
              </div>
            </div>
            :
            <>
              <div className='lg:block hidden font-semibold text-xl lg:text-base tracking-tighter bg-transparent pl-4 py-2 rounded-lg' style={{ color: color1 }}>
                <Link to="/login">
                  Login
                </Link>
              </div>
              <div className='hidden lg:hidden lg:font-semibold text-base tracking-tighter bg-transparent pl-2 py-2 rounded-lg' style={{ color: color1 }}>
                <Link to="/login" style={{ color: color1 }}>
                  {/* <img alt="Avatar" src="/profile.svg" className='h-7' /> */}
                  <svg className='h-8 fill-current' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
                    <path d="M 24 4 C 18.494917 4 14 8.494921 14 14 C 14 19.505079 18.494917 24 24 24 C 29.505083 24 34 19.505079 34 14 C 34 8.494921 29.505083 4 24 4 z M 24 7 C 27.883764 7 31 10.116238 31 14 C 31 17.883762 27.883764 21 24 21 C 20.116236 21 17 17.883762 17 14 C 17 10.116238 20.116236 7 24 7 z M 12.5 28 C 10.032499 28 8 30.032499 8 32.5 L 8 33.699219 C 8 36.640082 9.8647133 39.277974 12.708984 41.091797 C 15.553256 42.90562 19.444841 44 24 44 C 28.555159 44 32.446744 42.90562 35.291016 41.091797 C 38.135287 39.277974 40 36.640082 40 33.699219 L 40 32.5 C 40 30.032499 37.967501 28 35.5 28 L 12.5 28 z M 12.5 31 L 35.5 31 C 36.346499 31 37 31.653501 37 32.5 L 37 33.699219 C 37 35.364355 35.927463 37.127823 33.677734 38.5625 C 31.428006 39.997177 28.068841 41 24 41 C 19.931159 41 16.571994 39.997177 14.322266 38.5625 C 12.072537 37.127823 11 35.364355 11 33.699219 L 11 32.5 C 11 31.653501 11.653501 31 12.5 31 z"></path>
                  </svg>
                </Link>
              </div>
              <div className='ml-4 lg:block hidden'>
                <Link to="/signup" className='font-bold tracking-tighter lg:font-semibold text-white px-4 py-2 rounded-lg' style={{ backgroundColor: color1 }}>
                  Signup
                </Link>
              </div>
            </>
          }
        </div>
      </div>
    </header>
  );
}

export default Header;
