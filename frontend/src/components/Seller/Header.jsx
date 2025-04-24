import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
    return (
        <header className="py-2 px-3 lg:px-4 top-0 sticky text-slate-950 border-b border-gray-200 bg-white lg:hidden h-[70px]">
            <div className="container flex justify-between h-full">
                <Link to="/seller/dashboard" className="flex items-center p-2">
                    <img className='h-10' src="/eazzy.png" alt="eazzy" />
                </Link>
            </div>
        </header>
    )
}

export default Header