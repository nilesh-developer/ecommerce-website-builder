import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import useStoreData from '../../Hooks/useStoreData';

function Payout() {
    const { user, loading } = useStoreData();
    const [transactions, setTransactions] = useState([])
    const [currentWeekPendingPayout, setCurrentWeekPendingPayout] = useState()

    const allTransactions = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/get-payouts/${user?.store?._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const data = await response.json();
                setTransactions(data.data)
            } else {
                toast.error("Something went wrong")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getCurrentWeekPayout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/get-current-week-payout/${user?.store?._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const data = await response.json();
                setCurrentWeekPendingPayout(data.currentWeekPayout)
            } else {
                toast.error("Something went wrong")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user?.store?._id) {
            allTransactions()
            getCurrentWeekPayout()
        }
    }, [user])

    if (loading) {
        return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <section className='bg-white flex-grow h-full pb-14 lg:pb-8'>
            <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
                <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>Payouts</h2>
                <div className='p-3 mt-5 rounded-2xl bg-blue-950 text-white'>
                    <p>All payouts will be automatically settled to your bank account <span className='font-bold'>every week on Monday.</span></p>
                </div>
                {/* <h3 className='mt-5 font-extrabold text-xl'>Current Week Details</h3> */}
                <div className='flex justify-between gap-3 mt-3'>
                    <div className='p-3 rounded-2xl w-full bg-yellow-400'>
                        <h3 className='font-semibold text-sm lg:text-base'>Current Week Pending Payout</h3>
                        <p className='font-bold text-xl lg:text-3xl mt-2'>&#8377; {currentWeekPendingPayout}</p>
                    </div>
                    <div className='p-3 rounded-2xl w-full bg-green-400'>
                        <h3 className='font-semibold text-sm lg:text-base'>Remaining Payout of Previous Paid Week</h3>
                        <p className='font-bold text-xl lg:text-3xl mt-2'>&#8377; {user?.store?.additionalPreviousWeekPayout?.amount}</p>
                    </div>
                </div>
                {transactions?.length !== 0 ?
                    <>
                        <h3 className='mt-5 font-extrabold text-xl'>Payout History</h3>
                        <div className="lg:overflow-auto overflow-scroll mt-3">
                            <table className="min-w-full text-xs">
                                <colgroup>
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                </colgroup>
                                <thead className="bg-gray-100">
                                    <tr className="text-left">
                                        <th className="p-3 text-base tracking-tighter min-w-36">Payout Week</th>
                                        {/* <th className="p-3 text-base tracking-tighter">Payment Method</th>
                                        <th className="p-3 text-base tracking-tighter">Transaction No.</th>
                                        <th className="p-3 text-base tracking-tighter min-w-36">Date</th> */}
                                        <th className="p-3 text-base tracking-tighter">No. of orders</th>
                                        <th className="p-3 text-base tracking-tighter">Amount</th>
                                        <th className="p-3 text-base tracking-tighter">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction, index) =>
                                    // {
                                    //     if (transaction?.status === "pending") {
                                    //         return 
                                    (
                                        <tr key={index} className="border-b border-opacity-20 border-gray-300 bg-white">
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{dateFormat(transaction?.paymentWeekStart, "dd mmm") + " - " + dateFormat(transaction?.paymentWeekEnd, "dd mmm")}</p>
                                            </td>
                                            {/* <td className="p-3 text-base tracking-tight">
                                                <p>{transaction?.paymentMethod ? transaction?.paymentMethod?.toUpperCase() : "----"}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{transaction?.paymentTransactionNo ? transaction?.paymentTransactionNo : "----"}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{dateFormat(transaction?.updatedAt, "mediumDate")}</p>
                                            </td> */}
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{transaction?.orders?.length}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p>Rs. {transaction?.amount}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{transaction?.status === "pending" ? <span className='text-orange-500 font-semibold'>Pending</span> : <span className='text-green-600 font-semibold'>Paid</span>}</p>
                                            </td>
                                        </tr>
                                    )
                                        //     }
                                        // }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                    : <></>
                }

            </div>
        </section>
    )
}

export default Payout