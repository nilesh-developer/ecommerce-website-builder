import React, { useEffect } from 'react';
import { ProductCard, Category, Banner } from "../components";
import { Helmet } from "react-helmet";
import LazyLoadingPage from '../components/LazyLoadingPage';
import { useOutletContext } from 'react-router-dom';
import ShuffledProducts from '../components/ShuffledProducts';
import ProductList from './ProductList';

function Homepage() {
  const { store, color1, color2, products } = useOutletContext(); // Access context passed from StoreLayout

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  if (!store || !products) {
    return <LazyLoadingPage />;
  }

  return (
    <>
      <Helmet>
        <title>{store.metaTitle}</title>
        <meta name="description" content={store.metaDescription} />
        <meta property="og:title" content={store.metaTitle} />
        <meta property="og:description" content={store.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.hostname} />
      </Helmet>

      <Banner store={store} color1={color1} color2={color2} />

      {store.hideCategory === false ?
        <Category categories={store?.categories} />
        : null
      }


      {/* New Arrivals */}
      <div className="bg-white">
        <div className="mx-auto px-4 py-5 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-4">
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900">New Arrivals</h2>

          <ProductList products={products} color1={color1} color2={color2} />
        </div>
      </div>

      {/* All Products */}
      <div className="mx-auto px-4 py-5 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-4 mb-10">
        <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900">All Products</h2>
        <ShuffledProducts products={products} color1={color1} color2={color2} />
      </div>
    </>
  )
}

export default Homepage;