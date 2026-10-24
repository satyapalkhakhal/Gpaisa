import { MetadataRoute } from 'next';

// Crawlers that collect content to train AI models: blocked. AI search and assistant
// agents (OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot,
// Claude-User) are allowed by the '*' rule, so answers in those tools can cite and link
// gpaisa.in. This replaces Cloudflare's managed robots.txt, which also blocked assistants.
const AI_TRAINING_BOTS = [
    'GPTBot', 'ClaudeBot', 'anthropic-ai', 'Claude-Web', 'CCBot', 'Google-Extended',
    'Applebot-Extended', 'Bytespider', 'meta-externalagent', 'Amazonbot', 'Diffbot',
    'cohere-ai', 'MistralAI-Training', 'omgili', 'PetalBot', 'Google-CloudVertexBot',
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/', '/admin/'],
            },
            {
                userAgent: 'Googlebot-News',
                allow: '/',
                disallow: ['/api/', '/admin/'],
            },
            {
                userAgent: AI_TRAINING_BOTS,
                disallow: '/',
            },
        ],
        sitemap: [
            'https://www.gpaisa.in/sitemap.xml',
        ],
    };
}
