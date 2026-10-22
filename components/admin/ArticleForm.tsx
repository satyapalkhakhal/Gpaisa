'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/categories';
import { slugify } from '@/lib/slugify';
import { validateArticleInput } from '@/lib/validateArticle';
import { LEAD_IMAGE_MIN_WIDTH } from '@/lib/imageDimensions';
import type { Article } from '@/lib/articlesApi';
import ArticleEditor from './ArticleEditor';
import SeoScorePanel from './SeoScorePanel';
import { UploadCloud } from 'lucide-react';

// Natural width of a local image file, or null if the browser can't decode it
// (the upload route then makes the final call).
function readImageWidth(file: File): Promise<number | null> {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const img = new window.Image();
        img.onload = () => { URL.revokeObjectURL(url); resolve(img.naturalWidth); };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
        img.src = url;
    });
}

interface ArticleFormProps {
    mode: 'create' | 'edit';
    initialArticle?: Article;
    /** Slug of the English article this (Hindi) article translates, when editing. */
    initialTranslationOfSlug?: string;
}

export default function ArticleForm({ mode, initialArticle, initialTranslationOfSlug }: ArticleFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState(initialArticle?.title || '');
    const [slug, setSlug] = useState(initialArticle?.slug || '');
    const [slugTouched, setSlugTouched] = useState(mode === 'edit');
    const [language, setLanguage] = useState<'en' | 'hi'>(initialArticle?.language === 'hi' ? 'hi' : 'en');
    const [translationOfSlug, setTranslationOfSlug] = useState(initialTranslationOfSlug || '');
    const [category, setCategory] = useState(initialArticle?.category || CATEGORIES[0].dbValue);
    const [subcategory, setSubcategory] = useState(initialArticle?.subcategory || '');
    const [articleType, setArticleType] = useState<'article' | 'news'>(initialArticle?.article_type === 'news' ? 'news' : 'article');
    const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
    const [content, setContent] = useState(initialArticle?.content || '');
    const [imageUrl, setImageUrl] = useState(initialArticle?.image_url || '');
    const [imageAlt, setImageAlt] = useState('');
    const [author, setAuthor] = useState(initialArticle?.author || 'Gpaisa Desk');
    const [tags, setTags] = useState((initialArticle?.tags || []).join(', '));
    const [isFeatured, setIsFeatured] = useState(!!initialArticle?.is_featured);
    const [isEditorsPick, setIsEditorsPick] = useState(!!initialArticle?.is_editors_pick);
    const [isTrending, setIsTrending] = useState(!!initialArticle?.is_trending);
    const [status, setStatus] = useState<'draft' | 'published'>(initialArticle?.status || 'published');
    const [metaTitle, setMetaTitle] = useState(initialArticle?.meta_title || '');
    const [metaDescription, setMetaDescription] = useState(initialArticle?.meta_description || '');
    const [metaKeywords, setMetaKeywords] = useState(initialArticle?.meta_keywords || '');
    const [focusKeyword, setFocusKeyword] = useState(initialArticle?.focus_keyword || '');

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [slugError, setSlugError] = useState('');

    function handleTitleChange(value: string) {
        setTitle(value);
        // Hindi titles have no Latin letters to slugify; Hindi slugs come from the English version or are typed in.
        if (!slugTouched && language === 'en') setSlug(slugify(value));
    }

    function handleTranslationOfChange(value: string) {
        setTranslationOfSlug(value);
        if (!slugTouched) setSlug(slugify(value));
    }

    function handleSlugChange(value: string) {
        setSlugTouched(true);
        setSlug(slugify(value));
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        // Instant feedback; the upload route enforces the same minimum.
        const width = await readImageWidth(file);
        if (width !== null && width < LEAD_IMAGE_MIN_WIDTH) {
            setErrors([`Featured image is ${width}px wide. It must be at least ${LEAD_IMAGE_MIN_WIDTH}px wide (16:9, e.g. 1200×675, works best).`]);
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('purpose', 'lead');
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();
        setUploading(false);
        if (res.ok) setImageUrl(data.secure_url);
        else setErrors([data.error || 'Image upload failed.']);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSlugError('');
        const payload = {
            title, slug, category, subcategory, excerpt, content, status,
        };
        const validationErrors = validateArticleInput(payload);
        if (validationErrors.length) {
            setErrors(validationErrors);
            return;
        }
        setErrors([]);
        setSaving(true);

        const body = {
            title, slug, category, subcategory: subcategory || null, excerpt, content, article_type: articleType,
            language, translation_of_slug: language === 'hi' ? translationOfSlug : '',
            image_url: imageUrl, author, tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            is_featured: isFeatured, is_editors_pick: isEditorsPick, is_trending: isTrending, status,
            meta_title: metaTitle, meta_description: metaDescription, meta_keywords: metaKeywords, focus_keyword: focusKeyword,
        };

        const url = mode === 'create' ? '/api/admin/articles' : `/api/admin/articles/${initialArticle!.id}`;
        const method = mode === 'create' ? 'POST' : 'PATCH';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json();
        setSaving(false);

        if (res.status === 401) {
            router.push('/admin/login');
            return;
        }
        if (res.status === 409) {
            setSlugError(data.error);
            return;
        }
        if (!res.ok) {
            setErrors([data.error || 'Failed to save article.']);
            return;
        }
        router.push('/admin/articles');
        router.refresh();
    }

    const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                    {errors.length > 0 && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            {errors.map((err, i) => <div key={i}>{err}</div>)}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Language</label>
                            <select value={language} onChange={(e) => setLanguage(e.target.value === 'hi' ? 'hi' : 'en')} className={inputClass}>
                                <option value="en">English — /articles/…</option>
                                <option value="hi">हिन्दी (Hindi) — /hi/articles/…</option>
                            </select>
                        </div>
                        {language === 'hi' && (
                            <div>
                                <label className={labelClass}>English version (slug, optional)</label>
                                <input
                                    type="text"
                                    value={translationOfSlug}
                                    onChange={(e) => handleTranslationOfChange(e.target.value)}
                                    placeholder="e.g. best-fd-rates-in-india"
                                    className={inputClass}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Links the two versions for Google (hreflang). Leave empty for a Hindi-only article.
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Title</label>
                        <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass} required />
                    </div>

                    <div>
                        <label className={labelClass}>Slug</label>
                        <input type="text" value={slug} onChange={(e) => handleSlugChange(e.target.value)} className={inputClass} required />
                        {language === 'hi' && (
                            <p className="mt-1 text-xs text-gray-500">
                                English letters only, e.g. sone-ka-bhav-aaj-delhi. A translation can reuse its English slug.
                            </p>
                        )}
                        {slugError && <p className="text-xs text-red-600 mt-1">{slugError}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                                {CATEGORIES.map(c => <option key={c.dbValue} value={c.dbValue}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Subcategory (optional)</label>
                            <input type="text" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Article type</label>
                        <select value={articleType} onChange={(e) => setArticleType(e.target.value === 'news' ? 'news' : 'article')} className={inputClass + ' w-auto'}>
                            <option value="article">Guide / review (evergreen)</option>
                            <option value="news">News (time-sensitive)</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            News: RBI decisions, IPO updates, price moves, policy changes. Marked up as NewsArticle for Google News and Discover.
                        </p>
                    </div>

                    <div>
                        <label className={labelClass}>Excerpt</label>
                        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={inputClass} required />
                    </div>

                    <div>
                        <label className={labelClass}>Featured image</label>
                        <div className="flex items-center gap-3">
                            {imageUrl && (
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    <Image src={imageUrl} alt="Featured" fill className="object-cover" />
                                </div>
                            )}
                            <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                                <UploadCloud className="w-4 h-4" />
                                {uploading ? 'Uploading…' : imageUrl ? 'Replace image' : 'Upload image'}
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            At least {LEAD_IMAGE_MIN_WIDTH}px wide, 16:9 recommended (e.g. 1200×675). No logos or text-heavy banners.
                        </p>
                        {imageUrl && (
                            <input
                                type="text"
                                placeholder="Alt text for the featured image"
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Content</label>
                        <ArticleEditor value={content} onChange={setContent} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Author</label>
                            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Tags (comma-separated)</label>
                            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                            Featured
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" checked={isEditorsPick} onChange={(e) => setIsEditorsPick(e.target.checked)} />
                            Editor's pick
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} />
                            Trending
                        </label>
                        <div className="ml-auto flex items-center gap-2">
                            <label className={labelClass + ' mb-0'}>Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')} className={inputClass + ' w-auto'}>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">SEO Details</h3>
                    <div>
                        <label className={labelClass}>Focus keyword</label>
                        <input type="text" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Meta title</label>
                        <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Meta description</label>
                        <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Meta keywords (comma-separated)</label>
                        <input type="text" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} className={inputClass} />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold rounded-lg px-6 py-2.5 transition-colors"
                >
                    {saving ? 'Saving…' : mode === 'create' ? 'Create Article' : 'Save Changes'}
                </button>
            </div>

            <div className="lg:col-span-4">
                <SeoScorePanel
                    input={{
                        title, slug, metaTitle, metaDescription, focusKeyword, content,
                        imageUrl, imageAlt,
                    }}
                />
            </div>
        </form>
    );
}
