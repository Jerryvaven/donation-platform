import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id } = await context.params

    // First, get the donation details to update donor stats
    const { data: donation, error: fetchError } = await supabase
      .from('product_donations')
      .select('donor_id, product_id, quantity, products(value)')
      .eq('id', id)
      .single()

    if (fetchError || !donation) {
      console.error('Error fetching donation:', fetchError)
      return NextResponse.json(
        { error: 'Donation not found', details: fetchError?.message },
        { status: 404 }
      )
    }

    // Delete the donation
    const { error: deleteError } = await supabase
      .from('product_donations')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting donation:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete donation', details: deleteError.message },
        { status: 500 }
      )
    }

    // Update donor statistics
    const productValue = (donation.products as any)?.value || 0
    const donationValue = productValue * donation.quantity

    // Get current donor stats
    const { data: donor, error: donorError } = await supabase
      .from('donors')
      .select('total_donated_value, total_products_donated')
      .eq('id', donation.donor_id)
      .single()

    if (!donorError && donor) {
      // Update donor stats by subtracting the deleted donation
      const newTotalValue = Math.max(0, (donor.total_donated_value || 0) - donationValue)
      const newTotalProducts = Math.max(0, (donor.total_products_donated || 0) - donation.quantity)

      // Check if donor has any remaining donations
      const { data: remainingDonations, error: checkError } = await supabase
        .from('product_donations')
        .select('id')
        .eq('donor_id', donation.donor_id)

      if (!checkError && remainingDonations && remainingDonations.length === 0) {
        // No remaining donations, delete the donor
        await supabase
          .from('donors')
          .delete()
          .eq('id', donation.donor_id)
      } else {
        // Update donor stats
        await supabase
          .from('donors')
          .update({
            total_donated_value: newTotalValue,
            total_products_donated: newTotalProducts,
            updated_at: new Date().toISOString()
          })
          .eq('id', donation.donor_id)
      }
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()
    const { id } = await context.params

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
