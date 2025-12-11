import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
});
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { couponCode, cartTotal, email } = body;
        if (!couponCode) {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
        }
        const { data: coupon, error: couponError } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', couponCode.toUpperCase())
            .eq('is_active', true)
            .single();
        if (couponError || !coupon) {
            return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
        }
        if (coupon.valid_from) {
            const validFrom = new Date(coupon.valid_from);
            if (new Date() < validFrom) {
                return NextResponse.json({ error: 'Coupon is not yet valid' }, { status: 400 });
            }
        }
        if (coupon.valid_until) {
            const validUntil = new Date(coupon.valid_until);
            if (new Date() > validUntil) {
                return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
            }
        }
        if (coupon.maximum_uses && coupon.used_count >= coupon.maximum_uses) {
            return NextResponse.json({ error: 'Coupon has reached maximum uses' }, { status: 400 });
        }
        if (coupon.maximum_uses_per_customer && email) {
            const { data: usageCount, error: usageError } = await supabase
                .from('coupon_usage')
                .select('id', { count: 'exact', head: true })
                .eq('coupon_id', coupon.id)
                .eq('email', email);
            if (!usageError && usageCount && usageCount.length >= coupon.maximum_uses_per_customer) {
                return NextResponse.json({ error: 'You have already used this coupon' }, { status: 400 });
            }
        }
        if (coupon.minimum_purchase && cartTotal < coupon.minimum_purchase) {
            return NextResponse.json({
                error: `Minimum purchase of $${coupon.minimum_purchase} required`,
            }, { status: 400 });
        }
        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = (cartTotal * coupon.discount_value) / 100;
        }
        else {
            discountAmount = coupon.discount_value;
        }
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }
        return NextResponse.json({
            success: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discount_type,
                discountValue: coupon.discount_value,
                discountAmount: Math.round(discountAmount * 100) / 100,
                description: coupon.description,
            },
        });
    }
    catch (error) {
        console.log('Coupon validation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
