import { Metadata } from 'next';
import { fetchRightsIssues } from '@/lib/otherInvestmentsApi';
import RightsIssueCard from '@/components/ipo/RightsIssueCard';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Rights Issues in India — Ratio, Price, Record Date | gpaisa.in',
        description: 'Track rights issues from Indian listed companies — rights ratio, issue price, record date, RE trading window, and application dates.',
        openGraph: {
            title: 'Rights Issues in India',
            description: 'Rights ratio, issue price, record date, and application dates for Indian rights issues.',
            type: 'website',
            url: 'https://www.gpaisa.in/rights-issue',
            siteName: 'gpaisa.in',
            locale: 'en_IN',
        },
        alternates: { canonical: 'https://www.gpaisa.in/rights-issue' },
        robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    };
}

export default async function RightsIssueHubPage() {
    const issues = await fetchRightsIssues();

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Rights Issues in India',
        description: 'Rights ratio, issue price, record date, and application dates for Indian rights issues.',
        url: 'https://www.gpaisa.in/rights-issue',
        inLanguage: 'en-IN',
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Rights Issues</h1>
            <p className="text-gray-600 max-w-2xl mb-8">
                Existing shareholders' entitlement offers from Indian listed companies — rights ratio, discounted issue price, and key dates.
            </p>

            {issues.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">No rights issues available right now.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {issues.map(issue => <RightsIssueCard key={issue.id} issue={issue} />)}
                </div>
            )}
        </div>
    );
}
