import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useCustomerAuth } from '../store/customerAuth'
import { Helmet } from 'react-helmet'
import {Box, LogOut, Pen, User} from "lucide-react"

function Account() {
    const { customerData, loading } = useCustomerAuth()
    const [store, setStore] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const subdomain = window.location.hostname;

    async function getStoreData() {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/subdomain/${subdomain}`)
            const responseData = await response.json()
            if (response.ok) {
                setStore(responseData.data)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getStoreData()
    }, [])

    if (isLoading && loading) {
        return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }
    return (
        <div className="m-5 lg:m-10">
            <Helmet>
                <title>{"Account - " + store.name}</title>
                <meta name="description" content={store.metaDescription} />
            </Helmet>
            <h4 className="text-base lg:text-2xl font-semibold truncate">Hello {customerData.name},</h4>
            <div className="lg:flex flex-wrap mt-6">
                <div className="lg:w-1/4 w-full lg:h-full ">
                    <div className="lg:grid grid-rows-4 h-[26rem] hidden lg:gap-4 w-[40rem]">
                            <div className='text-md w-1/2 font-semibold p-4 rounded-md bg-slate-200 flex flex-wrap justify-center items-center'>
                                <User className="w-6 h-6 text-black" />
                                <Link to={"/account"} className='text-xl ml-3'>Profile</Link>
                            </div>
                            <div className='text-md w-1/2 font-semibold p-4 rounded-md bg-slate-200 flex flex-wrap justify-center items-center'>
                                <Box className="w-6 h-6 text-black" />
                                <Link to={"/orders"} className='text-xl ml-3'>Orders</Link>
                            </div>
                            <div className='text-md w-1/2 font-semibold p-4 rounded-md bg-slate-200 flex flex-wrap justify-center items-center'>
                                <Pen className="w-5 h-5 text-black" />
                                <Link to={"./update-password"} className='text-xl ml-3'>Manage Password</Link>
                            </div>
                            <div className='text-md w-1/2 font-semibold p-4 rounded-md bg-slate-200 flex flex-wrap justify-center items-center'>
                                <LogOut className="w-6 h-6 text-black" />
                                <Link to={"/logout"} className='text-xl ml-3'>Logout</Link>
                            </div>
                        </div>
                    <div className='w-full lg:hidden'>
                        <div className='flex gap-2'>
                            <Link className="text-xs w-1/2 font-semibold p-4 rounded-md bg-slate-200 flex flex-wrap justify-center items-center"
                                to="/account">Profile</Link>
                            <Link className="text-xs w-1/2 font-semibold p-4 rounded-md bg-slate-200 flex flex-wrap justify-center items-center"
                                to="/orders">Orders</Link>
                        </div>
                        <div className='flex gap-2 mt-2'>
                            <Link className="text-xs w-1/2 font-semibold p-4 text-center rounded-md bg-slate-200 flex flex-wrap justify-center items-center"
                                to="./update-password">Change Password</Link>
                            <Link className="text-xs w-1/2 font-semibold p-4 rounded-md bg-slate-200 flex flex-wrap justify-center items-center"
                                to="/logout">Logout</Link>
                        </div>
                    </div>
                </div>

                <Outlet context={{ color1: `${store.themeColorOne}`, color2: `${store.themeColorTwo}` }} />
            </div>
        </div>
    )
}

export default Account