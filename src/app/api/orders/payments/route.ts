import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
});
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, paymentMethod, amount, transactionId, status = 'pending', paymentResponse, } = body;
        if (!orderId || !paymentMethod || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const { data: payment, error } = await supabase
            .from('order_payments')
            .insert([
            {
                order_id: orderId,
                payment_method: paymentMethod,
                amount,
                currency: 'USD',
                transaction_id: transactionId,
                status,
                payment_response: paymentResponse,
            },
        ])
            .select('*')
            .single();
        if (error) {
            console.log('Payment creation error:', error);
            return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 });
        }
        if (status === 'succeeded') {
            await supabase
                .from('orders')
                .update({ payment_status: 'COMPLETED', status: 'PROCESSING' })
                .eq('id', orderId);
        }
        return NextResponse.json({ success: true, data: payment }, { status: 201 });
    }
    catch (error) {
        console.log('Payment creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const orderId = searchParams.get('orderId');
        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }
        const { data: payments, error } = await supabase
            .from('order_payments')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: false });
        if (error) {
            return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
        }
        return NextResponse.json({ success: true, data: payments });
    }
    catch (error) {
        console.log('Fetch payments error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
