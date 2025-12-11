import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, description, discountType, discountValue, minimumPurchase, maximumUses, maximumUsesPerCustomer, validFrom, validUntil, } = body;
        if (!code || !discountType || !discountValue) {
            return NextResponse.json({ error: 'Missing required fields: code, discountType, discountValue' }, { status: 400 });
        }
        const { data, error } = await supabase
            .from('coupons')
            .insert([
            {
                code: code.toUpperCase(),
                description: description || null,
                discount_type: discountType,
                discount_value: parseFloat(discountValue),
                minimum_purchase: minimumPurchase ? parseFloat(minimumPurchase) : null,
                maximum_uses: maximumUses ? parseInt(maximumUses) : null,
                maximum_uses_per_customer: maximumUsesPerCustomer ? parseInt(maximumUsesPerCustomer) : null,
                valid_from: validFrom || null,
                valid_until: validUntil || null,
                is_active: true,
            },
        ])
            .select();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true, coupon: data[0] }, { status: 201 });
    }
    catch (error) {
        console.log('Coupon creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true, coupons: data });
    }
    catch (error) {
        console.log('Fetch coupons error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, is_active } = body;
        if (!id) {
            return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
        }
        const { data, error } = await supabase
            .from('coupons')
            .update({ is_active })
            .eq('id', id)
            .select();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true, coupon: data[0] });
    }
    catch (error) {
        console.log('Coupon update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;
        if (!id) {
            return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
        }
        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', id);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.log('Coupon deletion error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
