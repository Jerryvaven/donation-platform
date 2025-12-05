import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Try to create admin client, but handle if service role key is not available
    let adminSupabase
    try {
      adminSupabase = createAdminSupabaseClient()
    } catch (error) {
      console.log('Admin client creation failed:', error)
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

    // Get all regular admins (not superadmins) using admin client (bypasses RLS)
    const { data: adminRecords, error: adminError } = await adminSupabase
      .from('admins')
      .select('user_id, is_superadmin, created_at')
      .eq('is_superadmin', false)

    if (adminError) {
      console.log('Error fetching admin records:', adminError)
      return NextResponse.json({ error: 'Failed to fetch admin records' }, { status: 500 })
    }

    if (!adminRecords || adminRecords.length === 0) {
      return NextResponse.json([])
    }

    // Get user emails for these admin user_ids using admin API
    const userIds = adminRecords.map(admin => admin.user_id)

    let userData: any[] = []
    let userError: any = null

    try {
      // Use admin API to get user information instead of querying auth.users directly
      const { data: users, error: usersError } = await adminSupabase.auth.admin.listUsers()
      
      if (usersError) {
        console.log('Error fetching users from admin API:', usersError)
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
      }

      // Filter users to only include admin user IDs
      userData = users?.users?.filter(user => userIds.includes(user.id)) || []
      userError = usersError
    } catch (adminError) {
      console.log('Error accessing admin API:', adminError)
      return NextResponse.json({ error: 'Failed to access admin API. Admin service may not be properly configured.' }, { status: 500 })
    }

    if (userError) {
      console.log('Error fetching user data:', userError)
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

    // Combine admin data with user emails
    const combinedData = adminRecords.map(admin => ({
      user_id: admin.user_id,
      is_superadmin: admin.is_superadmin,
      created_at: admin.created_at,
      email: userData?.find(user => user.id === admin.user_id)?.email || 'Unknown Email'
    }))

    return NextResponse.json(combinedData)
  } catch (error) {
    console.log('Unexpected error in admins API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
