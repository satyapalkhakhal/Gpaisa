// Who writes this, where the numbers come from, and what this site is not — the EEAT/YMYL
// context a finance front page owes its readers, kept quiet and Groww-plain.
import Link from 'next/link';
import { CALCULATORS } from '@/lib/calculatorsList';

export default function TrustBand() {
    return (
        <section aria-label="About gpaisa.in, data sources and regulatory notice" className="border-t border-gw-border pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gw-sub leading-relaxed">
            <div>
                <h2 className="text-sm font-medium text-gw-text mb-1.5">About gpaisa.in</h2>
                <p>
                    Written and edited by Satyapal Khakhal. Independent coverage of Indian markets, IPOs, bullion and personal
                    finance, with {CALCULATORS.length} free calculators. No advertiser influences our reviews.
                </p>
                <div className="flex gap-4 mt-1.5 font-medium">
                    <Link href="/about" className="text-gw-green hover:underline">About us</Link>
                    <Link href="/contact" className="text-gw-green hover:underline">Contact</Link>
                </div>
            </div>
            <div>
                <h2 className="text-sm font-medium text-gw-text mb-1.5">Data sources</h2>
                <p>
                    Gold and silver rates are indicative and come from a third-party market data feed. Index values come
                    from public market data pages and may be delayed. IPO details are taken from SEBI offer documents
                    (DRHP/RHP). IPO GMP is unofficial grey-market data and is always labelled as such.
                </p>
            </div>
            <div>
                <h2 className="text-sm font-medium text-gw-text mb-1.5">Regulatory notice</h2>
                <p>
                    gpaisa.in is not registered with SEBI as an investment adviser or research analyst. Content, including IPO
                    reviews, is for information and education only and is not a recommendation to buy or sell any security.
                    Consult a SEBI-registered adviser before investing.
                </p>
                <Link href="/disclaimer" className="inline-block mt-1.5 font-medium text-gw-green hover:underline">Full disclaimer</Link>
            </div>
        </section>
    );
}
