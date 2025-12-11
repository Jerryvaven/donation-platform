import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        let adminSupabase;
        try {
            adminSupabase = createAdminSupabaseClient();
        }
        catch (error) {
            console.log('Admin client creation failed:', error);
            return NextResponse.json({ error: 'Admin service not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' }, { status: 500 });
        }
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log('Auth check - User:', user?.id, 'Error:', authError);
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { data: adminData, error: adminCheckError } = await adminSupabase
            .from('admins')
            .select('is_superadmin')
            .eq('user_id', user.id)
            .single();
        console.log('User ID:', user.id);
        console.log('Admin check error:', adminCheckError);
        console.log('Admin data:', adminData);
        if (adminCheckError) {
            console.log('Admin check error details:', adminCheckError);
            return NextResponse.json({ error: 'Database error checking admin status' }, { status: 500 });
        }
        if (!adminData) {
            console.log('No admin record found for user:', user.id);
            return NextResponse.json({ error: 'User is not an admin' }, { status: 403 });
        }
        if (!adminData.is_superadmin) {
            console.log('User is admin but not superadmin:', user.id);
            return NextResponse.json({ error: 'Superadmin access required' }, { status: 403 });
        }
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
        }
        try {
            const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true,
            });
            if (createError) {
                console.log('Error creating user:', createError);
                if (createError.code === 'email_exists' || createError.message?.includes('already registered') || createError.message?.includes('already been registered')) {
                    return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
                }
                return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
            }
            if (!newUser.user?.id) {
                return NextResponse.json({ error: 'Failed to create user - no user ID returned' }, { status: 500 });
            }
            const { error: adminInsertError } = await adminSupabase
                .from('admins')
                .insert({
                user_id: newUser.user.id,
                is_superadmin: false
            });
            if (adminInsertError) {
                console.log('Error adding user to admins table:', adminInsertError);
                try {
                    await adminSupabase.auth.admin.deleteUser(newUser.user.id);
                }
                catch (cleanupError) {
                    console.log('Error cleaning up user after admin insertion failure:', cleanupError);
                }
                return NextResponse.json({ error: 'Failed to assign admin role to user' }, { status: 500 });
            }
            return NextResponse.json({
                success: true,
                message: `${email} created successfully as an admin`,
                userId: newUser.user.id
            });
        }
        catch (createError: any) {
            console.log('Error creating user:', createError);
            if (createError.code === 'email_exists' || createError.message?.includes('already registered') || createError.message?.includes('already been registered') || createError.message?.includes('already exists')) {
                return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
            }
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }
    }
    catch (error) {
        console.log('Unexpected error in add-user API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
