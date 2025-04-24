import React from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNavBar, Header, Sidebar } from '../../components/Seller'

function Layout() {
  return (
    <>
      <Header />
      <div className='flex bg-white'>
        <aside className='h-screen sticky top-0 p-3 space-y-2 w-60 border-r border-zinc-100 bg-white text-zinc-900 hidden lg:block'>
          <Sidebar />
        </aside>
        <main className='w-full bg-white h-full'>
          <Outlet />
        </main>
      </div>
      <BottomNavBar />
    </>
  )
}

export default Layout