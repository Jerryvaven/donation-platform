import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

function getTimeAgo(timestamp: string): string {
  const now = new Date().getTime()
  const past = new Date(timestamp).getTime()
  const diffInSeconds = Math.floor((now - past) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const lastCheck = searchParams.get('lastCheck')

    // Get recent product donations with timestamps
    const { data: donations } = await supabase
      .from('product_donations')
      .select(`
        *,
        products(name, value),
        fire_departments(name),
        donors(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    const allActivities: any[] = []
    const newActivities: any[] = []

    const lastCheckTime = lastCheck ? new Date(lastCheck).getTime() : 0

    // Process donations as activities
    donations?.forEach((donation: any) => {
      const donorName = donation.donors?.name || 'Unknown Donor'
      const productName = donation.products?.name || 'Product'
      const fireDeptName = donation.fire_departments?.name || ''
      const timeAgo = getTimeAgo(donation.created_at)
      const createdTime = new Date(donation.created_at).getTime()

      const donationActivity = {
        id: `donation-${donation.id}`,
        type: 'donation',
        message: `${donorName} donated ${productName}`,
        timestamp: timeAgo,
        icon: '🎁',
        color: 'green'
      }

      allActivities.push(donationActivity)

      if (createdTime > lastCheckTime) {
        newActivities.push(donationActivity)
      }

      // Matched donation activity
      if (donation.matched && fireDeptName) {
        const matchActivity = {
          id: `match-${donation.id}`,
          type: 'match',
          message: `${productName} matched to ${fireDeptName}`,
          timestamp: timeAgo,
          icon: '🤝',
          color: 'yellow'
        }

        allActivities.push(matchActivity)

        if (createdTime > lastCheckTime) {
          newActivities.push(matchActivity)
        }
      }
    })

    return NextResponse.json({ 
      data: {
        all: allActivities.slice(0, 5),
        new: newActivities.slice(0, 5),
        hasUnread: newActivities.length > 0
      }
    })
  } catch (error: any) {
    console.log('Exception in activity API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

