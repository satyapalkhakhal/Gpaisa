// Authors with a public profile page (/author/<slug>). Articles store the author as free
// text, so bylines are matched case- and space-insensitively ("SATYAPAL KHAKHAL" → Satyapal
// Khakhal). Only facts the author has published on /about go here; add credentials and
// profile links (sameAs) when the author provides them.
import { SITE_URL } from './articleLocale';

export interface Author {
    slug: string;
    name: string;
    jobTitle: string;
    image: string;
    bio: string;
    /** Public profiles (LinkedIn, X, …) for schema.org sameAs. */
    sameAs: string[];
}

export const AUTHORS: Author[] = [
    {
        slug: 'satyapal-khakhal',
        name: 'Satyapal Khakhal',
        jobTitle: 'Founder & Financial Content Author',
        image: 'https://res.cloudinary.com/dpqtibvzn/image/upload/v1779511268/thinkscope/merzsltgiiep9ebljs6d.png',
        bio: 'Satyapal Khakhal is the founder of gpaisa.in and writes about personal finance, gold prices, investment trends, credit cards, and financial tools for Indian readers. His focus is on simplifying complex financial topics into practical, easy-to-understand insights backed by real market data and research.',
        sameAs: [],
    },
];

const normalizeName = (name: string) => name.trim().replace(/\s+/g, ' ').toLowerCase();

export function findAuthorByName(name?: string | null): Author | undefined {
    if (!name) return undefined;
    const key = normalizeName(name);
    return AUTHORS.find(a => normalizeName(a.name) === key);
}

export function getAuthorBySlug(slug: string): Author | undefined {
    return AUTHORS.find(a => a.slug === slug);
}

export const authorPath = (author: Author) => `/author/${author.slug}`;

/** One schema.org Person node per author, shared by the author page, /about and article markup. */
export const authorPersonId = (author: Author) => `${SITE_URL}${authorPath(author)}#person`;

/** Lower-cased name as matched in SQL (lower(btrim(author))). */
export const authorNameKey = (author: Author) => normalizeName(author.name);
