import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: donations } = await supabase
      .from('product_donations')
      .select('quantity, donation_date, matched, products(value)')

    // Initialize monthly data for all 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear()

    const monthlyStats = months.map((month, index) => {
      const monthNum = index + 1
      const monthDonations = donations?.filter(d => {
        const date = new Date(d.donation_date)
        return date.getMonth() + 1 === monthNum && date.getFullYear() === currentYear
      }) || []

      const totalDonations = monthDonations.reduce((sum, d) => {
        const value = d.products?.value || 0
        return sum + (parseFloat(value.toString()) * d.quantity)
      }, 0)
      const totalMatched = monthDonations.reduce((sum, d) => {
        const value = d.products?.value || 0
        return d.matched ? sum + (parseFloat(value.toString()) * d.quantity) : sum
      }, 0)

      return {
        month,
        donations: totalDonations,
        matched: totalMatched
      }
    })

    return NextResponse.json({ data: monthlyStats })
  } catch (error: any) {
    console.error('Exception in monthly data API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
