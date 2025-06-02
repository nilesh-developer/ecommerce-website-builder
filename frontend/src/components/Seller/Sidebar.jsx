import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import useStoreData from '../../Hooks/useStoreData'
import { ArrowLeftRight, Box, Calendar, ChartColumn, Grid2X2, Landmark, LogOut, Menu, Settings, ShoppingBasket, Store, Ticket, Users } from 'lucide-react'

function Sidebar() {
    const { user, loading } = useStoreData()

    return (
        <>
            {loading ? <div className="flex items-center p-2 space-x-4">
                <div data-theme="light" className="w-20 h-12 skeleton rounded-full"></div>
                <div className='w-full'>
                    <div data-theme="light" className="skeleton h-4 w-full"></div>
                    <div data-theme="light" className="flex items-center skeleton h-4 w-full mt-2"></div>
                </div>
            </div>
                :
                <div className="flex items-center p-2 space-x-4">
                    {user?.store?.favicon ?
                        <img src={user?.store?.favicon} alt="" className="w-12 h-12 rounded-full bg-gray-500" />
                        :
                        <img src="/store-icon.jpg" alt="" className="w-12 h-12 rounded-full bg-gray-500" />
                    }
                    <div>
                        <h2 className="text-lg font-semibold">{user?.store?.name}</h2>
                        <span className="flex items-center space-x-1">
                            <Link to={`https://${user?.store?.subdomain}`} className="text-xs hover:underline text-gray-600">View store</Link>
                        </span>
                    </div>
                </div>
            }
            <div className="divide-y divide-gray-300 bg-white">
                <ul className="pt-2 pb-4 space-y-1 text-sm">
                    <li>
                        <NavLink to="dashboard" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Grid2X2 className='w-5 h-5 text-[fill-current]'/>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="products" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Box className='w-5 h-5 text-[fill-current]'/>
                            <span>Products</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="orders" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <ShoppingBasket className='w-5 h-5 text-[fill-current]'/>
                            <span>Orders</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="categories" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Menu className='w-5 h-5 text-[fill-current]'/>
                            <span>Category</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="customers" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Users className='w-5 h-5 text-[fill-current]'/>
                            <span>Customers</span>
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink to="analytics" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-gray-900 rounded-lg" : ""}`}>
                            <ChartColumn className='w-5 h-5 text-[fill-current]'/>
                            <span>Analytics</span>
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink to="coupon" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Ticket className='w-5 h-5 text-[fill-current]'/>
                            <span>Coupon</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="payouts" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                        <ArrowLeftRight className='w-5 h-5 text-[fill-current]'/>
                        <span>Payouts</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="payments" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Landmark className='w-5 h-5 text-[fill-current]'/>
                            <span>Payments</span>
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink to="transactions" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 122.883 85.208" ><path fill-rule="evenodd" clip-rule="evenodd" d="M122.883,28.086L93.668,0l-0.004,18.078h-26.66h-0.506H41.932v20.019H66.5l0,0 h27.164l0.004,18.08L122.883,28.086L122.883,28.086z M0,57.118l29.215-28.087l0.002,18.078h26.661h0.506h24.567v20.019H56.382l0,0 H29.217l-0.002,18.08L0,57.118L0,57.118z"/></svg>
                        <span>Transactions</span>
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink to="subscriptions" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                        <Calendar className='w-5 h-5 text-[fill-current]'/>
                        <span>Subscription</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="edit-store" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Store className='w-5 h-5 text-[fill-current]'/>
                            <span>Store Settings</span>
                        </NavLink>
                    </li>
                </ul>
                <ul className="pt-4 pb-2 space-y-1 text-sm">
                    <li>
                        <NavLink to="settings" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Settings className='w-5 h-5 text-[fill-current]'/>
                            <span>Settings</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/logout" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <LogOut className='w-5 h-5 text-[fill-current]'/>
                            <span>Logout</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Sidebar