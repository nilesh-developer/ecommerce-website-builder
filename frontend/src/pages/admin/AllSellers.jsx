import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dateFormat from "dateformat";
import { useAdminAuth } from '../../store/adminAuth';

function AllSellers() {
    const { adminToken } = useAdminAuth();
    const [sellers, setSellers] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const getAllSellers = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-all-stores`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            })
            if (response.ok) {
                const responseData = await response.json()
                setSellers(responseData.data)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getAllSellers()
    }, [])

    if (isLoading) {
        return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <section className='flex-grow min-h-dvh h-full lg:h-dvh lg:pb-0 pb-20'>
            <div className='lg:my-10 my-5 mx-3 lg:mx-5'>
                <h2 className='text-xl lg:text-3xl text-zinc-900 font-extrabold tracking-tight'>All Stores</h2>
            </div>

            {sellers.length === 0 ?

                <div className='w-full mt-20'>
                    <div className='flex justify-center items-center'>
                        <img className='h-40 w-40' src="/order.png" alt="" />
                    </div>
                    <h1 className='text-center text-3xl font-semibold tracking-tighter text-gray-700 mt-3'>No store created yet!</h1>
                </div>
                :
                <>
                    <div className='px-5'>
                        <div className="overflow-x-auto mt-7 lg:block">
                            <table className="min-w-full text-xs">
                                <colgroup>
                                    <col />
                                    {/* <col /> */}
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                </colgroup>
                                <thead className="bg-gray-100">
                                    <tr className="text-left">
                                        <th className="p-3 text-base tracking-tighter">Store ID</th>
                                        {/* <th className="p-3 text-base tracking-tighter">Email</th> */}
                                        <th className="p-3 text-base tracking-tighter">Logo</th>
                                        <th className="p-3 text-base tracking-tighter">Name</th>
                                        <th className="p-3 text-base tracking-tighter">Subscription</th>
                                        <th className="p-3 text-base tracking-tighter min-w-32">Date</th>
                                        <th className="p-3 text-base tracking-tighter">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sellers.map((seller, idx) => (
                                        <tr key={idx} className="border-b border-opacity-20 border-gray-300 bg-white">
                                            <td className="p-3 text-base tracking-tight">
                                                <Link to={"/admin/store/" + seller?._id} className='underline font-semibold'>{seller?._id}</Link>
                                            </td>
                                            {/* <td className="p-3 text-base tracking-tight">
                                                <p className=''>{seller?.owner?.email}</p>
                                            </td> */}
                                            <td className="p-3 text-base tracking-tight">
                                                <img className='h-7 w-7' src={seller?.logo} alt="" />
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p className=''>{seller?.name}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                {seller?.owner?.subcription === false ?
                                                    <p className='text-red-600 font-bold tracking-tighter'>Inactive</p>
                                                    :
                                                    <p className='text-green-600 font-bold tracking-tighter'>Active</p>
                                                }
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{dateFormat(seller?.createdAt, "mediumDate")}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                {seller?.status === false ?
                                                    <p className='text-red-600 font-bold tracking-tighter'>Close</p>
                                                    :
                                                    <p className='text-green-600 font-bold tracking-tighter'>Open</p>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            }

        </section >
    )
}

export default AllSellers