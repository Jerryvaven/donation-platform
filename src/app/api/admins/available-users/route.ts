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
      console.log('Admin client created successfully')
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

    // Get all admin user IDs to exclude them using admin client (bypasses RLS)
    const { data: adminRecords, error: adminError } = await adminSupabase
      .from('admins')
      .select('user_id')

    if (adminError) {
      console.log('Error fetching admin records:', adminError)
      return NextResponse.json({ error: 'Failed to fetch admin records' }, { status: 500 })
    }

    const adminUserIds = adminRecords?.map(admin => admin.user_id) || []

    // Get all users who are not admins using admin API
    let userData: any[] = []
    let userError: any = null

    try {
      // Use admin API to get all users
      const { data: users, error: usersError } = await adminSupabase.auth.admin.listUsers()
      
      if (usersError) {
        console.log('Error fetching users from admin API:', usersError)
        return NextResponse.json({ error: 'Failed to fetch available users' }, { status: 500 })
      }

      // Filter out admin users and limit to 50
      const allUsers = users?.users || []
      userData = allUsers
        .filter(user => !adminUserIds.includes(user.id))
        .slice(0, 50)
      
      userError = usersError

      console.log('Successfully fetched available users:', userData.length, 'out of', allUsers.length, 'total users')
    } catch (adminError) {
      console.log('Error accessing admin API:', adminError)
      return NextResponse.json({ error: 'Failed to access admin API. Admin service may not be properly configured.' }, { status: 500 })
    }

    if (userError) {
      console.log('Error fetching available users:', userError)
      return NextResponse.json({ error: 'Failed to fetch available users' }, { status: 500 })
    }

    return NextResponse.json(userData || [])
  } catch (error) {
    console.log('Unexpected error in available-users API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
