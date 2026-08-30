export type DataSourceKind = 'official' | 'unofficial' | 'editorial' | 'estimated';

const STYLES: Record<DataSourceKind, { label: string; className: string }> = {
    official: { label: 'Official', className: 'bg-green-50 text-green-700 border-green-200' },
    unofficial: { label: 'Unofficial · Market Data', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    editorial: { label: 'Editorial Analysis', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    estimated: { label: 'Estimate — Not Guaranteed', className: 'bg-purple-50 text-purple-700 border-purple-200' },
};

/**
 * Distinguishes official data, unofficial market chatter (GMP), editorial opinion (reviews),
 * and calculated estimates (allotment probability) so readers never mistake one for another.
 */
export default function DataSourceBadge({ kind, className = '' }: { kind: DataSourceKind; className?: string }) {
    const { label, className: styleClassName } = STYLES[kind];
    return (
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border ${styleClassName} ${className}`}>
            {label}
        </span>
    );
}
