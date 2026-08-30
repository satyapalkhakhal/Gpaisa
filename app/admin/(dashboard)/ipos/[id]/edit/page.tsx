import { notFound } from 'next/navigation';
import { getIpoByIdAdmin } from '@/lib/supabaseAdmin';
import IpoForm from '@/components/admin/ipo/IpoForm';

export default async function EditIpoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ipo = await getIpoByIdAdmin(id);
    if (!ipo) notFound();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit IPO</h1>
            <IpoForm mode="edit" initialIpo={ipo} />
        </div>
    );
}
