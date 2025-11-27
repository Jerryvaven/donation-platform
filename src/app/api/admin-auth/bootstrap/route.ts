import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is already an admin
    const adminSupabase = createAdminSupabaseClient()
    const { data: existingAdmin } = await adminSupabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'User is already an admin',
        isSuperAdmin: existingAdmin.is_superadmin
      })
    }

    // Add user as superadmin
    const { data: newAdmin, error: insertError } = await adminSupabase
      .from('admins')
      .insert({
        user_id: user.id,
        is_superadmin: true
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating admin record:', insertError)
      return NextResponse.json({ error: 'Failed to create admin record' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'User promoted to superadmin successfully',
      isSuperAdmin: true
    })
  } catch (error) {
    console.error('Unexpected error in bootstrap:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}