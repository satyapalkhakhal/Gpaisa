import IpoForm from '@/components/admin/ipo/IpoForm';

export default function NewIpoPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">New IPO</h1>
            <IpoForm mode="create" />
        </div>
    );
}
