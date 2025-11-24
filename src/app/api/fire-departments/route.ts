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

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Fire station ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, city, county, address, latitude, longitude } = body

    // Build update object with only provided fields
    const updateData: any = {}
    if (name !== undefined) updateData.name = name?.trim()
    if (city !== undefined) updateData.city = city?.trim() || null
    if (county !== undefined) updateData.county = county?.trim() || null
    if (address !== undefined) updateData.address = address?.trim() || null
    if (latitude !== undefined) updateData.latitude = latitude || null
    if (longitude !== undefined) updateData.longitude = longitude || null

    const { data, error } = await supabase
      .from('fire_departments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating fire department:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to update fire station', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data, message: 'Fire station updated successfully' })
  } catch (error: any) {
    console.error('Exception in fire departments PUT API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Fire station ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('fire_departments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting fire department:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to delete fire station', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Fire station deleted successfully' })
  } catch (error: any) {
    console.error('Exception in fire departments DELETE API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

