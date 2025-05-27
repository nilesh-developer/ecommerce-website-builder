import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import useStoreData from "../../Hooks/useStoreData";

function AddPaymentDetails() {
    const {user, loading, userAuthentication} = useStoreData();
    const [type, setType] = useState("")
    const [formData, setFormData] = useState({
        bankName: "",
        ifsc: "",
        accountNo: "",
        accountHolderName: "",
        confirmAccountNo: "",
        upiId: ""
    });

    useEffect(() => {
        if (user?.store?._id) {
            setType(user?.store?.paymentDetails?.type)
            setFormData({
                bankName: user?.store?.paymentDetails?.bankName,
                ifsc: user?.store?.paymentDetails?.ifsc,
                accountNo: user?.store?.paymentDetails?.accountNo,
                accountHolderName: user?.store?.paymentDetails?.accountHolderName,
                upiId: user?.store?.paymentDetails?.upiId,
            })
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (type === "bankTransfer") {
            if (formData.bankName === "" || formData.ifsc === "" || formData.accountHolderName === "" || formData.accountNo === "") {
                toast.error("All bank details feilds are required")
                return
            }
            if (formData.accountNo !== formData.confirmAccountNo) {
                toast.error("Account no. and Confirm account no. is not matching")
            }
        }
        if (type === "upi") {
            if (formData.upiId === "") {
                toast.error("UPI ID is required")
                return
            }
        }
        try {
            const formdata = new FormData()
            formdata.append("storeId", user?.store?._id)
            formdata.append("type", type)
            formdata.append("bankName", formData.bankName)
            formdata.append("ifsc", formData.ifsc)
            formdata.append("accountNo", formData.accountNo)
            formdata.append("accountHolderName", formData.accountHolderName)
            formdata.append("upiId", formData.upiId)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/store/set-payment-details`, formdata, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            toast.success(response.data.message)
            userAuthentication()
        } catch (error) {
            console.log(error);

        }
    };

     if (loading) {
        return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <div data-theme="light" className="lg:min-h-screen flex items-center justify-center bg-white lg:bg-gray-100 px-4 py-4 lg:p-4 mb-20 lg:mb-0">
            <form
                className="bg-white lg:shadow-md rounded-lg  w-[500px] lg:p-8 space-y-6"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center">Setup Payment Method</h2>
                <div className="mb-6">
                    <label className="block text-gray-600 mb-2 font-semibold" htmlFor="type">Payment Method</label>
                    <select
                        id="type"
                        name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className='w-full bg-gray-50 rounded-md px-3 py-3'
                    >
                        <option value="" disabled>Select Payment Method</option>
                        <option value="bankTransfer">Bank Transfer</option>
                        <option value="upi">UPI</option>
                    </select>
                </div>

                {type === "bankTransfer" ?
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                            <input
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                            <input
                                type="tel"
                                name="ifsc"
                                value={formData.ifsc}
                                onChange={handleChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                            <input
                                type="text"
                                name="accountHolderName"
                                value={formData.accountHolderName}
                                onChange={handleChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Account Number</label>
                            <input
                                type="text"
                                name="accountNo"
                                value={formData.accountNo}
                                onChange={handleChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Account Number</label>
                            <input
                                type="text"
                                name="confirmAccountNo"
                                value={formData.confirmAccountNo}
                                onChange={handleChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                            />
                        </div>
                    </>
                    : null}

                {type === "upi" ?
                    <div>
                        <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                        <input
                            type="text"
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                        />
                    </div>
                    : null}

                <div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB500]"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddPaymentDetails