// Groww "in the news" block: category chips over one list of headline rows.
import Link from 'next/link';
import type { Article } from '@/lib/supabaseApi';
import PillTabs from './PillTabs';
import { Card, NewsRow, SectionTitle } from './HomeUi';

export interface NewsTab {
    key: string;
    label: string;
    href: string;
    articles: Article[];
}

const NewsList = ({ tab }: { tab: NewsTab }) => (
    <Card className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 divide-y divide-gw-border md:divide-y-0">
            {tab.articles.map((article, i) => (
                // On md+ the list flows in two columns; draw row dividers per column instead.
                <div key={article.id} className={i >= 2 ? 'md:border-t md:border-gw-border' : ''}>
                    <NewsRow article={article} />
                </div>
            ))}
        </div>
        <div className="border-t border-gw-border py-3 text-center">
            <Link href={tab.href} className="text-sm font-medium text-gw-green hover:text-gw-greenDark">More {tab.label === 'Latest' ? 'news' : tab.label.toLowerCase()}</Link>
        </div>
    </Card>
);

export default function NewsSection({ tabs }: { tabs: NewsTab[] }) {
    const visible = tabs.filter(t => t.articles.length > 0);
    if (visible.length === 0) return null;
    return (
        <section aria-labelledby="news-heading">
            <SectionTitle id="news-heading" title="In the news" href="/news" />
            <PillTabs
                ariaLabel="News category"
                tabs={visible.map(t => ({ key: t.key, label: t.label }))}
                panels={visible.map(t => <NewsList key={t.key} tab={t} />)}
            />
        </section>
    );
}
