import { notFound } from 'next/navigation';
import { getBuybackByIdAdmin } from '@/lib/supabaseAdmin';
import BuybackForm from '@/components/admin/buyback/BuybackForm';

export default async function EditBuybackPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const buyback = await getBuybackByIdAdmin(id);
    if (!buyback) notFound();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Buyback</h1>
            <BuybackForm mode="edit" initialBuyback={buyback} />
        </div>
    );
}
