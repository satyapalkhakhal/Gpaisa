// Groww calculators-page style: chips by money goal, then a grid of icon cards with a
// one-line description. Names, links and descriptions come from lib/calculatorsList.
import Link from 'next/link';
import { TrendingUp, PiggyBank, Home, Receipt, type LucideIcon } from 'lucide-react';
import { CALCULATORS } from '@/lib/calculatorsList';
import PillTabs from './PillTabs';
import { SectionTitle } from './HomeUi';

interface GoalGroup {
    key: string;
    label: string;
    icon: LucideIcon;
    tone: string;
    hrefs: string[];
}

const GOAL_GROUPS: GoalGroup[] = [
    {
        key: 'invest', label: 'Invest', icon: TrendingUp, tone: 'bg-gw-greenBg text-gw-green',
        hrefs: ['/calculator/sip', '/calculator/mutual-fund', '/calculator/cagr', '/calculator/swp'],
    },
    {
        key: 'save', label: 'Save', icon: PiggyBank, tone: 'bg-[#e0f2fe] text-[#0369a1]',
        hrefs: ['/calculator/fd', '/calculator/ppf', '/calculator/nsc', '/calculator/ssy', '/calculator/scss', '/calculator/simple-interest'],
    },
    {
        key: 'borrow', label: 'Loans', icon: Home, tone: 'bg-[#fef3c7] text-[#b45309]',
        hrefs: ['/calculator/emi', '/calculator/home-loan', '/calculator/car-loan'],
    },
    {
        key: 'tax', label: 'Tax & retirement', icon: Receipt, tone: 'bg-[#f3e8ff] text-[#7e22ce]',
        hrefs: ['/calculator/income-tax', '/calculator/hra', '/calculator/epf', '/calculator/nps', '/calculator/gratuity', '/calculator/gst'],
    },
];

const CALCULATOR_BY_HREF = new Map(CALCULATORS.map(c => [c.href, c]));

const CalculatorGrid = ({ group }: { group: GoalGroup }) => {
    const Icon = group.icon;
    const calculators = group.hrefs.map(href => CALCULATOR_BY_HREF.get(href)).filter(c => c !== undefined);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {calculators.map(calc => (
                <Link
                    key={calc.href}
                    href={calc.href}
                    className="group flex items-start gap-3 bg-white rounded-xl border border-gw-border p-4 hover:shadow-[0_2px_12px_rgba(0,0,0,0.07)] transition-shadow"
                >
                    <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${group.tone}`}>
                        <Icon className="w-5 h-5" />
                    </span>
                    <span className="min-w-0">
                        <span className="block text-sm font-medium text-gw-text group-hover:text-gw-green transition-colors">{calc.name}</span>
                        <span className="text-xs text-gw-sub mt-0.5 line-clamp-2">{calc.description}</span>
                    </span>
                </Link>
            ))}
        </div>
    );
};

export default function CalculatorSection() {
    return (
        <section aria-labelledby="calculators-heading">
            <SectionTitle id="calculators-heading" title="Calculators" href="/calculator" hrefLabel={`All ${CALCULATORS.length}`} />
            <PillTabs
                ariaLabel="Calculator goal"
                tabs={GOAL_GROUPS.map(g => ({ key: g.key, label: g.label }))}
                panels={GOAL_GROUPS.map(g => <CalculatorGrid key={g.key} group={g} />)}
            />
            <p className="text-xs text-gw-sub mt-3">
                Fund-house SIP calculators:{' '}
                {[
                    { name: 'HDFC', href: '/calculator/hdfc-sip-calculator' },
                    { name: 'SBI', href: '/calculator/sbi-sip-calculator' },
                    { name: 'ICICI', href: '/calculator/icici-sip-calculator' },
                    { name: 'Axis', href: '/calculator/axis-sip-calculator' },
                ].map((amc, i) => (
                    <span key={amc.href}>
                        {i > 0 && ' · '}
                        <Link href={amc.href} className="text-gw-green font-medium hover:underline">{amc.name}</Link>
                    </span>
                ))}
            </p>
        </section>
    );
}
