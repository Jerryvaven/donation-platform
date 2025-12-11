'use client';
import { useState, useEffect } from 'react';
import { FaTrash, FaToggleOn, FaToggleOff, FaPlus } from 'react-icons/fa';
import Navbar from '@/components/admin/Navbar';
import type { Coupon } from '@/types';
export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(false);
    const [lastNotificationCheck, setLastNotificationCheck] = useState(new Date().toISOString());
    const [notificationActivity, setNotificationActivity] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage' as 'percentage' | 'fixed_amount',
        discountValue: '',
        minimumPurchase: '',
        maximumUses: '',
        maximumUsesPerCustomer: '',
        validFrom: '',
        validUntil: '',
    });
    useEffect(() => {
        fetchCoupons();
    }, []);
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('adminDarkMode');
        if (savedDarkMode !== null) {
            setDarkMode(JSON.parse(savedDarkMode));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
    }, [darkMode]);
    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/coupons');
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Failed to fetch coupons');
                return;
            }
            setCoupons(data.coupons || []);
        }
        catch (err) {
            setError('Failed to fetch coupons');
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.code || !formData.discountValue) {
            setError('Code and discount value are required');
            return;
        }
        try {
            const response = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Failed to create coupon');
                return;
            }
            setCoupons([data.coupon, ...coupons]);
            setFormData({
                code: '',
                description: '',
                discountType: 'percentage',
                discountValue: '',
                minimumPurchase: '',
                maximumUses: '',
                maximumUsesPerCustomer: '',
                validFrom: '',
                validUntil: '',
            });
            setShowForm(false);
        }
        catch (err) {
            setError('Failed to create coupon');
            console.log(err);
        }
    };
    const handleToggleCoupon = async (id: string, isActive: boolean) => {
        try {
            const response = await fetch('/api/coupons', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_active: !isActive }),
            });
            if (!response.ok) {
                setError('Failed to update coupon');
                return;
            }
            setCoupons(coupons.map((c) => (c.id === id ? { ...c, is_active: !isActive } : c)));
        }
        catch (err) {
            setError('Failed to update coupon');
            console.log(err);
        }
    };
    const handleDeleteCoupon = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?'))
            return;
        try {
            const response = await fetch('/api/coupons', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) {
                setError('Failed to delete coupon');
                return;
            }
            setCoupons(coupons.filter((c) => c.id !== id));
        }
        catch (err) {
            setError('Failed to delete coupon');
            console.log(err);
        }
    };
    return (<div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <Navbar notificationActivity={notificationActivity} showNotifications={showNotifications} setShowNotifications={setShowNotifications} unreadNotifications={unreadNotifications} setUnreadNotifications={setUnreadNotifications} lastNotificationCheck={lastNotificationCheck} setLastNotificationCheck={setLastNotificationCheck} darkMode={darkMode} setDarkMode={setDarkMode}/>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Coupons</h1>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <FaPlus /> Create Coupon
          </button>
        </div>

        {error && (<div className={`border px-4 py-3 rounded mb-6 ${darkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-100 border-red-400 text-red-700'}`}>
            {error}
          </div>)}

        {showForm && (<div className={`rounded-lg shadow p-6 mb-8 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create New Coupon</h2>
            <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Coupon Code *</label>
                <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g., SAVE10" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                ? 'bg-[#242424] border-[#444444] text-white'
                : 'border-gray-300 bg-white text-gray-900'}`}/>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Discount Type *</label>
                <select name="discountType" value={formData.discountType} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                ? 'bg-[#242424] border-[#444444] text-white'
                : 'border-gray-300 bg-white text-gray-900'}`}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed_amount">Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Discount Value {formData.discountType === 'percentage' ? '(%)' : '($)'} *
                </label>
                <input type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} step="0.01" placeholder="10" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                ? 'bg-[#242424] border-[#444444] text-white'
                : 'border-gray-300 bg-white text-gray-900'}`}/>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="e.g., 10% off all products" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                ? 'bg-[#242424] border-[#444444] text-white'
                : 'border-gray-300 bg-white text-gray-900'}`}/>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Minimum Purchase ($)</label>
                <input type="number" name="minimumPurchase" value={formData.minimumPurchase} onChange={handleInputChange} step="0.01" placeholder="Leave empty for no minimum" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                ? 'bg-[#242424] border-[#444444] text-white'
                : 'border-gray-300 bg-white text-gray-900'}`}/>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Maximum Uses</label>
                <input type="number" name="maximumUses" value={formData.maximumUses} onChange={handleInputChange} placeholder="Leave empty for unlimited" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                ? 'bg-[#242424] border-[#444444] text-white'
                : 'border-gray-300 bg-white text-gray-900'}`}/>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Max Uses Per Customer</label>
                <input type="number" name="maximumUsesPerCustomer" value={formData.maximumUsesPerCustomer} onChange={handleInputChange} placeholder="Leave empty for unlimited" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                ? 'bg-[#242424] border-[#444444] text-white'
                : 'border-gray-300 bg-white text-gray-900'}`}/>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Valid From</label>
                <input type="date" name="validFrom" value={formData.validFrom} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                ? 'bg-[#242424] border-[#444444] text-white'
                : 'border-gray-300 bg-white text-gray-900'}`}/>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Valid Until</label>
                <input type="date" name="validUntil" value={formData.validUntil} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                ? 'bg-[#242424] border-[#444444] text-white'
                : 'border-gray-300 bg-white text-gray-900'}`}/>
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Create Coupon
                </button>
                <button type="button" onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg ${darkMode
                ? 'bg-[#242424] text-gray-300 hover:bg-[#333333]'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>
                  Cancel
                </button>
              </div>
            </form>
          </div>)}

        <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
          {loading ? (<div className={`p-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading coupons...</div>) : coupons.length === 0 ? (<div className={`p-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No coupons created yet</div>) : (<div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${darkMode ? 'bg-[#242424] border-[#444444]' : 'bg-gray-100 border-gray-200'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Code</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Discount</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Min Purchase</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Uses</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Valid Until</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-[#444444]' : 'divide-gray-200'}`}>
                  {coupons.map((coupon) => (<tr key={coupon.id} className={`${darkMode ? 'hover:bg-[#333333]' : 'hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{coupon.code}</td>
                      <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{coupon.description || '-'}</td>
                      <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {(coupon as any).discount_type === 'percentage'
                    ? `${(coupon as any).discount_value}%`
                    : `$${(coupon as any).discount_value}`}
                      </td>
                      <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {(coupon as any).minimum_purchase ? `$${(coupon as any).minimum_purchase}` : '-'}
                      </td>
                      <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {(coupon as any).used_count || 0}
                        {(coupon as any).maximum_uses ? ` / ${(coupon as any).maximum_uses}` : ''}
                      </td>
                      <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {(coupon as any).valid_until ? new Date((coupon as any).valid_until).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${(coupon as any).is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'}`}>
                          {(coupon as any).is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm flex gap-2`}>
                        <button onClick={() => handleToggleCoupon(coupon.id, (coupon as any).is_active)} className={`${(coupon as any).is_active ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 hover:text-gray-600'}`}>
                          {(coupon as any).is_active ? <FaToggleOn size={18}/> : <FaToggleOff size={18}/>}
                        </button>
                        <button onClick={() => handleDeleteCoupon(coupon.id)} className={`${darkMode ? 'text-red-500 hover:text-red-400' : 'text-red-600 hover:text-red-800'}`}>
                          <FaTrash size={16}/>
                        </button>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>)}
        </div>
      </div>
    </div>);
}
