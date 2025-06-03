import React, { useEffect, useState } from 'react';
import { useCart } from '../store/CartContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShoppingBag } from 'lucide-react';

function Cart() {
    const { cart, removeFromCart, updateQuantity, calculateTotal } = useCart();
    const [store, setStore] = useState({})
    const [color1, setColor1] = useState("")
    const [color2, setColor2] = useState("")
    const [loading, setLoading] = useState(true)

    const subdomain = window.location.hostname;

    async function getStoreData() {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/subdomain/${subdomain}`)
            const responseData = await response.json()
            if (response.ok) {
                setStore(responseData.data)
                setColor1(responseData.data.themeColorOne)
                setColor2(responseData.data.themeColorTwo)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getStoreData()
    }, [])

    if (loading) {
        return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    const calculateSubtotal = () => {
        return cart.reduce((subtotal, item) => subtotal + item.salePrice * item.quantity, 0);
    };

    return (
        <section className="h-full bg-white py-6 sm:py-8 lg:py-10">
            <Helmet>
                <title>{"Cart - " + store.name}</title>
                <meta name="description" content={store.metaDescription} />
            </Helmet>
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900">Your Cart</h1>
                </div>

                {cart.length !== 0 ?
                    <div className="mx-auto max-w-2xl mt-4 md:mt-7">
                        <div className="bg-white shadow">
                            <div className="px-4 py-6 sm:px-8 sm:py-10">
                                <div className="flow-root">
                                    <ul className="-my-8">
                                        {cart.map((product, index) => (
                                            <li key={index} className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
                                                <Link to={"../product/" + product?._id}>
                                                    <div className="shrink-0">
                                                        <img className="h-24 w-24 max-w-full rounded-lg object-cover" src={product.images.featuredImage} alt={product.name} />
                                                    </div>
                                                </Link>
                                                <div className="relative flex flex-1 flex-col justify-between">
                                                    <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                                                        <div className="pr-8 sm:pr-5">
                                                            <p className="text-base font-semibold text-gray-900">{product?.name}</p>
                                                        </div>

                                                        <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                                                            <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">&#8377;{product.salePrice}</p>

                                                            <div className="sm:order-1">
                                                                <div className="mx-auto flex h-8 items-stretch text-gray-600">
                                                                    <button
                                                                        className="flex items-center justify-center rounded-l-md bg-gray-200 px-4 transition hover:bg-black hover:text-white"
                                                                        onClick={() => updateQuantity(index, product?.quantity - 1)}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <div className="flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition">
                                                                        {product?.quantity}
                                                                    </div>
                                                                    <button
                                                                        className="flex items-center justify-center rounded-r-md bg-gray-200 px-4 transition hover:bg-black hover:text-white"
                                                                        onClick={() => updateQuantity(index, product.quantity + 1)}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
                                                        <button
                                                            type="button"
                                                            className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900"
                                                            onClick={() => removeFromCart(index)}
                                                        >
                                                            <svg
                                                                className="h-5 w-5"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                    className=""
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6 border-t border-b py-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-400">Subtotal</p>
                                        <p className="text-lg font-semibold text-gray-900">&#8377;{calculateSubtotal().toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-400">Shipping</p>
                                        <p className="text-lg font-semibold text-gray-900">Free <span className='text-gray-500'>(&#8377;0.00)</span></p>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900">Total</p>
                                    <p className="text-2xl font-semibold text-gray-900"><span className="text-xs font-normal text-gray-400">INR</span> &#8377;{(calculateTotal() + 0.00).toFixed(2)}</p>
                                </div>

                                <div className="mt-6 text-center">
                                    <Link to="/checkout">
                                        <button
                                            type="button"
                                            style={{ backgroundColor: color1, color: color2 }}
                                            className="group inline-flex w-full items-center justify-center rounded-md px-6 py-4 text-lg font-semibold transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
                                        >
                                            Checkout
                                            <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:ml-8 ml-4 h-6 w-6 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='flex justify-center items-center h-[20rem] lg:h-auto lg:mt-10'>
                        <div className=''>
                            <img className='h-32 ml-5 lg:ml-0 lg:h-52 hidden lg:block' src="./shopping-cart.png" alt="Cart Image" />
                            <p className='text-center text-2xl font-semibold'>Your cart is empty</p>
                            <Link to="/">
                                <button data-theme="light" style={{ backgroundColor: color1, color: color2 }} type='button' className='btn mt-5 w-full'>
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                }

            </div>
        </section>
    );
}

export default Cart;
