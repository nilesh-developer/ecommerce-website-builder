import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowLeftRight, Box, CalendarCheck, Grid2X2, Key, KeyIcon, KeySquare, LogOut, Settings, User, Users } from "lucide-react"

function AdminSidebar() {

    return (
        <>
            <div className="divide-y divide-gray-300 bg-white">
                <div className="flex items-center justify-center p-2 space-x-4">
                    <img className='h-10' src="/eazzy.png" alt="eazzy" />
                </div>
                <ul className="pt-2 pb-4 space-y-1 text-sm">
                    <li>
                        <NavLink to="dashboard" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Grid2X2 className='w-5 h-5 text-[fill-current]' />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="sellers" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <User className='w-5 h-5 text-[fill-current]' />
                            <span>Sellers</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="orders" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Box className='w-5 h-5 text-[fill-current]' />
                            <span>Orders</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="customers" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Users className='w-5 h-5 text-[fill-current]' />
                            <span>Customers</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="payouts" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <ArrowLeftRight className='w-5 h-5 text-[fill-current]' />
                            <span>Payouts</span>
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink to="subscriptions" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                        <CalendarCheck className='h-5 w-5 text-[fill-current]'/>
                            <span>Subscription</span>
                        </NavLink>
                    </li> */}
                </ul>
                <ul className="pt-4 pb-2 space-y-1 text-sm">
                    {/* <li>
                        <NavLink to="settings" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <Settings className='h-5 w-5 text-[fill-current]'/>
                            <span>Settings</span>
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink to="/admin/change-password" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <KeySquare className='h-5 w-5 text-[fill-current]' />
                            <span>Change Password</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/logout" className={({ isActive }) => `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-gray-100 text-orange-600 font-bold rounded-lg" : ""}`}>
                            <LogOut className='h-5 w-5 text-[fill-current]' />
                            <span>Logout</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default AdminSidebar