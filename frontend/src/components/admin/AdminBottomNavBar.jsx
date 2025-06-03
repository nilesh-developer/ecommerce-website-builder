import { Box, Grid2X2, Menu, User, Users } from 'lucide-react'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'

function AdminBottomNavBar() {
    return (
        <div data-theme="light" className="btm-nav lg:hidden bottom-0">
            <NavLink to="dashboard" className={({ isActive }) => `${isActive ? "active text-orange-600 font-bold" : ""}`}>
                <Grid2X2 className='w-5 h-5 text-[fill-current]' />
                <span className="btm-nav-label text-xs lg:text-sm">Home</span>
            </NavLink>
            <NavLink to="sellers" className={({ isActive }) => `${isActive ? "active text-orange-600 font-bold" : ""}`}>
                <User className='w-5 h-5 text-[fill-current]' />
                <span className="btm-nav-label text-xs lg:text-sm">Sellers</span>
            </NavLink>
            <NavLink to="orders" className={({ isActive }) => `${isActive ? "active text-orange-600 font-bold" : ""}`}>
                <Box className='w-5 h-5 text-[fill-current]' />
                <span className="btm-nav-label text-xs lg:text-sm">Orders</span>
            </NavLink>
            <NavLink to="customers" className={({ isActive }) => `${isActive ? "active text-orange-600 font-bold" : ""}`}>
                <Users className='w-5 h-5 text-[fill-current]' />
                <span className="btm-nav-label text-xs lg:text-sm">Customers</span>
            </NavLink>
            <div className="dropdown dropdown-top dropdown-end pr-3">
                <div tabIndex={0} role="button" className="btn m-1 lg:ml-3 bg-white border-2 shadow-none border-white">
                    <Menu className='w-5 h-5 text-[fill-current]' />
                    <span className="btm-nav-label text-xs lg:text-sm">More</span></div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu px-2 shadow bg-base-100 rounded-box w-52">
                    {/* <li><Link to="subscriptions" className='text-md'>Subscription</Link></li> */}
                    <li><Link to="payouts" className='text-md'>Payouts</Link></li>
                    <li><Link to="change-password" className='text-md'>Change Password</Link></li>
                    {/* <li><Link to="settings" className='text-md'>Settings</Link></li> */}
                    <li><Link to="/admin/logout" className='text-md'>Logout</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default AdminBottomNavBar