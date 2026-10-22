// The written guide under a city's gold or silver rates (lib/cityGoldData, cityGoldDataHi,
// citySilverData): market background, popular areas, buying tips, price factors, investment
// and festival notes, and the purity guide. Compact type; same content as before the redesign.
import type { ArticleLanguage } from '@/lib/articleLocale';
import { BulletList, Prose, Section } from './RatesUi';

export interface CityGuideInfo {
    city: string;
    uniqueDescription: string;
    culture: string;
    keyHighlights: { icon: string; label: string; detail: string }[];
    popularAreas: { name: string; specialty: string }[];
    buyingTips: string[];
    priceFactors: string[];
    investmentInsight: string;
    festivalsImpact: string;
}

type Metal = 'gold' | 'silver';

const HEADINGS: Record<ArticleLanguage, Record<Metal, (c: string) => Record<string, string>>> = {
    en: {
        gold: c => ({ about: `About the gold market in ${c}`, culture: `Gold culture and heritage in ${c}`, areas: `Where to buy gold in ${c}`, tips: `Gold buying tips for ${c}`, factors: `What moves the gold price in ${c}`, invest: `Gold investment in ${c}`, festivals: `Festival and seasonal demand in ${c}` }),
        silver: c => ({ about: `About the silver market in ${c}`, culture: `Silver culture in ${c}`, areas: `Where to buy silver in ${c}`, tips: `Silver buying tips for ${c}`, factors: `What moves the silver price in ${c}`, invest: `Silver investment in ${c}`, festivals: `Festival and seasonal demand in ${c}` }),
    },
    hi: {
        gold: c => ({ about: `${c} का सोना बाज़ार`, culture: `${c} की गोल्ड संस्कृति और विरासत`, areas: `${c} के प्रमुख सोना बाज़ार`, tips: `${c} में सोना ख़रीदने के टिप्स`, factors: `${c} में सोने के भाव पर असर डालने वाले कारण`, invest: `${c} में सोने में निवेश`, festivals: `${c} में त्योहार और मौसमी मांग` }),
        silver: c => ({ about: `${c} का चांदी बाज़ार`, culture: `${c} में चांदी की परंपरा`, areas: `${c} के प्रमुख चांदी बाज़ार`, tips: `${c} में चांदी ख़रीदने के टिप्स`, factors: `${c} में चांदी के भाव पर असर डालने वाले कारण`, invest: `${c} में चांदी में निवेश`, festivals: `${c} में त्योहार और मौसमी मांग` }),
    },
};

export default function CityGuide({ info, metal, lang }: { info: CityGuideInfo; metal: Metal; lang: ArticleLanguage }) {
    const h = HEADINGS[lang][metal](info.city);
    return (
        <>
            <Section id="about-market" title={h.about}>
                <Prose>
                    <p>{info.uniqueDescription}</p>
                    <p>{info.culture}</p>
                </Prose>
                {info.keyHighlights.length > 0 && (
                    <dl className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {info.keyHighlights.map(k => (
                            <div key={k.label} className="rounded-lg border border-gw-border px-3 py-2.5">
                                <dt className="text-sm font-semibold text-gw-text">{k.icon} {k.label}</dt>
                                <dd className="mt-0.5 text-[13px] leading-snug text-gray-600">{k.detail}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </Section>

            {info.popularAreas.length > 0 && (
                <Section id="popular-markets" title={h.areas}>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        {info.popularAreas.map(a => (
                            <li key={a.name} className="text-[15px] leading-snug">
                                <span className="font-semibold text-gw-text">{a.name}</span>
                                <span className="block text-sm text-gray-600">{a.specialty}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {info.buyingTips.length > 0 && <Section id="buying-tips" title={h.tips}><BulletList items={info.buyingTips} ordered /></Section>}
            {info.priceFactors.length > 0 && <Section id="price-factors" title={h.factors}><BulletList items={info.priceFactors} /></Section>}
            <Section id="investment" title={h.invest}><Prose><p>{info.investmentInsight}</p></Prose></Section>
            <Section id="festivals" title={h.festivals}><Prose><p>{info.festivalsImpact}</p></Prose></Section>
        </>
    );
}

const PURITY: Record<ArticleLanguage, { title: string; rows: [string, string][] }> = {
    en: {
        title: 'Gold purity: 24K vs 22K vs 18K',
        rows: [
            ['24K (99.9%)', 'Purest form, used for coins and bars; too soft for everyday jewellery.'],
            ['22K (91.6%, "916")', 'The standard for Indian jewellery: alloyed for strength while keeping high purity.'],
            ['18K (75%)', 'Used in lighter, modern and stone-set designs; harder and more scratch-resistant.'],
        ],
    },
    hi: {
        title: 'सोने की शुद्धता: 24K, 22K और 18K में फ़र्क',
        rows: [
            ['24 कैरेट (99.9%)', 'सबसे शुद्ध रूप, सिक्कों और बार में; रोज़ पहनने वाले गहनों के लिए बहुत नरम।'],
            ['22 कैरेट (91.6%, "916")', 'भारतीय गहनों का मानक: मज़बूती के लिए मिश्र धातु, फिर भी ऊंची शुद्धता।'],
            ['18 कैरेट (75%)', 'हल्के, आधुनिक और नग वाले डिज़ाइनों में; ज़्यादा मज़बूत।'],
        ],
    },
};

export function PurityGuide({ lang }: { lang: ArticleLanguage }) {
    const p = PURITY[lang];
    return (
        <Section id="purity-guide" title={p.title}>
            <dl className="divide-y divide-gw-border border-y border-gw-border">
                {p.rows.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 py-2.5 text-[15px]">
                        <dt className="font-semibold text-gw-text">{k}</dt>
                        <dd className="text-gray-700">{v}</dd>
                    </div>
                ))}
            </dl>
        </Section>
    );
}

export function SilverPurityGuide() {
    const rows: [string, string][] = [
        ['999 fine silver (99.9%)', 'The purest form, used for bars, coins and bullion; too soft for jewellery.'],
        ['925 sterling silver (92.5%)', 'The standard for silver jewellery, alloyed with copper for strength. Look for the "925" mark.'],
        ['800 silver (80%)', 'Used for utensils, silverware and decorative pieces; harder and more durable for daily use.'],
    ];
    return (
        <Section id="purity-guide" title="Silver purity: 999 vs 925 vs 800">
            <dl className="divide-y divide-gw-border border-y border-gw-border">
                {rows.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 py-2.5 text-[15px]">
                        <dt className="font-semibold text-gw-text">{k}</dt>
                        <dd className="text-gray-700">{v}</dd>
                    </div>
                ))}
            </dl>
        </Section>
    );
}
