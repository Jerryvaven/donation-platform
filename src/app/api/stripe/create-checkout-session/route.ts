import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
});
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId } = body;
        if (!orderId) {
            return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
        }
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);
        if (itemsError || !orderItems || orderItems.length === 0) {
            return NextResponse.json({ error: 'Order has no items' }, { status: 400 });
        }
        const lineItems = orderItems.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product_name,
                    description: item.product_sku ? `SKU: ${item.product_sku}` : 'Product',
                },
                unit_amount: Math.round(item.price_per_unit * 100),
            },
            quantity: item.quantity,
        }));
        const totalAmountCents = lineItems.reduce((sum, item) => {
            return sum + (item.price_data.unit_amount * item.quantity);
        }, 0);
        const STRIPE_MAX_AMOUNT = 99999999;
        if (totalAmountCents > STRIPE_MAX_AMOUNT) {
            console.log(`Order total exceeds Stripe limit: ${totalAmountCents} cents ($${(totalAmountCents / 100).toFixed(2)})`);
            return NextResponse.json({ error: `Order total of $${(totalAmountCents / 100).toFixed(2)} exceeds maximum allowed amount of $999,999.99` }, { status: 400 });
        }
        console.log(`Creating Stripe session for order ${orderId}: ${totalAmountCents} cents ($${(totalAmountCents / 100).toFixed(2)})`);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order-confirmation?orderId=${orderId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/payment?orderId=${orderId}`,
            customer_email: order.email,
        });
        const { error: updateError } = await supabase
            .from('orders')
            .update({ stripe_session_id: session.id })
            .eq('id', orderId);
        if (updateError) {
            console.log('Failed to store session ID:', updateError);
        }
        else {
            console.log(`Session ID stored: ${session.id}`);
        }
        return NextResponse.json({
            success: true,
            checkoutUrl: session.url,
            sessionId: session.id,
        }, { status: 200 });
    }
    catch (error: any) {
        console.log('Stripe checkout session error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 });
    }
}
