'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserPlus, FaTimes, FaSync, FaCheckCircle } from 'react-icons/fa'
import { fetchProducts, fetchFireDepartments, addDonation, updateDonation } from '@/lib/api-client'
import type { Product, FireDepartment } from '@/types'

interface ProductDonation {
  id: string
  donorId: string
  donorName: string
  productId: string
  productName: string
  productValue: number
  fireDepartmentId: string | null
  fireDepartmentName: string
  quantity: number
  city: string
  county: string
  date: string
  status: 'MATCHED' | 'PENDING'
}

interface AddProductDonationModalProps {
  showAddDonorModal: boolean
  setShowAddDonorModal: (show: boolean) => void
  onDataRefresh: () => void
  mode?: 'add' | 'edit' | 'view'
  donation?: ProductDonation | null
  darkMode?: boolean
}

export default function AddProductDonationModal({
  showAddDonorModal,
  setShowAddDonorModal,
  onDataRefresh,
  mode = 'add',
  donation = null,
  darkMode = false
}: AddProductDonationModalProps) {
  const [donorName, setDonorName] = useState('')
  const [city, setCity] = useState('')
  const [county, setCounty] = useState('')
  const [address, setAddress] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [matched, setMatched] = useState(false)
  const [selectedFireDepartment, setSelectedFireDepartment] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [fireDepartments, setFireDepartments] = useState<FireDepartment[]>([])
  const [fireDepartmentSearch, setFireDepartmentSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Fetch products and fire departments using API routes
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, fireDepsRes] = await Promise.all([
          fetchProducts(),
          fetchFireDepartments()
        ])
        
        setProducts(productsRes.data || [])
        setFireDepartments(fireDepsRes.data || [])
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && donation) {
      setDonorName(donation.donorName)
      setCity(donation.city)
      setCounty(donation.county)
      setSelectedProduct(donation.productId)
      setQuantity(donation.quantity.toString())
      setMatched(donation.status === 'MATCHED')
      if (donation.fireDepartmentId) {
        setSelectedFireDepartment(donation.fireDepartmentId)
        setFireDepartmentSearch(donation.fireDepartmentName)
      } else {
        setSelectedFireDepartment('')
        setFireDepartmentSearch('')
      }
    } else if (mode === 'add') {
      // Reset form for add
      setDonorName('')
      setCity('')
      setCounty('')
      setAddress('')
      setSelectedProduct('')
      setQuantity('1')
      setMatched(false)
      setSelectedFireDepartment('')
      setFireDepartmentSearch('')
    }
    setMessage(null)
  }, [mode, donation, showAddDonorModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (mode === 'edit' && donation) {
        // Update existing donation (only matching status)
        await updateDonation(donation.id, {
          matched,
          fire_department_id: matched ? selectedFireDepartment : undefined
        })
        setMessage({ type: 'success', text: 'Donation updated successfully!' })
      } else {
        // Add new donation
        await addDonation({
          donorName,
          city,
          county,
          address,
          productId: selectedProduct,
          quantity: parseInt(quantity),
          matched,
          fireDepartmentId: matched ? selectedFireDepartment : undefined
        })
        setMessage({ type: 'success', text: 'Product donation added successfully!' })
      }

      // Refresh data
      onDataRefresh()

      // Close modal after a short delay
      setTimeout(() => {
        setShowAddDonorModal(false)
      }, 1500)

      // Reset form only for add mode
      if (mode === 'add') {
        setDonorName('')
        setCity('')
        setCounty('')
        setAddress('')
        setSelectedProduct('')
        setQuantity('1')
        setMatched(false)
        setSelectedFireDepartment('')
        setFireDepartmentSearch('')
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {showAddDonorModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-2 ${darkMode ? 'bg-[#3B82F6]' : 'bg-black'} rounded-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FaUserPlus className="text-xl text-white" />
                </motion.div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {mode === 'edit' ? 'Edit Donation' : mode === 'view' ? 'View Donation' : 'Add Donation'}
                </h2>
              </div>
              <motion.button
                onClick={() => setShowAddDonorModal(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className={`${darkMode ? 'text-[#808080] hover:text-white hover:bg-[#242424]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} rounded-lg p-2 transition-all`}
              >
                <FaTimes className="text-xl" />
              </motion.button>
            </div>

            {/* Message Display */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
                    message.type === 'success'
                      ? darkMode ? 'bg-[#22C55E]/20 border border-[#22C55E]/30' : 'bg-green-50 border border-green-200'
                      : darkMode ? 'bg-[#EF4444]/20 border border-[#EF4444]/30' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {message.type === 'success' ? (
                    <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
                  ) : (
                    <FaTimes className="text-red-600 text-xl flex-shrink-0" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      message.type === 'success'
                        ? darkMode ? 'text-[#22C55E]' : 'text-green-800'
                        : darkMode ? 'text-[#EF4444]' : 'text-red-800'
                    }`}
                  >
                    {message.text}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="donorName" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                    Donor Name *
                  </label>
                  <input
                    type="text"
                    id="donorName"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                    disabled={mode === 'edit' || mode === 'view'}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                    placeholder="Enter donor name"
                  />
                </div>

                <div>
                  <label htmlFor="city" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={mode === 'edit' || mode === 'view'}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                    placeholder="City"
                  />
                </div>

                <div>
                  <label htmlFor="county" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                    County
                  </label>
                  <input
                    type="text"
                    id="county"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    disabled={mode === 'edit' || mode === 'view'}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                    placeholder="County"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="address" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={mode === 'edit' || mode === 'view'}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                    placeholder="Full address"
                  />
                </div>

                <div>
                  <label htmlFor="product" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                    Product *
                  </label>
                  <select
                    id="product"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    required
                    disabled={mode === 'edit' || mode === 'view'}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.value.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="quantity" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    required
                    disabled={mode === 'edit' || mode === 'view'}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className={`flex items-center gap-3 py-3 px-4 ${darkMode ? 'bg-[#242424] border-[#333333] hover:bg-[#2A2A2A]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} rounded-lg border transition-all`}>
                <input
                  type="checkbox"
                  id="matched"
                  checked={matched}
                  onChange={(e) => setMatched(e.target.checked)}
                  disabled={mode === 'view'}
                  className={`w-5 h-5 ${darkMode ? 'text-[#3B82F6] bg-[#1E1E1E] border-[#333333] focus:ring-[#3B82F6]' : 'text-black bg-white border-gray-300 focus:ring-black'} rounded focus:ring-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
                />
                <label htmlFor="matched" className={`text-sm ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} font-medium cursor-pointer`}>
                  Match to Fire Department
                </label>
              </div>

              {matched && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label htmlFor="fireDepartmentSearch" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                    Fire Department *
                  </label>
                  <input
                    type="text"
                    id="fireDepartmentSearch"
                    value={fireDepartmentSearch}
                    onChange={(e) => setFireDepartmentSearch(e.target.value)}
                    disabled={mode === 'view'}
                    placeholder="Search fire departments..."
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                  />
                  <div className={`max-h-48 overflow-y-auto border rounded-lg ${darkMode ? 'border-[#333333] bg-[#242424]' : 'border-gray-300 bg-white'}`}>
                    {fireDepartments
                      .filter(dept => 
                        dept.name.toLowerCase().includes(fireDepartmentSearch.toLowerCase()) ||
                        dept.city?.toLowerCase().includes(fireDepartmentSearch.toLowerCase())
                      )
                      .map(dept => (
                        <div
                          key={dept.id}
                          onClick={() => {
                            setSelectedFireDepartment(dept.id)
                            setFireDepartmentSearch(dept.name)
                          }}
                          className={`px-4 py-2.5 cursor-pointer transition-colors ${
                            selectedFireDepartment === dept.id
                              ? darkMode ? 'bg-[#3B82F6] text-white' : 'bg-black text-white'
                              : darkMode ? 'hover:bg-[#333333] text-white' : 'hover:bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="font-medium">{dept.name}</div>
                          <div className={`text-xs ${selectedFireDepartment === dept.id ? 'text-white/80' : darkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
                            {dept.city}
                          </div>
                        </div>
                      ))}
                    {fireDepartments.filter(dept => 
                      dept.name.toLowerCase().includes(fireDepartmentSearch.toLowerCase()) ||
                      dept.city?.toLowerCase().includes(fireDepartmentSearch.toLowerCase())
                    ).length === 0 && (
                      <div className={`px-4 py-8 text-center text-sm ${darkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
                        No fire departments found
                      </div>
                    )}
                  </div>
                  {!selectedFireDepartment && (
                    <input type="text" required className="absolute opacity-0 pointer-events-none" />
                  )}
                </motion.div>
              )}

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={() => setShowAddDonorModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-5 py-2.5 ${darkMode ? 'bg-[#242424] hover:bg-[#2A2A2A] text-[#B3B3B3]' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} rounded-lg font-semibold transition-all duration-200`}
                >
                  {mode === 'view' ? 'Close' : 'Cancel'}
                </motion.button>
                {mode !== 'view' && (
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 px-5 py-2.5 ${darkMode ? 'bg-[#3B82F6] hover:bg-[#2563EB]' : 'bg-black hover:bg-gray-800'} text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {saving ? (
                      <>
                        <FaSync className="animate-spin" />
                        {mode === 'edit' ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        {mode === 'edit' ? 'Update Donation' : 'Add Donation'}
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
