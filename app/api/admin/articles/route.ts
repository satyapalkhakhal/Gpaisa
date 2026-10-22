import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { listArticlesAdmin, createArticle } from '@/lib/adminDb';
import { resolveArticleLanguage } from '@/lib/adminArticleLanguage';
import { validateArticleInput } from '@/lib/validateArticle';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    try {
        const result = await listArticlesAdmin({
            page: Number(searchParams.get('page') || '1'),
            pageSize: Number(searchParams.get('pageSize') || '20'),
            search: searchParams.get('search') || undefined,
            category: searchParams.get('category') || undefined,
            status: searchParams.get('status') || undefined,
        });
        return NextResponse.json(result);
    } catch (error) {
        console.error('[ADMIN_ARTICLES] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const errors = validateArticleInput(body);
        if (errors.length) {
            return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
        }

        const resolved = await resolveArticleLanguage(body);
        if (!resolved.ok) {
            return NextResponse.json({ error: resolved.error }, { status: resolved.status });
        }
        const { slug, language, translation_of } = resolved;

        const now = new Date().toISOString();
        const article = await createArticle({
            title: body.title.trim(),
            slug,
            language,
            translation_of,
            category: body.category,
            subcategory: body.subcategory || null,
            excerpt: body.excerpt.trim(),
            content: body.content,
            image_url: body.image_url || '',
            author: body.author?.trim() || 'Gpaisa Desk',
            author_avatar: body.author_avatar || '',
            read_time: body.read_time || '',
            tags: Array.isArray(body.tags) ? body.tags : [],
            is_featured: !!body.is_featured,
            is_editors_pick: !!body.is_editors_pick,
            is_trending: !!body.is_trending,
            status: body.status === 'draft' ? 'draft' : 'published',
            meta_title: body.meta_title || '',
            meta_description: body.meta_description || '',
            meta_keywords: body.meta_keywords || '',
            focus_keyword: body.focus_keyword || '',
            article_type: body.article_type === 'news' ? 'news' : 'article',
            published_at: body.published_at || now,
            content_updated_at: body.published_at || now,
            date: body.date || now,
        });
        // Public pages read through cachedRows (tag 'db'); refresh them now instead of at TTL.
        revalidateTag('db');
        return NextResponse.json({ article }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN_ARTICLES] POST failed:', error);
        return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }
}
