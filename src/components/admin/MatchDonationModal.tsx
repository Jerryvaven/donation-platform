'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSync, FaCheckCircle } from 'react-icons/fa';
import { fetchFireDepartments, updateDonation } from '@/lib/api-client';
import type { FireDepartment } from '@/types';
interface ProductDonation {
    id: string;
    donorId: string;
    donorName: string;
    productId: string;
    productName: string;
    productValue: number;
    fireDepartmentId: string | null;
    fireDepartmentName: string;
    quantity: number;
    city: string;
    state: string;
    date: string;
    status: 'MATCHED' | 'PENDING';
}
interface MatchDonationModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    donation: ProductDonation | null;
    onDataRefresh: () => void;
    darkMode?: boolean;
}
export default function MatchDonationModal({ showModal, setShowModal, donation, onDataRefresh, darkMode = false }: MatchDonationModalProps) {
    const [selectedFireDepartment, setSelectedFireDepartment] = useState('');
    const [fireDepartmentSearch, setFireDepartmentSearch] = useState('');
    const [fireDepartments, setFireDepartments] = useState<FireDepartment[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);
    useEffect(() => {
        const loadFireDepartments = async () => {
            if (!showModal)
                return;
            setLoading(true);
            try {
                const response = await fetchFireDepartments();
                setFireDepartments(response.data || []);
            }
            catch (error) {
                console.log('Error fetching fire departments:', error);
                setMessage({ type: 'error', text: 'Failed to load fire departments' });
            }
            finally {
                setLoading(false);
            }
        };
        loadFireDepartments();
    }, [showModal]);
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);
    useEffect(() => {
        if (showModal && donation) {
            setSelectedFireDepartment(donation.fireDepartmentId || '');
            setFireDepartmentSearch('');
        }
        else {
            setSelectedFireDepartment('');
            setFireDepartmentSearch('');
        }
        setMessage(null);
    }, [showModal, donation]);
    const filteredFireDepartments = fireDepartments.filter(fd => fd.name.toLowerCase().includes(fireDepartmentSearch.toLowerCase()) ||
        (fd.city && fd.city.toLowerCase().includes(fireDepartmentSearch.toLowerCase())) ||
        (fd.county && fd.county.toLowerCase().includes(fireDepartmentSearch.toLowerCase())));
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!donation || !selectedFireDepartment)
            return;
        setSaving(true);
        try {
            await updateDonation(donation.id, {
                matched: true,
                fire_department_id: selectedFireDepartment
            });
            setMessage({ type: 'success', text: 'Donation matched successfully!' });
            onDataRefresh();
            setTimeout(() => {
                setShowModal(false);
            }, 1500);
        }
        catch (error: any) {
            setMessage({ type: 'error', text: 'Error matching donation: ' + error.message });
        }
        finally {
            setSaving(false);
        }
    };
    if (!showModal || !donation)
        return null;
    return (<>
      <AnimatePresence>
        {showModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className={`${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide`} style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }} onClick={(e) => e.stopPropagation()}>
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
          <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-[#333333]' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Match Donation
            </h2>
            <motion.button onClick={() => setShowModal(false)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-[#333333]' : 'hover:bg-gray-100'}`}>
              <FaTimes className={darkMode ? 'text-[#B3B3B3]' : 'text-gray-400'}/>
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            <div className={`p-4 rounded-lg border ${darkMode ? 'bg-[#1A1A1A] border-[#333333]' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Donation Details
              </h3>
              <div className={`text-sm space-y-1 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>
                <p><strong>Donor:</strong> {donation.donorName}</p>
                <p><strong>Product:</strong> {donation.productName} (x{donation.quantity})</p>
                <p><strong>Value:</strong> ${donation.productValue * donation.quantity}</p>
                <p><strong>Location:</strong> {donation.city}, {donation.state}</p>
              </div>
            </div>

            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Search Fire Departments
              </label>
              <input type="text" value={fireDepartmentSearch} onChange={(e) => setFireDepartmentSearch(e.target.value)} placeholder="Search by name, city, or county..." className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                ? 'bg-[#1A1A1A] border-[#333333] text-white placeholder-[#808080]'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}/>
            </div>

            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Select Fire Department *
              </label>
              <div className={`max-h-40 overflow-y-auto border rounded-lg ${darkMode ? 'border-[#333333]' : 'border-gray-300'}`}>
                {loading ? (<div className={`flex items-center justify-center py-4 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}`}>
                    <FaSync className="animate-spin mr-2"/>
                    Loading...
                  </div>) : filteredFireDepartments.length === 0 ? (<div className={`text-center py-4 text-sm ${darkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
                    No fire departments found
                  </div>) : (filteredFireDepartments.map((fd) => (<motion.div key={fd.id} onClick={() => setSelectedFireDepartment(fd.id)} whileHover={{ backgroundColor: darkMode ? '#333333' : '#F3F4F6' }} className={`p-3 cursor-pointer border-b last:border-b-0 ${selectedFireDepartment === fd.id
                    ? (darkMode ? 'bg-[#3B82F6]/20 border-[#3B82F6]' : 'bg-blue-50 border-blue-200')
                    : (darkMode ? 'border-[#333333]' : 'border-gray-200')}`}>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {fd.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}`}>
                        {fd.city && fd.county ? `${fd.city}, ${fd.county}` : (fd.city || fd.county || 'Location not specified')}
                      </div>
                    </motion.div>)))}
              </div>
            </div>

            
            <AnimatePresence>
              {message && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`flex items-center gap-2 p-3 rounded-lg ${message.type === 'success'
                    ? (darkMode ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-green-50 text-green-700')
                    : (darkMode ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-red-50 text-red-700')}`}>
                  <FaCheckCircle />
                  <span className="text-sm">{message.text}</span>
                </motion.div>)}
            </AnimatePresence>

            
            <div className="flex gap-3">
              <motion.button type="button" onClick={() => setShowModal(false)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${darkMode
                ? 'border-[#333333] text-[#B3B3B3] hover:bg-[#333333]'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                Cancel
              </motion.button>
              <motion.button type="submit" disabled={!selectedFireDepartment || saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700`}>
                {saving ? (<div className="flex items-center justify-center gap-2">
                    <FaSync className="animate-spin"/>
                    Matching...
                  </div>) : ('Match Donation')}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>)}
      </AnimatePresence>
    </>);
}
