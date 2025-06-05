import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header, Footer } from '../../components/Home/index'
import HeaderLanding from '../../components/Home/HeaderLanding'
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
      {/* <Header /> */}
      <HeaderLanding />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout