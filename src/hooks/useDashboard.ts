'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import {
  fetchStats,
  fetchDonations,
  fetchMonthlyData,
  fetchActivity
} from '@/lib/api-client'
import { formatCurrency, getTimeAgo } from '@/lib/utils'
import type { DashboardStats, RecentProductDonation, ActivityItem, MonthlyData } from '@/types'

export function useDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalDonatedValue: 0,
    totalProductsDonated: 0,
    totalDonors: 0,
    matchedProducts: 0,
    saunaDonated: 0,
    coldPlungeDonated: 0,
    fireDepartmentsReached: 0,
    todaysProducts: 0,
    newDonorsToday: 0,
    matchRate: 0
  })
  const [recentDonors, setRecentDonors] = useState<RecentProductDonation[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [notificationActivity, setNotificationActivity] = useState<ActivityItem[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([
    {month: 'Jan', donations: 0, matched: 0},
    {month: 'Feb', donations: 0, matched: 0},
    {month: 'Mar', donations: 0, matched: 0},
    {month: 'Apr', donations: 0, matched: 0},
    {month: 'May', donations: 0, matched: 0},
    {month: 'Jun', donations: 0, matched: 0},
    {month: 'Jul', donations: 0, matched: 0},
    {month: 'Aug', donations: 0, matched: 0},
    {month: 'Sep', donations: 0, matched: 0},
    {month: 'Oct', donations: 0, matched: 0},
    {month: 'Nov', donations: 0, matched: 0},
    {month: 'Dec', donations: 0, matched: 0}
  ])
  const [loading, setLoading] = useState(true)
  const [showAddDonorModal, setShowAddDonorModal] = useState(false)
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(true)
  const [lastNotificationCheck, setLastNotificationCheck] = useState<string>('')
  const notificationRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Load last notification check time from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lastNotificationCheck')
    if (stored) {
      setLastNotificationCheck(stored)
      setUnreadNotifications(false)
    }
  }, [])

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showAddDonorModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showAddDonorModal])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowAddDonorModal(false)
      }
    }

    if (showAddDonorModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAddDonorModal])

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
        }
      }
    }
    getUser()
  }, [router, supabase.auth])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    await Promise.all([
      loadDashboardStats(),
      loadRecentDonors(),
      loadRecentActivity(),
      loadMonthlyData()
    ])
  }

  const loadMonthlyData = async () => {
    try {
      const response = await fetchMonthlyData()
      setMonthlyData(response.data)
    } catch (error) {
      console.error('Error fetching monthly data:', error)
    }
  }

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetchStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentDonors = async () => {
    try {
      setLoading(true)
      const response = await fetchDonations(50)
      
      const formattedDonors: RecentProductDonation[] = response.data.map((d: any) => ({
        id: d.id,
        donorId: d.donor_id,
        donorName: d.donors?.name || 'Unknown Donor',
        productName: d.products?.name || 'Unknown Product',
        productValue: d.products?.value ? parseFloat(d.products.value.toString()) : 0,
        fireDepartmentName: d.fire_departments?.name || 'Pending Match',
        city: d.donors?.city || 'N/A',
        county: d.donors?.county || 'N/A',
        date: d.donation_date,
        status: d.matched ? 'MATCHED' : 'PENDING'
      }))

      setRecentDonors(formattedDonors)
    } catch (error) {
      console.error('Error fetching recent donors:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentActivity = async () => {
    try {
      const response = await fetchActivity(lastNotificationCheck)
      
      setRecentActivity(response.data.all)
      setNotificationActivity(response.data.new)
      
      if (response.data.hasUnread) {
        setUnreadNotifications(true)
      }
    } catch (error) {
      console.error('Error fetching activity:', error)
    }
  }

  const handleQuickMatch = async () => {
    try {
      // Get all pending product donations
      const { data: pendingDonations, error: fetchError } = await supabase
        .from('product_donations')
        .select('id')
        .eq('matched', false)

      if (fetchError) throw fetchError

      if (!pendingDonations || pendingDonations.length === 0) {
        setMessage({ type: 'info', text: 'No pending product donations to match.' })
        setTimeout(() => setMessage(null), 3000)
        return
      }

      // Update each pending donation individually
      const updatePromises = pendingDonations.map(donation =>
        supabase
          .from('product_donations')
          .update({
            matched: true,
            status: 'MATCHED'
          })
          .eq('id', donation.id)
      )

      const results = await Promise.all(updatePromises)

      // Check for errors
      const errors = results.filter(result => result.error)
      if (errors.length > 0) {
        throw errors[0].error
      }

      setMessage({ type: 'success', text: `Successfully matched ${pendingDonations.length} pending product donations!` })
      setTimeout(() => setMessage(null), 5000)

      // Refresh data
      refreshData()
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error performing quick match: ' + error.message })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleExport = async () => {
    try {
      // Get all donors with their product donations
      const { data: donors, error: donorsError } = await supabase
        .from('donors')
        .select(`
          *,
          product_donations(
            *,
            products(name, value),
            fire_departments(name)
          )
        `)

      if (donorsError) throw donorsError

      if (!donors || donors.length === 0) {
        setMessage({ type: 'info', text: 'No donors to export.' })
        setTimeout(() => setMessage(null), 3000)
        return
      }

      // Create CSV content
      const csvHeaders = 'Donor Name,Total Value,Total Products,City,County,Address,Number of Donations,Products Donated,Last Donation Date\n'
      const csvRows = donors.map(donor => {
        const donorDonations = donor.product_donations || []
        const lastDonation = donorDonations.length > 0
          ? new Date(Math.max(...donorDonations.map((d: any) => new Date(d.donation_date).getTime()))).toISOString().split('T')[0]
          : 'N/A'
        
        const productsList = donorDonations.map((d: any) => d.products?.name || 'Unknown').join('; ')

        return `"${donor.name}","${donor.total_donated_value}","${donor.total_products_donated}","${donor.city || ''}","${donor.county || ''}","${donor.address || ''}","${donorDonations.length}","${productsList}","${lastDonation}"`
      }).join('\n')

      const csvContent = csvHeaders + csvRows

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `donors_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setMessage({ type: 'success', text: 'Donors data exported successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error exporting data: ' + error.message })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleImport = () => {
    setMessage({ type: 'info', text: 'Import feature coming soon!' })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleReport = async () => {
    setMessage({ type: 'info', text: 'Report generation feature coming soon!' })
    setTimeout(() => setMessage(null), 3000)
  }

  const refreshData = () => {
    loadDashboardData()
  }

  return {
    // State
    user,
    stats,
    recentDonors,
    recentActivity,
    notificationActivity,
    monthlyData,
    loading,
    showAddDonorModal,
    setShowAddDonorModal,
    showAccessDeniedModal,
    setShowAccessDeniedModal,
    message,
    setMessage,
    showNotifications,
    setShowNotifications,
    unreadNotifications,
    setUnreadNotifications,
    lastNotificationCheck,
    setLastNotificationCheck,
    notificationRef,
    modalRef,

    // Functions
    formatCurrency,
    handleQuickMatch,
    handleExport,
    handleImport,
    handleReport,
    refreshData
  }
}
