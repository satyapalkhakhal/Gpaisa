import type { Metadata } from 'next';

// Robots directives for every indexable page. `max-image-preview: large` is what
// allows Google to show large images in Discover and Search results.
// A page-level `robots` replaces the root-layout default entirely (metadata merges
// shallowly), so routes that set their own robots must use this constant rather
// than `{ index: true, follow: true }`.
export const INDEXABLE_ROBOTS: Metadata['robots'] = {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
};

// Search engines truncate titles past ~70 characters and descriptions past ~160 (Bing flags both).
const TITLE_MAX = 70;
const DESCRIPTION_MAX = 160;
const TITLE_SUFFIX = ' | gpaisa.in';

/** `<title>` with the site suffix, dropped when it would push the title past TITLE_MAX. */
export function pageTitle(title: string): string {
    return title.length + TITLE_SUFFIX.length <= TITLE_MAX ? `${title}${TITLE_SUFFIX}` : title;
}

/** Meta description clipped to DESCRIPTION_MAX at a word boundary. */
export function metaDescription(text: string): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= DESCRIPTION_MAX) return clean;
    const cut = clean.slice(0, DESCRIPTION_MAX - 1);
    return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.—–-]+$/, '')}…`;
}
