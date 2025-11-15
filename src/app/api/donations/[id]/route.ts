import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id } = params

    const { error } = await supabase
      .from('product_donations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting donation:', error)
      return NextResponse.json(
        { error: 'Failed to delete donation', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Donation deleted successfully' })
  } catch (error: any) {
    console.error('Exception in delete donation API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()
    const { id } = params

    const { matched, fire_department_id } = body

    const { data, error } = await supabase
      .from('product_donations')
      .update({
        matched: matched || false,
        fire_department_id: fire_department_id || null,
        status: matched ? 'MATCHED' : 'PENDING'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating donation:', error)
      return NextResponse.json(
        { error: 'Failed to update donation', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, message: 'Donation updated successfully' })
  } catch (error: any) {
    console.error('Exception in update donation API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
