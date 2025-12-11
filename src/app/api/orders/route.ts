import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
});
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, firstName, lastName, phone, shippingAddress, shippingCity, shippingState, shippingZipCode, shippingCountry, billingAddress, billingCity, billingState, billingZipCode, billingCountry, sameAsShipping, subtotal, shippingCost, tax, discountAmount, total, couponCode, couponDiscountType, couponDiscountValue, items, customerNotes, paymentMethod, } = body;
        if (!email || !firstName || !lastName || !phone || !shippingAddress || !shippingCity || !shippingState || !shippingZipCode) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
        }
        if (total > 999999.99) {
            return NextResponse.json({ error: 'Order total exceeds maximum allowed amount of $999,999.99' }, { status: 400 });
        }
        console.log('Items received:', JSON.stringify(items, null, 2));
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([
            {
                email,
                first_name: firstName,
                last_name: lastName,
                phone,
                shipping_address: shippingAddress,
                shipping_city: shippingCity,
                shipping_state: shippingState,
                shipping_zip_code: shippingZipCode,
                shipping_country: shippingCountry || 'United States',
                billing_address: billingAddress,
                billing_city: billingCity,
                billing_state: billingState,
                billing_zip_code: billingZipCode,
                billing_country: billingCountry,
                same_as_shipping: sameAsShipping,
                subtotal,
                shipping_cost: shippingCost,
                tax,
                discount_amount: discountAmount,
                total,
                coupon_code: couponCode,
                coupon_discount_type: couponDiscountType,
                coupon_discount_value: couponDiscountValue,
                payment_method: paymentMethod,
                customer_notes: customerNotes,
                status: 'PENDING',
                payment_status: 'PENDING',
            },
        ])
            .select('id')
            .single();
        if (orderError) {
            console.log('Order creation error:', orderError);
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }
        const orderId = orderData.id;
        console.log('Order created with ID:', orderId);
        try {
            const orderItems = items.map((item: any) => {
                const priceStr = typeof item.price === 'string' ? item.price : String(item.price);
                const cleanPrice = parseFloat(priceStr.replace(/[$,]/g, ''));
                if (isNaN(cleanPrice)) {
                    throw new Error(`Invalid price for item ${item.name}: ${item.price}`);
                }
                const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
                return {
                    order_id: orderId,
                    ecommerce_product_id: isValidUUID ? item.id : null,
                    product_name: item.name,
                    product_sku: item.sku || null,
                    price_per_unit: cleanPrice,
                    quantity: parseInt(item.quantity) || 1,
                    line_total: cleanPrice * (parseInt(item.quantity) || 1),
                    product_image_url: item.image || null,
                    product_category: item.category || null,
                };
            });
            console.log('Order items to insert:', JSON.stringify(orderItems, null, 2));
            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);
            if (itemsError) {
                console.log('Order items creation error:', itemsError);
                return NextResponse.json({ error: 'Failed to save order items: ' + itemsError.message }, { status: 500 });
            }
        }
        catch (itemError: any) {
            console.log('Error creating order items:', itemError);
            return NextResponse.json({ error: 'Error processing items: ' + itemError.message }, { status: 500 });
        }
        if (couponCode) {
            const { data: couponData, error: couponError } = await supabase
                .from('coupons')
                .select('id, used_count, maximum_uses')
                .eq('code', couponCode)
                .eq('is_active', true)
                .single();
            if (!couponError && couponData) {
                await supabase.from('coupon_usage').insert([
                    {
                        coupon_id: couponData.id,
                        order_id: orderId,
                        email,
                    },
                ]);
                if (!couponData.maximum_uses || couponData.used_count < couponData.maximum_uses) {
                    await supabase
                        .from('coupons')
                        .update({ used_count: (couponData.used_count || 0) + 1 })
                        .eq('id', couponData.id);
                }
            }
        }
        return NextResponse.json({ success: true, orderId }, { status: 201 });
    }
    catch (error) {
        console.log('Order creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const orderId = searchParams.get('id');
        const email = searchParams.get('email');
        const fetchAll = searchParams.get('all');
        if (orderId) {
            const { data: order, error } = await supabase
                .from('orders')
                .select(`
          *,
          items:order_items(*),
          payments:order_payments(*)
          `)
                .eq('id', orderId)
                .single();
            if (error) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: order });
        }
        if (email) {
            const { data: orders, error } = await supabase
                .from('orders')
                .select(`
          *,
          items:order_items(*),
          payments:order_payments(*)
          `)
                .eq('email', email)
                .order('created_at', { ascending: false });
            if (error) {
                return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
            }
            return NextResponse.json({ success: true, data: orders });
        }
        if (fetchAll === 'true') {
            const paymentStatus = searchParams.get('paymentStatus');
            const status = searchParams.get('status');
            let query = supabase
                .from('orders')
                .select(`
          *,
          items:order_items(*),
          payments:order_payments(*)
          `);
            if (paymentStatus) {
                query = query.eq('payment_status', paymentStatus);
            }
            if (status) {
                query = query.eq('status', status);
            }
            const { data: orders, error } = await query.order('created_at', { ascending: false });
            if (error) {
                console.log('Failed to fetch all orders:', error);
                return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
            }
            return NextResponse.json({ success: true, data: orders });
        }
        return NextResponse.json({ error: 'Missing required parameter' }, { status: 400 });
    }
    catch (error) {
        console.log('Fetch order error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, status, paymentStatus, trackingNumber, shippingProvider, internalNotes } = body;
        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }
        const updateData: any = {
            updated_at: new Date().toISOString(),
        };
        if (status) {
            updateData.status = status;
            if (status === 'SHIPPED' && !updateData.shipped_date) {
                updateData.shipped_date = new Date().toISOString();
            }
            if (status === 'DELIVERED' && !updateData.delivered_date) {
                updateData.delivered_date = new Date().toISOString();
            }
        }
        if (paymentStatus) {
            updateData.payment_status = paymentStatus;
        }
        if (trackingNumber !== undefined) {
            updateData.tracking_number = trackingNumber;
        }
        if (shippingProvider !== undefined) {
            updateData.shipping_provider = shippingProvider;
        }
        if (internalNotes !== undefined) {
            updateData.internal_notes = internalNotes;
        }
        const { data, error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', orderId)
            .select(`
        *,
        items:order_items(*),
        payments:order_payments(*)
        `)
            .single();
        if (error) {
            console.log('Order update error:', error);
            return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
        }
        return NextResponse.json({ success: true, data }, { status: 200 });
    }
    catch (error) {
        console.log('Order update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
