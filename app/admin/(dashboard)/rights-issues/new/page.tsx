import RightsIssueForm from '@/components/admin/rights/RightsIssueForm';

export default function NewRightsIssuePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">New Rights Issue</h1>
            <RightsIssueForm mode="create" />
        </div>
    );
}
