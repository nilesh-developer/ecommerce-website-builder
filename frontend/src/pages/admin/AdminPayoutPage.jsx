import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Check, X, Clock, AlertCircle, Download, User, Store, IndianRupee, Plus, Calendar, CreditCard, Wallet } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const AdminPayoutPage = () => {
    const [selectedPayout, setSelectedPayout] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'view', 'edit', 'transaction'
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [transactionDetails, setTransactionDetails] = useState({
        paymentTransactionNo: '',
        paymentMethod: '',
        notes: ''
    });
    const [isLoading, setIsLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)

    const [payoutRequests, setPayoutRequests] = useState([]);

    async function getAllPayoutData() {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payout/get-all-payouts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const responseData = await response.json()
                setPayoutRequests(responseData.data)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getAllPayoutData()
    }, [])

    if (isLoading) {
        return <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'requested':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-orange-100 text-orange-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredPayouts = payoutRequests.filter(payout => {
        const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
        const matchesSearch = payout.store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payout.store.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleStatusUpdate = async (payoutId, newStatus) => {
        setPayoutRequests(prev => prev.map(payout =>
            payout._id === payoutId
                ? { ...payout, status: newStatus, lastUpdated: new Date().toISOString() }
                : payout
        ));
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payout/update-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    payoutId,
                    newStatus
                })
            })
            if (response.ok) {
                const responseData = await response.json()
                toast.success(`Payout Request ${newStatus}`)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    };

    const handleTransactionUpdate = async (payoutId) => {
        setPayoutRequests(prev => prev.map(payout =>
            payout._id === payoutId
                ? {
                    ...payout,
                    ...transactionDetails,
                    status: 'processing',
                    lastUpdated: new Date().toISOString()
                }
                : payout
        ));
        try {
            setBtnLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payout/add-transaction-details`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    payoutId,
                    ...transactionDetails
                })
            })
            if (response.ok) {
                const responseData = await response.json()
                toast.success(`Added Transaction Details`)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setBtnLoading(false)
        }
        setShowModal(false);
        setTransactionDetails({ paymentTransactionNo: '', paymentMethod: '', notes: '' });
    };

    const openModal = (type, payout = null) => {
        setModalType(type);
        setSelectedPayout(payout);
        if (payout && type === 'transaction') {
            setTransactionDetails({
                paymentTransactionNo: payout.paymentTransactionNo || '',
                paymentMethod: payout.paymentMethod || '',
                notes: payout.notes || ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPayout(null);
        setTransactionDetails({ paymentTransactionNo: '', paymentMethod: '', notes: '' });
    };

    const getStatusStats = () => {
        const stats = payoutRequests.reduce((acc, payout) => {
            acc[payout.status] = (acc[payout.status] || 0) + 1;
            acc.totalAmount += payout.amount;
            return acc;
        }, { totalAmount: 0 });
        return stats;
    };

    const stats = getStatusStats();

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.text('All Payouts', 14, 15);

        const tableColumn = [
            'STORE',
            'AMOUNT',
            'ORDERS',
            'REQUEST DATE',
            'PAYMENT METHOD',
            'TRANSACTION NO',
            'STATUS',
        ];

        const tableRows = [];

        payoutRequests.forEach(payout => {
            const payoutData = [
                payout.store._id,
                "Rs. " + payout.amount,
                payout.orders.length,
                formatDate(payout.createdAt),
                payout.paymentMethod ? payout.paymentMethod.toUpperCase() : "-",
                payout.paymentTransactionNo ? payout.paymentTransactionNo : "-",
                payout.status.toUpperCase()
            ];
            tableRows.push(payoutData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 7, cellWidth: 'wrap' },
            headStyles: { fillColor: [22, 160, 133] }, // teal header
        });

        doc.save(`Payouts.pdf`);
    };

    // Modal Components
    const ViewModal = ({ payout }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Payout Request Details</h2>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Store className="w-5 h-5 mr-2 text-blue-600" />
                                Store Information
                            </h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Name:</span> {payout.store.name}</p>
                                <p><span className="font-medium">Email:</span> {payout.store.email}</p>
                                <p><span className="font-medium">Phone:</span> {payout.store.phoneNo}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <IndianRupee className="w-5 h-5 mr-2 text-green-600" />
                                Payout Details
                            </h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Amount:</span> {formatCurrency(payout.amount)}</p>
                                <p><span className="font-medium">Status:</span>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                    </span>
                                </p>
                                <p><span className="font-medium">Request Date:</span> {formatDate(payout.createdAt)}</p>
                                <p><span className="font-medium">Last Updated:</span> {formatDate(payout.updatedAt)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Wallet className="w-5 h-5 mr-2 text-blue-600" />
                                Store Payment Details
                            </h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Type:</span> {payout.store.paymentDetails.type.toUpperCase()}</p>
                                {payout.store.paymentDetails.type.toUpperCase() === "UPI" ?
                                    <p><span className="font-medium">UPI ID:</span> {payout.store.paymentDetails.upiId}</p>
                                    :
                                    <>
                                        <p><span className="font-medium">Bank Name:</span> {payout.store.paymentDetails.bankName}</p>
                                        <p><span className="font-medium">IFSC:</span> {payout.store.paymentDetails.ifsc}</p>
                                        <p><span className="font-medium">Account No:</span> {payout.store.paymentDetails.accountNo}</p>
                                        <p><span className="font-medium">Account Holder Name:</span> {payout.store.paymentDetails.accountHolderName}</p>
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                    {payout.paymentMethod && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                                Payment Information
                            </h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Method:</span> {payout.paymentMethod}</p>
                                <p><span className="font-medium">Transaction No:</span> {payout.paymentTransactionNo}</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white border rounded-lg">
                        <h3 className="font-semibold text-gray-900 p-4 border-b">Associated Orders</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Number</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Payable</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {payout.orders.map(order => (
                                        <tr key={order._id}>
                                            <td className="px-4 py-3 text-sm text-gray-900">{order._id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(order.totalPrice)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(order.commission)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(order.payoutAmount)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{order.status.toUpperCase()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const TransactionModal = ({ payout }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Add Transaction Details</h2>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                            <select
                                value={transactionDetails.paymentMethod}
                                onChange={(e) => setTransactionDetails(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">Select Payment Method</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="UPI">UPI</option>
                                <option value="Wallet">Wallet</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Number</label>
                            <input
                                type="text"
                                value={transactionDetails.paymentTransactionNo}
                                onChange={(e) => setTransactionDetails(prev => ({ ...prev, paymentTransactionNo: e.target.value }))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Enter transaction number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                            <textarea
                                value={transactionDetails.notes}
                                onChange={(e) => setTransactionDetails(prev => ({ ...prev, notes: e.target.value }))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                rows="3"
                                placeholder="Add any notes..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleTransactionUpdate(payout._id)}
                            disabled={!transactionDetails.paymentMethod || !transactionDetails.paymentTransactionNo}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {!btnLoading ? "Update Transaction" : <span className="loading loading-spinner loading-md"></span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div data-theme="light" className="min-h-screen bg-gray-50 px-3 py-3 pb-28 lg:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payout Management</h1>
                            <p className="text-gray-600">Manage seller payout requests and transactions</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={generatePDF} className="flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors">
                                <Download className="w-4 h-4 mr-2" />
                                Payouts
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <Clock className="w-8 h-8 text-yellow-600 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Pending Requests</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.requested || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <AlertCircle className="w-8 h-8 text-orange-600 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Processing</p>
                                    <p className="text-2xl font-bold text-orange-600">{stats.processing || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <Check className="w-8 h-8 text-green-600 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.completed || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <IndianRupee className="w-8 h-8 text-blue-600 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalAmount)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by store name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2"
                        >
                            <option value="all">All Status</option>
                            <option value="requested">Requested</option>
                            <option value="accepted">Accepted</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Payout Requests Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Store</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPayouts.map(payout => (
                                    <tr key={payout._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {payout?.store?.favicon ?
                                                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                                                            <img src={payout?.store?.favicon} alt="Logo" />
                                                        </div>
                                                        :
                                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                            <Store className="w-5 h-5 text-gray-600" />
                                                        </div>
                                                    }
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{payout.store.name}</div>
                                                    <div className="text-sm text-gray-500">{payout.store.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{formatCurrency(payout.amount)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{payout.orders.length} orders</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payout.status)}`}>
                                                {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(payout.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {payout.paymentMethod || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => openModal('view', payout)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                {payout.status === 'requested' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(payout._id, 'accepted')}
                                                            className="text-green-600 hover:text-green-900 p-1 rounded"
                                                            title="Accept Request"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(payout._id, 'rejected')}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            title="Reject Request"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}

                                                {(payout.status === 'accepted' || payout.status === 'processing') && (
                                                    <button
                                                        onClick={() => openModal('transaction', payout)}
                                                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                                                        title="Add Transaction Details"
                                                    >
                                                        <CreditCard className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {payout.status === 'processing' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(payout._id, 'completed')}
                                                        className="text-green-600 hover:text-green-900 p-1 rounded"
                                                        title="Mark as Completed"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredPayouts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-2">No payout requests found</div>
                            <div className="text-gray-400">Try adjusting your search or filter criteria</div>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {showModal && modalType === 'view' && selectedPayout && (
                    <ViewModal payout={selectedPayout} />
                )}

                {showModal && modalType === 'transaction' && selectedPayout && (
                    <TransactionModal payout={selectedPayout} />
                )}
            </div>
        </div>
    );
};

export default AdminPayoutPage;