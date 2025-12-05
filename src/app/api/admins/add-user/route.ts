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
      console.log('Admin client creation failed:', error)
      return NextResponse.json({ error: 'Admin service not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' }, { status: 500 })
    }

    // Get the current user to check if they're an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('Auth check - User:', user?.id, 'Error:', authError)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if the user is a superadmin using admin client (bypasses RLS)
    const { data: adminData, error: adminCheckError } = await adminSupabase
      .from('admins')
      .select('is_superadmin')
      .eq('user_id', user.id)
      .single()

    console.log('User ID:', user.id)
    console.log('Admin check error:', adminCheckError)
    console.log('Admin data:', adminData)

    if (adminCheckError) {
      console.log('Admin check error details:', adminCheckError)
      return NextResponse.json({ error: 'Database error checking admin status' }, { status: 500 })
    }

    if (!adminData) {
      console.log('No admin record found for user:', user.id)
      return NextResponse.json({ error: 'User is not an admin' }, { status: 403 })
    }

    if (!adminData.is_superadmin) {
      console.log('User is admin but not superadmin:', user.id)
      return NextResponse.json({ error: 'Superadmin access required' }, { status: 403 })
    }

    // Get the user data from the request body
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    // Check if user already exists by trying to get user by email
    // Note: Supabase admin API doesn't have getUserByEmail, so we'll handle this in the createUser call
    try {
      // Create the new user
      const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Auto-confirm email for admin-created users
      })

      if (createError) {
        console.log('Error creating user:', createError)
        if (createError.code === 'email_exists' || createError.message?.includes('already registered') || createError.message?.includes('already been registered')) {
          return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }

      if (!newUser.user?.id) {
        return NextResponse.json({ error: 'Failed to create user - no user ID returned' }, { status: 500 })
      }

      // Add the user to the admins table with regular admin role (not superadmin)
      const { error: adminInsertError } = await adminSupabase
        .from('admins')
        .insert({
          user_id: newUser.user.id,
          is_superadmin: false
        })

      if (adminInsertError) {
        console.log('Error adding user to admins table:', adminInsertError)
        // Try to clean up the created user if admin insertion fails
        try {
          await adminSupabase.auth.admin.deleteUser(newUser.user.id)
        } catch (cleanupError) {
          console.log('Error cleaning up user after admin insertion failure:', cleanupError)
        }
        return NextResponse.json({ error: 'Failed to assign admin role to user' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: `${email} created successfully as an admin`,
        userId: newUser.user.id
      })
    } catch (createError: any) {
      console.log('Error creating user:', createError)
      if (createError.code === 'email_exists' || createError.message?.includes('already registered') || createError.message?.includes('already been registered') || createError.message?.includes('already exists')) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }
  } catch (error) {
    console.log('Unexpected error in add-user API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
