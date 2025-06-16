import React, { useState } from 'react';
import { ArrowLeft, Store, CreditCard, Hash, DollarSign, Clock, CheckCircle, AlertCircle, Package, IndianRupee, CircleCheck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useRef } from 'react';

const SinglePayoutPage = () => {

    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [payout, setPayout] = useState({})
    const navigate = useNavigate()

    async function getPayoutData() {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payout/data/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const responseData = await response.json()
                setPayout(responseData.payout)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }
    console.log(payout)
    useEffect(() => {
        getPayoutData()
    }, [])

    if (isLoading) {
        return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>;
    }

    const downloadPDF = async () => {
        const input = document.getElementById('receipt');

        // Use html2canvas to convert full content into a canvas
        const canvas = await html2canvas(input, {
            scale: 2, // Better quality
            useCORS: true, // Load images from external sources if needed
            scrollY: -window.scrollY, // Prevents visible-only rendering
            windowWidth: document.documentElement.scrollWidth,
            windowHeight: document.documentElement.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/png');

        // Set up PDF page size
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save('full-content.pdf');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'requested':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'accepted':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'processing':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'requested':
                return <Clock className="w-4 h-4" />;
            case 'accepted':
                return <CheckCircle className="w-4 h-4" />;
            case 'processing':
                return <AlertCircle className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <div id='receipt' className="min-h-screen bg-gray-50 p-4 pb-16 lg:pb-8 lg:p-6">
            <div className="max-w-7xl lg:mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-6">
                        <button onClick={() => navigate("/seller/payouts")} className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Payouts
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payout Details</h1>
                            <p className="text-gray-600">Payout ID: {payout._id}</p>
                        </div>
                        <div className={`flex items-center px-4 py-2 rounded-full border ${getStatusColor(payout.status)}`}>
                            {getStatusIcon(payout.status)}
                            <span className="ml-2 font-medium capitalize">{payout.status}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Payout Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payout Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                                    <IndianRupee className="w-8 h-8 text-green-600 mr-4" />
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-2xl font-bold text-green-600">{formatCurrency(payout.amount)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                                    <Package className="w-8 h-8 text-blue-600 mr-4" />
                                    <div>
                                        <p className="text-sm text-gray-600">Orders Count</p>
                                        <p className="text-2xl font-bold text-blue-600">{payout.orders.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Store Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <Store className="w-5 h-5 mr-2" />
                                Store Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Store Name</label>
                                    <p className="text-gray-900">{payout.store.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Store ID</label>
                                    <p className="text-gray-900 font-mono text-sm">{payout.store._id}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                    <p className="text-gray-900">{payout.store.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                                    <p className="text-gray-900">{payout.store.phoneNo}</p>
                                </div>
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Associated Orders</h2>

                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivered Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {payout.orders.map((order) => (
                                                <tr key={order._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Link to={`/seller/orders/${order._id}`}><span className="font-medium text-blue-600">{order._id}</span></Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                                        {order.status.toUpperCase()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                                        {formatCurrency(order.totalPrice)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-red-600">
                                                        -{formatCurrency(order.commission)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">
                                                        {formatCurrency(order.payoutAmount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                        {formatDate(order.deliveryDate)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Payment Details */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Payment Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Payment Method</label>
                                    <p className="text-gray-900">{payout.paymentMethod}</p>
                                </div>
                                {payout.paymentTransactionNo && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1 items-center">
                                            <Hash className="w-4 h-4 mr-1" />
                                            Transaction Number
                                        </label>
                                        <p className="text-gray-900 font-mono text-sm break-all">{payout.paymentTransactionNo}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Payout Requested</p>
                                        <p className="text-sm text-gray-500">{formatDate(payout.createdAt)}</p>
                                    </div>
                                </div>

                                {payout.status !== "completed" ?
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">Status Updated</p>
                                            <p className="text-sm text-gray-500">{formatDate(payout.updatedAt)}</p>
                                        </div>
                                    </div>
                                    :
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <CircleCheck className="w-4 h-4 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">Completed</p>
                                            <p className="text-sm text-gray-500">{formatDate(payout.updatedAt)}</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                            <div className="space-y-3">
                                {/* {payout.status === 'requested' && (
                                    <>
                                        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors">
                                            Accept Payout
                                        </button>
                                        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors">
                                            Reject Payout
                                        </button>
                                    </>
                                )}
                                {payout.status === 'accepted' && (
                                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
                                        Start Processing
                                    </button>
                                )}
                                {payout.status === 'processing' && (
                                    <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors">
                                        Mark as Completed
                                    </button>
                                )} */}
                                <button onClick={downloadPDF} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors">
                                    Download Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SinglePayoutPage;