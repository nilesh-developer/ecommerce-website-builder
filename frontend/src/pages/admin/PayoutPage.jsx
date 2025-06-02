import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import dateFormat from "dateformat";
import toast from "react-hot-toast";
import { useAdminAuth } from "../../store/adminAuth";

const PayoutPage = () => {
    const { id } = useParams();
    const {adminToken} = useAdminAuth()
    const [store, setStore] = useState(null);
    const [transaction, setTransaction] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [transactionNo, setTransactionNo] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/admin/get-payout-details/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch store details");
                }
                const data = await response.json();
                setTransaction(data.data);
                setStore(data.data?.store);
                // setPaymentMethod(data.data?.store?.paymentDetails?.type || "");
                setTransactionNo(data.data?.paymentTransactionNo || "");
            } catch (error) {
                console.error("Error fetching partner details:", error);
                toast.error("Failed to load payout details.");
            } finally {
                setLoading(false);
            }
        };

        fetchStore();
    }, [id]);

    // const handleSave = async () => {
    //     if (!paymentMethod || !transactionNo) {
    //         toast.error("Please enter transaction number.");
    //         return;
    //     }

    //     try {
    //         setSaving(true);
    //         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payout/payment`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 id,
    //                 paymentMethod,
    //                 transactionNo,
    //                 status: "completed",
    //             }),
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to update partner payment details");
    //         }

    //         toast.success("Payment details updated successfully!");
    //         navigate("/admin/payouts");
    //     } catch (error) {
    //         console.error("Error updating payment details:", error);
    //         toast.error("Error updating payment details.");
    //     } finally {
    //         setSaving(false);
    //     }
    // };

    if (loading) {
        return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Partner Payment Details</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Partner Info */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Store Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <p><span className="font-medium">Name:</span> {store?.name}</p>
                        <p><span className="font-medium">URL:</span> {store?.subdomain}</p>
                        <p><span className="font-medium">Phone Number:</span> {store?.phoneNo}</p>
                        <Link to={`/admin/store/${store?._id}`}><p><span className="font-medium">Store ID:</span> <span className="hover:font-bold text-orange-500">{store?._id}</span></p></Link>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Payout Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <p><span className="font-medium">Payment Method:</span> {store?.paymentDetails?.type?.toUpperCase()}</p>
                        {store?.paymentDetails?.type === "upi" ? (
                            <p><span className="font-medium">UPI ID:</span> {store?.paymentDetails?.upiId}</p>
                        ) : (
                            <>
                                <p><span className="font-medium">Bank Name:</span> {store?.paymentDetails?.bankName}</p>
                                <p><span className="font-medium">IFSC:</span> {store?.paymentDetails?.ifsc}</p>
                                <p><span className="font-medium">Account Number:</span> {store?.paymentDetails?.accountNo}</p>
                                <p><span className="font-medium">Account Holder Name:</span> {store?.paymentDetails?.accountHolderName}</p>
                            </>
                        )}
                        <p><span className="font-medium">Payout Week:</span> {dateFormat(transaction?.paymentWeekStart, "dd mmm yyyy")} - {dateFormat(transaction?.paymentWeekEnd, "dd mmm yyyy")}</p>
                        <p><span className="font-medium">Amount:</span> ₹{transaction?.amount?.toFixed(2)}</p>
                        <p><span className="font-medium">Status:</span> {transaction?.status}</p>
                    </div>
                </div>

                {/* Update Payment Section */}
                <div data-theme="light" className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Update Payment</h2>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <label htmlFor="paymentMethod" className="font-medium text-gray-900">Payment Method</label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                             onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100"
                        >
                            <option value="">Select Payment Method</option>
                            <option value="bankTransfer">Bank Transfer</option>
                            <option value="upi">UPI</option>
                        </select>

                        <label htmlFor="transactionNo" className="font-medium text-gray-900">Transaction Number</label>
                        <input
                            type="text"
                            id="transactionNo"
                            name="transactionNo"
                            value={transactionNo}
                            onChange={(e) => setTransactionNo(e.target.value)}
                            placeholder="Enter Transaction Number"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                {/* <div className="mt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded ${saving && "opacity-50 cursor-not-allowed"}`}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default PayoutPage;
