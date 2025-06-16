import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStoreData from '../../Hooks/useStoreData';
import { RequestPayoutModal } from '../../components/Seller';
import toast from 'react-hot-toast';
import dateFormat from 'dateformat';
import { useEffect } from 'react';

const SellerPayoutPage = () => {
  const { user, loading } = useStoreData();
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [payouts, setPayouts] = useState([])
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const allTransactions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payout/get-payouts/${user?.store?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (response.ok) {
        const data = await response.json();
        setPayouts(data.data)
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRequestPayout = () => {
    setIsModalOpen(true);
  };

  const handleConfirmPayout = async () => {
    setIsModalOpen(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payout/request-payout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          storeId: user?.store?._id
        })
      })
      if (response.ok) {
        toast.success("Payout requested successfully!");
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (user?.store?._id) {
      allTransactions()
    }
  }, [user])

  if (loading) {
    return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
  }


  return (
    <section data-theme="light" className='bg-white flex-grow h-full pb-14 lg:pb-8'>
      <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
        <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>Payouts</h2>

        {/* Payout Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900 mb-2">₹{user?.store?.pendingPayout?.amount}</div>
              <div className="text-gray-500">Payable Payout</div>
            </div>
            {user?.store?.pendingPayout?.amount === 0 ?
              <button onClick={handleRequestPayout} disabled className="w-full bg-gray-500 text-white font-medium py-2 px-4 rounded transition-colors">
                REQUEST
              </button>
              :
              <button onClick={handleRequestPayout} className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors">
                REQUEST
              </button>
            }
          </div>

          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">₹0</div>
              <div className="text-gray-500 text-sm">
                Available after order is delivered
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                <CreditCard className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <button onClick={() => navigate("/seller/add-payment-details")} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors">
              EDIT PAYMENT DETAIL
            </button>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to redeem payout?</h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                <span>To initiate your payout, please click <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">REQUEST</span> button</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                <span>Your payout will be processed the next Friday.</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                <span>Repeat this process for your future payouts.</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How does Payout work?</h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                <span>Eazzy verifies each payout before processing.</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                <span>Only the delivered products are eligible for payout.</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                <span>Payout is processed every week on Friday.</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Last Payouts Table */}
        <div className="bg-white rounded-lg border border-zinc-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Last Payouts</h3>
              <div className="relative hidden lg:block ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. of Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payouts.length !== 0 ?
                  payouts.map((payout, idx) => (
                    <tr key={idx}>
                      <td colSpan="1" className="px-6 py-3 text-gray-800">
                        {dateFormat(payout?.createdAt, "dd mmm yyyy")}
                      </td>
                      <td colSpan="1" className="px-6 py-3 text-gray-800">
                        Rs. {payout?.amount}
                      </td>
                      <td colSpan="1" className="px-6 py-3 text-gray-800">
                        {payout?.orders?.length}
                      </td>
                      <td colSpan="1" className="px-6 py-3 text-gray-800">
                        {payout?.status?.toUpperCase()}
                      </td>
                      <td colSpan="1" className="px-6 py-3 text-gray-800">
                        <button onClick={() =>  navigate(`${payout._id}`)} className='bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md'>View Details</button>
                      </td>
                    </tr>
                  ))
                  :
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-1 rounded hover:bg-gray-100 disabled:opacity-50" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-700">-</span>
                <button className="p-1 rounded hover:bg-gray-100 disabled:opacity-50" disabled>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RequestPayoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmPayout}
      />
    </section>
  );
};

export default SellerPayoutPage;