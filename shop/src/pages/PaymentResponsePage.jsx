import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';

export default function PaymentResponsePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/payment-status/${orderId}`);
        if (res.data?.paymentProcess === 'completed') {
          setStatus('success');
          setTimeout(() => navigate('/payment-success'), 2000);
        } else {
          setStatus('failed');
          setTimeout(() => navigate('/payment-failed'), 2000);
        }
      } catch (err) {
        console.error(err);
        setStatus('failed');
        setTimeout(() => navigate('/payment-failed'), 2000);
      }
    };

    if (orderId) checkPaymentStatus();
    else setStatus('failed');
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      {status === 'loading' && (
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="mt-4 text-lg font-medium">Verifying your payment...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center text-green-600">
          <CheckCircle2 className="w-16 h-16" />
          <h1 className="mt-4 text-2xl font-semibold">Payment Successful!</h1>
          <p className="mt-2 text-gray-700">Redirecting you to your confirmation page...</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="flex flex-col items-center text-red-600">
          <XCircle className="w-16 h-16" />
          <h1 className="mt-4 text-2xl font-semibold">Payment Failed</h1>
          <p className="mt-2 text-gray-700">Redirecting you to the failure page...</p>
        </div>
      )}
    </div>
  );
} 
