'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function ConfirmPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))

        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.log('Confirmation error:', error)
          router.push('/admin/profile?error=confirmation_failed')
          return
        }

        console.log('Confirmation successful, session:', session)

        // If successful, redirect to profile with success
        router.push('/admin/profile?confirmed=email')
      } catch (error) {
        console.log('Unexpected error:', error)
        router.push('/admin/profile?error=unexpected')
      }
    }

    handleEmailConfirmation()
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Confirming your email...</p>
      </div>
    </div>
  )
}
