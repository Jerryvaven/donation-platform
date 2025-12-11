import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
export async function PUT(request: NextRequest, context: {
    params: Promise<{
        id: string;
    }>;
}) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = await request.json();
        const { id } = await context.params;
        const { total_donated_value, total_products_donated, city, state, address } = body;
        const { data, error } = await supabase
            .from('donors')
            .update({
            total_donated_value,
            total_products_donated,
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
