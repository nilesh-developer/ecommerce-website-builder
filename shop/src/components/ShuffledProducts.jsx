import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';

function ShuffledProducts({ products, color1, color2 }) {
    const { addToCart } = useCart();
    const [shuffledProducts, setShuffledProducts] = useState([]);
    const [imageLoaded, setImageLoaded] = useState({}); // Store loading status for each product

    // Shuffle products using Fisher-Yates algorithm and limit to 8 products
    useEffect(() => {
        const shuffleArray = (array) => {
            let shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };

        const shuffled = shuffleArray(products);
        setShuffledProducts(shuffled.slice(0, 8)); // Limit to 8 products
    }, [products]);

    // Handle image load
    const handleImageLoad = (id) => {
        setImageLoaded((prevState) => ({ ...prevState, [id]: true }));
    };

    return (
        <div data-theme="light" className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-5">
            {shuffledProducts.map((product, index) => {
                if (product?.status === true && product?.stockStatus === true) {
                    return (
                        <div
                            key={index}
                            className="relative w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md"
                        >
                            <Link className="hover:opacity-75" to={`/product/${product._id}`}>
                                {!imageLoaded[product._id] && (
                                    <div
                                        className="h-48 flex skeleton items-center justify-center"
                                        style={{ borderRadius: '0.375rem 0.375rem 0 0' }}
                                    >
                                    </div>
                                )}
                                <img
                                    className={`h-fit w-auto rounded-t-lg object-cover ${!imageLoaded[product._id] ? 'hidden' : ''
                                        }`}
                                    src={product.images.featuredImage}
                                    alt="product image"
                                    onLoad={() => handleImageLoad(product._id)}
                                />
                            </Link>
                            {product?.salePrice < product?.originalPrice ? (
                                <span
                                    className="absolute top-0 left-0 w-28 translate-y-4 -translate-x-6 -rotate-45 text-center text-sm"
                                    style={{ backgroundColor: color1, color: color2 }}
                                >
                                    Sale
                                </span>
                            ) : (
                                ''
                            )}
                            <div className="mt-4 px-3 lg:px-5 pb-5">
                                <Link to={`/product/${product?._id}`}>
                                    <h5
                                        className="text-base lg:text-xl font-semibold tracking-tight truncate"
                                    // style={{ color: color1 }}
                                    >
                                        {product?.name}
                                    </h5>
                                </Link>
                                <div className="lg:flex items-center justify-between mt-3">
                                    <p className="mb-4 lg:mb-0">
                                        <span
                                            className="text-2xl font-bold"
                                        // style={{ color: color1 }}
                                        >
                                            &#8377;{product?.salePrice}
                                        </span>
                                        &nbsp;
                                        <span
                                            className="text-sm line-through"
                                        // style={{ color: color1 }}
                                        >
                                            &#8377;{product?.originalPrice}
                                        </span>
                                    </p>
                                    {product?.affiliateProduct ?
                                        <Link to={product?.affiliateLink}>
                                            <button
                                                type="button"
                                                className="flex items-center w-full lg:w-auto justify-center rounded-md px-5 py-3 text-center text-sm font-medium hover:opacity-75 focus:outline-none"
                                                style={{
                                                    color: color2,
                                                    backgroundColor: color1,
                                                }}
                                            >
                                                <span className='font-bold'>Buy from {product?.affiliatePlatformName}</span>
                                            </button>
                                        </Link>
                                        :
                                        <button
                                            type="button"
                                            onClick={() =>
                                                addToCart({ ...product, quantity: 1 })
                                            }
                                            className="flex items-center w-full lg:w-auto justify-center rounded-md px-5 py-3 text-center text-sm font-medium hover:opacity-75 focus:outline-none"
                                            style={{
                                                color: color2,
                                                backgroundColor: color1,
                                            }}
                                        >
                                            <img
                                                className="h-5 lg:block hidden"
                                                src="./cart.svg"
                                                alt=""
                                            />
                                            &nbsp;
                                            <span>Add to cart</span>
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
}

export default ShuffledProducts;
