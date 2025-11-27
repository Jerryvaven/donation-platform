'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaLock, FaSave, FaArrowLeft, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { fetchAdmins, addAdminUser, deleteAdminUser } from '@/lib/api-client'
import AccessDeniedModal from '@/components/admin/minicomponents/AccessDeniedModal'
import Navbar from '@/components/admin/Navbar'
import type { ActivityItem } from '@/types'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [updatingPassword, setUpdatingPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [notificationActivity, setNotificationActivity] = useState<ActivityItem[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(false)
  const [lastNotificationCheck, setLastNotificationCheck] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [adminUsers, setAdminUsers] = useState<any[]>([])
  const [loadingAdmins, setLoadingAdmins] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [showNewUserPassword, setShowNewUserPassword] = useState(false)
  const [addingUser, setAddingUser] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState<any>(null)
  const [deletingAdmin, setDeletingAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/admin/login')
      } else {
        // Check if user is admin
        const { data: adminData } = await supabase.from('admins').select('*').eq('user_id', user.id).single()
        if (!adminData) {
          setShowAccessDeniedModal(true)
          await supabase.auth.signOut()
          router.push('/admin/login')
        } else {
          setUser(user)
          // Check if user is superadmin
          setIsSuperAdmin(adminData.is_superadmin || false)
        }
      }
      setLoading(false)
    }
    getUser()
  }, [router, supabase.auth])

  useEffect(() => {
    // Apply dark mode to the entire page
    if (darkMode) {
      document.body.style.backgroundColor = "#121212";
      document.documentElement.style.backgroundColor = "#121212";
    } else {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    }
  }, [darkMode])


  const loadAdminUsers = async () => {
    setLoadingAdmins(true)
    try {
      const data = await fetchAdmins()
      setAdminUsers(data || [])
      setCurrentPage(1) // Reset to first page when loading admin users
    } catch (error: any) {
      console.error('Error loading admin users:', error)
      setMessage({ type: 'error', text: 'Failed to load admin users.' })
    } finally {
      setLoadingAdmins(false)
    }
  }

  const handleAddNewUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      setMessage({ type: 'error', text: 'Email and password are required' })
      return
    }

    if (newUserPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      return
    }

    setAddingUser(true)
    setMessage(null)

    try {
      const result = await addAdminUser({
        email: newUserEmail,
        password: newUserPassword,
      })

      setMessage({ type: 'success', text: result.message || 'User added successfully' })
      setNewUserEmail('')
      setNewUserPassword('')
      // Refresh the admin list to show the new admin
      loadAdminUsers()
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error: any) {
      console.error('Error adding new user:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to add new user' })
    } finally {
      setAddingUser(false)
    }
  }

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return

    setDeletingAdmin(true)
    try {
      await deleteAdminUser(adminToDelete.user_id)

      setMessage({ type: 'success', text: 'Admin user deleted successfully' })
      loadAdminUsers() // Refresh the admin list
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error: any) {
      console.error('Error deleting admin:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to delete admin' })
    } finally {
      setDeletingAdmin(false)
      setShowDeleteConfirm(false)
      setAdminToDelete(null)
    }
  }

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    setUpdatingPassword(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error

      setMessage({ type: 'success', text: 'Password updated successfully' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUpdatingPassword(false)
    }
  }

  useEffect(() => {
    if (isSuperAdmin) {
      loadAdminUsers()
    }
  }, [isSuperAdmin])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <Navbar
        notificationActivity={notificationActivity}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        unreadNotifications={unreadNotifications}
        setUnreadNotifications={setUnreadNotifications}
        lastNotificationCheck={lastNotificationCheck}
        setLastNotificationCheck={setLastNotificationCheck}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        userRole={isSuperAdmin ? 'Super Admin' : 'Admin'}
      />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${darkMode ? 'bg-[#242424]' : 'bg-white'} rounded-xl shadow-lg p-8`}
        >
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => router.push('/admin/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg ${darkMode ? 'bg-[#333333] text-gray-300 hover:bg-[#404040]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
            >
              <FaArrowLeft size={20} />
            </motion.button>
            <div className="flex items-center gap-3">
              <FaUser className="text-blue-500" size={24} />
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile Settings</h1>
            </div>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <div className="space-y-8">
            {/* First Row: User Info and Password Update */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Information - Left Side */}
              <div className={`${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'} rounded-lg p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <FaUser className="text-blue-500" size={20} />
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>User Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <div className={`px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-gray-100 text-gray-900'}`}>
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Role
                    </label>
                    <div className={`px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-gray-100 text-gray-900'}`}>
                      {isSuperAdmin ? 'Super Admin' : 'Admin'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Update - Right Side */}
              <div className={`${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'} rounded-lg p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <FaLock className="text-blue-500" size={20} />
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Update Password</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 right-0 pr-3 flex items-center ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute inset-y-0 right-0 pr-3 flex items-center ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleUpdatePassword}
                    disabled={updatingPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      updatingPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {updatingPassword ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FaSave size={16} />
                    )}
                    Update Password
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Second Row: Admin Management */}
            {isSuperAdmin && (
              <div className="grid grid-cols-1 gap-8">
                <div className={`${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'} rounded-lg p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <FaUser className="text-blue-500" size={20} />
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Management</h2>
                  </div>

                  <div className="space-y-4">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      As a superadmin, you can promote users to admin status.
                    </p>

                    {/* Current Admins and Add New Admin User in one row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Current Admins - Left Side */}
                      <div className="space-y-2">
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Current Admins</h3>
                        {loadingAdmins ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                          </div>
                        ) : adminUsers.length > 0 ? (
                          <div className="space-y-2">
                            {adminUsers
                              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                              .map((admin: any) => (
                                <div key={admin.user_id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-[#242424]' : 'bg-white'}`}>
                                  <div>
                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {admin.email}
                                    </p>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      Added: {new Date(admin.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                                      Admin
                                    </span>
                                    <motion.button
                                      onClick={() => {
                                        setAdminToDelete(admin)
                                        setShowDeleteConfirm(true)
                                      }}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className={`p-1.5 rounded-md transition-colors ${
                                        darkMode 
                                          ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                                          : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                                      }`}
                                      title="Delete Admin"
                                    >
                                      <FaTrash size={14} />
                                    </motion.button>
                                  </div>
                                </div>
                              ))}
                            {/* Pagination Controls */}
                            {adminUsers.length > itemsPerPage && (
                              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, adminUsers.length)} to {Math.min(currentPage * itemsPerPage, adminUsers.length)} of {adminUsers.length} admins
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                      currentPage === 1
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                        : `bg-blue-500 hover:bg-blue-600 text-white`
                                    }`}
                                  >
                                    Previous
                                  </button>
                                  <span className={`text-sm px-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Page {currentPage} of {Math.ceil(adminUsers.length / itemsPerPage)}
                                  </span>
                                  <button
                                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(adminUsers.length / itemsPerPage), prev + 1))}
                                    disabled={currentPage === Math.ceil(adminUsers.length / itemsPerPage)}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                      currentPage === Math.ceil(adminUsers.length / itemsPerPage)
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                        : `bg-blue-500 hover:bg-blue-600 text-white`
                                    }`}
                                  >
                                    Next
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No regular admins found.</p>
                        )}
                      </div>

                      {/* Add New Admin User - Right Side */}
                      <div className="space-y-2">
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add New Admin User</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                          Create a new user with admin privileges. They will be able to access the admin dashboard.
                        </p>
                        <div className="space-y-4">
                          <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={newUserEmail}
                              onChange={(e) => setNewUserEmail(e.target.value)}
                              placeholder="user@example.com"
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                              Password
                            </label>
                            <div className="relative">
                              <input
                                type={showNewUserPassword ? "text" : "password"}
                                value={newUserPassword}
                                onChange={(e) => setNewUserPassword(e.target.value)}
                                placeholder="Enter password"
                                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                              >
                                {showNewUserPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                              </button>
                            </div>
                          </div>
                          <motion.button
                            onClick={handleAddNewUser}
                            disabled={addingUser}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${addingUser ? 'cursor-not-allowed' : ''}`}
                          >
                            {addingUser ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Creating Admin...
                              </>
                            ) : (
                              <>
                                <FaUser size={14} />
                                Create Admin User
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && adminToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                <FaTrash className={`text-red-500 ${darkMode ? 'text-red-400' : ''}`} size={20} />
              </div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Delete Admin User
              </h3>
            </div>
            
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete the admin user <strong className={darkMode ? 'text-white' : 'text-gray-900'}>{adminToDelete.email}</strong>? 
              This action cannot be undone and will remove their admin privileges.
            </p>
            
            <div className="flex gap-3 justify-end">
              <motion.button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setAdminToDelete(null)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                disabled={deletingAdmin}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleDeleteAdmin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  deletingAdmin
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600'
                } text-white`}
                disabled={deletingAdmin}
              >
                {deletingAdmin ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash size={14} />
                    Delete
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <AccessDeniedModal
        showAccessDeniedModal={showAccessDeniedModal}
        setShowAccessDeniedModal={setShowAccessDeniedModal}
        darkMode={darkMode}
      />
    </div>
  )
}