import type { Ipo } from '@/lib/ipoTypes';

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA';
}

function buildFaqs(ipo: Ipo, companyName: string): { question: string; answer: string }[] {
    const faqs: { question: string; answer: string }[] = [];

    if (ipo.price_band_min != null && ipo.price_band_max != null) {
        faqs.push({
            question: `What is the price band of the ${companyName} IPO?`,
            answer: `The ${companyName} IPO price band is ₹${ipo.price_band_min} to ₹${ipo.price_band_max} per share.`,
        });
    }
    if (ipo.lot_size) {
        faqs.push({
            question: `What is the lot size for the ${companyName} IPO?`,
            answer: `The minimum lot size is ${ipo.lot_size} shares${ipo.price_band_max ? `, requiring a minimum investment of ₹${(ipo.lot_size * ipo.price_band_max).toLocaleString('en-IN')} for retail investors` : ''}.`,
        });
    }
    if (ipo.open_date && ipo.close_date) {
        faqs.push({
            question: `When does the ${companyName} IPO open and close?`,
            answer: `The IPO opens on ${formatDate(ipo.open_date)} and closes on ${formatDate(ipo.close_date)}.`,
        });
    }
    if (ipo.allotment_date) {
        faqs.push({
            question: `When will the ${companyName} IPO allotment be finalized?`,
            answer: `The basis of allotment is expected on ${formatDate(ipo.allotment_date)}.`,
        });
    }
    if (ipo.listing_date) {
        faqs.push({
            question: `When will ${companyName} shares be listed?`,
            answer: `${companyName} is expected to list on ${ipo.exchange?.toUpperCase() || 'the exchanges'} on ${formatDate(ipo.listing_date)}.`,
        });
    }
    if (ipo.registrar) {
        faqs.push({
            question: `Who is the registrar for the ${companyName} IPO?`,
            answer: `${ipo.registrar.name} is the registrar for this IPO.${ipo.registrar.allotment_status_check_url ? ' You can check your allotment status on their official portal.' : ''}`,
        });
    }
    faqs.push({
        question: `Is the ${companyName} IPO GMP a guarantee of listing gains?`,
        answer: `No. Grey Market Premium (GMP) is unofficial market sentiment, not an exchange-quoted or guaranteed price — actual listing performance can differ significantly.`,
    });

    return faqs;
}

export default function IpoFaq({ ipo, companyName }: { ipo: Ipo; companyName: string }) {
    const faqs = buildFaqs(ipo, companyName);
    if (faqs.length === 0) return null;

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
    };

    return (
        <div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="divide-y divide-gray-100">
                {faqs.map((faq, i) => (
                    <details key={i} className="group py-3">
                        <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 text-sm list-none">
                            {faq.question}
                            <span className="text-gray-400 group-open:rotate-45 transition-transform ml-2 shrink-0">+</span>
                        </summary>
                        <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                    </details>
                ))}
            </div>
        </div>
    );
}
