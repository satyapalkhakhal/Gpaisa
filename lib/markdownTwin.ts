import { NodeHtmlMarkdown } from 'node-html-markdown';

// Markdown twins (AEO spec v1.0, https://dualmark.dev/docs/spec/overview): every public page
// is also served as markdown, at <path>.md or at the page URL with `Accept: text/markdown`,
// so AI assistants can read the content without the header, ticker, footer, ads and scripts.
// middleware.ts routes those requests to app/api/markdown/route.ts, which renders the page's
// HTML and converts its <main> element here.

export const SITE_URL = 'https://www.gpaisa.in';
export const AEO_VERSION = '1.0';

// Paths that are never pages, so they get no twin, no Link header and no 406.
export function isPagePath(pathname: string): boolean {
    if (pathname.startsWith('/api/') || pathname.startsWith('/admin') || pathname.startsWith('/_next/')) {
        return false;
    }
    // Files (feed.xml, robots.txt, images, ...) have an extension; pages don't.
    return !/\.[a-z0-9]+$/i.test(pathname);
}

// '/' ↔ '/index.md', '/ipo' ↔ '/ipo.md'
export function twinPath(pagePath: string): string {
    return pagePath === '/' ? '/index.md' : `${pagePath.replace(/\/$/, '')}.md`;
}

export function pagePathFromTwin(mdPath: string): string {
    const base = mdPath.slice(0, -'.md'.length);
    return base === '/index' ? '/' : base;
}

function qualities(accept: string): Map<string, number> {
    const result = new Map<string, number>();
    for (const part of accept.split(',')) {
        const [type, ...params] = part.trim().toLowerCase().split(';');
        if (!type) continue;
        const qParam = params.map(p => p.trim()).find(p => p.startsWith('q='));
        const q = qParam ? Number(qParam.slice(2)) : 1;
        result.set(type.trim(), Number.isFinite(q) ? q : 0);
    }
    return result;
}

// True when the client asks for markdown at least as strongly as for HTML. Browsers never
// send text/markdown, so they always get HTML.
export function prefersMarkdown(accept: string | null): boolean {
    if (!accept) return false;
    const q = qualities(accept);
    const md = q.get('text/markdown') ?? 0;
    const html = Math.max(q.get('text/html') ?? 0, q.get('application/xhtml+xml') ?? 0);
    return md > 0 && md >= html;
}

// False when an Accept header rules out both HTML and markdown (spec §3: 406 Not Acceptable).
// text/x-component is what Next.js client navigations and server actions ask for.
export function acceptsPage(accept: string | null): boolean {
    if (!accept || !accept.trim()) return true;
    const q = qualities(accept);
    return ['text/html', 'application/xhtml+xml', 'text/markdown', 'text/x-component', 'text/*', '*/*']
        .some(type => (q.get(type) ?? 0) > 0);
}

const converter = new NodeHtmlMarkdown(
    { bulletMarker: '-', maxConsecutiveNewlines: 2, useLinkReferenceDefinitions: false },
    {
        // Interactive and decorative markup with no text worth reading.
        'script, style, noscript, template, svg, canvas, iframe, form, button, select, input, textarea, nav, aside, ins':
            { ignore: true },
    }
);

function decodeEntities(text: string): string {
    return text
        .replace(/&quot;/g, '"')
        .replace(/&#x27;|&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

function headTag(html: string, pattern: RegExp): string | null {
    const match = html.match(pattern);
    return match ? decodeEntities(match[1].trim()) : null;
}

function yamlString(value: string): string {
    return JSON.stringify(value.replace(/\s+/g, ' '));
}

export function htmlToMarkdownTwin(html: string, pagePath: string): string {
    const title = headTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = headTag(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
    const canonical = headTag(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i) ?? `${SITE_URL}${pagePath}`;

    const mainStart = html.search(/<main[\s>]/i);
    const mainEnd = html.lastIndexOf('</main>');
    const main = mainStart >= 0 && mainEnd > mainStart
        ? html.slice(mainStart, mainEnd + '</main>'.length)
        : (html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html);

    const body = converter.translate(main)
        // Absolute links, so they still work once the markdown is copied out of the site.
        .replace(/\]\(\/(?!\/)/g, `](${SITE_URL}/`)
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    const frontMatter = [
        '---',
        title && `title: ${yamlString(title)}`,
        description && `description: ${yamlString(description)}`,
        `url: ${canonical}`,
        '---',
    ].filter(Boolean).join('\n');

    return `${frontMatter}\n\n${body}\n`;
}

// Rough token count (~4 characters per token) for the X-Markdown-Tokens header.
export function estimateTokens(markdown: string): number {
    return Math.ceil(markdown.length / 4);
}

export function markdownHeaders(markdown: string, cacheControl: string): HeadersInit {
    return {
        'Content-Type': 'text/markdown; charset=utf-8',
        'X-Markdown-Tokens': String(estimateTokens(markdown)),
        // The HTML page is the one to index; the twin is a copy of it.
        'X-Robots-Tag': 'noindex',
        'Vary': 'Accept',
        'X-Content-Type-Options': 'nosniff',
        'X-AEO-Version': AEO_VERSION,
        'Cache-Control': cacheControl,
    };
}
