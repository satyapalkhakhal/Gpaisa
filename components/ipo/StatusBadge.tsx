import type { IpoLifecycleStatus } from '@/lib/ipoTypes';
import { LIFECYCLE_LABELS } from '@/lib/ipoTypes';

const STATUS_STYLES: Record<IpoLifecycleStatus, string> = {
    drhp: 'bg-gray-100 text-gray-600',
    rhp: 'bg-gray-100 text-gray-600',
    announced: 'bg-blue-100 text-blue-700',
    upcoming: 'bg-blue-100 text-blue-700',
    open: 'bg-green-100 text-green-700',
    closed: 'bg-amber-100 text-amber-700',
    allotment: 'bg-amber-100 text-amber-700',
    listed: 'bg-purple-100 text-purple-700',
};

export default function StatusBadge({ status, className = '' }: { status: IpoLifecycleStatus; className?: string }) {
    return (
        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status]} ${className}`}>
            {LIFECYCLE_LABELS[status]}
        </span>
    );
}
