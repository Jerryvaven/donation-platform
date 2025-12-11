'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/user/Navbar';
import { FaChevronLeft, FaCheck } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
export default function OrderConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const sessionId = searchParams.get('session_id');
    const { clearCart } = useCart();
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('adminDarkMode');
            return saved ? JSON.parse(saved) : true;
        }
        return true;
    });
    const [mounted, setMounted] = useState(false);
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
    }, [darkMode]);
    useEffect(() => {
        setMounted(true);
    }, []);
    useEffect(() => {
        const verifyPaymentAndFetchOrder = async () => {
            if (!orderId) {
                setError('No order ID provided');
                setLoading(false);
                return;
            }
            try {
                console.log('=== ORDER CONFIRMATION LOAD START ===');
                console.log('orderId:', orderId);
                console.log('Calling verify-session endpoint...');
                const verifyResponse = await fetch('/api/stripe/verify-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId,
                        sessionId,
                    }),
                });
                const verifyData = await verifyResponse.json();
                console.log('Verify response:', { status: verifyResponse.status, data: verifyData });
                if (!verifyResponse.ok) {
                    console.warn('Payment verification warning:', verifyData.error);
                }
                else {
                    console.log('Payment verified:', verifyData);
                }
                console.log('Fetching order details...');
                const response = await fetch(`/api/orders?id=${orderId}`);
                const data = await response.json();
                console.log('Order details response:', { status: response.status, paymentStatus: data.data?.payment_status });
                if (!response.ok || !data.data) {
                    throw new Error('Failed to fetch order details');
                }
                console.log('=== ORDER CONFIRMATION LOAD END ===');
                setOrderDetails(data.data);
                clearCart();
            }
            catch (err: any) {
                console.log('Error verifying payment:', err);
                setError(err.message || 'Failed to verify payment or load order details');
            }
            finally {
                setLoading(false);
            }
        };
        verifyPaymentAndFetchOrder();
    }, [orderId, sessionId]);
    if (!mounted) {
        return null;
    }
    if (error && !loading) {
        return (<div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[#D4AF37] mb-8 hover:text-[#E5C158]">
            <FaChevronLeft size={16}/>
            Back to Home
          </button>
          <div className={`text-center py-16 rounded-lg ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
            <p className={`text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
          </div>
        </div>
      </div>);
    }
    if (loading) {
        return (<div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className={`text-center py-16 rounded-lg ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
            <div className="inline-block h-8 w-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"/>
          </div>
        </div>
      </div>);
    }
    return (<div className={`min-h-screen transition-colors ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[#D4AF37] mb-8 hover:text-[#E5C158]">
          <FaChevronLeft size={16}/>
          Back to Home
        </button>

        <div className={`rounded-lg p-8 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <FaCheck size={40} className="text-white"/>
            </div>
          </div>

          
          <h1 className={`text-3xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Payment Successful!
          </h1>
          <p className={`text-center mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Thank you for your order. Your payment has been processed successfully.
          </p>

          
          <div className={`p-6 rounded-lg mb-8 ${darkMode ? 'bg-[#242424]' : 'bg-gray-50'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Order Details
            </h2>

            <div className="space-y-3 text-sm">
              <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>Order ID:</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'} style={{ fontFamily: 'monospace' }}>
                  {orderId}
                </span>
              </div>

              <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>Customer Name:</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                  {orderDetails.first_name} {orderDetails.last_name}
                </span>
              </div>

              <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>Email:</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{orderDetails.email}</span>
              </div>

              <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>Phone:</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{orderDetails.phone}</span>
              </div>

              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'} pt-3 mt-3`}>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Shipping Address
                </h3>
                <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <p>{orderDetails.shipping_address}</p>
                  <p>{orderDetails.shipping_city}, {orderDetails.shipping_state} {orderDetails.shipping_zip_code}</p>
                  <p>{orderDetails.shipping_country}</p>
                </div>
              </div>
            </div>
          </div>

          
          <div className={`p-6 rounded-lg mb-8 ${darkMode ? 'bg-[#242424]' : 'bg-gray-50'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Items Ordered
            </h2>

            <div className="space-y-3">
              {orderDetails.items?.map((item: any) => (<div key={item.id} className={`flex justify-between items-start pb-3 ${darkMode ? 'border-gray-700' : 'border-gray-300'} border-b last:border-b-0 last:pb-0`}>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.product_name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      SKU: {item.product_sku} | Qty: {item.quantity}
                    </p>
                  </div>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${item.line_total.toFixed(2)}
                  </p>
                </div>))}
            </div>
          </div>

          
          <div className={`p-6 rounded-lg mb-8 ${darkMode ? 'bg-[#242424]' : 'bg-gray-50'}`}>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                  ${orderDetails.subtotal?.toFixed(2)}
                </span>
              </div>

              {orderDetails.shipping_cost > 0 && (<div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Shipping:</span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                    ${orderDetails.shipping_cost?.toFixed(2)}
                  </span>
                </div>)}

              {orderDetails.tax > 0 && (<div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Tax:</span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                    ${orderDetails.tax?.toFixed(2)}
                  </span>
                </div>)}

              {orderDetails.discount_amount > 0 && (<div className="flex justify-between text-green-500">
                  <span>Discount:</span>
                  <span>-${orderDetails.discount_amount?.toFixed(2)}</span>
                </div>)}

              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'} pt-3 flex justify-between text-lg font-bold`}>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>Total Paid:</span>
                <span className="text-[#D4AF37]">${orderDetails.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          
          <div className={`p-4 rounded-lg mb-8 text-center ${darkMode ? 'bg-green-900 bg-opacity-30 text-green-300' : 'bg-green-50 text-green-800'}`}>
            <p className="font-semibold">
              Payment Status: {orderDetails.payment_status === 'COMPLETED' ? '✓ Completed' : orderDetails.payment_status}
            </p>
          </div>

          
          <div className="flex gap-4">
            <button onClick={() => router.push('/')} className="flex-1 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold py-3 rounded-lg transition-colors">
              Continue Shopping
            </button>
          </div>

          
          <div className={`mt-8 p-4 rounded-lg text-center ${darkMode ? 'bg-[#242424]' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              A confirmation email has been sent to <strong>{orderDetails.email}</strong>
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You can track your order status in your account dashboard
            </p>
          </div>
        </div>
      </div>
    </div>);
}
