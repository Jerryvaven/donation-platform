import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
export async function PUT(request: NextRequest, { params }: {
    params: Promise<{
        id: string;
    }>;
}) {
    try {
        const supabase = await createServerSupabaseClient();
        const { id } = await params;
        const body = await request.json();
        const { name, city, county, address, latitude, longitude } = body;
        const updateData: any = {};
        if (name !== undefined)
            updateData.name = name;
        if (city !== undefined)
            updateData.city = city || null;
        if (county !== undefined)
            updateData.county = county || null;
        if (address !== undefined)
            updateData.address = address || null;
        if (latitude !== undefined)
            updateData.latitude = latitude ? parseFloat(latitude) : null;
        if (longitude !== undefined)
            updateData.longitude = longitude ? parseFloat(longitude) : null;
        const { data, error } = await supabase
            .from('fire_departments')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.log('Error updating fire department:', error);
            return NextResponse.json({ error: 'Failed to update fire department', details: error.message }, { status: 500 });
        }
        if (!data) {
            return NextResponse.json({ error: 'Fire department not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data,
            message: 'Fire department updated successfully'
        });
    }
    catch (error: any) {
        console.log('Exception in fire departments PUT API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
export async function DELETE(request: NextRequest, { params }: {
    params: Promise<{
        id: string;
    }>;
}) {
    try {
        const supabase = await createServerSupabaseClient();
        const { id } = await params;
        const { error } = await supabase
            .from('fire_departments')
            .delete()
            .eq('id', id);
        if (error) {
            console.log('Error deleting fire department:', error);
            return NextResponse.json({ error: 'Failed to delete fire department', details: error.message }, { status: 500 });
        }
        return NextResponse.json({
            success: true,
            message: 'Fire department deleted successfully'
        });
    }
    catch (error: any) {
        console.log('Exception in fire departments DELETE API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
