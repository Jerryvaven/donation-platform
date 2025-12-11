import { Suspense } from 'react';
import OrderConfirmationContent from './order-confirmation-content';
function OrderConfirmationFallback() {
    return (<div className="min-h-screen bg-[#121212]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-16 rounded-lg bg-[#1E1E1E]">
          <div className="inline-block h-8 w-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"/>
        </div>
      </div>
    </div>);
}
export default function OrderConfirmationPage() {
    return (<Suspense fallback={<OrderConfirmationFallback />}>
      <OrderConfirmationContent />
    </Suspense>);
}
