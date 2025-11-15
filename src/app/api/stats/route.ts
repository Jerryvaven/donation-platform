import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get all product donations with related data
    const { data: productDonations } = await supabase
      .from('product_donations')
      .select(`
        *,
        products(name, category, value),
        fire_departments(name)
      `)

    // Get all donors
    const { data: donors } = await supabase
      .from('donors')
      .select('id, total_donated_value, total_products_donated, county, city, created_at')

    const today = new Date().toISOString().split('T')[0]

    // Calculate statistics
    const totalDonatedValue = donors?.reduce((sum: number, d: any) => sum + parseFloat(d.total_donated_value.toString()), 0) || 0
    const totalProductsDonated = donors?.reduce((sum: number, d: any) => sum + (d.total_products_donated || 0), 0) || 0
    const totalDonors = donors?.length || 0
    const matchedProducts = productDonations?.filter((d: any) => d.matched).length || 0
    
    // Count saunas and cold plunges
    const saunaDonated = productDonations?.filter((d: any) => 
      d.products?.category === 'Sauna'
    ).reduce((sum: number, d: any) => sum + d.quantity, 0) || 0
    
    const coldPlungeDonated = productDonations?.filter((d: any) => 
      d.products?.category === 'Cold Plunge'
    ).reduce((sum: number, d: any) => sum + d.quantity, 0) || 0
    
    const fireDepartmentsReached = new Set(
      productDonations
        ?.filter((d: any) => d.fire_department_id)
        .map((d: any) => d.fire_department_id)
    ).size

    const todaysProducts = productDonations?.filter((d: any) => d.donation_date === today)
      .reduce((sum: number, d: any) => sum + d.quantity, 0) || 0

    const newDonorsToday = donors?.filter((d: any) =>
      new Date(d.created_at).toISOString().split('T')[0] === today
    ).length || 0

    // Match rate
    const matchRate = productDonations && productDonations.length > 0
      ? (matchedProducts / productDonations.length) * 100
      : 0

    const stats = {
      totalDonatedValue,
      totalProductsDonated,
      totalDonors,
      matchedProducts,
      saunaDonated,
      coldPlungeDonated,
      fireDepartmentsReached,
      todaysProducts,
      newDonorsToday,
      matchRate
    }

    return NextResponse.json({ data: stats })
  } catch (error: any) {
    console.error('Exception in stats API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
