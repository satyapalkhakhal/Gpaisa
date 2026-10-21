import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getArticleByIdAdmin, updateArticle, deleteArticle } from '@/lib/adminDb';
import { resolveArticleLanguage } from '@/lib/adminArticleLanguage';
import { validateArticleInput } from '@/lib/validateArticle';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const article = await getArticleByIdAdmin(id);
        if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        return NextResponse.json({ article });
    } catch (error) {
        console.error('[ADMIN_ARTICLE] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load article' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const errors = validateArticleInput(body);
        if (errors.length) {
            return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
        }

        const existing = await getArticleByIdAdmin(id);
        if (!existing) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

        const resolved = await resolveArticleLanguage(body, id);
        if (!resolved.ok) {
            return NextResponse.json({ error: resolved.error }, { status: resolved.status });
        }
        const { slug, language, translation_of } = resolved;

        // Only edits to what readers see count as a content update (not flags/SEO fields).
        const title = body.title.trim();
        const excerpt = body.excerpt.trim();
        const contentChanged = title !== existing.title || excerpt !== existing.excerpt || body.content !== existing.content;

        const article = await updateArticle(id, {
            title,
            slug,
            language,
            translation_of,
            category: body.category,
            subcategory: body.subcategory || null,
            excerpt,
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
            ...(contentChanged ? { content_updated_at: new Date().toISOString() } : {}),
        });
        // Public pages read through cachedRows (tag 'db'); refresh them now instead of at TTL.
        revalidateTag('db');
        return NextResponse.json({ article });
    } catch (error) {
        console.error('[ADMIN_ARTICLE] PATCH failed:', error);
        return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const existing = await getArticleByIdAdmin(id);
        if (!existing) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        await deleteArticle(id);
        revalidateTag('db');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_ARTICLE] DELETE failed:', error);
        return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
    }
}
