import React, { useEffect, useState } from 'react'
import { useCustomerAuth } from '../store/customerAuth';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';

function AccountContent() {
    const {color1, color2} = useOutletContext()
    const [loading, setLoading] = useState(true)
    const [customerData, setCustomerData] = useState({})
    const [customerToken, setCustomerToken] = useState(localStorage.getItem("customerToken"))
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        state: '',
        country: 'India',
        pinCode: ''
    });

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
                setFormData({
                    name: data.data?.name,
                    email: data.data?.email,
                    phone: data.data?.phoneNo,
                    address: data.data?.address,
                    state: data.data?.state,
                    pinCode: data.data?.pinCode
                })
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching customer data")
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        if(customerToken){
            customerAuthentication()
        }
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/update-profile`,{
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${customerToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...formData})
            })
            
            if(response.ok){
                const responseData = await response.json();
                console.log(responseData)
                toast.success(responseData.message)
            }
        } catch (error) {
            console.log(error)
        }
        setIsEditing(false);
    };

    if (loading) {
        return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <div className="lg:w-3/4 mt-10 lg:mt-0 h-full">
            <div>
                <h4 className="lg:ml-10 font-bold text-3xl border-b-4 border-b-black">Profile</h4>
                <div className="mt-6 lg:ml-10">
                    <div className="">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-600">Personal Information</h3>
                            {!isEditing ? (
                                customerData ? <div>
                                    <div className="mt-4">
                                        <p className="text-gray-600">Name</p>
                                        <p className="font-medium text-gray-800">{formData.name}</p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-gray-600">Email</p>
                                        <p className="font-medium text-gray-800">{formData.email}</p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-gray-600">Phone</p>
                                        <p className="font-medium text-gray-800">{formData.phone}</p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-gray-600">Address</p>
                                        <p className="font-medium text-gray-800">{formData.address}</p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-gray-600">State</p>
                                        <p className="font-medium text-gray-800">{formData.state}</p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-gray-600">Pin Code</p>
                                        <p className="font-medium text-gray-800">{formData.pinCode}</p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            className="font-semibold py-2 px-4 rounded hover:bg-zinc-800"
                                            style={{color: color2, backgroundColor: color1}}
                                            onClick={handleEditClick}
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                                : <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
                            ) : (
                                <div>
                                    <div className="bg-gray-100 rounded-lg">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mt-4">
                                                <label className="text-gray-600">Name</label>
                                                <input
                                                    data-theme="light"
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 mt-2 border rounded"
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label className="text-gray-600">Phone</label>
                                                <input
                                                    data-theme="light"
                                                    type="text"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 mt-2 border rounded"
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label className="text-gray-600">Address</label>
                                                <input
                                                    data-theme="light"
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 mt-2 border rounded"
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label className="text-gray-600">State</label>
                                                <input
                                                    data-theme="light"
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 mt-2 border rounded"
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label className="text-gray-600">Pin Code</label>
                                                <input
                                                    data-theme="light"
                                                    type="text"
                                                    name="pinCode"
                                                    value={formData.pinCode}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 mt-2 border rounded"
                                                />
                                            </div>
                                            <div className="mt-4 flex justify-between">
                                                <button
                                                    type="button"
                                                    className="bg-zinc-600 text-white py-2 px-4 rounded hover:bg-gray-500"
                                                    onClick={handleEditClick}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="py-2 px-4 rounded-md"
                                                    style={{color: color2, backgroundColor: color1}}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountContent