'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/user/Navbar';
import { FaChevronLeft } from 'react-icons/fa';
function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [darkMode, setDarkMode] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
    }, [darkMode]);
    useEffect(() => {
        const redirectToStripe = async () => {
            if (!orderId) {
                setError('No order ID provided');
                setLoading(false);
                return;
            }
            try {
                const response = await fetch('/api/stripe/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId,
                    }),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to create checkout session');
                }
                if (data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                }
            }
            catch (err: any) {
                console.log('Error creating checkout session:', err);
                setError(err.message || 'Failed to redirect to payment');
                setLoading(false);
            }
        };
        redirectToStripe();
    }, [orderId]);
    if (loading) {
        return (<div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <div className="max-w-2xl mx-auto px-4 py-8 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="inline-block h-12 w-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"/>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Redirecting to Stripe payment...
            </p>
          </div>
        </div>
      </div>);
    }
    if (error) {
        return (<div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[#D4AF37] mb-8 hover:text-[#E5C158]">
            <FaChevronLeft size={16}/>
            Back
          </button>
          <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
            <p className={`text-lg mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
            <button onClick={() => router.back()} className="bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold py-2 px-6 rounded-lg">
              Try Again
            </button>
          </div>
        </div>
      </div>);
    }
    return null;
}
export default function PaymentPage() {
    return (<Suspense fallback={<PaymentPageLoading />}>
      <PaymentContent />
    </Suspense>);
}
function PaymentPageLoading() {
    return (<div className="min-h-screen bg-[#121212]">
      <div className="max-w-2xl mx-auto px-4 py-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"/>
          <p className="text-lg text-gray-300">
            Loading payment...
          </p>
        </div>
      </div>
    </div>);
}
