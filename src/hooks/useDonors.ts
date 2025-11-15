'use client'

import { useEffect, useState } from 'react'
import { fetchDonors } from '@/lib/api-client'
import type { Donor } from '@/types'

export const useDonors = () => {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDonors = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetchDonors()
        setDonors(response.data || [])
      } catch (err: any) {
        console.error('Error fetching donors:', err)
        setError(err.message || 'Failed to fetch donors')
      } finally {
        setLoading(false)
      }
    }

    loadDonors()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchDonors()
      setDonors(response.data || [])
    } catch (err: any) {
      console.error('Error refetching donors:', err)
      setError(err.message || 'Failed to fetch donors')
    } finally {
      setLoading(false)
    }
  }

  return { donors, loading, error, refetch }
}
