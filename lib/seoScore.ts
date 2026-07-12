export interface SeoCheck {
    label: string;
    passed: boolean;
    message: string;
}

export interface SeoScoreInput {
    title: string;
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    content: string; // HTML
    imageUrl?: string;
    imageAlt?: string;
}

export interface SeoScoreResult {
    score: number;
    checks: SeoCheck[];
}

const STOPWORDS = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for', 'is', 'are', 'with']);

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export function computeSeoScore(input: SeoScoreInput): SeoScoreResult {
    const checks: SeoCheck[] = [];
    const title = input.title || '';
    const metaTitle = input.metaTitle || title;
    const metaDescription = input.metaDescription || '';
    const focusKeyword = (input.focusKeyword || '').trim().toLowerCase();
    const plainContent = stripHtml(input.content || '');
    const words = plainContent ? plainContent.split(/\s+/).filter(Boolean).length : 0;

    checks.push({
        label: 'Title length',
        passed: metaTitle.length >= 50 && metaTitle.length <= 60,
        message: `${metaTitle.length} characters (aim for 50-60)`,
    });

    checks.push({
        label: 'Meta description length',
        passed: metaDescription.length >= 120 && metaDescription.length <= 160,
        message: metaDescription ? `${metaDescription.length} characters (aim for 120-160)` : 'Meta description is empty',
    });

    checks.push({
        label: 'Content length',
        passed: words >= 300,
        message: `${words} words (aim for 300+)`,
    });

    const hasH2 = /<h2[\s>]/i.test(input.content || '');
    checks.push({
        label: 'Heading structure',
        passed: hasH2,
        message: hasH2 ? 'Content has at least one H2 subheading' : 'Add at least one H2 subheading',
    });

    const hasImage = !!input.imageUrl;
    const hasAlt = !!(input.imageAlt && input.imageAlt.trim());
    checks.push({
        label: 'Image with alt text',
        passed: hasImage && hasAlt,
        message: !hasImage ? 'Add a featured image' : (!hasAlt ? 'Add descriptive alt text' : 'Featured image has alt text'),
    });

    const slugWords = (input.slug || '').split('-').filter(Boolean);
    const slugOk = input.slug.length > 0 && input.slug.length <= 75
        && !slugWords.some(w => STOPWORDS.has(w)) && /^[a-z0-9-]+$/.test(input.slug);
    checks.push({
        label: 'Slug readability',
        passed: slugOk,
        message: slugOk ? 'Slug is short and readable' : 'Use a short, hyphenated, lowercase slug without stopwords',
    });

    if (focusKeyword) {
        const inTitle = title.toLowerCase().includes(focusKeyword);
        checks.push({ label: 'Focus keyword in title', passed: inTitle, message: inTitle ? 'Found in title' : 'Not found in title' });

        const inSlug = input.slug.toLowerCase().includes(focusKeyword.replace(/\s+/g, '-'));
        checks.push({ label: 'Focus keyword in slug', passed: inSlug, message: inSlug ? 'Found in slug' : 'Not found in slug' });

        const firstP = stripHtml(input.content.match(/<p[^>]*>(.*?)<\/p>/i)?.[1] || '');
        const inFirstParagraph = firstP.toLowerCase().includes(focusKeyword);
        checks.push({
            label: 'Focus keyword in first paragraph',
            passed: inFirstParagraph,
            message: inFirstParagraph ? 'Found in first paragraph' : 'Not found in first paragraph',
        });

        const inMetaDesc = metaDescription.toLowerCase().includes(focusKeyword);
        checks.push({
            label: 'Focus keyword in meta description',
            passed: inMetaDesc,
            message: inMetaDesc ? 'Found in meta description' : 'Not found in meta description',
        });
    }

    const score = Math.round((checks.filter(c => c.passed).length / checks.length) * 100);
    return { score, checks };
}
