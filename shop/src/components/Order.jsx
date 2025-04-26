import React, { Fragment, useEffect, useState } from 'react'
import { useCustomerAuth } from '../store/customerAuth'
import { Link } from 'react-router-dom'
import dateFormat from 'dateformat'
import toast from "react-hot-toast"
import { Helmet } from 'react-helmet'
import { Dialog, Transition } from '@headlessui/react'

function Order() {
    let [isOpen, setIsOpen] = useState(false)
    const [orders, setOrders] = useState([])
    const [canceling, setCanceling] = useState(false)
    const [cancelOrderId, setCancelOrderId] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const [loading, setLoading] = useState(true)
    const [customerData, setCustomerData] = useState({})
    const [customerToken, setCustomerToken] = useState(localStorage.getItem("customerToken"))

    const [store, setStore] = useState({})
    const [metaLoading, setMetaLoading] = useState(true)

    const subdomain = window.location.hostname;

    const customerAuthentication = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/current-customer`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${customerToken}`
                }
            })

            if(response.ok){
                const data = await response.json();
                setCustomerData(data.data)
                setOrders(data.data.orders)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching customer data")
        }
    }

    async function getStoreData() {
        try {
            setMetaLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/subdomain/${subdomain}`)
            const responseData = await response.json()
            if (response.ok) {
                setStore(responseData.data)
            }
            setMetaLoading(false)
        } catch (error) {
            console.log(error)
            setMetaLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        if(customerToken){
            customerAuthentication()
        }
        getStoreData()
    }, [])

    function closeModal() {
        setIsOpen(false)
    }

    function openModal(orderId) {
        setIsOpen(true)
        setCancelOrderId(orderId)
    }

    const handleCancelOrder = async (orderid) => {
        try {
            setCanceling(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/cancel-order/${orderid}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ customerId: customerData._id, status: "canceled" })
            })

            if (response.ok) {
                const responseData = await response.json()
                toast.success(`Order ${responseData.data.name} is canceled`)
                closeModal()
            } else {
                toast.error("Failed to cancel order")
                closeModal()
            }
            setCanceling(false)
        } catch (error) {
            console.log(error)
            toast.error("Failed to cancel order")
        }
    }

    console.log(orders[0])

    if (loading) {
        return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (isLoading && metaLoading) {
        return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className='w-full h-full bg-white'>
            <Helmet>
                <title>{"Orders - " + store.name}</title>
                <meta name="description" content={store.metaDescription} />
            </Helmet>
            <div className='px-5 lg:px-64 py-7 lg:py-10'>
                <div>
                    <h2 className='text-2xl lg:text-4xl font-bold'>Orders</h2>
                    <p className='text-xs lg:text-base text-gray-600 mt-2'>Check the status of recent orders, manage returns, and discover similar products.</p>
                </div>

                {orders?.length > 0 ?
                    <div className='grid grid-flow-row gap-3 mt-3'>
                        {orders?.reverse()?.map((order, idx) => (
                            <div key={idx} className='bg-white rounded-xl border-[1px] border-gray-400 h-full w-full'>
                                <div className='px-5 lg:px-10 py-5 border-b-[1px] border-gray-300 grid grid-cols-2 lg:grid-cols-4'>
                                    <div>
                                        <h3 className='font-bold'>Order Number</h3>
                                        <p className='text-gray-700 truncate'>{order._id}</p>
                                    </div>
                                    <div className='hidden lg:block'>
                                        <h3 className='font-bold'>Date placed</h3>
                                        <p className='text-gray-700'>{dateFormat(order.createdAt, "mediumDate")}</p>
                                    </div>
                                    <div className='hidden lg:block'>
                                        <h3 className='font-bold'>Total Amount</h3>
                                        <p className='text-gray-700 font-semibold'>&#8377;{order.totalPrice}</p>
                                    </div>
                                    <Link to={"/order/" + order._id} className='w-full text-right mt-3'>
                                        <h3 className='font-bold'>Details</h3>
                                    </Link>
                                </div>

                                <div className='px-5 lg:px-10 py-5 lg:flex hidden'>
                                    <div className='w-1/4 h-24 flex justify-center items-center'>
                                        <img className='h-full' src={order?.product[0]?.images?.featuredImage} alt="" />
                                    </div>
                                    <div className='w-2/4'>
                                        <h3 className='text-xl lg:text-2xl font-bold'>{order?.product[0]?.name}</h3>
                                        <p className='text-gray-600'>{order?.product[0]?.quantity} item</p>
                                        <p className='mt-2'>Status: {order?.status?.toUpperCase() === "CANCELED" ? <span className='font-bold text-red-700'>{order?.status?.toUpperCase()}</span> : <span className='font-bold text-green-700'>{order?.status?.toUpperCase()}</span>}</p>
                                    </div>
                                    <div className='w-1/4 grid grid-rows-2 gap-2 text-right'>
                                        <Link to={"/product/" + order.product[0]._id} className="btn btn-primary text-white">View Product</Link>
                                        {order.status !== "delivered" ?
                                            <>
                                                {order.status === "canceled" ?
                                                    <Link to={"/product/" + order.product[0]._id} className="btn btn-neutral text-white">Buy again</Link>
                                                    :
                                                    <button onClick={(e) => openModal(order._id)} className="btn btn-neutral text-white">{canceling ? <span className="loading loading-spinner loading-md"></span> : "Cancel"}</button>
                                                }
                                            </>
                                            :
                                            <Link to={"/product/" + order.product[0]._id} className="btn btn-neutral text-white">Buy again</Link>
                                        }
                                    </div>
                                </div>

                                <div className='px-5 py-5 flex lg:hidden'>
                                    <div className='w-1/3 flex justify-center items-center h-20 border-[0.5px] border-gray-400 rounded-lg'>
                                        <img className='h-full' src={order.product[0].images.featuredImage} alt="" />
                                    </div>
                                    <div className='w-2/3 px-3'>
                                        <h3 className='font-bold'>{order.product[0].name}</h3>
                                        <p className='font-semibold'>&#8377;{order.totalPrice}</p>
                                        {order?.status === "delivered" ?
                                            <p className='mt-2 font-semibold text-green-700'>{(order?.status)[0].toUpperCase() + order?.status.slice(1)}</p>
                                            :
                                            <>
                                                {order?.status === "canceled" ?
                                                    <p className='mt-2 font-semibold text-red-700'>{(order?.status)[0].toUpperCase() + order?.status.slice(1)}</p>
                                                    :
                                                    <p className='mt-2 font-semibold text-green-700'>Ordered on {order.createdAt.split("T")[0]}</p>
                                                }
                                            </>
                                        }
                                    </div>
                                </div>

                                <div className='px-5 py-5 border-t-[1px] border-gray-300 grid grid-cols-2 lg:hidden'>
                                    <Link to={"/product/" + order.product[0]._id} className='font-bold text-center border-r-[1px] border-gray-300'>View Product</Link>
                                    {order.status !== "delivered" ?
                                        <>
                                            {order.status === "canceled" ?
                                                <Link to={"/product/" + order.product[0]._id} className='font-bold text-center'>Buy again</Link>
                                                :
                                                <button onClick={(e) => openModal(order._id)} className='font-bold text-center'>{canceling ? <span className="loading loading-spinner loading-md"></span> : "Cancel"}</button>
                                            }
                                        </>
                                        :
                                        <Link to={"/product/" + order.product[0]._id} className='font-bold text-center'>Buy again</Link>
                                    }
                                </div>
                            </div>
                        ))}

                    </div>
                    :
                    <div className='h-screen flex justify-center'>
                        <div className='pt-20'>
                            <img className='h-44 ml-5' src="./order.png" alt="" />
                            <h1 className='text-center text-2xl font-semibold'>No order placed yet!</h1>
                        </div>
                    </div>
                }
            </div>
            {/* Dialog Box */}
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
                                            You want to cancel the order
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
                                            onClick={(e) => handleCancelOrder(cancelOrderId)}
                                        >
                                            Cancel order
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default Order