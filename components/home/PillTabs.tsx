'use client';

import { useState } from 'react';

export interface PillTab {
    key: string;
    label: string;
    count?: number;
}

/**
 * Groww-style chip tabs. Panels are rendered on the server and passed in, so every
 * panel's links stay in the HTML (crawlable) — the client only toggles visibility.
 */
export default function PillTabs({ tabs, panels, initialKey, ariaLabel }: {
    tabs: PillTab[];
    panels: React.ReactNode[];
    initialKey?: string;
    ariaLabel: string;
}) {
    const [active, setActive] = useState(initialKey ?? tabs[0]?.key);

    return (
        <div>
            <div role="tablist" aria-label={ariaLabel} className="flex gap-2 overflow-x-auto pb-1 -mb-1 [scrollbar-width:none]">
                {tabs.map(tab => {
                    const selected = tab.key === active;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => setActive(tab.key)}
                            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${
                                selected
                                    ? 'border-gw-green bg-gw-greenBg text-gw-green font-medium'
                                    : 'border-gw-border bg-white text-gw-text hover:border-gw-sub'
                            }`}
                        >
                            {tab.label}{tab.count != null && <span className="ml-1 opacity-70">({tab.count})</span>}
                        </button>
                    );
                })}
            </div>
            {panels.map((panel, i) => (
                <div key={tabs[i]?.key ?? i} role="tabpanel" hidden={tabs[i]?.key !== active} className="mt-4">
                    {panel}
                </div>
            ))}
        </div>
    );
}
