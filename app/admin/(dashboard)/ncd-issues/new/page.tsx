import NcdIssueForm from '@/components/admin/ncd/NcdIssueForm';

export default function NewNcdIssuePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">New NCD Issue</h1>
            <NcdIssueForm mode="create" />
        </div>
    );
}
