import { Box, Grid2X2, Menu, ShoppingBasket, Store } from 'lucide-react'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'

function BottomNavBar() {
    return (
        <div data-theme="light" className="btm-nav lg:hidden bottom-0">
            <NavLink to="dashboard" className={({ isActive }) => `${isActive ? "active text-orange-600 font-bold" : ""}`}>
                <Grid2X2 className='w-5 h-5 text-[fill-current]'/>
                <span className="btm-nav-label text-xs lg:text-sm">Home</span>
            </NavLink>
            <NavLink to="products" className={({ isActive }) => `${isActive ? "active text-orange-600 font-bold" : ""}`}>
                <Box className='w-5 h-5 text-[fill-current]'/>
                <span className="btm-nav-label text-xs lg:text-sm">Products</span>
            </NavLink>
            <NavLink to="edit-store" className={({ isActive }) => `${isActive ? "active text-orange-600 font-bold" : ""}`}>
                  <Store className='w-5 h-5 text-[fill-current]'/>
                <span className="btm-nav-label text-xs lg:text-sm">Store</span>
            </NavLink>
            <NavLink to="orders" className={({ isActive }) => `${isActive ? "active text-orange-600 font-bold" : ""}`}>
                <ShoppingBasket className='w-5 h-5 text-[fill-current]'/>
                <span className="btm-nav-label text-xs lg:text-sm">Orders</span>
            </NavLink>
            <div className="dropdown dropdown-top dropdown-end pr-3">
                <div tabIndex={0} role="button" className="btn m-1 lg:ml-3 bg-white border-2 shadow-none border-white">
                     <Menu className='w-5 h-5 text-[fill-current]'/>
               <span className="btm-nav-label text-xs lg:text-sm">More</span></div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><Link to="coupon" className='text-md'>Coupon</Link></li>
                    <li><Link to="payments" className='text-md'>Payment</Link></li>
                    <li><Link to="customers" className='text-md'>Customers</Link></li>
                    <li><Link to="categories" className='text-md'>Category</Link></li>
                    <li><Link to="subscriptions" className='text-md'>Subscription</Link></li>
                    <li><Link to="payouts" className='text-md'>Payouts</Link></li>
                    {/* <li><Link to="transactions" className='text-md'>Transactions</Link></li> */}
                    <li><Link to="settings" className='text-md'>Settings</Link></li>
                    <li><Link to="/logout" className='text-md'>Logout</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default BottomNavBar