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

    // Check if user is admin using admin client (bypasses RLS)
    let adminSupabase
    try {
      adminSupabase = createAdminSupabaseClient()
    } catch (error) {
      console.error('Admin client creation failed:', error)
      return NextResponse.json({ error: 'Admin service not configured. Please contact administrator.' }, { status: 500 })
    }

    const { data: adminData, error: adminCheckError } = await adminSupabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (adminCheckError || !adminData) {
      console.error('Admin check failed:', adminCheckError)
      return NextResponse.json({ error: 'Access denied: Admin role required.' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      isSuperAdmin: adminData.is_superadmin || false
    })
  } catch (error) {
    console.error('Unexpected error in admin auth check:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}