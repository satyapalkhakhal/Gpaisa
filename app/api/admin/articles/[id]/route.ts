import { NextRequest, NextResponse } from 'next/server';
import { getArticleByIdAdmin, updateArticle, deleteArticle } from '@/lib/supabaseAdmin';
import { fetchArticleBySlug } from '@/lib/supabaseApi';
import { slugify } from '@/lib/slugify';
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

        const slug = slugify(body.slug || body.title);
        if (slug !== existing.slug) {
            const collision = await fetchArticleBySlug(slug);
            if (collision && collision.id !== id) {
                return NextResponse.json({ error: `Slug "${slug}" is already in use.` }, { status: 409 });
            }
        }

        const article = await updateArticle(id, {
            title: body.title.trim(),
            slug,
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
        });
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
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_ARTICLE] DELETE failed:', error);
        return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
    }
}
