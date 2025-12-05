'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserPlus, FaTimes, FaSync, FaCheckCircle, FaPlus } from 'react-icons/fa'
import { fetchProducts, fetchFireDepartments, addDonation, updateDonation, updateDonor } from '@/lib/api-client'
import AddProductModal from './AddProductModal'
import AddFireStationModal from './AddFireStationModal'
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
  state: string
  address?: string
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
  productsRefreshTrigger?: number
  onGlobalProductAdded?: () => void
}

export default function AddProductDonationModal({
  showAddDonorModal,
  setShowAddDonorModal,
  onDataRefresh,
  mode = 'add',
  donation = null,
  darkMode = false,
  productsRefreshTrigger = 0,
  onGlobalProductAdded
}: AddProductDonationModalProps) {
  const [donorName, setDonorName] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
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
  
  // New product modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showAddFireStationModal, setShowAddFireStationModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)

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
        console.log('Error loading data:', error)
      }
    }

    loadData()
  }, [productsRefreshTrigger])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productDropdownOpen && !(event.target as Element).closest('.product-dropdown')) {
        setProductDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [productDropdownOpen])

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && donation) {
      setDonorName(donation.donorName || '')
      setCity(donation.city || '')
      setState(donation.state || '')
      setAddress(donation.address || '')
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
      setState('')
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

    const currentMode = mode
    const currentDonation = donation

    try {
      if (currentMode === 'edit' && currentDonation && currentDonation.id) {
        
        await updateDonation(currentDonation.id, {
          product_id: selectedProduct,
          quantity: parseInt(quantity),
          matched,
          fire_department_id: matched ? selectedFireDepartment : undefined
        })

        // Update donor information
        await updateDonor({
          id: currentDonation.donorId,
          name: donorName,
          city,
          state,
          address
        })

        setMessage({ type: 'success', text: 'Donation updated successfully!' })
      } else if (currentMode === 'edit' && currentDonation && !currentDonation.id) {
        setMessage({ type: 'error', text: 'Cannot update donation: missing ID' })
        setSaving(false)
        return
      } else {
        await addDonation({
          donorName,
          city,
          state,
          address,
          productId: selectedProduct,
          quantity: parseInt(quantity),
          matched,
          fireDepartmentId: matched ? selectedFireDepartment : undefined
        })
        setMessage({ type: 'success', text: 'Product donation added successfully!' })
      }

      onDataRefresh()

      setTimeout(() => {
        setShowAddDonorModal(false)
      }, 1500)

      if (mode === 'add') {
        setDonorName('')
        setCity('')
        setState('')
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
    <>
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
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
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
                    readOnly={mode === 'view'}
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
                    readOnly={mode === 'view'}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                    placeholder="City"
                  />
                </div>

                <div>
                  <label htmlFor="state" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    readOnly={mode === 'view'}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                    placeholder="State"
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
                    readOnly={mode === 'view'}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                    placeholder="Full address"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="product" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'}`}>
                      Product *
                    </label>
                    {mode === 'add' && (
                      <motion.button
                        type="button"
                        onClick={() => setShowAddProductModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg ${
                          darkMode 
                            ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white' 
                            : 'bg-black hover:bg-gray-800 text-white'
                        } transition-all`}
                      >
                        <FaPlus className="text-xs" />
                        Add Product
                      </motion.button>
                    )}
                  </div>
                  {/* Custom Product Dropdown */}
                  <div className="relative product-dropdown">
                    <div
                      onClick={() => mode !== 'view' && setProductDropdownOpen(!productDropdownOpen)}
                      className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg cursor-pointer focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none ${mode === 'view' ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-400'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={selectedProduct ? '' : 'text-gray-500'}>
                          {selectedProduct
                            ? products.find(p => p.id === selectedProduct)?.name
                            : 'Select Product'
                          }
                        </span>
                        <motion.svg
                          animate={{ rotate: productDropdownOpen ? 180 : 0 }}
                          className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-transform`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {productDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className={`absolute z-50 w-full mt-1 ${darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-300'} border rounded-lg shadow-lg max-h-60 overflow-hidden`}
                        >
                          <div className="max-h-48 overflow-y-auto">
                            {products.map(product => (
                              <motion.div
                                key={product.id}
                                whileHover={{ backgroundColor: darkMode ? '#333333' : '#f3f4f6' }}
                                onClick={() => {
                                  setSelectedProduct(product.id)
                                  setProductDropdownOpen(false)
                                }}
                                className={`px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                                  selectedProduct === product.id
                                    ? darkMode ? 'bg-[#3B82F6]/20' : 'bg-blue-50'
                                    : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex-shrink-0">
                                      {product.image_url ? (
                                        <img
                                          src={product.image_url}
                                          alt={product.name}
                                          className="w-full h-full object-cover rounded"
                                        />
                                      ) : (
                                        <div className={`w-full h-full rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center`}>
                                          <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {product.name}
                                      </div>
                                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        ${product.value.toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                  {selectedProduct === product.id && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className={`w-5 h-5 rounded-full ${darkMode ? 'bg-[#3B82F6]' : 'bg-black'} flex items-center justify-center`}
                                    >
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* View Image Button */}
                  {selectedProduct && products.find(p => p.id === selectedProduct)?.image_url && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={() => {
                        setSelectedImageUrl(products.find(p => p.id === selectedProduct)?.image_url || '')
                        setShowImageModal(true)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`mt-2 px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 ${
                        darkMode 
                          ? 'bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 border border-[#3B82F6]/30' 
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                      } transition-all`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Image
                    </motion.button>
                  )}
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
                    disabled={mode === 'view'}
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
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="fireDepartmentSearch" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'}`}>
                      Fire Department *
                    </label>
                    {mode === 'add' && (
                      <motion.button
                        type="button"
                        onClick={() => setShowAddFireStationModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg ${
                          darkMode 
                            ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white' 
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        } transition-all`}
                      >
                        <FaPlus className="text-xs" />
                        Add Fire Station
                      </motion.button>
                    )}
                  </div>
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

      {/* Add Product Modal */}
      <AddProductModal
        showAddProductModal={showAddProductModal}
        setShowAddProductModal={setShowAddProductModal}
        onProductAdded={(product) => {
          setProducts(prev => [...prev, product])
          setSelectedProduct(product.id)
          onGlobalProductAdded?.()
        }}
        darkMode={darkMode}
      />

      {/* Add Fire Station Modal */}
      <AddFireStationModal
        showAddFireStationModal={showAddFireStationModal}
        setShowAddFireStationModal={setShowAddFireStationModal}
        onFireStationAdded={(fireStation) => {
          setFireDepartments(prev => [...prev, fireStation])
          setSelectedFireDepartment(fireStation.id)
          setFireDepartmentSearch(fireStation.name)
        }}
        darkMode={darkMode}
      />

      {/* Image Viewer Modal */}
      <AnimatePresence>
      {showImageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
          onClick={() => setShowImageModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-5xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={() => setShowImageModal(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg z-10 transition-all"
            >
              <FaTimes className="text-xl" />
            </motion.button>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={selectedImageUrl}
                alt="Product full view"
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  )
}

