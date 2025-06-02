import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import isTokenExpired from '../../Hooks/verifyJwtToken';
import { useAdminAuth } from '../../store/adminAuth';

function Dashboard() {
  const { setAdminToken, adminToken, isLoading } = useAdminAuth();
  const [ data, setData ] = useState({})
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAllNumberData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-number-data`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      if (response.ok) {
        const responseData = await response.json()
        setData(responseData.data)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (adminToken) {
      getAllNumberData()
    }
  }, [adminToken])


  useEffect(() => {
    window.scrollTo(0, 0);
    if (localStorage.getItem('adminToken')) {
      const token = localStorage.getItem('adminToken');
      if (isTokenExpired(token)) {
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
      } else {
        setAdminToken(localStorage.getItem('adminToken'));
      }
    } else {
      navigate('/admin-login');
    }
  }, []);


  if (isLoading || loading) {
    return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
  }

  return (
    <>
      <section className='bg-white flex-grow h-full pb-14 lg:pb-8'>
        <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
          <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>Admin Dashboard</h2>
          <div className='grid grid-cols-2 mt-4 lg:mt-7 gap-5 lg:grid-cols-4 '>
            <div className='bg-white  border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Total Stores</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>{data?.noOfStores}</h2>
            </div>
            <div className='bg-white  border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Total Customer</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>{data?.noOfCustomers}</h2>
            </div>
            <div className='bg-white  border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Total Orders</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>{data?.noOfOrders}</h2>
            </div>
            <div className='bg-white border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Visits</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>{data?.noOfVisits}</h2>
            </div>
          </div>
          {/* <div className='grid grid-rows-2 grid-cols-none lg:grid-rows-none lg:grid-cols-2 gap-5 mt-8'> */}
        </div>
      </section >
    </>
  )
}

export default Dashboard