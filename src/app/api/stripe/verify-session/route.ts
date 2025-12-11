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
        const { orderId, sessionId } = body;
        console.log('=== VERIFY SESSION START ===');
        console.log('orderId:', orderId);
        console.log('sessionId provided:', !!sessionId);
        if (!orderId) {
            return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
        }
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        if (orderError || !order) {
            console.log('Order not found:', orderError);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        console.log('Order found:', { id: order.id, payment_status: order.payment_status, stripe_session_id: order.stripe_session_id });
        const stripeSessionId = sessionId || order.stripe_session_id;
        console.log('Stripe session ID to verify:', stripeSessionId);
        if (!stripeSessionId) {
            console.log('No session ID found');
            return NextResponse.json({ error: 'Session ID not found' }, { status: 400 });
        }
        const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
        console.log('Stripe session retrieved:', { payment_status: session.payment_status, amount_total: session.amount_total });
        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }
        if (session.payment_status === 'paid') {
            console.log('Payment confirmed as PAID, updating order...');
            const { error: paymentError } = await supabase
                .from('order_payments')
                .insert([
                {
                    order_id: orderId,
                    payment_method: 'stripe',
                    amount: (session.amount_total || 0) / 100,
                    currency: session.currency?.toUpperCase() || 'USD',
                    transaction_id: session.payment_intent,
                    status: 'completed',
                    payment_response: session,
                },
            ]);
            if (paymentError) {
                console.log('Payment record error:', paymentError);
            }
            else {
                console.log('Payment record created successfully');
            }
            const { error: updateError } = await supabase
                .from('orders')
                .update({ payment_status: 'COMPLETED' })
                .eq('id', orderId);
            if (updateError) {
                console.log('Order update error:', updateError);
            }
            else {
                console.log('Order payment status updated to COMPLETED');
            }
            console.log('=== VERIFY SESSION END (SUCCESS) ===');
            return NextResponse.json({
                success: true,
                message: 'Payment verified and recorded',
                paymentStatus: 'completed',
            }, { status: 200 });
        }
        else if (session.payment_status === 'unpaid') {
            console.log('Payment status is UNPAID');
            return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
        }
        console.log('=== VERIFY SESSION END (OTHER STATUS) ===');
        return NextResponse.json({
            success: true,
            paymentStatus: session.payment_status,
        }, { status: 200 });
    }
    catch (error: any) {
        console.log('=== VERIFY SESSION ERROR ===', error);
        return NextResponse.json({ error: error.message || 'Failed to verify session' }, { status: 500 });
    }
}
