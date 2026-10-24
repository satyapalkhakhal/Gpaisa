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
    /** Topics for schema.org knowsAbout. */
    knowsAbout: string[];
}

export const AUTHORS: Author[] = [
    {
        slug: 'satyapal-khakhal',
        name: 'Satyapal Khakhal',
        jobTitle: 'Founder & Writer, Full-Stack Developer',
        image: 'https://res.cloudinary.com/dpqtibvzn/image/upload/v1779511268/thinkscope/merzsltgiiep9ebljs6d.png',
        bio: 'Satyapal Khakhal is the founder of gpaisa.in. He is a full-stack developer by profession and built the site himself, including its financial calculators and live gold, silver and IPO pages. He writes about the stock market, IPOs, gold prices, credit cards and personal finance out of his interest in markets, explaining how each product works using official sources and worked numbers. Where a review is based on a product he has used himself, the article says so. He is not a SEBI-registered investment adviser, and nothing on gpaisa.in is investment advice.',
        sameAs: ['https://www.linkedin.com/in/satyapal-khakhal-b5751b1bb/'],
        knowsAbout: ['Stock market', 'IPOs', 'Personal finance', 'Gold and silver prices', 'Credit cards', 'Software development'],
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
