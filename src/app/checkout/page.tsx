'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/user/Navbar';
import { useCart } from '@/context/CartContext';
import { FaChevronLeft, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import type { CheckoutFormData } from '@/types';
export default function CheckoutPage() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('adminDarkMode');
            return saved ? JSON.parse(saved) : true;
        }
        return true;
    });
    const [mounted, setMounted] = useState(false);
    const [currentStep, setCurrentStep] = useState<'details' | 'address' | 'payment'>('details');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | null>(null);
    const [showOrderNotes, setShowOrderNotes] = useState(false);
    const [showBillingAddress, setShowBillingAddress] = useState(false);
    const { cart } = useCart();
    const router = useRouter();
    const [formData, setFormData] = useState<CheckoutFormData>({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        shippingAddress: '',
        shippingCity: '',
        shippingState: '',
        shippingZipCode: '',
        shippingCountry: 'United States',
        sameAsShipping: true,
        customerNotes: '',
        couponCode: '',
    });
    useEffect(() => {
        localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
    }, [darkMode]);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }
    if (cart.length === 0) {
        return (<div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button onClick={() => router.push('/cart')} className="flex items-center gap-2 text-[#D4AF37] mb-8">
            <FaChevronLeft size={16}/>
            Back to Cart
          </button>
          <div className={`text-center py-16 rounded-lg ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your cart is empty
            </p>
          </div>
        </div>
      </div>);
    }
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', '').replace(',', ''));
        return sum + price * item.quantity;
    }, 0);
    const total = subtotal - discountAmount;
    const handleInputChange = (field: keyof CheckoutFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const validateDetails = () => {
        if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone) {
            setError('Please fill in all customer details');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };
    const validateAddress = () => {
        if (!formData.shippingAddress ||
            !formData.shippingCity ||
            !formData.shippingState ||
            !formData.shippingZipCode) {
            setError('Please fill in all shipping address fields');
            return false;
        }
        if (!formData.sameAsShipping) {
            if (!formData.billingAddress ||
                !formData.billingCity ||
                !formData.billingState ||
                !formData.billingZipCode) {
                setError('Please fill in all billing address fields');
                return false;
            }
        }
        return true;
    };
    const handleCouponApply = async () => {
        if (!couponCode.trim()) {
            setError('Please enter a coupon code');
            return;
        }
        try {
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    couponCode: couponCode.toUpperCase(),
                    cartTotal: subtotal,
                    email: formData.email,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Invalid coupon code');
                return;
            }
            setDiscountAmount(data.coupon.discountAmount);
            setDiscountType(data.coupon.discountType as 'percentage' | 'fixed');
            setCouponApplied(true);
            setError('');
            setFormData((prev) => ({
                ...prev,
                couponCode: couponCode.toUpperCase(),
            }));
        }
        catch (err) {
            setError('Failed to validate coupon');
        }
    };
    const handleSubmitOrder = async () => {
        if (!validateAddress())
            return;
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    shippingAddress: formData.shippingAddress,
                    shippingCity: formData.shippingCity,
                    shippingState: formData.shippingState,
                    shippingZipCode: formData.shippingZipCode,
                    shippingCountry: formData.shippingCountry,
                    billingAddress: formData.sameAsShipping ? formData.shippingAddress : formData.billingAddress,
                    billingCity: formData.sameAsShipping ? formData.shippingCity : formData.billingCity,
                    billingState: formData.sameAsShipping ? formData.shippingState : formData.billingState,
                    billingZipCode: formData.sameAsShipping ? formData.shippingZipCode : formData.billingZipCode,
                    sameAsShipping: formData.sameAsShipping,
                    subtotal: Math.round(subtotal * 100) / 100,
                    shippingCost: 0,
                    tax: 0,
                    discountAmount: Math.round(discountAmount * 100) / 100,
                    total: Math.round(total * 100) / 100,
                    couponCode: couponCode.toUpperCase() || undefined,
                    couponDiscountType: discountType,
                    couponDiscountValue: discountAmount,
                    items: cart.map((item) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                        category: item.category,
                        sku: item.sku,
                    })),
                    customerNotes: formData.customerNotes,
                    paymentMethod: 'stripe',
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Failed to create order');
                return;
            }
            router.push(`/checkout/payment?orderId=${data.orderId}`);
        }
        catch (err) {
            setError('Failed to submit order. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className={`min-h-screen transition-colors ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/cart')} className="flex items-center gap-2 text-[#D4AF37] mb-8 hover:text-[#E5C158]">
          <FaChevronLeft size={16}/>
          Back to Cart
        </button>

        
        <div className="flex items-center justify-center gap-8 mb-12">
          {['Details', 'Address', 'Payment'].map((step, index) => (<div key={step} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${(index === 0 && currentStep === 'details') ||
                (index === 1 && currentStep === 'address') ||
                (index === 2 && currentStep === 'payment')
                ? 'bg-[#D4AF37] text-black'
                : darkMode
                    ? 'bg-[#1E1E1E] text-gray-400'
                    : 'bg-gray-300 text-gray-600'}`}>
                {index + 1}
              </div>
              <span className={`text-sm font-semibold ${(index === 0 && currentStep === 'details') ||
                (index === 1 && currentStep === 'address') ||
                (index === 2 && currentStep === 'payment')
                ? 'text-[#D4AF37]'
                : darkMode
                    ? 'text-gray-400'
                    : 'text-gray-600'}`}>
                {step}
              </span>
              {index < 2 && (<div className={`h-1 w-12 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-300'}`}/>)}
            </div>))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className={`rounded-lg p-8 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
              
              {error && (<div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${darkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-50'}`}>
                  <FaExclamationCircle className="text-red-500" size={20}/>
                  <p className={darkMode ? 'text-red-400' : 'text-red-600'}>{error}</p>
                </div>)}

              
              {total > 999999.99 && (<div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${darkMode ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-50'}`}>
                  <FaExclamationCircle className="text-yellow-500" size={20}/>
                  <p className={darkMode ? 'text-yellow-400' : 'text-yellow-600'}>
                    Order total exceeds the maximum allowed amount of $999,999.99. Please reduce quantities.
                  </p>
                </div>)}

              
              {currentStep === 'details' && (<div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Customer Details
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <input type="email" placeholder="Email address *" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={`p-3 rounded-lg border ${darkMode
                ? 'bg-[#242424] border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'}`}/>
                    <input type="tel" placeholder="Phone number *" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={`p-3 rounded-lg border ${darkMode
                ? 'bg-[#242424] border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'}`}/>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First name *" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className={`p-3 rounded-lg border ${darkMode
                ? 'bg-[#242424] border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'}`}/>
                    <input type="text" placeholder="Last name *" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className={`p-3 rounded-lg border ${darkMode
                ? 'bg-[#242424] border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'}`}/>
                  </div>

                  <div className="pt-4">
                    <button onClick={() => {
                if (validateDetails()) {
                    setCurrentStep('address');
                    setError('');
                }
            }} className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold py-3 rounded-lg transition-colors">
                      Continue to Address
                    </button>
                  </div>
                </div>)}

              
              {currentStep === 'address' && (<div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Shipping Address
                  </h2>

                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Country / Region *
                    </label>
                    <select value={formData.shippingCountry} onChange={(e) => handleInputChange('shippingCountry', e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode
                ? 'bg-[#242424] border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'}`}>
                      <option value="United States">United States (US)</option>
                      <option value="Canada">Canada (CA)</option>
                      <option value="Mexico">Mexico (MX)</option>
                      <option value="Reunion">Réunion (RE)</option>
                    </select>
                  </div>

                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Street address *
                    </label>
                    <input type="text" placeholder="123 Main Street" value={formData.shippingAddress} onChange={(e) => handleInputChange('shippingAddress', e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode
                ? 'bg-[#242424] border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'}`}/>
                  </div>

                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Apartment, suite, unit etc. (optional)
                    </label>
                    <input type="text" placeholder="Apt 4B" className={`w-full p-3 rounded-lg border ${darkMode
                ? 'bg-[#242424] border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'}`}/>
                  </div>

                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Town / City *
                    </label>
                    <input type="text" placeholder="Los Angeles" value={formData.shippingCity} onChange={(e) => handleInputChange('shippingCity', e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode
                ? 'bg-[#242424] border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'}`}/>
                  </div>

                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        State *
                      </label>
                      <select value={formData.shippingState} onChange={(e) => handleInputChange('shippingState', e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode
                ? 'bg-[#242424] border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'}`}>
                        <option value="">Select state</option>
                        <option value="Alabama">Alabama</option>
                        <option value="Alaska">Alaska</option>
                        <option value="Arizona">Arizona</option>
                        <option value="Arkansas">Arkansas</option>
                        <option value="California">California</option>
                        <option value="Colorado">Colorado</option>
                        <option value="Connecticut">Connecticut</option>
                        <option value="Delaware">Delaware</option>
                        <option value="Florida">Florida</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Hawaii">Hawaii</option>
                        <option value="Idaho">Idaho</option>
                        <option value="Illinois">Illinois</option>
                        <option value="Indiana">Indiana</option>
                        <option value="Iowa">Iowa</option>
                        <option value="Kansas">Kansas</option>
                        <option value="Kentucky">Kentucky</option>
                        <option value="Louisiana">Louisiana</option>
                        <option value="Maine">Maine</option>
                        <option value="Maryland">Maryland</option>
                        <option value="Massachusetts">Massachusetts</option>
                        <option value="Michigan">Michigan</option>
                        <option value="Minnesota">Minnesota</option>
                        <option value="Mississippi">Mississippi</option>
                        <option value="Missouri">Missouri</option>
                        <option value="Montana">Montana</option>
                        <option value="Nebraska">Nebraska</option>
                        <option value="Nevada">Nevada</option>
                        <option value="New Hampshire">New Hampshire</option>
                        <option value="New Jersey">New Jersey</option>
                        <option value="New Mexico">New Mexico</option>
                        <option value="New York">New York</option>
                        <option value="North Carolina">North Carolina</option>
                        <option value="North Dakota">North Dakota</option>
                        <option value="Ohio">Ohio</option>
                        <option value="Oklahoma">Oklahoma</option>
                        <option value="Oregon">Oregon</option>
                        <option value="Pennsylvania">Pennsylvania</option>
                        <option value="Rhode Island">Rhode Island</option>
                        <option value="South Carolina">South Carolina</option>
                        <option value="South Dakota">South Dakota</option>
                        <option value="Tennessee">Tennessee</option>
                        <option value="Texas">Texas</option>
                        <option value="Utah">Utah</option>
                        <option value="Vermont">Vermont</option>
                        <option value="Virginia">Virginia</option>
                        <option value="Washington">Washington</option>
                        <option value="West Virginia">West Virginia</option>
                        <option value="Wisconsin">Wisconsin</option>
                        <option value="Wyoming">Wyoming</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        ZIP Code *
                      </label>
                      <input type="text" placeholder="90001" value={formData.shippingZipCode} onChange={(e) => handleInputChange('shippingZipCode', e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode
                ? 'bg-[#242424] border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'}`}/>
                    </div>
                  </div>

                  
                  <div className="space-y-3 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={showBillingAddress} onChange={(e) => {
                setShowBillingAddress(e.target.checked);
                handleInputChange('sameAsShipping', !e.target.checked);
            }} className="w-4 h-4 cursor-pointer"/>
                      <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        Ship to a different address?
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={showOrderNotes} onChange={(e) => setShowOrderNotes(e.target.checked)} className="w-4 h-4 cursor-pointer"/>
                      <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        Order notes?
                      </span>
                    </label>
                  </div>

                  
                  {showBillingAddress && (<div className={`space-y-4 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Billing Address
                      </h3>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Street address *
                        </label>
                        <input type="text" placeholder="123 Main Street" value={formData.billingAddress || ''} onChange={(e) => handleInputChange('billingAddress', e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode
                    ? 'bg-[#242424] border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'}`}/>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Town / City *
                        </label>
                        <input type="text" placeholder="Los Angeles" value={formData.billingCity || ''} onChange={(e) => handleInputChange('billingCity', e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode
                    ? 'bg-[#242424] border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'}`}/>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            State *
                          </label>
                          <select value={formData.billingState || ''} onChange={(e) => handleInputChange('billingState', e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode
                    ? 'bg-[#242424] border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'}`}>
                            <option value="">Select state</option>
                            <option value="California">California</option>
                            <option value="Texas">Texas</option>
                            <option value="Florida">Florida</option>
                            <option value="New York">New York</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            ZIP Code *
                          </label>
                          <input type="text" placeholder="90001" value={formData.billingZipCode || ''} onChange={(e) => handleInputChange('billingZipCode', e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode
                    ? 'bg-[#242424] border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'}`}/>
                        </div>
                      </div>
                    </div>)}

                  
                  {showOrderNotes && (<div className={`pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Order notes
                      </label>
                      <textarea placeholder="Special instructions, delivery notes, etc." value={formData.customerNotes} onChange={(e) => handleInputChange('customerNotes', e.target.value)} className={`w-full p-3 rounded-lg border h-24 ${darkMode
                    ? 'bg-[#242424] border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'}`}/>
                    </div>)}

                  <div className="flex gap-3 pt-6">
                    <button onClick={() => setCurrentStep('details')} className={`flex-1 py-3 rounded-lg transition-colors font-semibold ${darkMode
                ? 'bg-[#242424] hover:bg-[#333333] text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
                      Back
                    </button>
                    <button onClick={() => {
                setCurrentStep('payment');
                setError('');
            }} className="flex-1 bg-black hover:bg-gray-900 text-white font-bold py-3 rounded-lg transition-colors">
                      Continue to Payment
                    </button>
                  </div>
                </div>)}

              
              {currentStep === 'payment' && (<div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Review & Payment
                  </h2>

                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#242424]' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Coupon Code (optional)
                    </label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} disabled={couponApplied} className={`flex-1 p-3 rounded-lg border ${darkMode
                ? 'bg-[#1E1E1E] border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'} disabled:opacity-50`}/>
                      {!couponApplied ? (<button onClick={handleCouponApply} className="bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold px-6 rounded-lg transition-colors">
                          Apply
                        </button>) : (<button onClick={() => {
                    setCouponApplied(false);
                    setCouponCode('');
                    setDiscountAmount(0);
                    setDiscountType(null);
                }} className={`font-bold px-6 rounded-lg transition-colors ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-900'}`}>
                          Remove
                        </button>)}
                    </div>
                  </div>

                  
                  <div className={`p-4 rounded-lg space-y-3 ${darkMode ? 'bg-[#242424]' : 'bg-gray-50'}`}>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    {discountAmount > 0 && (<div className="flex justify-between text-green-500">
                        <span>Discount ({discountType})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>)}
                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'} pt-3 flex justify-between text-lg font-bold`}>
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>Total</span>
                      <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  
                  <div className={`p-4 rounded-lg space-y-2 ${darkMode ? 'bg-[#242424]' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <strong>Name:</strong> {formData.firstName} {formData.lastName}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <strong>Email:</strong> {formData.email}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <strong>Shipping To:</strong> {formData.shippingAddress}, {formData.shippingCity}, {formData.shippingState} {formData.shippingZipCode}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setCurrentStep('address')} className={`flex-1 py-3 rounded-lg transition-colors font-semibold ${darkMode
                ? 'bg-[#242424] hover:bg-[#333333] text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
                      Back
                    </button>
                    <button onClick={handleSubmitOrder} disabled={loading || total > 999999.99} className="flex-1 bg-[#D4AF37] hover:bg-[#E5C158] disabled:opacity-50 text-black font-bold py-3 rounded-lg transition-colors">
                      {loading ? 'Processing...' : 'Continue to Payment'}
                    </button>
                  </div>
                </div>)}
            </div>
          </div>

          
          <div className="lg:col-span-1">
            <div className={`rounded-lg p-6 sticky top-4 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Order Summary
              </h3>

              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {cart.map((item) => {
            const itemPrice = parseFloat(item.price.replace('$', '').replace(',', ''));
            return (<div key={item.id} className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>${(itemPrice * item.quantity).toFixed(2)}</span>
                    </div>);
        })}
              </div>

              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'} pt-4 space-y-2`}>
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Shipping</span>
                  <span className="text-green-500">FREE</span>
                </div>
                {discountAmount > 0 && (<div className="flex justify-between text-sm text-green-500">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>)}
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'} pt-2 flex justify-between font-bold`}>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>Total</span>
                  <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
