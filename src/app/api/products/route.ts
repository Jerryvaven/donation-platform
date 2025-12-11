import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name');
        if (error) {
            console.log('Error fetching products:', error);
            return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ data });
    }
    catch (error: any) {
        console.log('Exception in products API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = await request.json();
        const { name, category, value, description, image_url } = body;
        if (!name || !category || !value) {
            return NextResponse.json({ error: 'Name, category, and value are required' }, { status: 400 });
        }
        const { data, error } = await supabase
            .from('products')
            .insert({
            name,
            category,
            value: parseFloat(value),
            description: description || null,
            image_url: image_url || null
        })
            .select()
            .single();
        if (error) {
            console.log('Error adding product:', error);
            return NextResponse.json({ error: 'Failed to add product', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ data, message: 'Product added successfully' });
    }
    catch (error: any) {
        console.log('Exception in products POST API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }
        const body = await request.json();
        const { name, category, value, description, image_url } = body;
        const updateData: any = {};
        if (name !== undefined)
            updateData.name = name;
        if (category !== undefined)
            updateData.category = category;
        if (value !== undefined)
            updateData.value = parseFloat(value);
        if (description !== undefined)
            updateData.description = description || null;
        if (image_url !== undefined)
            updateData.image_url = image_url || null;
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
        return NextResponse.json({ data, message: 'Product updated successfully' });
    }
    catch (error: any) {
        console.log('Exception in products PUT API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error) {
            console.log('Error deleting product:', error);
            return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Product deleted successfully' });
    }
    catch (error: any) {
        console.log('Exception in products DELETE API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
