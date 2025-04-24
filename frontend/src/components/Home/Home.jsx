import React from 'react'
import { Link } from "react-router-dom"
import { useAuth } from '../../store/auth';
import { useEffect } from 'react';

export default function Home() {

    const { token } = useAuth()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div>
            <div className="mx-auto w-full max-w-7xl">
                <aside className="relative overflow-hidden text-black rounded-lg sm:mx-16 mx-2 sm:py-16">
                    <div className="relative z-10 max-w-screen-xl px-4  pb-20 pt-10 sm:py-24 mx-auto sm:px-6 lg:px-8">
                        <div className="max-w-xl sm:mt-1 mt-80 space-y-8 text-center sm:text-right sm:ml-auto">
                            <h2 className="text-2xl font-extrabold sm:text-5xl">
                                Launch your own online store
                                <br /><span className="sm:block text-xl lg:text-3xl font-bold font-sans text-green-700">in 30 seconds</span>
                            </h2>

                            {token ?
                                <Link
                                    className="inline-flex text-white items-center px-6 py-3 font-bold bg-orange-600 shadow-sm shadow-orange-200 rounded-lg hover:opacity-75"
                                    to="/seller/dashboard"
                                > Get started for free
                                </Link>
                                :
                                <Link
                                    className="inline-flex text-white items-center px-6 py-3 font-bold bg-orange-600 shadow-sm shadow-orange-200 rounded-lg hover:opacity-75"
                                    to="/signup"
                                > Get started for free
                                </Link>
                            }
                        </div>
                    </div>

                    <div className="absolute inset-0 w-full sm:my-20 sm:pt-1 pt-12 h-full ">
                        <img className="w-96" src="/explore.png" alt="image1" />
                    </div>
                </aside>

            </div>

            <div className='h-full w-full bg-yellow-200 py-8'>
                <h3 className='font-bold text-lg text-yellow-800 lg:text-2xl text-center mb-8'>Why sell on Eazzy</h3>
                <div className='flex justify-center items-center mx-auto'>
                    <div className='h-full w-full mx-10 lg:mx-0 lg:flex justify-evenly items-center'>

                        <div className='bg-violet-50 h-full lg:w-80 p-8 rounded-2xl'>
                            <div className='flex justify-center items-center'>
                                <img className='h-36' src="/store-management.png" alt="" />
                            </div>
                            <h3 className='text-center text-xl font-bold py-2'>Store Management</h3>
                            <p className='text-center font-semibold text-zinc-600'>Effortlessly manage products, categories, orders, customers, and coupons - all from a user-friendly dashboard.</p>
                        </div>

                        <div className='bg-violet-50 h-full lg:w-80 p-8 rounded-2xl lg:mt-0 mt-10'>
                            <div className='flex justify-center items-center'>
                                <img className='h-36' src="/influencer.png" alt="" />
                            </div>
                            <h3 className='text-center text-xl font-bold py-2'>Engage with customers</h3>
                            <p className='text-center font-semibold text-zinc-600'>Market your store with your own custom domain or subdomain for professional branding and ownership</p>
                        </div>

                        <div className='bg-violet-50 h-full lg:w-80 p-8 rounded-2xl lg:mt-0 mt-10'>
                            <div className='flex justify-center items-center'>
                                <img className='h-36' src="/store-custom.png" alt="" />
                            </div>
                            <h3 className='text-center text-xl font-bold py-2'>Easy Store Customization</h3>
                            <p className='text-center font-semibold text-zinc-600'>Tailor your store with customizable store policies, categories, and settings to suit your business needs.</p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
