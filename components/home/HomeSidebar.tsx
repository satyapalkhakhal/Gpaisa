// Right rail, after Groww's Explore page: "Products & tools" list, then our IPO reviews
// and what readers are opening. Sticky on desktop so tools stay in reach while scrolling.
import Link from 'next/link';
import {
    Rocket, Activity, Landmark, RefreshCcw, FileSignature, Coins, Gem, Calculator, Scale, BarChart3, CreditCard,
    ChevronRight, type LucideIcon,
} from 'lucide-react';
import type { Article } from '@/lib/articlesApi';
import type { IpoReviewSummary } from '@/lib/ipoApi';
import type { IpoRecommendation } from '@/lib/ipoTypes';
import { RECOMMENDATION_LABELS } from '@/lib/ipoTypes';
import { Card, CardTitle, LogoTile } from './HomeUi';

interface Product {
    name: string;
    href: string;
    icon: LucideIcon;
    tag?: string;
}

const RECOMMENDATION_STYLE: Record<IpoRecommendation, string> = {
    subscribe: 'text-gw-up bg-gw-upBg',
    subscribe_long_term: 'text-sky-700 bg-sky-100',
    neutral: 'text-gw-sub bg-gw-bg',
    avoid: 'text-gw-down bg-gw-downBg',
};

export default function HomeSidebar({ openIpoCount, liveIssueCounts, reviews, trending }: {
    openIpoCount: number;
    liveIssueCounts: { ncd: number; buyback: number; rights: number };
    reviews: IpoReviewSummary[];
    trending: Article[];
}) {
    const live = (n: number) => (n > 0 ? `${n} open` : undefined);
    const products: Product[] = [
        { name: 'IPO', href: '/ipo', icon: Rocket, tag: live(openIpoCount) },
        { name: 'IPO GMP today', href: '/ipo/gmp', icon: Activity },
        { name: 'Compare IPOs', href: '/ipo/compare', icon: Scale },
        { name: 'IPO listing performance', href: '/ipo/listing-performance', icon: BarChart3 },
        { name: 'Credit cards', href: '/credit-cards', icon: CreditCard },
        { name: 'Bonds (NCDs)', href: '/ncd', icon: Landmark, tag: live(liveIssueCounts.ncd) },
        { name: 'Buybacks', href: '/buyback', icon: RefreshCcw, tag: live(liveIssueCounts.buyback) },
        { name: 'Rights issues', href: '/rights-issue', icon: FileSignature, tag: live(liveIssueCounts.rights) },
        { name: 'Gold rate', href: '/gold-rate', icon: Coins },
        { name: 'Silver rate', href: '/silver-rate', icon: Gem },
        { name: 'IPO lot size calculator', href: '/ipo-calculator/lot-size-calculator', icon: Calculator },
    ];

    return (
        <aside className="space-y-5 lg:sticky lg:top-20">
            <Card>
                <CardTitle title="Products & tools" />
                <ul className="pb-2">
                    {products.map(({ name, href, icon: Icon, tag }) => (
                        <li key={href}>
                            <Link href={href} className="group flex items-center gap-3 px-4 py-2.5 hover:bg-gw-bg/70 transition-colors">
                                <Icon className="w-[18px] h-[18px] text-gw-sub group-hover:text-gw-green shrink-0" strokeWidth={1.75} />
                                <span className="text-sm text-gw-text flex-1">{name}</span>
                                {tag && <span className="text-[11px] font-medium text-gw-green bg-gw-greenBg rounded px-1.5 py-0.5">{tag}</span>}
                                <ChevronRight className="w-4 h-4 text-gw-border group-hover:text-gw-green shrink-0" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </Card>

            {reviews.length > 0 && (
                <Card>
                    <CardTitle title="Our IPO reviews" />
                    <ul className="pb-2">
                        {reviews.map(({ review, ipoSlug, companyName }) => (
                            <li key={review.id}>
                                <Link href={`/ipo/${ipoSlug}`} className="group flex items-center gap-3 px-4 py-2.5 hover:bg-gw-bg/70 transition-colors">
                                    <LogoTile name={companyName} size={36} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gw-text group-hover:text-gw-green transition-colors truncate">{companyName}</p>
                                        {review.recommendation && (
                                            <span className={`inline-block text-[11px] font-medium rounded px-1.5 py-0.5 mt-0.5 ${RECOMMENDATION_STYLE[review.recommendation]}`}>
                                                {RECOMMENDATION_LABELS[review.recommendation]}
                                            </span>
                                        )}
                                    </div>
                                    {review.overall_score != null && (
                                        <span className="text-sm font-medium text-gw-text tabular-nums shrink-0">
                                            {review.overall_score}<span className="text-xs text-gw-sub">/10</span>
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {trending.length > 0 && (
                <Card>
                    <CardTitle title="Trending" />
                    <ol className="pb-2">
                        {trending.map((article, i) => (
                            <li key={article.id}>
                                <Link href={`/articles/${article.slug}`} className="group flex gap-3 px-4 py-2.5 hover:bg-gw-bg/70 transition-colors">
                                    <span className="text-sm font-medium text-gw-sub tabular-nums w-4 shrink-0">{i + 1}</span>
                                    <span className="text-sm text-gw-text leading-snug line-clamp-2 group-hover:text-gw-green transition-colors">{article.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </Card>
            )}
        </aside>
    );
}
