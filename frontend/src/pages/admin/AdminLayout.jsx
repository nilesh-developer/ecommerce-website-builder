import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/admin/Header'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminBottomNavBar from '../../components/admin/AdminBottomNavBar'

function AdminLayout() {
  return (
    <>
      <Header />
      <div className='flex bg-white'>
        <aside className='h-screen sticky top-0 p-3 space-y-2 w-60 border-r border-zinc-100 bg-white text-zinc-900 hidden lg:block'>
          <AdminSidebar />
        </aside>
        <main className='w-full bg-white h-full'>
          <Outlet />
        </main>
      </div>
      <AdminBottomNavBar />
    </>
  )
}

export default AdminLayout