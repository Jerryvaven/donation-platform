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
      .select('id, total_donated_value, total_products_donated, state, city, created_at')

    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Calculate current month statistics
    const currentMonthDonations = productDonations?.filter((d: any) => {
      const date = new Date(d.donation_date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }) || []

    const lastMonthDonations = productDonations?.filter((d: any) => {
      const date = new Date(d.donation_date)
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    }) || []

    const currentMonthDonors = donors?.filter((d: any) => {
      const date = new Date(d.created_at)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }) || []

    const lastMonthDonors = donors?.filter((d: any) => {
      const date = new Date(d.created_at)
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    }) || []

    // Calculate current month stats
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

    const todaysProducts = productDonations?.filter((d: any) => d.donation_date === today.toISOString().split('T')[0])
      .reduce((sum: number, d: any) => sum + d.quantity, 0) || 0

    const newDonorsToday = donors?.filter((d: any) =>
      new Date(d.created_at).toISOString().split('T')[0] === today.toISOString().split('T')[0]
    ).length || 0

    // Match rate
    const matchRate = productDonations && productDonations.length > 0
      ? (matchedProducts / productDonations.length) * 100
      : 0

    // Calculate last month stats for growth comparison
    const lastMonthTotalDonatedValue = lastMonthDonors?.reduce((sum: number, d: any) => sum + parseFloat(d.total_donated_value.toString()), 0) || 0
    const lastMonthTotalProductsDonated = lastMonthDonors?.reduce((sum: number, d: any) => sum + (d.total_products_donated || 0), 0) || 0
    const lastMonthTotalDonors = lastMonthDonors?.length || 0
    const lastMonthMatchedProducts = lastMonthDonations?.filter((d: any) => d.matched).length || 0
    const lastMonthFireDepartmentsReached = new Set(
      lastMonthDonations
        ?.filter((d: any) => d.fire_department_id)
        .map((d: any) => d.fire_department_id)
    ).size

    // Calculate growth percentages
    const totalDonatedValueGrowth = lastMonthTotalDonatedValue > 0
      ? ((totalDonatedValue - lastMonthTotalDonatedValue) / lastMonthTotalDonatedValue) * 100
      : 0

    const totalProductsDonatedGrowth = lastMonthTotalProductsDonated > 0
      ? ((totalProductsDonated - lastMonthTotalProductsDonated) / lastMonthTotalProductsDonated) * 100
      : 0

    const totalDonorsGrowth = lastMonthTotalDonors > 0
      ? ((totalDonors - lastMonthTotalDonors) / lastMonthTotalDonors) * 100
      : 0

    const matchedProductsGrowth = lastMonthMatchedProducts > 0
      ? ((matchedProducts - lastMonthMatchedProducts) / lastMonthMatchedProducts) * 100
      : 0

    const fireDepartmentsReachedGrowth = lastMonthFireDepartmentsReached > 0
      ? ((fireDepartmentsReached - lastMonthFireDepartmentsReached) / lastMonthFireDepartmentsReached) * 100
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
      matchRate,
      totalDonatedValueGrowth,
      totalProductsDonatedGrowth,
      totalDonorsGrowth,
      matchedProductsGrowth,
      fireDepartmentsReachedGrowth
    }

    return NextResponse.json({ data: stats })
  } catch (error: any) {
    console.log('Exception in stats API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

