import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header, Footer } from '../../components/Home/index'
function Layout() {

  const addVisit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/add-visit`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    addVisit()
  }, [])

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout