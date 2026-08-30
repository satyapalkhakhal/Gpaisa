import BuybackForm from '@/components/admin/buyback/BuybackForm';

export default function NewBuybackPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">New Buyback</h1>
            <BuybackForm mode="create" />
        </div>
    );
}
