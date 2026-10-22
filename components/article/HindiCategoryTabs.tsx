import Link from 'next/link';
import type { Article } from '@/lib/articlesApi';
import { CATEGORIES, categoryPath } from '@/lib/categories';

// Category tabs for the Hindi hubs (/hi and /hi/category/[slug]). Only categories that have
// Hindi articles get a tab, so a new category (e.g. credit cards) appears with its first article.
export default function HindiCategoryTabs({ current, articles }: { current?: string; articles: Pick<Article, 'category'>[] }) {
    const used = new Set(articles.map(a => (a.category || '').toUpperCase()));
    const tab = (active: boolean) =>
        `whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${active ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:text-primary-700'}`;

    return (
        <nav aria-label="श्रेणियां" className="flex gap-2 overflow-x-auto pb-1 mb-6">
            <Link href="/hi" className={tab(!current)}>सभी</Link>
            {CATEGORIES.filter(c => used.has(c.dbValue) || c.slug === current).map(c => (
                <Link key={c.slug} href={categoryPath(c, 'hi')} className={tab(current === c.slug)}>{c.hiName}</Link>
            ))}
        </nav>
    );
}
