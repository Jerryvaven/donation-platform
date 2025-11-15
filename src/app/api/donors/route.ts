import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const response = await supabase
      .from('donors')
      .select(`
        *,
        product_donations (
          *,
          products (*),
          fire_departments (*)
        )
      `)
      .order('total_donated_value', { ascending: false })

    const { data, error } = response

    if (error) {
      console.error('Error fetching donors:', error)
      return NextResponse.json(
        { error: 'Failed to fetch donors', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Exception in donors API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    const { name, city, county, address, totalDonatedValue, totalProductsDonated } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Donor name is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('donors')
      .insert([{
        name,
        city: city || null,
        county: county || null,
        address: address || null,
        total_donated_value: totalDonatedValue || 0,
        total_products_donated: totalProductsDonated || 0
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating donor:', error)
      return NextResponse.json(
        { error: 'Failed to create donor', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, message: 'Donor created successfully' }, { status: 201 })
  } catch (error: any) {
    console.error('Exception in create donor API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
