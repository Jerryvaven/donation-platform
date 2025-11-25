'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaPlus, FaCheckCircle, FaSync, FaFireAlt } from 'react-icons/fa'
import { addFireDepartment, updateFireDepartment, fetchCoordinates } from '@/lib/api-client'
import type { FireDepartment } from '@/types'

interface AddFireStationModalProps {
  showAddFireStationModal: boolean
  setShowAddFireStationModal: (show: boolean) => void
  onFireStationAdded: (fireStation: FireDepartment) => void
  onFireStationUpdated?: (fireStation: FireDepartment) => void
  editStation?: FireDepartment | null
  darkMode?: boolean
}

export default function AddFireStationModal({
  showAddFireStationModal,
  setShowAddFireStationModal,
  onFireStationAdded,
  onFireStationUpdated,
  editStation,
  darkMode = false
}: AddFireStationModalProps) {
  const [newStationName, setNewStationName] = useState('')
  const [newStationCity, setNewStationCity] = useState('')
  const [newStationCounty, setNewStationCounty] = useState('')
  const [newStationAddress, setNewStationAddress] = useState('')
  const [newStationLatitude, setNewStationLatitude] = useState('')
  const [newStationLongitude, setNewStationLongitude] = useState('')
  const [addingStation, setAddingStation] = useState(false)
  const [fetchingCoords, setFetchingCoords] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Populate form when editing
  useEffect(() => {
    if (editStation) {
      setNewStationName(editStation.name || '')
      setNewStationCity(editStation.city || '')
      setNewStationCounty(editStation.county || '')
      setNewStationAddress(editStation.address || '')
      setNewStationLatitude(editStation.latitude?.toString() || '')
      setNewStationLongitude(editStation.longitude?.toString() || '')
    } else {
      // Reset form when not editing
      setNewStationName('')
      setNewStationCity('')
      setNewStationCounty('')
      setNewStationAddress('')
      setNewStationLatitude('')
      setNewStationLongitude('')
    }
  }, [editStation])

  const handleFetchCoordinates = async () => {
    if (!newStationAddress.trim()) {
      setMessage({ type: 'error', text: 'Please enter an address first.' })
      return
    }

    setFetchingCoords(true)
    setMessage(null)

    try {
      const response = await fetchCoordinates(newStationAddress.trim())
      if (response.data) {
        setNewStationLatitude(response.data.latitude)
        setNewStationLongitude(response.data.longitude)
        setMessage({ type: 'success', text: 'Coordinates fetched successfully!' })
      } else {
        setMessage({ type: 'error', text: 'No coordinates found for this address.' })
      }
    } catch (error: unknown) {
      console.error('Error fetching coordinates:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch coordinates.'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setFetchingCoords(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStationName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a fire station name.' })
      return
    }

    setAddingStation(true)
    setMessage(null)

    try {
      const stationData = {
        name: newStationName.trim(),
        city: newStationCity.trim() || undefined,
        county: newStationCounty.trim() || undefined,
        address: newStationAddress.trim() || undefined,
        latitude: newStationLatitude.trim() || undefined,
        longitude: newStationLongitude.trim() || undefined
      }

      let response
      if (editStation) {
        response = await updateFireDepartment(editStation.id, stationData)
        if (onFireStationUpdated) {
          onFireStationUpdated(response.data)
        }
      } else {
        response = await addFireDepartment(stationData)
        onFireStationAdded(response.data)
      }
      
      // Reset form
      setNewStationName('')
      setNewStationCity('')
      setNewStationCounty('')
      setNewStationAddress('')
      setNewStationLatitude('')
      setNewStationLongitude('')
      
      setTimeout(() => {
        setShowAddFireStationModal(false)
        setMessage(null)
      }, 1500)
    } catch (error: unknown) {
      console.error(`Error ${editStation ? 'updating' : 'adding'} fire station:`, error)
      const errorMessage = error instanceof Error ? error.message : `Failed to ${editStation ? 'update' : 'add'} fire station.`
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setAddingStation(false)
    }
  }

  return (
    <AnimatePresence>
      {showAddFireStationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-2xl max-w-lg w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide`}
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
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <motion.div
                  className={`p-3 ${darkMode ? 'bg-[#EF4444]' : 'bg-red-600'} rounded-xl`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FaFireAlt className="text-xl text-white" />
                </motion.div>
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {editStation ? 'Edit Fire Station' : 'Add Fire Station'}
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {editStation ? 'Update the fire station details' : 'Fill in the details to add a new fire station'}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => setShowAddFireStationModal(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition-all ${darkMode ? 'text-[#808080] hover:text-white hover:bg-[#242424]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="stationName" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  Fire Station Name *
                </label>
                <input
                  type="text"
                  id="stationName"
                  value={newStationName}
                  onChange={(e) => setNewStationName(e.target.value)}
                  required
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#EF4444] focus:border-[#EF4444]' : 'focus:ring-red-600 focus:border-red-600'} transition-all`}
                  placeholder="e.g., Newport Beach Fire Department"
                />
              </div>

              <div>
                <label htmlFor="stationCity" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  City
                </label>
                <input
                  type="text"
                  id="stationCity"
                  value={newStationCity}
                  onChange={(e) => setNewStationCity(e.target.value)}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#EF4444] focus:border-[#EF4444]' : 'focus:ring-red-600 focus:border-red-600'} transition-all`}
                  placeholder="e.g., Newport Beach"
                />
              </div>

              <div>
                <label htmlFor="stationCounty" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  County
                </label>
                <input
                  type="text"
                  id="stationCounty"
                  value={newStationCounty}
                  onChange={(e) => setNewStationCounty(e.target.value)}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#EF4444] focus:border-[#EF4444]' : 'focus:ring-red-600 focus:border-red-600'} transition-all`}
                  placeholder="e.g., Orange County"
                />
              </div>

              <div>
                <label htmlFor="stationAddress" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  Address
                </label>
                <div className="space-y-2">
                  <textarea
                    id="stationAddress"
                    value={newStationAddress}
                    onChange={(e) => setNewStationAddress(e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#EF4444] focus:border-[#EF4444]' : 'focus:ring-red-600 focus:border-red-600'} transition-all resize-none`}
                    placeholder="Full address of the fire station..."
                  />
                  <motion.button
                    type="button"
                    onClick={handleFetchCoordinates}
                    disabled={fetchingCoords || !newStationAddress.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${darkMode ? 'bg-[#333333] text-[#B3B3B3] hover:bg-[#444444] hover:text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm`}
                  >
                    {fetchingCoords ? (
                      <>
                        <FaSync className="animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <FaPlus />
                        Get Coordinates
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stationLatitude" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="stationLatitude"
                    value={newStationLatitude}
                    onChange={(e) => setNewStationLatitude(e.target.value)}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#EF4444] focus:border-[#EF4444]' : 'focus:ring-red-600 focus:border-red-600'} transition-all`}
                    placeholder="e.g., 33.6189"
                  />
                </div>

                <div>
                  <label htmlFor="stationLongitude" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="stationLongitude"
                    value={newStationLongitude}
                    onChange={(e) => setNewStationLongitude(e.target.value)}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#EF4444] focus:border-[#EF4444]' : 'focus:ring-red-600 focus:border-red-600'} transition-all`}
                    placeholder="e.g., -117.9298"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  type="button"
                  onClick={() => setShowAddFireStationModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${darkMode ? 'bg-[#242424] text-[#B3B3B3] hover:bg-[#333333] hover:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={addingStation}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${darkMode ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]' : 'bg-red-600 text-white hover:bg-red-700'} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {addingStation ? (
                    <>
                      <FaSync className="animate-spin" />
                      {editStation ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      {editStation ? 'Update Fire Station' : 'Add Fire Station'}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
