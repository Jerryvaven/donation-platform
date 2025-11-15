import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    let query = supabase
      .from('product_donations')
      .select(`
        *,
        products(name, value, category),
        fire_departments(name),
        donors(name, city, county)
      `)
      .order('donation_date', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching donations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch donations', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Exception in donations API:', error)
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

    const { 
      donor_id, 
      product_id, 
      fire_department_id, 
      quantity, 
      matched, 
      donation_date 
    } = body

    if (!donor_id || !product_id || !quantity) {
      return NextResponse.json(
        { error: 'donor_id, product_id, and quantity are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('product_donations')
      .insert([{
        donor_id,
        product_id,
        fire_department_id: fire_department_id || null,
        quantity: parseInt(quantity),
        donation_date: donation_date || new Date().toISOString().split('T')[0],
        matched: matched || false,
        status: matched ? 'MATCHED' : 'PENDING'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating donation:', error)
      return NextResponse.json(
        { error: 'Failed to create donation', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, message: 'Donation created successfully' }, { status: 201 })
  } catch (error: any) {
    console.error('Exception in create donation API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
