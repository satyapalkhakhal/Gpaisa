import { notFound } from 'next/navigation';
import { getRightsIssueByIdAdmin } from '@/lib/supabaseAdmin';
import RightsIssueForm from '@/components/admin/rights/RightsIssueForm';

export default async function EditRightsIssuePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const issue = await getRightsIssueByIdAdmin(id);
    if (!issue) notFound();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Rights Issue</h1>
            <RightsIssueForm mode="edit" initialIssue={issue} />
        </div>
    );
}
