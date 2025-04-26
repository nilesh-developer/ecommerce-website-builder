import React, { Fragment, useEffect, useState } from 'react';
import { Ordermobile } from '../../components/Seller';
import { useAuth } from '../../store/auth';
import { Link } from 'react-router-dom';
import dateFormat from "dateformat";
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';

function Orders() {
  const { token } = useAuth();
  let [isOpen, setIsOpen] = useState(false);
  let [openAccept, setOpenAccept] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderStatusId, setOrderStatusId] = useState('');
  const [selectedOption, setSelectedOption] = useState(false);
  const [tracking, setTracking] = useState({
    trackingId: '',
    trackingUrl: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const getAllOrders = async () => {
    try {
      setIsLoading(true)

      const store = await fetch(`${import.meta.env.VITE_API_URL}/api/user/current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const storeData = await store.json()

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-orders/${storeData.data.store._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const responseData = await response.json()
        setOrders(responseData.data)
      }

      setIsLoading(false)

    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAllOrders()
  }, [])

  const handleInput = (e) => {
    const { name, value } = e.target;

    setTracking({
      ...tracking,
      [name]: value
    })
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal(orderId) {
    setIsOpen(true)
    setOrderStatusId(orderId)
  }

  function closeAcceptModal() {
    setOpenAccept(false)
  }

  function openAcceptModal(orderId) {
    setOpenAccept(true)
    setOrderStatusId(orderId)
  }

  const changeOrderStatus = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/update-status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected' })
      })

      const responseData = await response.json()
      if (response.ok) {
        toast.success(responseData.message)
        getAllOrders()
      } else {
        toast.error(responseData.message)
      }
      setIsOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const acceptOrderStatus = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/accept/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'accepted', selectedOption, ...tracking })
      })

      const responseData = await response.json()
      if (response.ok) {
        toast.success(responseData.message)
        getAllOrders()
      } else {
        toast.error(responseData.message)
      }
      setOpenAccept(false)
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading) {
    return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
  }

  return (
    <section className='flex-grow min-h-dvh h-full lg:h-dvh lg:pb-0 pb-20'>
      <div className='lg:my-10 my-5 mx-3 lg:mx-5'>
        <h2 className='text-xl lg:text-3xl text-zinc-900 font-extrabold tracking-tight'>All Orders</h2>
      </div>

      {orders.length === 0 ?

        <div className='w-full mt-20'>
          <div className='flex justify-center items-center'>
            <img className='h-40 w-40' src="/order.png" alt="" />
          </div>
          <h1 className='text-center text-3xl font-semibold tracking-tighter text-gray-700 mt-3'>No orders yet!</h1>
        </div>
        :
        <>
          {/* Mobile View of Orders */}
          < div className='mx-5 flex flex-row lg:hidden'>
            <Ordermobile orders={orders} />
          </div>

          {/* Desktop View of Orders */}
          <div className='px-5'>
            <div className="overflow-x-auto mt-7 hidden lg:block">
              <table className="min-w-full text-xs">
                <colgroup>
                  <col />
                  <col />
                  <col />
                  <col />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="p-3 text-base tracking-tighter">Order ID</th>
                    <th className="p-3 text-base tracking-tighter">Image</th>
                    <th className="p-3 text-base tracking-tighter">Name</th>
                    <th className="p-3 text-base tracking-tighter">Date</th>
                    <th className="p-3 text-base tracking-tighter">Payment</th>
                    <th className="p-3 text-base tracking-tighter">Amount</th>
                    <th className="p-3 text-base tracking-tighter">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={idx} className="border-b border-opacity-20 border-gray-300 bg-white">
                      <td className="p-3 text-base tracking-tight">
                        <Link to={"/seller/orders/" + order?._id} className='underline font-semibold'>{"#" + order?._id}</Link>
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        <img className='h-7 w-7' src={order?.product[0]?.images?.featuredImage} alt="" />
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        <p className=''>{order?.product[0]?.name}</p>
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        <p>{dateFormat(order?.createdAt, "mediumDate")}</p>
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        <span className="bg-green-100 px-2 text-green-500 font-semibold tracking-tighter py-1">
                          <span>{order?.paymentMethod?.toUpperCase() === "COD" ? "COD" : "Online"}</span>
                        </span>
                      </td>
                      <td className="p-3 text-base tracking-tight">
                        <p className='font-bold trac'>{"Rs. " + order?.totalPrice}</p>
                      </td>
                      {order?.status === 'pending' ?
                        <td className="p-3 text-base tracking-tight">
                          <button onClick={(e) => openAcceptModal(order._id)} className='bg-green-600 px-3 py-2 text-white '>Accept</button>&nbsp;&nbsp;
                          <button onClick={(e) => openModal(order._id)} className='bg-red-600 text-white  px-3 py-2'>Reject</button>
                        </td>
                        :
                        <td className="p-3 text-base tracking-tight">
                          {order?.status === 'canceled' ?
                            <p className='text-red-600 font-bold tracking-tighter'>{(order?.status)[0].toUpperCase() + order?.status.slice(1)}</p>
                            :
                            <p className='text-green-600 font-bold tracking-tighter'>{(order?.status)[0].toUpperCase() + order?.status.slice(1)}</p>
                          }
                        </td>
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      }
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    Are you sure?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-md tracking-tight text-gray-500">
                      You want to reject the order request
                    </p>
                  </div>

                  <div className="mt-4 flex float-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={(e) => changeOrderStatus(orderStatusId)}
                    >
                      Reject order
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={openAccept} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeAcceptModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    Mark the item as accepted
                  </Dialog.Title>
                  <div className="mt-3">
                  
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name='radio1'
                        checked={selectedOption === false}
                        onChange={(e) => setSelectedOption(false)}
                        className="form-radio h-5 w-5"
                      />
                      <span className="text-gray-700 text-lg">Fulfill without delivery tracking</span>
                    </label>
                    

                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name='radio1'
                        checked={selectedOption === true}
                        onChange={(e) => setSelectedOption(true)}
                        className="form-radio h-5 w-5"
                      />
                      <span className="text-gray-700 text-lg">Fulfill with delivery tracking</span>
                    </label>
                    
                    {selectedOption && (
                      <>
                        <p className="text-md mt-4 font-semibold tracking-tight text-slate-900">
                          Delivery Tracking Details
                        </p>
                        <input
                          type="text"
                          name='trackingId'
                          id="trackingId"
                          onChange={handleInput}
                          value={tracking.trackingId}
                          placeholder="Enter Tracking ID"
                          className="border outline-none rounded-lg mt-2 px-3 py-3 text-black bg-transparent w-full"
                        />
                        <input
                          type="text"
                          name='trackingUrl'
                          id="trackingUrl"
                          onChange={handleInput}
                          value={tracking.trackingUrl}
                          placeholder="Enter Tracking Page URL"
                          className="border outline-none rounded-lg mt-2 px-3 py-3 text-black bg-transparent w-full"
                        />
                      </>
                    )
                    }
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeAcceptModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={(e) => acceptOrderStatus(orderStatusId)}
                    >
                      Accept order
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </section >
  )
}

export default Orders