import { MetadataRoute } from 'next';

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
        ],
        sitemap: [
            'https://www.gpaisa.in/sitemap.xml',
        ],
    };
}
