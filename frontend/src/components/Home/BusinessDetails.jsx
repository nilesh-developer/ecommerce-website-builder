import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const BusinessDetails = () => {
  const { storename } = useParams();
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    address: '',
    mobileNo: ''
  });
  const navigate = useNavigate()
  const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty & Health",
    "Sports & Outdoors",
    "Toys & Games",
    "Automotive",
    "Books",
    "Groceries",
    "Pet Supplies",
    "Office Supplies",
    "Baby Products",
    "Jewelry & Watches",
    "Music & Instruments",
    "Movies & TV",
    "Video Games",
    "Garden & Outdoor",
    "Tools & Hardware",
    "Furniture",
    "Art & Crafts",
    "Stationery",
    "Lighting",
    "Health & Personal Care",
    "Travel Accessories",
    "Gift Cards",
    "Industrial & Scientific",
    "Software",
    "Luggage & Travel Gear",
    "Building Materials",
    "Hobbies & Collectibles"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/businessdetails`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ storename, ...formData })
      })

      const responseData = await response.json()

      if (response.ok) {
          toast.success("Store created successfully")
          navigate("/seller/dashboard")
      } else {
          toast.error("Something went wrong")
      }
  } catch (error) {
      console.log(error)
  }
  };

  return (
    <div className="flex lg:items-center justify-center h-screen bg-white mt-10">
      <div data-theme="light" className="bg-white px-5 py-8 mt-4 lg:mt-0 rounded-lg w-full max-w-xl">
        <h2 className="text-4xl font-bold text-black text-center mb-8">Business Details</h2>
        <form onSubmit={handleSubmit}>

          {/* Business Name Field */}
          <div className="mb-4">
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
              Business Name:
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Enter your business name"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            >
              <option value="" disabled>Select category</option>
              {categories.map((category) => (
                <option value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Address Field */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Enter your address"
              required
            />
          </div>

          {/* Mobile Number Field */}
          <div className="mb-4">
            <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">
              Mobile Number:
            </label>
            <input
              type="tel"
              id="mobileNo"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Enter your mobile number"
              pattern="[0-9]{10}"
              required
            />
          </div>

          {/* Next Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-lg font-bold text-white py-4 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessDetails;
