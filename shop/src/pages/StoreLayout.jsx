import React, { useEffect, useState } from 'react';
import { BottomNavbar, Footer, Header } from '../components'
import { Outlet, useNavigate } from 'react-router-dom';
import changeFavicon from '../Hooks/changeFavicon';
import LazyLoadingPage from '../components/LazyLoadingPage';
import { useCustomerAuth } from '../store/customerAuth';

export default function StoreLayout() {
  const [store, setStore] = useState({});
  const [color1, setColor1] = useState("#000000");
  const [color2, setColor2] = useState("#f2f2f2");
  const { setStoreId } = useCustomerAuth();
  const [loading, setLoading] = useState(true);
  const [openSearch, setOpenSearch] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const subdomain = window.location.hostname;

  const getThemeColor = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/subdomain/${subdomain}`);
      if (!response.ok) throw new Error('Failed to fetch store data');
      const data = await response.json();
      setStore(data.data);
      setStoreId(data.data._id);
      setColor1(data.data.themeColorOne || "#000000");
      setColor2(data.data.themeColorTwo || "#f2f2f2");
    } catch (error) {
      console.error('Error fetching store data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getThemeColor();
  }, []);

  changeFavicon(store.favicon);

  const handleSearch = () => {
    setOpenSearch(false)
    if (query.trim()) {
      navigate(`/search?q=${query}`);
    }
  };

  if (loading) return <div className='flex min-h-dvh h-full w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>

  // if (loading) return <LazyLoadingPage />;

  return (
    <div>
      <Header store={store} color1={color1} color2={color2} openSearch={openSearch} setOpenSearch={setOpenSearch} />

      {/* Pass store, products, and colors to child components via Outlet */}
      <main>
        {/* Mobile search bar */}
        {openSearch ?
          <div data-theme="light" className='bg-zinc-100 my-2 rounded-full flex justify-between lg:hidden'>
            <input
              className="h-12 w-full bg-zinc-100 outline-none rounded-full px-4 text-base"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products"
            />
            <button onClick={handleSearch} className={`${query ? "bg-zinc-800" : ""}  px-6 py-auto rounded-full`}>
              {query ?
                <img className='h-7 w-8' src="/search-icon.png" alt="search" />
                :
                <img className='h-3
                 w-4' src="/remove.png" alt="search" />
              }
            </button>
          </div>
          : null}

        <Outlet context={{ store, color1, color2, products: store.products, openSearch: openSearch, setOpenSearch: setOpenSearch }} />
      </main>
      <BottomNavbar color1={color1} />
      <Footer store={store} color1={color1} color2={color2} />
    </div>
  );
}
