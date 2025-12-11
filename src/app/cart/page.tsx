'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/user/Navbar';
import { useCart } from '@/context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaChevronLeft, FaChevronRight, FaShoppingCart, FaTruck, FaLock, FaCheck } from 'react-icons/fa';
import Image from 'next/image';
export default function CartPage() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('adminDarkMode');
            return saved ? JSON.parse(saved) : true;
        }
        return true;
    });
    const [mounted, setMounted] = useState(false);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
    const { cart, removeFromCart, updateQuantity } = useCart();
    const router = useRouter();
    useEffect(() => {
        localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
    }, [darkMode]);
    useEffect(() => {
        if (mounted) {
            if (darkMode) {
                document.body.style.backgroundColor = "#121212";
                document.documentElement.style.backgroundColor = "#121212";
            }
            else {
                document.body.style.backgroundColor = "";
                document.documentElement.style.backgroundColor = "";
            }
        }
    }, [darkMode, mounted]);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }
    const totalPrice = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', '').replace(',', ''));
        return sum + (price * item.quantity);
    }, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    return (<div className={`min-h-screen transition-colors ${darkMode ? "bg-[#121212]" : "bg-gray-50"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Shopping Cart
        </h1>

        {cart.length === 0 ? (<div className={`text-center py-16 rounded-lg ${darkMode ? "bg-[#1E1E1E]" : "bg-white"}`}>
            <FaShoppingCart className="mx-auto mb-4 text-4xl text-[#D4AF37]"/>
            <p className={`text-xl mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Your cart is empty
            </p>
            <button onClick={() => router.back()} className="bg-[#D4AF37] hover:bg-[#E5C158] text-black px-6 py-2 rounded-lg transition-colors font-semibold flex items-center gap-2 justify-center mx-auto">
              <FaChevronLeft size={16}/>
              Continue Shopping
            </button>
          </div>) : (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-1">
              {cart.length > 0 && (<div className={`rounded-lg p-6 sticky top-4 ${darkMode ? "bg-[#1E1E1E]" : "bg-white"}`}>
                  <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Product Preview
                  </h2>
                  
                  
                  <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                    <Image src={cart[currentPreviewIndex].image} alt={cart[currentPreviewIndex].name} fill className="object-cover"/>
                    
                    
                    {cart.length > 1 && (<>
                        <button onClick={() => setCurrentPreviewIndex((prev) => (prev === 0 ? cart.length - 1 : prev - 1))} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all" title="Previous product">
                          <FaChevronLeft size={16}/>
                        </button>
                        <button onClick={() => setCurrentPreviewIndex((prev) => (prev === cart.length - 1 ? 0 : prev + 1))} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all" title="Next product">
                          <FaChevronRight size={16}/>
                        </button>
                      </>)}
                    
                    
                    {cart.length > 1 && (<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {cart.map((_, index) => (<button key={index} onClick={() => setCurrentPreviewIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentPreviewIndex ? 'bg-[#D4AF37] w-6' : 'bg-white bg-opacity-60'}`} title={`Product ${index + 1}`}/>))}
                      </div>)}
                  </div>
                  
                  <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} pt-4`}>
                    <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Product Name
                    </p>
                    <p className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {cart[currentPreviewIndex].name}
                    </p>
                    
                    <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Unit Price
                    </p>
                    <p className="text-2xl font-bold text-[#D4AF37] mb-4">
                      {cart[currentPreviewIndex].price}
                    </p>

                    <div className={`rounded-lg p-4 ${darkMode ? "bg-[#242424]" : "bg-gray-50"}`}>
                      <p className={`text-xs mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        ITEMS IN CART
                      </p>
                      <p className="text-3xl font-bold text-[#D4AF37]">
                        {totalItems}
                      </p>
                    </div>
                    
                    
                    {cart.length > 1 && (<div className={`mt-4 p-3 rounded-lg text-center ${darkMode ? "bg-[#242424]" : "bg-gray-50"}`}>
                        <p className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          PRODUCT
                        </p>
                        <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {currentPreviewIndex + 1} of {cart.length}
                        </p>
                      </div>)}
                  </div>
                </div>)}
            </div>

            
            <div className="lg:col-span-2">
              <div className={`rounded-lg p-6 ${darkMode ? "bg-[#1E1E1E]" : "bg-white"}`}>
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Order Summary
                </h2>

                
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (<div key={item.id} className={`flex items-center gap-4 p-4 rounded-lg border ${darkMode
                    ? "bg-[#242424] border-gray-700"
                    : "bg-gray-50 border-gray-200"}`}>
                      
                      <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover"/>
                      </div>

                      
                      <div className="flex-1">
                        <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {item.name}
                        </p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {item.price} each
                        </p>
                        <p className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Total: ${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={`p-2 rounded transition-colors ${darkMode
                    ? "bg-[#D4AF37] hover:bg-[#E5C158] text-black"
                    : "bg-[#D4AF37] hover:bg-[#E5C158] text-black"}`}>
                          <FaMinus size={14}/>
                        </button>
                        <span className={`w-8 text-center font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={`p-2 rounded transition-colors ${darkMode
                    ? "bg-[#D4AF37] hover:bg-[#E5C158] text-black"
                    : "bg-[#D4AF37] hover:bg-[#E5C158] text-black"}`}>
                          <FaPlus size={14}/>
                        </button>
                      </div>

                      
                      <button onClick={() => removeFromCart(item.id)} className="p-2 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-colors" title="Remove from cart">
                        <FaTrash size={16}/>
                      </button>
                    </div>))}
                </div>

                
                <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} pt-6 mb-6`}>
                  <div className="flex justify-between mb-3">
                    <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                      Subtotal ({totalItems} items)
                    </span>
                    <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className={`flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaTruck size={16}/>
                      Shipping
                    </span>
                    <span className={`font-semibold text-green-500 flex items-center gap-1`}>
                      <FaCheck size={14}/>
                      FREE
                    </span>
                  </div>
                  <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} pt-3 flex justify-between`}>
                    <span className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Total
                    </span>
                    <span className="text-2xl font-bold text-[#D4AF37]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                
                <button onClick={() => router.push('/checkout')} className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2">
                  <FaLock size={16}/>
                  Proceed to Checkout
                </button>
                <button onClick={() => router.back()} className={`w-full py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${darkMode
                ? "bg-[#242424] hover:bg-[#333333] text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"}`}>
                  <FaChevronLeft size={16}/>
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>)}
      </div>
    </div>);
}
