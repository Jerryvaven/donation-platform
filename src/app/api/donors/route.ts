import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const response = await supabase
            .from('donors')
            .select(`
        *,
        product_donations (
          *,
          products (*),
          fire_departments (*)
        )
      `)
            .order('created_at', { ascending: false });
        const { data, error } = response;
        if (error) {
            console.log('Error fetching donors:', error);
            return NextResponse.json({ error: 'Failed to fetch donors', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ data });
    }
    catch (error: any) {
        console.log('Exception in donors API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = await request.json();
        const { name, city, state, address, totalDonatedValue, totalProductsDonated } = body;
        if (!name) {
            return NextResponse.json({ error: 'Donor name is required' }, { status: 400 });
        }
        const { data, error } = await supabase
            .from('donors')
            .insert([{
                name,
                city: city || null,
                state: state || null,
                address: address || null,
                total_donated_value: totalDonatedValue || 0,
                total_products_donated: totalProductsDonated || 0
            }])
            .select()
            .single();
        if (error) {
            console.log('Error creating donor:', error);
            return NextResponse.json({ error: 'Failed to create donor', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ data, message: 'Donor created successfully' }, { status: 201 });
    }
    catch (error: any) {
        console.log('Exception in create donor API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = await request.json();
        const { id, name, city, state, address } = body;
        if (!id) {
            return NextResponse.json({ error: 'Donor ID is required' }, { status: 400 });
        }
        const { data, error } = await supabase
            .from('donors')
            .update({
            name: name || null,
            city: city || null,
            state: state || null,
            address: address || null,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.log('Error updating donor:', error);
            return NextResponse.json({ error: 'Failed to update donor', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ data, message: 'Donor updated successfully' });
    }
    catch (error: any) {
        console.log('Exception in update donor API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
