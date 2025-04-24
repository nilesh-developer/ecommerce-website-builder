import React, { useState } from 'react';
import useStoreData from '../../Hooks/useStoreData';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddCoupon = () => {
  const { user, loading } = useStoreData();
  const navigate = useNavigate()
  const [type, setType] = useState("percentage")
  const [coupon, setCoupon] = useState({
    code: "",
    perCustomer: "",
    discountPercent: "",
    flatDiscount: "",
    minimumOrder: "",
    maximumDiscount: "",
    validFromDate: "",
    validFromTime: "12:00:00",
    validTillDate: "",
    validTillTime: "01:00:00"
  })
  const [status, setStatus] = useState(true)

  if (loading) {
    return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>;
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCoupon({
      ...coupon,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    Object.keys(coupon).forEach((key) => formData.append(key, coupon[key]));
    formData.append("storeId", user.store._id);
    formData.append("status", status);
    formData.append("type", type);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/coupon/create`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success(response.data.message);
      setCoupon({
        code: "",
        perCustomer: "",
        discountPercent: "",
        flatDiscount: "",
        minimumOrder: "",
        maximumDiscount: "",
        validFromDate: "",
        validFromTime: "12:00:00",
        validTillDate: "",
        validTillTime: "01:00:00"
      })
      setType("percentage")
      setStatus(true)
      navigate("../coupon")
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="bg-white lg:bg-gray-100 p-4 lg:p-10 lg:min-h-screen h-full lg:mb-0 mb-20">
      <div className="max-w-3xl mx-auto p-2 lg:p-6 bg-white lg:shadow-md rounded-md">
        <h2 className="text-3xl font-extrabold mb-4">Create coupon</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="code">Coupon Code <span className="text-red-500">*</span></label>
            <input
              data-theme="light"
              type="text"
              id="code"
              name='code'
              onChange={handleInput}
              value={coupon.code}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              placeholder="Enter coupon code"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="uses-per-customer">Uses per customer <span className="text-red-500">*</span></label>
            <select
              data-theme="light"
              id="uses-per-customer"
              name='perCustomer'
              onChange={handleInput}
              value={coupon.perCustomer}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required>
              <option value="">Select uses per customer</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="uses-per-customer">Type <span className="text-red-500">*</span></label>
            <select
              data-theme="light"
              id="uses-per-customer"
              name='type'
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
          </div>
          <h3 className="text-xl tracking-tight font-bold mb-4">Coupon details</h3>
          {type === "percentage" ?
            <>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="discount-percent">Discount percent <span className="text-red-500">*</span></label>
                  <input
                    data-theme="light"
                    type="number"
                    id="discount-percent"
                    name='discountPercent'
                    value={coupon.discountPercent}
                    onChange={handleInput}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    placeholder="Enter percentage"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="min-order-value">Minimum order value <span className="text-red-500">*</span></label>
                  <input
                    data-theme="light"
                    type="number"
                    id="min-order-value"
                    name='minimumOrder'
                    onChange={handleInput}
                    value={coupon.minimumOrder}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    placeholder="₹ Enter amount"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="max-discount">Maximum discount</label>
                <input
                  data-theme="light"
                  type="number"
                  id="max-discount"
                  name='maximumDiscount'
                  onChange={handleInput}
                  value={coupon.maximumDiscount}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  placeholder="₹ Enter amount"
                />
              </div>
            </>
            :
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="flatDiscount">Flat Discount <span className="text-red-500">*</span></label>
                <input
                  data-theme="light"
                  type="number"
                  id="flatDiscount"
                  name='flatDiscount'
                  value={coupon.flatDiscount}
                  onChange={handleInput}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  placeholder="Enter discount amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="min-order-value">Minimum order value <span className="text-red-500">*</span></label>
                <input
                  data-theme="light"
                  type="number"
                  id="min-order-value"
                  name='minimumOrder'
                  onChange={handleInput}
                  value={coupon.minimumOrder}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  placeholder="₹ Enter amount"
                  required
                />
              </div>
            </div>
          }

          <h3 className="text-xl tracking-tight font-bold mb-4">Coupon functionality</h3>
          <h4 className='font-semibold tracking-tight text-gray-800 text-base'>Valid From</h4>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600" htmlFor="validFromDate">Date <span className="text-red-500">*</span></label>
              <input
                data-theme="light"
                type="date"
                id="validFromDate"
                name='validFromDate'
                onChange={handleInput}
                value={coupon.validFromDate}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                placeholder="Enter percentage"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700" htmlFor="validFromTime">Time <span className="text-red-500">*</span></label>
              <input
                data-theme="light"
                type="time"
                id="validFromTime"
                name='validFromTime'
                onChange={handleInput}
                value={coupon.validFromTime}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                placeholder="₹ Enter amount"
                required
              />
            </div>
          </div>
          <h4 className='font-semibold tracking-tight text-gray-800 text-base'>Valid Till</h4>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600" htmlFor="validTillDate">Date <span className="text-red-500">*</span></label>
              <input
                data-theme="light"
                type="date"
                id="validTillDate"
                name='validTillDate'
                onChange={handleInput}
                value={coupon.validTillDate}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                placeholder="Enter percentage"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700" htmlFor="validTillTime">Time <span className="text-red-500">*</span></label>
              <input
                data-theme="light"
                type="time"
                id="validTillTime"
                name='validTillTime'
                onChange={handleInput}
                value={coupon.validTillTime}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                placeholder="₹ Enter amount"
                required
              />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mr-3">Coupon Status</label>
            <input
              data-theme='light'
              id='status'
              name='status'
              type="checkbox"
              className="toggle toggle-success text-red-600"
              onChange={(e) => setStatus(!status)}
              checked={status}
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600">Create Coupon</button>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;
