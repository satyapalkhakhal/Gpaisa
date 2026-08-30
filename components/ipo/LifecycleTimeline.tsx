import type { IpoLifecycleStatus } from '@/lib/ipoTypes';
import { LIFECYCLE_LABELS, LIFECYCLE_ORDER } from '@/lib/ipoTypes';

export default function LifecycleTimeline({ status }: { status: IpoLifecycleStatus }) {
    const currentIndex = LIFECYCLE_ORDER.indexOf(status);

    return (
        <ol className="flex flex-wrap items-center gap-y-3" aria-label="IPO lifecycle stage">
            {LIFECYCLE_ORDER.map((stage, i) => {
                const isDone = i < currentIndex;
                const isCurrent = i === currentIndex;
                return (
                    <li key={stage} className="flex items-center">
                        <div className="flex flex-col items-center gap-1 px-2">
                            <span
                                className={`w-3 h-3 rounded-full ${
                                    isCurrent ? 'bg-primary-600 ring-4 ring-primary-100' : isDone ? 'bg-primary-400' : 'bg-gray-200'
                                }`}
                            />
                            <span className={`text-[11px] whitespace-nowrap ${isCurrent ? 'text-primary-700 font-semibold' : isDone ? 'text-gray-500' : 'text-gray-400'}`}>
                                {LIFECYCLE_LABELS[stage]}
                            </span>
                        </div>
                        {i < LIFECYCLE_ORDER.length - 1 && (
                            <div className={`w-6 sm:w-10 h-0.5 ${isDone ? 'bg-primary-400' : 'bg-gray-200'}`} />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
