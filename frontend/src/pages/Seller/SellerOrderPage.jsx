import React, { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import dateFormat from "dateformat";
import toast from 'react-hot-toast';
import { useAuth } from '../../store/auth';
import { Dialog, Transition } from '@headlessui/react';

function SellerOrderPage() {
    const { id } = useParams()
    const { token } = useAuth()
    let [isOpen, setIsOpen] = useState(false);
    let [openAccept, setOpenAccept] = useState(false);
    const [order, setOrder] = useState({})
    const [status, setStatus] = useState("")
    const [orderStatusId, setOrderStatusId] = useState('');
    const [selectedOption, setSelectedOption] = useState(false);
    const [tracking, setTracking] = useState({
        trackingId: '',
        trackingUrl: ''
    });
    const [loading, setLoading] = useState(true)

    const getOrderData = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-data/${id}`)

            if (response.ok) {
                const responseData = await response.json()
                setOrder(responseData.data)
                setStatus(responseData.data.status)
            }
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getOrderData()
    }, [])

    const changeOrderStatus = async (e) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/update-status/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            })

            const responseData = await response.json()
            if (response.ok) {
                toast.success(responseData.message)
            } else {
                toast.error(responseData.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

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

    const rejectOrderStatus = async (id) => {
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
                getOrderData()
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
                getOrderData()
            } else {
                toast.error(responseData.message)
            }
            setOpenAccept(false)
        } catch (error) {
            console.log(error)
        }
    }


    if (loading) {
        return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <div className='h-full mx-3 lg:mx-5 my-5 lg:my-8 mb-20'>
            <h2 className='text-xl lg:text-2xl font-bold'>View order details</h2>
            <div className='border border-gray-400 rounded-lg p-4 mt-6 flex'>
                <div className='w-1/3'>
                    <p className='text-gray-600'>Order date</p>
                    <p className='text-gray-600'>Order #</p>
                    <p className='text-gray-600'>Order total</p>
                </div>
                <div className='w-2/3'>
                    <p className='font-semibold ml-3'>{dateFormat(order?.createdAt, "mediumDate")}</p>
                    <p className='font-semibold ml-3 truncate'>{order?._id}</p>
                    <p className='font-semibold ml-3'>&#8377;{order?.product?.soldPrice}</p>
                </div>
            </div>
            <h3 className='lg:text-lg font-bold mt-4'>Product details</h3>
            <div className='border border-gray-400 rounded-lg px-6 mt-2'>
                <div className='py-5 flex'>
                    <div className='w-1/3 flex justify-center items-center h-20 lg:h-44 border-[0.5px] border-gray-400 rounded-lg'>
                        <img className='h-full' src={order?.product?.images.featuredImage} alt="" />
                    </div>
                    <div className='w-2/3 px-3'>
                        <Link to={`/seller/edit-product/${order?.product?._id}`}>
                            <p className='font-semibold text-xs'><span className='text-gray-800 truncate'>Product Id:</span> {order?.product?._id}</p>
                            <h3 className='font-bold'>{order?.product?.name}</h3>
                            <p className='font-semibold'>&#8377;{order?.product?.soldPrice}</p>
                            <p className='mt-2 font-semibold text-gray-500'>Qty: {order?.product?.quantity} {order?.product?.selectColor} {order?.product?.selectSize} {order?.product?.selectOther}</p>
                        </Link>
                    </div>
                </div>
            </div>
            <h3 className='lg:text-lg font-bold mt-4'>Status</h3>
            <div className='w-full border border-gray-400 rounded-lg p-4 mt-2'>
                {status === "canceled" ?
                    <div>
                        <h3 className='lg:text-lg font-bold mt-4'>Order Status</h3>
                        <div className='border border-gray-400 bg-white rounded-lg p-4 mt-2'>
                            {status === "accepted" ?
                                <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                    <li data-content="✓" className="step step-accent">Order placed</li>
                                    <li data-content="✓" className="step step-accent">Accepted</li>
                                    <li data-content="" className="step">Processed</li>
                                    <li data-content="" className="step">Shipped</li>
                                    <li data-content="" className="step">Delivered</li>
                                </ul>
                                : null}
                            {status === "processed" ?
                                <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                    <li data-content="✓" className="step step-accent">Order placed</li>
                                    <li data-content="✓" className="step step-accent">Accepted</li>
                                    <li data-content="✓" className="step step-accent">Processed</li>
                                    <li data-content="" className="step">Shipped</li>
                                    <li data-content="" className="step">Delivered</li>
                                </ul>
                                : null}
                            {status === "canceled" ?
                                <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                    <li data-content="✓" className="step step-error">Order placed</li>
                                    <li data-content="✓" className="step step-error">Canceled</li>
                                </ul>
                                : null}
                            {status === "shipped" ?
                                <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                    <li data-content="✓" className="step step-accent">Order placed</li>
                                    <li data-content="✓" className="step step-accent">Accepted</li>
                                    <li data-content="✓" className="step step-accent">Processed</li>
                                    <li data-content="✓" className="step step-accent">Shipped</li>
                                    <li data-content="" className="step">Delivered</li>
                                </ul>
                                : null}
                            {status === "delivered" ?
                                <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                    <li data-content="✓" className="step step-accent">Order placed</li>
                                    <li data-content="✓" className="step step-accent">Accepted</li>
                                    <li data-content="✓" className="step step-accent">Processed</li>
                                    <li data-content="✓" className="step step-accent">Shipped</li>
                                    <li data-content="✓" className="step step-accent">Delivered</li>
                                </ul>
                                : null}
                        </div>
                    </div>
                    :
                    <>
                        {status === "rejected" ?
                            <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                <li data-content="✓" className="step step-error">Order placed</li>
                                <li data-content="✓" className="step step-error">Rejected</li>
                            </ul>
                            :
                            <>
                                {status === "pending" ?
                                    <>
                                        <button onClick={(e) => openAcceptModal(order._id)} className='bg-green-600 px-3 py-2 text-white '>Accept</button>&nbsp;&nbsp;
                                        <button onClick={(e) => openModal(order._id)} className='bg-red-600 text-white  px-3 py-2'>Reject</button>
                                    </>
                                    :
                                    <>
                                        <select
                                            name="status"
                                            id="status"
                                            onChange={(e) => setStatus(e.target.value)}
                                            value={status}
                                            className="w-full rounded-md bg-gray-100 border border-gray-400 px-4 py-3 text-baseoutline-none"
                                        >
                                            <option value="" disabled>Pending</option>
                                            <option value="processed">Processed</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                        <button onClick={changeOrderStatus} type='button' className='px-3 py-2 bg-orange-600 text-white rounded-md mt-2'>Update Status</button>
                                    </>
                                }
                            </>
                        }

                    </>
                }
            </div>
            <h3 className='lg:text-lg font-bold mt-4'>Shipment Details</h3>
            <div className='border border-gray-400 rounded-lg p-4 mt-2'>
                <b className='tracking-tighter'>Tracking No.</b>
                <p className='text-sm'>{order?.trackingNo}</p><br />
                <b className='tracking-tighter'>Tracking Page Url</b>
                <p className='text-sm text-blue-700'><a href={order?.trackingPageUrl}>{order?.trackingPageUrl}</a></p>
            </div>
            <h3 className='lg:text-lg font-bold mt-4'>Payment infomation</h3>
            <div className='border border-gray-400 rounded-lg p-4 mt-2'>
                <b className='tracking-tighter'>Payment method</b>
                <p className='text-sm'>{order?.paymentMethod}</p>
            </div>
            <h3 className='lg:text-lg font-bold mt-4'>Shipping Address</h3>
            <div className='border border-gray-400 rounded-lg p-4 mt-2 font-bold text-zinc-700'>
                <p className='tracking-tight text-sm'>{order?.name}</p>
                <p className='tracking-tight text-sm'>{order?.address1}</p>
                <p className='tracking-tight text-sm'>{order?.address2}</p>
                <p className='tracking-tight text-sm'>{order?.state}, {order.pinCode}</p>
                <p className='tracking-tight text-sm'>{order?.country}</p>
                <p className='tracking-tight text-sm mt-3'><span className='font-semibold'>Phone no:</span> {order?.phoneNo}</p>
            </div>
            <h3 className='lg:text-lg font-bold mt-4'>Order Summary</h3>
            <div className='border border-gray-400 rounded-lg p-4 flex mt-2'>
                <div className='w-2/3'>
                    <p>Items:</p>
                    <p>Packing:</p>
                    <p>Shipping:</p>
                    <p>Coupon discount:</p>
                    <b>Order Total:</b>
                </div>
                <div className='w-1/3'>
                    <p>Rs. {order?.product?.salePrice.toFixed(2)}</p>
                    <p>Rs. 0.00</p>
                    <p>Rs. 0.00</p>
                    <p>Rs. -{(Number(order?.product?.salePrice) - Number(order?.product?.soldPrice)).toFixed(2)}</p>
                    <b className='text-green-800'>Rs. {order?.product?.soldPrice.toFixed(2)}</b>
                </div>
            </div>
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
                                            onClick={(e) => rejectOrderStatus(orderStatusId)}
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
        </div>
    )
}

export default SellerOrderPage