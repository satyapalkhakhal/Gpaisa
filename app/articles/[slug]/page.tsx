import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchArticleBySlug, fetchArticleTranslation, fetchLatestArticles, fetchArticlesByCategory } from '@/lib/articlesApi';
import { buildArticleMetadata } from '@/lib/articleMetadata';
import ArticleView from '@/components/article/ArticleView';

export const revalidate = 86400; // Cache for 1 day (ISR)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug);

    if (!article) {
        return {
            title: 'Article Not Found | gpaisa.in',
        };
    }

    return buildArticleMetadata(article, await fetchArticleTranslation(article));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    // Fetch related articles - by same category or latest
    const [translation, latestArticles, categoryArticles] = await Promise.all([
        fetchArticleTranslation(article),
        fetchLatestArticles(6, 86400),
        article.category
            ? fetchArticlesByCategory(article.category, 6, 86400)
            : fetchLatestArticles(6, 86400)
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
