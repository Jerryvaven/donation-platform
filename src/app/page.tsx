'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Leaderboard from '@/components/user/Leaderboard'

export default function page() {
  const router = useRouter()

  useEffect(() => {
    // Check if this is an email confirmation redirect
    const urlParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))

    // Check for email confirmation indicators
    const hasConfirmationMessage = urlParams.get('message')?.includes('Confirmation') ||
                                  hashParams.get('message')?.includes('Confirmation') ||
                                  urlParams.get('type') === 'email_confirmation' ||
                                  hashParams.get('type') === 'email_confirmation'

    if (hasConfirmationMessage) {
      // Store confirmation message in localStorage for the profile page
      const confirmationMessage = { type: 'success' as const, text: 'Email confirmed successfully! Your email has been updated.' }
      localStorage.setItem('emailConfirmationMessage', JSON.stringify(confirmationMessage))

      // Redirect to profile page
      router.push('/admin/profile')
      return
    }
  }, [router])

  return (
    <Leaderboard />
  )
}

