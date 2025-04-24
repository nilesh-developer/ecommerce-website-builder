import React, { useEffect } from 'react'
import { ProductCard } from '../components'
import { useOutletContext } from 'react-router-dom';

function Shop() {
  const { store, color1, color2, products } = useOutletContext();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <div className="bg-white">
      <div className="mx-auto px-4 py-5 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-4">
        <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-center text-gray-900">Shop</h2>

        <ProductCard products={products} color1={color1} color2={color2} />
      </div>
    </div>
  )
}

export default Shop