'use client';
import { useState, useEffect } from 'react';
import { FaEye, FaSearch, FaFilter, FaTimes, FaBox, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import Navbar from '@/components/admin/Navbar';
interface OrderItem {
    id: string;
    order_id: string;
    ecommerce_product_id?: string;
    product_name: string;
    product_sku?: string;
    price_per_unit: number;
    quantity: number;
    line_total: number;
    product_image_url?: string;
    product_category?: string;
}
interface Order {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip_code: string;
    shipping_country: string;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    discount_amount: number;
    total: number;
    coupon_code?: string;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    payment_method?: string;
    tracking_number?: string;
    shipping_provider?: string;
    customer_notes?: string;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
}
export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(false);
    const [lastNotificationCheck, setLastNotificationCheck] = useState(new Date().toISOString());
    const [notificationActivity, setNotificationActivity] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('adminDarkMode');
        if (savedDarkMode !== null) {
            setDarkMode(JSON.parse(savedDarkMode));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
    }, [darkMode]);
    useEffect(() => {
        fetchOrders();
    }, []);
    useEffect(() => {
        filterOrders();
    }, [orders, searchTerm, paymentStatusFilter, orderStatusFilter]);
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/orders?all=true');
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Failed to fetch orders');
                return;
            }
            setOrders(data.data || []);
        }
        catch (err) {
            setError('Failed to fetch orders');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    const filterOrders = () => {
        let filtered = [...orders];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((order) => order.id.toLowerCase().includes(term) ||
                order.email.toLowerCase().includes(term) ||
                `${order.first_name} ${order.last_name}`.toLowerCase().includes(term) ||
                order.phone.includes(term));
        }
        if (paymentStatusFilter !== 'all') {
            filtered = filtered.filter((order) => order.payment_status === paymentStatusFilter);
        }
        if (orderStatusFilter !== 'all') {
            filtered = filtered.filter((order) => order.status === orderStatusFilter);
        }
        setFilteredOrders(filtered);
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'FAILED':
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-800';
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'REFUNDED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
            case 'DELIVERED':
                return <FaCheckCircle className="inline mr-1"/>;
            case 'PENDING':
            case 'PROCESSING':
                return <FaBox className="inline mr-1"/>;
            case 'SHIPPED':
                return <FaTruck className="inline mr-1"/>;
            case 'FAILED':
            case 'CANCELLED':
                return <FaTimesCircle className="inline mr-1"/>;
            default:
                return null;
        }
    };
    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };
    const handleUpdateStatus = async (orderId: string, newStatus: string, type: 'order' | 'payment') => {
        try {
            setUpdatingStatus(true);
            const updatePayload: any = { orderId };
            if (type === 'order') {
                updatePayload.status = newStatus;
            }
            else {
                updatePayload.paymentStatus = newStatus;
            }
            const response = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Failed to update order status');
                return;
            }
            setOrders(orders.map((order) => (order.id === orderId ? data.data : order)));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(data.data);
            }
            setError('');
            setSuccessMessage(`${type === 'order' ? 'Order' : 'Payment'} status updated successfully`);
            setTimeout(() => setSuccessMessage(''), 3000);
        }
        catch (err) {
            setError('Failed to update order status');
            console.error(err);
        }
        finally {
            setUpdatingStatus(false);
        }
    };
    const clearFilters = () => {
        setSearchTerm('');
        setPaymentStatusFilter('all');
        setOrderStatusFilter('all');
    };
    return (<div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <Navbar notificationActivity={notificationActivity} showNotifications={showNotifications} setShowNotifications={setShowNotifications} unreadNotifications={unreadNotifications} setUnreadNotifications={setUnreadNotifications} lastNotificationCheck={lastNotificationCheck} setLastNotificationCheck={setLastNotificationCheck} darkMode={darkMode} setDarkMode={setDarkMode}/>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Orders Management
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              View and manage all orders
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Orders:{' '}
            </span>
            <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {filteredOrders.length}
            </span>
          </div>
        </div>

        {error && (<div className={`border px-4 py-3 rounded mb-6 ${darkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-100 border-red-400 text-red-700'}`}>
            {error}
          </div>)}

        {successMessage && (<div className={`border px-4 py-3 rounded mb-6 ${darkMode ? 'bg-green-900 border-green-700 text-green-200' : 'bg-green-100 border-green-400 text-green-700'}`}>
            {successMessage}
          </div>)}

        
        <div className={`rounded-lg shadow p-6 mb-6 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className={darkMode ? 'text-gray-400' : 'text-gray-600'}/>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Filters
            </h2>
            {(searchTerm || paymentStatusFilter !== 'all' || orderStatusFilter !== 'all') && (<button onClick={clearFilters} className="ml-auto text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                <FaTimes size={12}/>
                Clear Filters
              </button>)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Search
              </label>
              <div className="relative">
                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14}/>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Order ID, email, name, phone..." className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
            ? 'bg-[#242424] border-[#444444] text-white placeholder-gray-500'
            : 'border-gray-300 bg-white text-gray-900'}`}/>
              </div>
            </div>

            
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Payment Status
              </label>
              <select value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
            ? 'bg-[#242424] border-[#444444] text-white'
            : 'border-gray-300 bg-white text-gray-900'}`}>
                <option value="all">All</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Order Status
              </label>
              <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
            ? 'bg-[#242424] border-[#444444] text-white'
            : 'border-gray-300 bg-white text-gray-900'}`}>
                <option value="all">All</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        
        <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
          {loading ? (<div className={`p-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="inline-block h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
              <p className="mt-2">Loading orders...</p>
            </div>) : filteredOrders.length === 0 ? (<div className={`p-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
            </div>) : (<div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${darkMode ? 'bg-[#242424] border-[#444444]' : 'bg-gray-100 border-gray-200'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Order ID
                    </th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Customer
                    </th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Total
                    </th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Payment Status
                    </th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Order Status
                    </th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date
                    </th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-[#444444]' : 'divide-gray-200'}`}>
                  {filteredOrders.map((order) => (<tr key={order.id} className={`${darkMode ? 'hover:bg-[#242424]' : 'hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {order.first_name} {order.last_name}
                      </td>
                      <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {order.email}
                      </td>
                      <td className={`px-6 py-4 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.payment_status)}`}>
                          {getStatusIcon(order.payment_status)}
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleViewDetails(order)} className="text-blue-500 hover:text-blue-600" title="View Details">
                            <FaEye size={18}/>
                          </button>
                          {order.status !== 'DELIVERED' && order.payment_status === 'COMPLETED' && (<button onClick={() => handleUpdateStatus(order.id, 'DELIVERED', 'order')} disabled={updatingStatus} className={`text-xs px-2 py-1 rounded font-semibold transition-colors ${updatingStatus
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'}`} title="Mark as Delivered">
                              Complete
                            </button>)}
                        </div>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>)}
        </div>
      </div>

      
      {showDetailModal && selectedOrder && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
            <div className={`sticky top-0 border-b px-6 py-4 flex justify-between items-center ${darkMode ? 'bg-[#242424] border-[#444444]' : 'bg-gray-50 border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Order Details
              </h2>
              <button onClick={() => setShowDetailModal(false)} className={`p-2 rounded-lg hover:bg-opacity-80 ${darkMode ? 'hover:bg-[#333333]' : 'hover:bg-gray-200'}`}>
                <FaTimes className={darkMode ? 'text-gray-400' : 'text-gray-600'}/>
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Order Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Order ID</p>
                    <p className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedOrder.id}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Order Date</p>
                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Payment Status</p>
                    <select value={selectedOrder.payment_status} onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value, 'payment')} disabled={updatingStatus} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode
                ? 'bg-[#242424] border-[#444444] text-white'
                : 'border-gray-300 bg-white text-gray-900'}`}>
                      <option value="PENDING">Pending</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="FAILED">Failed</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Order Status</p>
                    <select value={selectedOrder.status} onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value, 'order')} disabled={updatingStatus} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode
                ? 'bg-[#242424] border-[#444444] text-white'
                : 'border-gray-300 bg-white text-gray-900'}`}>
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name</p>
                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedOrder.first_name} {selectedOrder.last_name}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.phone}</p>
                  </div>
                </div>
              </div>

              
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Shipping Address
                </h3>
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedOrder.shipping_address}
                </p>
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip_code}
                </p>
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedOrder.shipping_country}
                </p>
              </div>

              
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (<div key={item.id} className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? 'bg-[#242424]' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        {item.product_image_url && (<img src={item.product_image_url} alt={item.product_name} className="w-12 h-12 object-cover rounded"/>)}
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.product_name}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            SKU: {item.product_sku} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${item.line_total.toFixed(2)}
                      </p>
                    </div>))}
                </div>
              </div>

              
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal</span>
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${selectedOrder.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipping</span>
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${selectedOrder.shipping_cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tax</span>
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${selectedOrder.tax.toFixed(2)}
                    </span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (<div className="flex justify-between text-green-500">
                      <span className="text-sm">
                        Discount {selectedOrder.coupon_code && `(${selectedOrder.coupon_code})`}
                      </span>
                      <span className="text-sm">-${selectedOrder.discount_amount.toFixed(2)}</span>
                    </div>)}
                  <div className={`flex justify-between pt-2 border-t ${darkMode ? 'border-[#444444]' : 'border-gray-200'}`}>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total</span>
                    <span className="font-bold text-[#D4AF37]">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.customer_notes && (<div>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Customer Notes
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedOrder.customer_notes}
                  </p>
                </div>)}
            </div>
          </div>
        </div>)}
    </div>);
}
