import React, { useEffect, useState } from 'react'
import { useAuth } from '../../store/auth'

function Customer() {
    const { token } = useAuth()
    const [store, setStore] = useState({})
    const [customers, setCustomers] = useState()
    const [isLoading, setIsLoading] = useState(true)

    async function getCustomerData() {
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

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/customer-data/${storeData.data.store._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const responseData = await response.json()
                setCustomers(responseData.data.customers)
            }

            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCustomerData()
    }, [])

    if (isLoading) {
        return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <section className='bg-white flex-grow h-dvh min-w-80 lg:h-dvh lg:pb-0 pb-20'>
            <div className='lg:my-7 my-5 mx-3 lg:mx-5'>
                <h2 className='text-xl lg:text-3xl text-zinc-900 font-extrabold tracking-tight'>Customers</h2>
            </div>

            {/* Mobile View of Orders */}

            {/* Desktop View of Orders */}
            {customers.length === 0 ?
                <div className='w-full mt-20'>
                    <div className='flex justify-center items-center'>
                        <img className='h-40 w-40' src="/group.png" alt="" />
                    </div>
                    <h1 className='text-center text-2xl font-semibold tracking-tighter text-gray-700'>No Customer found</h1>
                </div>
                :
                <div className='px-5'>
                    <div className="overflow-x-auto mt-7">
                        <table className="min-w-full text-xs">
                            <colgroup>
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                            </colgroup>
                            <thead className="dark:bg-gray-300">
                                <tr className="text-left">
                                    <th className="p-3 text-base tracking-tighter">Username</th>
                                    <th className="p-3 text-base tracking-tighter">Email</th>
                                    <th className="p-3 text-base tracking-tighter">No. of Orders</th>
                                    <th className="p-3 text-base tracking-tighter">Phone No.</th>
                                    <th className="p-3 text-base tracking-tighter">Address</th>
                                    {/* <th className="p-3 text-base tracking-tighter">Delete</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer,index) => (
                                <tr key={index} className="border-b border-opacity-20 border-gray-300 bg-gray-50">
                                    <td className="p-3 text-base tracking-tight">   
                                        <p>{customer.username}</p>
                                    </td>
                                    <td className="p-3 text-base tracking-tight">
                                        <p>{customer.email}</p>
                                    </td>
                                    <td className="p-3 text-base tracking-tight">
                                        <p>{customer.orders.length}</p>
                                    </td>
                                    <td className="p-3 text-base tracking-tight">
                                        <p>{!customer.phoneNo ? "----" : customer.phoneNo}</p>
                                    </td>
                                    <td className="p-3 text-base tracking-tight">
                                        <p>{!customer.address ? "----" : customer.address}</p>
                                    </td>
                                    {/* <td className="p-3 text-base tracking-tight">
                                        <span className="px-3 py-1 font-semibold rounded-md bg-red-600 text-gray-50">
                                            <span>Delete</span>
                                        </span>
                                    </td> */}
                                </tr>
                                ))}
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            }

        </section>
    )
}

export default Customer