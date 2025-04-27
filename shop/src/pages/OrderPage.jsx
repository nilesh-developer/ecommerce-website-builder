import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import dateFormat from "dateformat";

function OrderPage() {
    const { id } = useParams()
    const [order, setOrder] = useState({})
    const [loading, setLoading] = useState(true)

    const getOrderData = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-data/${id}`)

            if (response.ok) {
                const responseData = await response.json()
                setOrder(responseData.data)
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

    if (loading) {
        return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <div className='h-full lg:mx-32 mx-5 my-5 lg:my-8'>
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
                    <p className='font-semibold ml-3'>&#8377;{order?.totalPrice}</p>
                </div>
            </div>
            <h3 className='lg:text-lg font-bold mt-4'>Shipment details</h3>
            <div className='border border-gray-400 rounded-lg px-6 py-4 mt-2'>
                <p>Status: <span className='font-bold'>{(order?.status)[0].toUpperCase() + order?.status.slice(1)}</span></p>
                {order?.product?.map((odr, idx) => (
                    <div className='py-5 flex'>
                        <div className='w-1/3 flex justify-center items-center h-20 lg:h-44 border-[0.5px] border-gray-400 rounded-lg'>
                            <img className='h-full' src={odr?.images?.featuredImage} alt="product image" />
                        </div>
                        <div className='w-2/3 px-3'>
                            <h3 className='font-bold'>{odr?.name}</h3>
                            <p className='font-semibold'>&#8377;{odr?.salePrice}</p>
                            <p className='mt-2 font-semibold text-gray-500'>Qty: {odr?.quantity} {odr?.selectColor}</p>
                        </div>
                    </div>
                ))}
            </div>
            {order?.status === "rejected" ? null :
                <>
                    <h3 className='lg:text-lg font-bold mt-4'>Order Status</h3>
                    <div className='border border-gray-400 rounded-lg p-4 mt-2'>
                        {order?.status === "pending" ?
                            <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                <li data-content="✓" className="step step-accent">Order placed</li>
                                <li data-content="" className="step">Accepted</li>
                                <li data-content="" className="step">Processed</li>
                                <li data-content="" className="step">Shipped</li>
                                <li data-content="" className="step">Delivered</li>
                            </ul>
                            : null}
                        {order?.status === "accepted" ?
                            <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                <li data-content="✓" className="step step-accent">Order placed</li>
                                <li data-content="✓" className="step step-accent">Accepted</li>
                                <li data-content="" className="step">Processed</li>
                                <li data-content="" className="step">Shipped</li>
                                <li data-content="" className="step">Delivered</li>
                            </ul>
                            : null}
                        {order?.status === "processed" ?
                            <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                <li data-content="✓" className="step step-accent">Order placed</li>
                                <li data-content="✓" className="step step-accent">Accepted</li>
                                <li data-content="✓" className="step step-accent">Processed</li>
                                <li data-content="" className="step">Shipped</li>
                                <li data-content="" className="step">Delivered</li>
                            </ul>
                            : null}
                        {order?.status === "canceled" ?
                            <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                <li data-content="✓" className="step step-error">Order placed</li>
                                <li data-content="✓" className="step step-error">Canceled</li>
                            </ul>
                            : null}
                        {order?.status === "shipped" ?
                            <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                <li data-content="✓" className="step step-accent">Order placed</li>
                                <li data-content="✓" className="step step-accent">Accepted</li>
                                <li data-content="✓" className="step step-accent">Processed</li>
                                <li data-content="✓" className="step step-accent">Shipped</li>
                                <li data-content="" className="step">Delivered</li>
                            </ul>
                            : null}
                        {order?.status === "delivered" ?
                            <ul data-theme="light" className="steps steps-vertical lg:steps-horizontal lg:w-full font-bold">
                                <li data-content="✓" className="step step-accent">Order placed</li>
                                <li data-content="✓" className="step step-accent">Accepted</li>
                                <li data-content="✓" className="step step-accent">Processed</li>
                                <li data-content="✓" className="step step-accent">Shipped</li>
                                <li data-content="✓" className="step step-accent">Delivered</li>
                            </ul>
                            : null}
                    </div>
                </>
            }

            {order?.isTrackingDetailsProvided && <>
                <h3 className='lg:text-lg font-bold mt-4'>Shipment Details</h3>
                <div className='border border-gray-400 rounded-lg p-4 mt-2'>
                    <b className='tracking-tighter'>Tracking No.</b>
                    <p className='text-sm'>{order?.trackingNo}</p><br />
                    <b className='tracking-tighter'>Tracking Page Url</b>
                    <p className='text-sm text-blue-700'><a href={order?.trackingPageUrl}>{order?.trackingPageUrl}</a></p>
                </div>
            </>
            }

            <h3 className='lg:text-lg font-bold mt-4'>Payment infomation</h3>
            <div className='border border-gray-400 rounded-lg p-4 mt-2'>
                <b className='tracking-tighter text-slate-600 font-semibold'>Payment method</b>
                {order?.paymentMethod?.toUpperCase() === "COD" &&
                    <p className='text-sm font-bold'>{order?.paymentMethod?.toUpperCase()}</p>
                }
                {order?.paymentMethod?.toUpperCase() === "CASHFREE" && <>
                    <p className='text-sm'>{"Online (via " + order?.paymentMethod?.toUpperCase() + " PG)"}</p>
                    <b className='tracking-tighter text-slate-600 font-semibold'>Payment status</b>
                    {order?.paymentProcess?.toUpperCase() === "FAILED" ? <p className='text-sm text-red-700'>{order?.paymentProcess?.toUpperCase()}</p> : <p className='text-sm'>{order?.paymentProcess?.toUpperCase()}</p>}
                </>
                }
            </div>
            <h3 className='lg:text-lg font-bold mt-4'>Shipping Address</h3>
            <div className='border border-gray-400 rounded-lg p-4 mt-2 font-bold text-zinc-700'>
                <p className='tracking-tight text-sm font'>{order?.name}</p>
                <p className='tracking-tight text-sm font'>{order?.address1}</p>
                <p className='tracking-tight text-sm font'>{order?.address2}</p>
                <p className='tracking-tight text-sm font'>{order?.state}, {order.pinCode}</p>
                <p className='tracking-tight text-sm font'>{order?.country}</p>
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
                    <p>Rs. {order?.totalPrice?.toFixed(2)}</p>
                    <p>Rs. 0.00</p>
                    <p>Rs. 0.00</p>
                    <p>{Number(order?.discountValue) === 0 ? "Free" : `Rs. -${Number(order?.discountValue)}`}</p>
                    <b className='text-green-800'>Rs. {order?.totalPrice?.toFixed(2)}</b>
                </div>
            </div>
        </div>
    )
}

export default OrderPage