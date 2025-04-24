import React from 'react'
import { Link } from 'react-router-dom'
import dateFormat from 'dateformat'

function Ordermobile({ orders }) {

    return (
        <div className='w-full'>
            {orders.map((order, idx) => (
                <div key={idx} className='bg-gray-50 shadow-md p-4 w-full rounded-md mt-3'>
                    <Link to={"/seller/orders/" + order._id}>
                        <div className='flex mb-3'>
                            <div className='w-1/4 p-2 border-2 flex justify-center items-center border-zinc-200 rounded-lg'>
                                <img className='h-20 w-auto' src={order.product.images.featuredImage} alt="" />
                            </div>
                            <div className='p-2 w-2/4'>
                                <h3 className='font-semibold text-sm text-wrap tracking-tighter truncate'>{order.product.name}</h3>
                                <p className='text-gray-600 text-sm'>Qty: {order.product.quantity}</p>
                                <p className='text-gray-600 text-sm'>{order.product?.selectColor || order.product?.selectSize || order.product?.selectOther}</p>
                                <p className='text-gray-600 text-xs'>Order date: {dateFormat(order.createdAt,"mediumDate")}</p>
                            </div>
                            <div className='p-2 w-1/4'>
                                <p className='font-bold text-lg tracking-tighter text-right'>&#8377;{order.product.soldPrice}</p>
                            </div>
                        </div>
                        <div className='flex justify-between border-zinc-300 border-t-2 pt-2 px-2'>
                            <h3 className='font-bold tracking-tighter text-green-800'>{(order?.status)[0].toUpperCase() + order?.status.slice(1)}</h3>
                            <h3 className='font-bold tracking-tight px-2 bg-green-400 text-green-800'>{order.paymentMethod}</h3>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default Ordermobile