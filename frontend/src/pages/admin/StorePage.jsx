import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdminAuth } from "../../store/adminAuth";

const StorePage = () => {
  const { id } = useParams();
  const { adminToken } = useAdminAuth();
  const [store, setStore] = useState();
  const [loading, setLoading] = useState(true);

  const getStoreData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/get-store-data/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setStore(responseData.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getStoreData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Banner */}
      <div
        className="w-full h-[250px] md:h-[350px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${store?.banner || store?.mobileBanner})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-5 left-5 text-white">
          <h1 className="text-3xl md:text-5xl font-bold capitalize drop-shadow">{store?.name}</h1>
          <p className="text-sm md:text-lg mt-1 drop-shadow">{store?.businessCategory}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Store Info */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {store?.logo && (
            <img
              src={store.logo}
              alt="Store Logo"
              className="h-20 w-20 rounded-full border shadow-lg"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold capitalize">{store?.businessName}</h2>
            <p className="text-gray-600 text-sm">{store?.bio}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6">
          {store?.address && (
            <div className="bg-gray-50 p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-700 mb-1">📍 Address</h3>
              <p className="text-sm text-gray-600">{store.address}</p>
            </div>
          )}
          {store?.phoneNo && (
            <div className="bg-gray-50 p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-700 mb-1">📞 Phone</h3>
              <p className="text-sm text-gray-600">{store.phoneNo}</p>
            </div>
          )}
          {store?.email && (
            <div className="bg-gray-50 p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-700 mb-1">📧 Email</h3>
              <p className="text-sm text-gray-600">{store.email}</p>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-4 text-sm">
          {store?.instagram && (
            <a
              href={store.instagram}
              className="text-blue-500 hover:underline hover:text-blue-700"
              target="_blank"
              rel="noreferrer"
            >
              📷 Instagram
            </a>
          )}
          {store?.facebook && (
            <a
              href={store.facebook}
              className="text-blue-700 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              📘 Facebook
            </a>
          )}
          {store?.youtube && (
            <a
              href={store.youtube}
              className="text-red-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              ▶️ YouTube
            </a>
          )}
          {store?.twitter && (
            <a
              href={store.twitter}
              className="text-sky-500 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              🐦 Twitter
            </a>
          )}
          {store?.whatsApp && (
            <a
              href={`https://wa.me/${store.whatsApp}`}
              className="text-green-500 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              💬 WhatsApp
            </a>
          )}
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Active Payment Options</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            {store?.cod && <li>Cash on Delivery</li>}
            {store?.cashfree && <li>Cashfree</li>}
            {store?.upiStatus && store?.upiId && (
              <li>UPI: {store.upiId} ({store.upiReceiverName})</li>
            )}
            {store?.paymentDetails?.type === "bankTransfer" && (
              <li>
                Bank: {store.paymentDetails.bankName}, A/C: {store.paymentDetails.accountNo}, IFSC: {store.paymentDetails.ifsc}
              </li>
            )}
          </ul>
        </div>

        {/* Policies & About */}
        <div className="space-y-6">
          {store?.returnPolicy && (
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-1">Return Policy</h4>
              <p className="text-sm text-gray-600">{store.returnPolicy}</p>
            </div>
          )}
          {store?.shippingPolicy && (
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-1">Shipping Policy</h4>
              <p className="text-sm text-gray-600">{store.shippingPolicy}</p>
            </div>
          )}
          {store?.aboutContent && (
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-1">About Us</h4>
              <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: store.aboutContent}} />
            </div>
          )}
        </div>

        {/* SEO Info */}
        {/* {(store?.metaTitle || store?.metaDescription) && (
          <div className="mt-4 text-xs text-gray-500 border-t pt-4">
            <p><strong>Meta Title:</strong> {store.metaTitle}</p>
            <p><strong>Meta Description:</strong> {store.metaDescription}</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default StorePage;
