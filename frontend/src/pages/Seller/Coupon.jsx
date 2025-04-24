import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useStoreData from '../../Hooks/useStoreData'
import { useAuth } from '../../store/auth'
import toast from 'react-hot-toast';

function Coupon() {
  const { token } = useAuth()
  const [coupon, setCoupon] = useState([])
  const [store, setStore] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  async function getCouponData() {
    try {
      setIsLoading(true)
      const store = await fetch(`${import.meta.env.VITE_API_URL}/api/user/current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const storeData = await store.json()
      setStore(storeData.data.store)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupon/get-data/${storeData.data.store._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const responseData = await response.json()
        setCoupon(responseData.data.coupon)
      }

      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getCouponData()
  }, [])

  if (isLoading) {
    return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
  }

  const deleteCoupon = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupon/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      const responseData = await response.json()
      if (response.ok) {
        toast.success(responseData.message)
        getCouponData()
      } else {
        toast.error("Something went wrong");
        console.log(responseData);
      } 
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className='bg-white flex-grow h-dvh min-w-80 lg:h-dvh lg:pb-0 pb-20'>
      <div className='lg:my-10 my-5 lg:mx-5 mx-3'>
        <div className='flex justify-between lg:justify-start lg:gap-5'>
          <h2 className='text-xl lg:text-3xl text-zinc-900 ml-2 lg:ml-3 font-extrabold tracking-tight'>Coupons</h2>
          <Link to="../add-coupon"><h2 className='text-md font-semibold bg-orange-600 text-white rounded-xl px-3 py-2 tracking-tighter'>Create New Coupon</h2></Link>
        </div>

        {store.coupon.length === 0 ?
          <div className='w-full mt-20'>
            <div className='flex justify-center items-center'>
              <img className='h-40 w-40' src="/coupon.png" alt="" />
            </div>
            <h1 className='text-center text-2xl font-semibold tracking-tighter text-gray-700'>No coupon added yet!</h1>
          </div>
          :
          <div className='px-2 lg:px-3'>
            <div className="overflow-x-auto mt-7">
              <table className="min-w-full text-xs">
                <colgroup>
                  <col />
                  <col />
                  <col />
                  <col />
                  <col />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead className="dark:bg-gray-300">
                  <tr className="text-left">
                    <th className="p-3 text-base tracking-tighter">Code</th>
                    <th className="p-3 text-base tracking-tighter">Type</th>
                    <th className="p-3 text-base tracking-tighter">Value</th>
                    <th className="p-3 text-base tracking-tighter">Valid From</th>
                    <th className="p-3 text-base tracking-tighter">Valid Till</th>
                    <th className="p-3 text-base tracking-tighter">Status</th>
                    <th className="p-3 text-base tracking-tighter">Edit</th>
                    <th className="p-3 text-base tracking-tighter">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {coupon.map((key, index) => (
                    <tr key={index} className="border-b border-opacity-20 border-gray-300 bg-gray-50">
                      <td className="p-3 text-base tracking-tight">
                        <p>{key.code}</p>
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        <p>{key.type}</p>
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        <p>{key.percentValue || key.flatDiscountAmount}</p>
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        <p>{key.validFrom.split("T")[0]+", "+key.validFrom.split("T")[1].split(".")[0]}</p>
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        <p>{key.validTill.split("T")[0]+", "+key.validTill.split("T")[1].split(".")[0]}</p>
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        {key.status === true ?
                          <p className='text-green-600 font-bold tracking-tighter'>Active</p>
                          :
                          <p className='text-red-600 font-bold tracking-tighter'>Inactive</p>
                        }
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        <Link to={"../edit-coupon/"+key._id} className="px-3 py-1 font-semibold rounded-md bg-violet-600 text-gray-50">
                          <span>Edit</span>
                        </Link>
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        <button onClick={(e) => deleteCoupon(key._id)} className="px-3 py-1 font-semibold rounded-md bg-red-600 text-gray-50">
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </section>
  )
}

export default Coupon