import { NextRequest, NextResponse } from 'next/server';
import { fetchArticleById } from '@/lib/supabaseApi';

/**
 * API Route to lookup article slug by ID
 * Used by middleware to redirect old article ID URLs to new slug-based URLs
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json(
            { error: 'No article ID provided' },
            { status: 400 }
        );
    }

    try {
        // Fetch article by ID from Supabase
        const article = await fetchArticleById(id);

        if (article && article.slug) {
            return NextResponse.json({
                slug: article.slug,
                title: article.title
            });
        }

        return NextResponse.json(
            { error: 'Article not found' },
            { status: 404 }
        );
    } catch (error) {
        console.error('Article redirect lookup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
