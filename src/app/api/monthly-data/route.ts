import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: donations } = await supabase
            .from('product_donations')
            .select('quantity, donation_date, matched, products(value)');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const monthlyStats = months.map((month, index) => {
            const monthNum = index + 1;
            const monthDonations = donations?.filter(d => {
                const date = new Date(d.donation_date);
                return date.getMonth() + 1 === monthNum && date.getFullYear() === currentYear;
            }) || [];
            const totalDonations = monthDonations.reduce((sum, d) => {
                const products = d.products as any;
                let valueTotal = 0;
                if (Array.isArray(products)) {
                    valueTotal = products.reduce((acc: number, p: any) => acc + Number(p?.value || 0), 0);
                }
                else if (products) {
                    valueTotal = Number(products.value || 0);
                }
                return sum + valueTotal * d.quantity;
            }, 0);
            const totalMatched = monthDonations.reduce((sum, d) => {
                const products = d.products as any;
                let valueTotal = 0;
                if (Array.isArray(products)) {
                    valueTotal = products.reduce((acc: number, p: any) => acc + Number(p?.value || 0), 0);
                }
                else if (products) {
                    valueTotal = Number(products.value || 0);
                }
                return d.matched ? sum + valueTotal * d.quantity : sum;
            }, 0);
            return {
                month,
                donations: totalDonations,
                matched: totalMatched
            };
        });
        return NextResponse.json({ data: monthlyStats });
    }
    catch (error: any) {
        console.log('Exception in monthly data API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
