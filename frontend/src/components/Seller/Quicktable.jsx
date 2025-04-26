import React, { useEffect, useState } from 'react'
import { useAuth } from '../../store/auth'
import { Link } from 'react-router-dom'

function Quicktable() {
    const { token } = useAuth()
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

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

    if (isLoading) {
        return <div className='flex h-full w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <div className="overflow-x-auto">
            {orders.length > 0 ?
                <table className='table'>
                    <thead>
                        <tr>
                            <th className='text-slate-900'>Image</th>
                            <th className='text-slate-900'>Name</th>
                            {/* <th className='text-slate-900'>Qty</th> */}
                            <th className='text-slate-900'>Price</th>
                            <th className='text-slate-900'>Details</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {orders.map((order, index) => {
                            if (index < 4) {
                                return <tr key={index}>
                                    <td>
                                        <img className='h-10 w-10' src={order?.product[0]?.images?.featuredImage} />
                                    </td>
                                    <td>
                                        <p>{order?.product[0].name}</p>
                                    </td>
                                    {/* <td>
                                        <p>{order.product.quantity}</p>
                                    </td> */}
                                    <td>
                                        <p>&#8377;{order?.totalPrice}</p>
                                    </td>
                                    <td>
                                        <Link to={"/seller/orders/" + order?._id} className='p-3 rounded-lg font-bold text-white bg-orange-600 tracking-wide'>Details</Link>
                                    </td>
                                </tr>
                            }
                        })}
                    </tbody>
                </table>
                :
                <div className='flex justify-center items-center'>
                    <h3>No order received yet!</h3>
                </div>
            }
        </div>
    )
}

export default Quicktable