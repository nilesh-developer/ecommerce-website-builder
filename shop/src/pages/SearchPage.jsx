import React, { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components';

function SearchPage() {
    const { color1, color2 } = useOutletContext();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product/search?q=${query}`);
                const data = await response.json();
                setProducts(data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
            setLoading(false)
        };

        if (query) {
            fetchProducts();
        }
    }, [query]);

    if (loading) return <div className='flex h-[720px] lg:min-h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>

    return (
        <div className="bg-white">
            <div className="mx-auto px-4 py-5 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-4">
                <h2 className="text-base lg:text-2xl font-bold tracking-tight text-gray-900">Search Results for "{query}"</h2>
                {products.length !== 0 ?
                    <ProductCard products={products} color1={color1} color2={color2} />
                    :
                    <div className='h-[680px] lg:h-[500px] lg:text-lg flex justify-center items-center'>
                        <p>Product not found</p>
                    </div>
                }
            </div>
        </div>
    );
}

export default SearchPage;
