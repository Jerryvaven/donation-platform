import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Try to create admin client, but handle if service role key is not available
    let adminSupabase
    try {
      adminSupabase = createAdminSupabaseClient()
    } catch (error) {
      console.error('Admin client creation failed:', error)
      return NextResponse.json({ error: 'Admin service not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' }, { status: 500 })
    }

    // Get the current user to check if they're an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if the user is a superadmin using admin client (bypasses RLS)
    const { data: adminData, error: adminCheckError } = await adminSupabase
      .from('admins')
      .select('is_superadmin')
      .eq('user_id', user.id)
      .single()

    if (adminCheckError || !adminData?.is_superadmin) {
      return NextResponse.json({ error: 'Superadmin access required' }, { status: 403 })
    }

    // Get the user ID to promote from the request body
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if the user is already an admin using admin client (bypasses RLS)
    const { data: existingAdmin, error: checkError } = await adminSupabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking existing admin:', checkError)
      return NextResponse.json({ error: 'Failed to check user status' }, { status: 500 })
    }

    if (existingAdmin) {
      return NextResponse.json({ error: 'User is already an admin' }, { status: 400 })
    }

    // Promote the user to admin using admin client (bypasses RLS)
    const { error: promoteError } = await adminSupabase
      .from('admins')
      .insert({
        user_id: userId,
        is_superadmin: false
      })

    if (promoteError) {
      console.error('Error promoting user:', promoteError)
      return NextResponse.json({ error: 'Failed to promote user' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'User promoted to admin successfully' })
  } catch (error) {
    console.error('Unexpected error in promote API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}