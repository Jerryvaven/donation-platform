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
        const { name, category, value, description, image_url } = body;
        const updateData: any = {};
        if (name !== undefined)
            updateData.name = name;
        if (category !== undefined)
            updateData.category = category;
        if (value !== undefined) {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
                updateData.value = parsedValue;
            }
            else {
                return NextResponse.json({ error: 'Invalid value provided' }, { status: 400 });
            }
        }
        if (description !== undefined)
            updateData.description = description || null;
        if (image_url !== undefined)
            updateData.image_url = image_url || null;
        console.log('Final update data:', updateData);
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
        }
        const { data, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.log('Error updating product:', error);
            return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
        }
        if (!data) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data,
            message: 'Product updated successfully'
        });
    }
    catch (error: any) {
        console.log('Exception in products PUT API:', error);
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
            .from('products')
            .delete()
            .eq('id', id);
        if (error) {
            console.log('Error deleting product:', error);
            return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 });
        }
        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        });
    }
    catch (error: any) {
        console.log('Exception in products DELETE API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
