import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchArticleBySlug, fetchArticleTranslation, fetchArticlesByCategory, fetchArticlesByLanguage } from '@/lib/articlesApi';
import { buildArticleMetadata } from '@/lib/articleMetadata';
import ArticleView from '@/components/article/ArticleView';

// Hindi article pages. Related and latest lists only show Hindi articles.

export const revalidate = 86400; // Cache for 1 day (ISR)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug, 86400, 'hi');

    if (!article) {
        return {
            title: 'लेख नहीं मिला | gpaisa.in',
        };
    }

    return buildArticleMetadata(article, await fetchArticleTranslation(article));
}

export default async function HindiArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug, 86400, 'hi');

    if (!article) {
        notFound();
    }

    const [translation, latestArticles, categoryArticles] = await Promise.all([
        fetchArticleTranslation(article),
        fetchArticlesByLanguage('hi', 6, 86400),
        article.category
            ? fetchArticlesByCategory(article.category, 6, 86400, 'hi')
            : fetchArticlesByLanguage('hi', 6, 86400),
    ]);

    return (
        <ArticleView
            article={article}
            translation={translation}
            relatedArticles={categoryArticles.filter(a => a.id !== article.id).slice(0, 4)}
            sidebarArticles={latestArticles.filter(a => a.id !== article.id).slice(0, 5)}
        />
    );
}
