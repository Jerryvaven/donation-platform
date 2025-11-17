import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Exception in products API:', error)
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

    const { name, category, value, description, image_url } = body

    // Validate required fields
    if (!name || !category || !value) {
      return NextResponse.json(
        { error: 'Name, category, and value are required' },
        { status: 400 }
      )
    }

    // Insert new product
    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        category,
        value: parseFloat(value),
        description: description || null,
        image_url: image_url || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding product:', error)
      return NextResponse.json(
        { error: 'Failed to add product', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, message: 'Product added successfully' })
  } catch (error: any) {
    console.error('Exception in products POST API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
