'use client';

// Client-only, localStorage-backed "compare tray" — no backend needed. Selections
// persist across hub/detail page navigation within the browser; a custom window
// event lets independently-mounted components (card checkboxes, the floating bar)
// stay in sync without a shared React context.

const STORAGE_KEY = 'gpaisa_ipo_compare';
const CHANGE_EVENT = 'ipo-compare-change';
export const MAX_COMPARE = 3;

export interface CompareItem {
    slug: string;
    name: string;
}

export function getCompareSelection(): CompareItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function persist(items: CompareItem[]) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // localStorage unavailable (private mode, etc.) — selection just won't persist.
    }
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function isCompareSelected(slug: string): boolean {
    return getCompareSelection().some(i => i.slug === slug);
}

/** Returns the resulting selection so callers can show feedback (e.g. "tray full"). */
export function toggleCompareSelection(item: CompareItem): CompareItem[] {
    const current = getCompareSelection();
    const exists = current.some(i => i.slug === item.slug);
    let next: CompareItem[];
    if (exists) {
        next = current.filter(i => i.slug !== item.slug);
    } else if (current.length >= MAX_COMPARE) {
        return current; // tray full — no-op
    } else {
        next = [...current, item];
    }
    persist(next);
    return next;
}

export function clearCompareSelection() {
    persist([]);
}

export function subscribeToCompareChanges(callback: () => void): () => void {
    window.addEventListener(CHANGE_EVENT, callback);
    window.addEventListener('storage', callback); // cross-tab sync
    return () => {
        window.removeEventListener(CHANGE_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
}
