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
