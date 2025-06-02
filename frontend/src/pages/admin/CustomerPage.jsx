import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAdminAuth } from "../../store/adminAuth";

const CustomerPage = () => {
  const { id } = useParams();
  const { adminToken } = useAdminAuth();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCustomerData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/get-customer-data/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.data)
        setCustomer(responseData.data);
      }
    } catch (error) {
      console.error("Failed to fetch customer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getCustomerData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">👤 Customer Profile</h1>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <h3 className="font-medium text-lg">{customer?.name || "N/A"}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <h3 className="font-medium text-lg">{customer?.email}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <h3 className="font-medium text-lg">{customer?.phoneNo || "N/A"}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">Store Name</p>
            <h3 className="font-medium text-lg">{customer?.store?.name}</h3>
          </div>
        </div>

        {/* Address Info */}
        <div className="grid md:grid-cols-3 gap-4 border-t pt-4">
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <h3 className="font-medium text-md">{customer?.address || "N/A"}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">State</p>
            <h3 className="font-medium text-md">{customer?.state || "N/A"}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <h3 className="font-medium text-md">{customer?.country || "N/A"}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pin Code</p>
            <h3 className="font-medium text-md">{customer?.pinCode || "N/A"}</h3>
          </div>
        </div>

        {/* Coupons Used */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🎟️ Coupons Used</h3>
          {customer?.couponsUsed?.length > 0 ? (
            <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
              {customer.couponsUsed.map((coupon, index) => (
                <li key={index}>{coupon}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No coupons used.</p>
          )}
        </div>

        {/* Orders */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📦 Orders</h3>
          {customer?.orders?.length > 0 ? (
            <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
              {customer.orders.map((orderId, index) => (
                <li key={index} className="hover:font-bold"><Link to={`/admin/orders/${orderId}`}>{orderId}</Link></li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No orders placed yet.</p>
          )}
        </div>

        {/* Store Info */}
        {customer?.store && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">Associated Store ID</p>
            <h3 className="font-medium text-md">{customer?.store?._id}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
