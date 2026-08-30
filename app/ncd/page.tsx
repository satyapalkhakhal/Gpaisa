import { Metadata } from 'next';
import { fetchNcdIssues } from '@/lib/otherInvestmentsApi';
import NcdCard from '@/components/ipo/NcdCard';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'NCD Issues — Non-Convertible Debentures in India | gpaisa.in',
        description: 'Track open and upcoming NCD (Non-Convertible Debenture) issues in India — credit rating, coupon rates, tenure options, and issue dates.',
        openGraph: {
            title: 'NCD Issues in India',
            description: 'Open and upcoming NCD issues with credit rating, coupon rates, and tenure options.',
            type: 'website',
            url: 'https://www.gpaisa.in/ncd',
            siteName: 'gpaisa.in',
            locale: 'en_IN',
        },
        alternates: { canonical: 'https://www.gpaisa.in/ncd' },
        robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    };
}

export default async function NcdHubPage() {
    const issues = await fetchNcdIssues();

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'NCD Issues in India',
        description: 'Open and upcoming NCD issues with credit rating, coupon rates, and tenure options.',
        url: 'https://www.gpaisa.in/ncd',
        inLanguage: 'en-IN',
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">NCD Issues</h1>
            <p className="text-gray-600 max-w-2xl mb-8">
                Non-Convertible Debenture issues from Indian companies — credit rating, coupon rates across tenure options, and subscription status.
            </p>

            {issues.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">No NCD issues available right now.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {issues.map(issue => <NcdCard key={issue.id} issue={issue} />)}
                </div>
            )}
        </div>
    );
}
