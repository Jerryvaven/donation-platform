import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        let query = supabase
            .from('ecommerce_products')
            .select('*')
            .order('name');
        if (category) {
            query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (error) {
            console.log('Error fetching ecommerce products:', error);
            return NextResponse.json({ error: 'Failed to fetch ecommerce products', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ data });
    }
    catch (error: any) {
        console.log('Exception in ecommerce products API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = await request.json();
        const { name, category, price, description, features, card_features, benefits, specifications_array, specifications_data, product_description, health_benefits_description, feature_slides, questions_answers, specifications_image, dimensions_image, image_url, gallery_images, stock_quantity, is_available, sku, weight, dimensions, warranty_info, shipping_info, included_accessories } = body;
        if (!name || !category || !price) {
            return NextResponse.json({ error: 'Name, category, and price are required' }, { status: 400 });
        }
        if (category !== 'Sauna' && category !== 'Cold Plunge') {
            return NextResponse.json({ error: 'Category must be either "Sauna" or "Cold Plunge"' }, { status: 400 });
        }
        const { data, error } = await supabase
            .from('ecommerce_products')
            .insert({
            name,
            category,
            price: parseFloat(price),
            description: description || null,
            features: features || [],
            card_features: card_features || [],
            benefits: benefits || [],
            specifications_array: specifications_array || [],
            specifications_data: specifications_data || null,
            product_description: product_description || null,
            health_benefits_description: health_benefits_description || null,
            feature_slides: feature_slides || null,
            questions_answers: questions_answers || null,
            specifications_image: specifications_image || null,
            dimensions_image: dimensions_image || null,
            image_url: image_url || null,
            gallery_images: gallery_images || [],
            stock_quantity: stock_quantity || 0,
            is_available: is_available !== undefined ? is_available : true,
            sku: sku || null,
            weight: weight ? parseFloat(weight) : null,
            dimensions: dimensions || null,
            warranty_info: warranty_info || null,
            shipping_info: shipping_info || null,
            included_accessories: included_accessories || null,
            updated_at: new Date().toISOString()
        })
            .select()
            .single();
        if (error) {
            console.log('Error adding ecommerce product:', error);
            return NextResponse.json({ error: 'Failed to add ecommerce product', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ data, message: 'Ecommerce product added successfully' });
    }
    catch (error: any) {
        console.log('Exception in ecommerce products POST API:', error);
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
        const updateData: any = { updated_at: new Date().toISOString() };
        if (body.name !== undefined)
            updateData.name = body.name;
        if (body.category !== undefined) {
            if (body.category !== 'Sauna' && body.category !== 'Cold Plunge') {
                return NextResponse.json({ error: 'Category must be either "Sauna" or "Cold Plunge"' }, { status: 400 });
            }
            updateData.category = body.category;
        }
        if (body.price !== undefined)
            updateData.price = parseFloat(body.price);
        if (body.description !== undefined)
            updateData.description = body.description || null;
        if (body.features !== undefined)
            updateData.features = body.features;
        if (body.card_features !== undefined)
            updateData.card_features = body.card_features;
        if (body.benefits !== undefined)
            updateData.benefits = body.benefits;
        if (body.specifications !== undefined)
            updateData.specifications_array = body.specifications;
        if (body.specifications_array !== undefined)
            updateData.specifications_array = body.specifications_array;
        if (body.specifications_data !== undefined)
            updateData.specifications_data = body.specifications_data;
        if (body.product_description !== undefined)
            updateData.product_description = body.product_description;
        if (body.health_benefits_description !== undefined)
            updateData.health_benefits_description = body.health_benefits_description;
        if (body.feature_slides !== undefined)
            updateData.feature_slides = body.feature_slides;
        if (body.questions_answers !== undefined)
            updateData.questions_answers = body.questions_answers;
        if (body.specifications_image !== undefined)
            updateData.specifications_image = body.specifications_image || null;
        if (body.dimensions_image !== undefined)
            updateData.dimensions_image = body.dimensions_image || null;
        if (body.image_url !== undefined)
            updateData.image_url = body.image_url || null;
        if (body.gallery_images !== undefined)
            updateData.gallery_images = body.gallery_images;
        if (body.stock_quantity !== undefined)
            updateData.stock_quantity = body.stock_quantity;
        if (body.is_available !== undefined)
            updateData.is_available = body.is_available;
        if (body.sku !== undefined)
            updateData.sku = body.sku || null;
        if (body.weight !== undefined)
            updateData.weight = body.weight ? parseFloat(body.weight) : null;
        if (body.dimensions !== undefined)
            updateData.dimensions = body.dimensions || null;
        if (body.warranty_info !== undefined)
            updateData.warranty_info = body.warranty_info || null;
        if (body.shipping_info !== undefined)
            updateData.shipping_info = body.shipping_info || null;
        if (body.included_accessories !== undefined)
            updateData.included_accessories = body.included_accessories || null;
        const { data, error } = await supabase
            .from('ecommerce_products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.log('Error updating ecommerce product:', error);
            return NextResponse.json({ error: 'Failed to update ecommerce product', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ data, message: 'Ecommerce product updated successfully' });
    }
    catch (error: any) {
        console.log('Exception in ecommerce products PUT API:', error);
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
            .from('ecommerce_products')
            .delete()
            .eq('id', id);
        if (error) {
            console.log('Error deleting ecommerce product:', error);
            return NextResponse.json({ error: 'Failed to delete ecommerce product', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Ecommerce product deleted successfully' });
    }
    catch (error: any) {
        console.log('Exception in ecommerce products DELETE API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
