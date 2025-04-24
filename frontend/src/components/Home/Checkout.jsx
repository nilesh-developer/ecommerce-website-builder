import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import isTokenExpired from '../../Hooks/verifyJwtToken';
import { useAuth } from '../../store/auth';

const Checkout = () => {
    const navigate = useNavigate();
    const {userData} = useAuth()
    const { setToken } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const [price, setPrice] = useState(999);
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'card'
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token');
            if (isTokenExpired(token)) {
              localStorage.removeItem('token');
              navigate('/login');
            } else {
              setToken(localStorage.getItem('token'));
            }
          } else {
            navigate('/login');
          }
    }, []);

    const handlePlanChange = (e) => {
        const plan = e.target.value;
        setSelectedPlan(plan);
        if (plan === 'basic') setPrice(99);
        else if (plan === 'premium') setPrice(199);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handlePayment = () => {
        // Placeholder for real payment gateway integration
        alert(`Proceeding to pay ₹${price} via ${user.paymentMethod}.`);
        if(!userData?.store){
            navigate("/create-store")
        }
        navigate("/seller/dashboard")
    };

    return (
        <div data-theme="light" className="container mx-auto px-4 py-10">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Complete Your Subscription</h1>

                {/* Plan Selection */}
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Choose a Subscription Plan</label>
                    <select
                        value={selectedPlan}
                        onChange={handlePlanChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700"
                    >
                        <option value="basic">Basic - ₹99/month</option>
                        <option value="premium">Premium - ₹199/month</option>
                    </select>
                </div>

                {/* User Info */}
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Your Information</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={user.name}
                        onChange={handleInputChange}
                        className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={handleInputChange}
                        className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={user.phone}
                        onChange={handleInputChange}
                        className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Address Section */}
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Address</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Street Address"
                        value={user.address}
                        onChange={handleInputChange}
                        className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
                    />
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={user.city}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={user.state}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="text"
                            name="pincode"
                            placeholder="PIN Code"
                            value={user.pincode}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Payment Method</label>
                    <select
                        name="paymentMethod"
                        value={user.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700"
                    >
                        <option value="card">Credit/Debit Card</option>
                        <option value="upi">UPI</option>
                        <option value="netbanking">Net Banking</option>
                    </select>
                </div>

                {/* Summary */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm">
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-600">Subscription Plan:</span>
                            <span className="font-medium text-gray-800 capitalize">{selectedPlan}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-600">Plan Price:</span>
                            <span className="font-medium text-gray-800">₹{price}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-4 mt-4">
                            <span className="text-lg font-semibold text-gray-700">Total</span>
                            <span className="text-lg font-bold text-black">₹{price}</span>
                        </div>
                    </div>
                </div>


                {/* Pay Button */}
                <button
                    onClick={handlePayment}
                    className="w-full bg-orange-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-orange-700 transition duration-300 mb-4"
                >
                    Proceed to Pay
                </button>

                <Link to="/" className="block text-center text-sm text-gray-500 hover:underline">← Back to Home</Link>
            </div>
        </div>
    );
};

export default Checkout;
