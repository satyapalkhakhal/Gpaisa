import { notFound } from 'next/navigation';
import { getNcdIssueByIdAdmin } from '@/lib/supabaseAdmin';
import NcdIssueForm from '@/components/admin/ncd/NcdIssueForm';

export default async function EditNcdIssuePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const issue = await getNcdIssueByIdAdmin(id);
    if (!issue) notFound();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit NCD Issue</h1>
            <NcdIssueForm mode="edit" initialIssue={issue} />
        </div>
    );
}
