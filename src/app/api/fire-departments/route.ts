import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('fire_departments')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching fire departments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch fire departments', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Exception in fire departments API:', error)
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

    const { name, city, county, address, latitude, longitude } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Fire station name is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('fire_departments')
      .insert({
        name: name.trim(),
        city: city?.trim() || null,
        county: county?.trim() || null,
        address: address?.trim() || null,
        latitude: latitude || null,
        longitude: longitude || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding fire department:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to add fire station', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data, message: 'Fire station added successfully' })
  } catch (error: any) {
    console.error('Exception in fire departments POST API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

