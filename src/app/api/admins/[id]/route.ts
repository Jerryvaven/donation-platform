import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      console.error('Admin check error details:', adminCheckError)
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

    const { id: adminIdToDelete } = await params

    // Prevent superadmin from deleting themselves
    if (adminIdToDelete === user.id) {
      return NextResponse.json({ error: 'Cannot delete your own admin account' }, { status: 400 })
    }

    // Check if the admin to be deleted exists
    const { data: adminToDelete, error: fetchError } = await adminSupabase
      .from('admins')
      .select('*')
      .eq('user_id', adminIdToDelete)
      .single()

    if (fetchError || !adminToDelete) {
      console.log('Admin to delete not found:', adminIdToDelete)
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 })
    }

    // Prevent deleting the last super admin
    if (adminToDelete.is_superadmin) {
      const { data: allSuperAdmins, error: countError } = await adminSupabase
        .from('admins')
        .select('user_id')
        .eq('is_superadmin', true)

      if (countError) {
        console.error('Error checking super admin count:', countError)
        return NextResponse.json({ error: 'Failed to verify admin permissions' }, { status: 500 })
      }

      if (allSuperAdmins && allSuperAdmins.length <= 1) {
        return NextResponse.json({ error: 'Cannot delete the last super admin' }, { status: 400 })
      }
    }

    // Delete the admin record
    const { error: deleteError } = await adminSupabase
      .from('admins')
      .delete()
      .eq('user_id', adminIdToDelete)

    if (deleteError) {
      console.error('Error deleting admin:', deleteError)
      return NextResponse.json({ error: 'Failed to delete admin user' }, { status: 500 })
    }

    // Also delete the user account from auth.users completely
    const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(adminIdToDelete)
    if (authDeleteError) {
      console.error('Warning: Could not delete auth user account, but admin record was removed:', authDeleteError)
      // Note: We don't fail the operation since the admin privileges were successfully removed
    } else {
      console.log('Successfully deleted user account from auth:', adminIdToDelete)
    }

    console.log('Successfully deleted admin:', adminIdToDelete)
    return NextResponse.json({ message: 'Admin user completely deleted from the system' })

  } catch (error) {
    console.error('Unexpected error in delete admin:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}