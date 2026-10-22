// News-portal building blocks for the English (/) and Hindi (/hi) homepages: a lead story,
// story cards, thumbnail rows, a headline list and per-category blocks. Server components;
// every block takes the page language for links, category names and dates.
import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/articlesApi';
import { articlePath, type ArticleLanguage } from '@/lib/articleLocale';
import { categoryName, categoryPath, getCategoryByDbValue, type CategoryDef } from '@/lib/categories';

export const NEWS_LABELS: Record<ArticleLanguage, {
    topStories: string; latest: string; seeAll: string; readMore: string; minRead: string; dateLocale: string;
}> = {
    en: { topStories: 'Top stories', latest: 'Latest news', seeAll: 'See all', readMore: 'More', minRead: 'min read', dateLocale: 'en-IN' },
    hi: { topStories: 'प्रमुख खबरें', latest: 'ताज़ा खबरें', seeAll: 'सभी देखें', readMore: 'और पढ़ें', minRead: 'मिनट', dateLocale: 'hi-IN' },
};

export function articleDate(article: Article, lang: ArticleLanguage): string {
    const parsed = Date.parse(article.published_at || article.date);
    if (Number.isNaN(parsed)) return '';
    return new Date(parsed).toLocaleDateString(NEWS_LABELS[lang].dateLocale, { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
}

/**
 * Up to `count` articles, preferring ones not already shown on the page (`shown`), then
 * topping up with shown ones so a thin category still fills its block. Marks the picks as
 * shown unless `mark` is false (the text-only latest rail, so image blocks can still lead with them).
 */
export function pickArticles(articles: Article[], shown: Set<string>, count: number, mark = true): Article[] {
    const fresh = articles.filter(a => !shown.has(a.id));
    const picked = [...fresh, ...articles.filter(a => shown.has(a.id))].slice(0, count);
    if (mark) picked.forEach(a => shown.add(a.id));
    return picked;
}

const Kicker = ({ article, lang }: { article: Article; lang: ArticleLanguage }) => {
    const def = getCategoryByDbValue(article.category);
    if (!def) return null;
    return (
        <Link href={categoryPath(def, lang)} className="relative z-10 text-[11px] font-bold uppercase tracking-wider text-gw-green hover:underline">
            {lang === 'en' ? def.name.replace(/ News$/, '') : def.hiName}
        </Link>
    );
};

/** Card-wide click target: the headline link stretches over the whole card (kicker stays clickable). */
const HeadlineLink = ({ article, lang, className }: { article: Article; lang: ArticleLanguage; className: string }) => (
    <Link href={articlePath(lang, article.slug)} className={`after:absolute after:inset-0 ${className}`}>
        {article.title}
    </Link>
);

const Thumb = ({ article, sizes, priority = false, className = '' }: { article: Article; sizes: string; priority?: boolean; className?: string }) => (
    <div className={`relative aspect-video overflow-hidden bg-gray-100 ${className}`}>
        {article.image_url && (
            <Image src={article.image_url} alt={article.title} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        )}
    </div>
);

export const SectionHeader = ({ title, href, lang, id }: { title: string; href?: string; lang: ArticleLanguage; id?: string }) => (
    <div className="flex items-end justify-between gap-3 border-b-2 border-gw-text/90 pb-2 mb-5">
        <h2 id={id} className="text-xl sm:text-2xl font-extrabold tracking-tight text-gw-text">
            {href ? <Link href={href} className="hover:text-gw-green">{title}</Link> : title}
        </h2>
        {href && (
            <Link href={href} className="text-sm font-semibold text-gw-green hover:text-gw-greenDark whitespace-nowrap">
                {NEWS_LABELS[lang].seeAll} →
            </Link>
        )}
    </div>
);

export const LeadStory = ({ article, lang }: { article: Article; lang: ArticleLanguage }) => (
    <article className="group relative">
        <Thumb article={article} sizes="(max-width: 1024px) 100vw, 640px" priority className="rounded-lg" />
        <div className="mt-4">
            <Kicker article={article} lang={lang} />
            <h3 className="mt-1.5 text-2xl sm:text-[1.9rem] font-extrabold leading-tight tracking-tight text-gw-text">
                <HeadlineLink article={article} lang={lang} className="hover:text-gw-green" />
            </h3>
            {article.excerpt && <p className="mt-3 text-base text-gray-600 leading-relaxed line-clamp-3">{article.excerpt}</p>}
            <p className="mt-3 text-xs text-gray-500">
                {article.author && <span className="font-semibold text-gray-700">{article.author}</span>}
                {article.author && ' · '}
                <time dateTime={new Date(article.published_at).toISOString()}>{articleDate(article, lang)}</time>
            </p>
        </div>
    </article>
);

export const StoryCard = ({ article, lang }: { article: Article; lang: ArticleLanguage }) => (
    <article className="group relative">
        <Thumb article={article} sizes="(max-width: 640px) 100vw, 320px" className="rounded-lg" />
        <div className="mt-2.5">
            <Kicker article={article} lang={lang} />
            <h3 className="mt-1 text-base font-bold leading-snug text-gw-text line-clamp-3">
                <HeadlineLink article={article} lang={lang} className="hover:text-gw-green" />
            </h3>
        </div>
    </article>
);

export const StoryRow = ({ article, lang }: { article: Article; lang: ArticleLanguage }) => (
    <article className="group relative flex gap-3 py-3">
        <Thumb article={article} sizes="128px" className="w-28 sm:w-32 shrink-0 rounded-md" />
        <div className="min-w-0">
            <Kicker article={article} lang={lang} />
            <h3 className="mt-0.5 text-sm sm:text-[15px] font-bold leading-snug text-gw-text line-clamp-3">
                <HeadlineLink article={article} lang={lang} className="hover:text-gw-green" />
            </h3>
            <p className="mt-1 text-xs text-gray-500">{articleDate(article, lang)}</p>
        </div>
    </article>
);

/** Text-only headline list with dates, for the "Latest" rail. */
export const HeadlineList = ({ articles, lang, title, href }: { articles: Article[]; lang: ArticleLanguage; title: string; href?: string }) => (
    <div>
        <div className="flex items-center justify-between border-b border-gw-border pb-2 mb-1">
            <h2 className="text-base font-extrabold uppercase tracking-wide text-gw-text">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 align-middle" />{title}
            </h2>
            {href && <Link href={href} className="text-xs font-semibold text-gw-green hover:underline">{NEWS_LABELS[lang].seeAll}</Link>}
        </div>
        <ol className="divide-y divide-gw-border">
            {articles.map(article => (
                <li key={article.id} className="group relative py-3">
                    <p className="text-[11px] text-gray-500 mb-0.5">{articleDate(article, lang)}</p>
                    <h3 className="text-sm font-semibold leading-snug text-gw-text line-clamp-3">
                        <HeadlineLink article={article} lang={lang} className="hover:text-gw-green" />
                    </h3>
                </li>
            ))}
        </ol>
    </div>
);

/**
 * Lead story, two secondary stories and a "Latest" rail. Needs at least one article;
 * the secondary column and rail collapse when there are too few.
 */
export function TopStories({ lead, secondary, latest, lang, latestHref }: {
    lead: Article; secondary: Article[]; latest: Article[]; lang: ArticleLanguage; latestHref?: string;
}) {
    return (
        <section aria-labelledby={`top-stories-${lang}`} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <h2 id={`top-stories-${lang}`} className="sr-only">{NEWS_LABELS[lang].topStories}</h2>
            <div className="lg:col-span-6"><LeadStory article={lead} lang={lang} /></div>
            {secondary.length > 0 && (
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:border-l lg:border-gw-border lg:pl-6">
                    {secondary.map(a => <StoryCard key={a.id} article={a} lang={lang} />)}
                </div>
            )}
            {latest.length > 0 && (
                <div className={`${secondary.length > 0 ? 'lg:col-span-3' : 'lg:col-span-6'} lg:border-l lg:border-gw-border lg:pl-6`}>
                    <HeadlineList articles={latest} lang={lang} title={NEWS_LABELS[lang].latest} href={latestHref} />
                </div>
            )}
        </section>
    );
}

/** One desk: a story card on top and up to three thumbnail rows under it. */
export const CategoryBlock = ({ category, articles, lang, href }: { category: CategoryDef; articles: Article[]; lang: ArticleLanguage; href?: string }) => {
    if (articles.length === 0) return null;
    const [first, ...rest] = articles;
    const link = href ?? categoryPath(category, lang);
    return (
        <section aria-label={categoryName(category, lang)}>
            <SectionHeader title={categoryName(category, lang)} href={link} lang={lang} />
            <StoryCard article={first} lang={lang} />
            {rest.length > 0 && (
                <div className="mt-2 divide-y divide-gw-border border-t border-gw-border">
                    {rest.map(a => <StoryRow key={a.id} article={a} lang={lang} />)}
                </div>
            )}
        </section>
    );
};

/** Quick links as rounded pills (sections, tools and rate pages). */
export const PillLinks = ({ links, label }: { links: { href: string; label: string }[]; label: string }) => (
    <nav aria-label={label} className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {links.map(l => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-full border border-gw-border bg-white px-4 py-1.5 text-sm font-semibold text-gw-text hover:border-gw-green hover:text-gw-green transition-colors">
                {l.label}
            </Link>
        ))}
    </nav>
);
