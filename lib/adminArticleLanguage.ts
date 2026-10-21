// Server-only. Resolves the language fields of an admin article create/update:
// language, the English article a Hindi article translates, and a slug unique within
// that language.
import { getArticleBySlugAdmin, getTranslationOfAdmin } from './adminDb';
import { slugify } from './slugify';
import { articlePath, toArticleLanguage, type ArticleLanguage } from './articleLocale';

export interface ArticleLanguageBody {
    title?: string;
    slug?: string;
    language?: string;
    translation_of_slug?: string;
}

export type ResolvedArticleLanguage =
    | { ok: true; language: ArticleLanguage; slug: string; translation_of: string | null }
    | { ok: false; status: number; error: string };

export async function resolveArticleLanguage(body: ArticleLanguageBody, currentId?: string): Promise<ResolvedArticleLanguage> {
    const language = toArticleLanguage(body.language);

    // A Hindi article may name the English article it translates (by slug).
    let english: Awaited<ReturnType<typeof getArticleBySlugAdmin>> = null;
    const translationSlug = language === 'hi' ? slugify(body.translation_of_slug || '') : '';
    if (translationSlug) {
        english = await getArticleBySlugAdmin(translationSlug, 'en');
        if (!english) {
            return { ok: false, status: 400, error: `No English article has the slug "${translationSlug}".` };
        }
        const existing = await getTranslationOfAdmin(english.id);
        if (existing && existing.id !== currentId) {
            return { ok: false, status: 409, error: `That English article already has a Hindi translation: ${articlePath('hi', existing.slug)}` };
        }
    }

    // Switching an English article to Hindi would orphan its own translation.
    if (currentId && language === 'hi' && (await getTranslationOfAdmin(currentId))) {
        return { ok: false, status: 409, error: 'This article has a Hindi translation, so it must stay English.' };
    }

    // slugify() drops Devanagari, so Hindi titles can't produce a slug; fall back to the
    // English original's slug (giving the /articles/x <-> /hi/articles/x pair).
    let slug = slugify(body.slug || (language === 'en' ? body.title || '' : ''));
    if (!slug && english) slug = english.slug;
    if (!slug) {
        return { ok: false, status: 400, error: 'Hindi articles need a slug in English letters, e.g. sone-ka-bhav-aaj-delhi.' };
    }

    const collision = await getArticleBySlugAdmin(slug, language);
    if (collision && collision.id !== currentId) {
        return { ok: false, status: 409, error: `Slug "${slug}" is already used by another ${language === 'hi' ? 'Hindi' : 'English'} article.` };
    }

    return { ok: true, language, slug, translation_of: english?.id ?? null };
}
