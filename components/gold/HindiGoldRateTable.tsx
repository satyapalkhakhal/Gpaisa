import type { GoldCaratRate } from '@/lib/angelOneApi';

// Server-rendered Hindi gold rate table (no client fetch, so crawlers see the rates).
// Rates are the indicative all-India rates also shown on the English pages.

const PURITY_LABEL: Record<GoldCaratRate['purity'], string> = {
    '24K': '24 कैरेट (99.9% शुद्ध)',
    '22K': '22 कैरेट (91.6% शुद्ध)',
    '18K': '18 कैरेट (75% शुद्ध)',
};

const inr = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

export default function HindiGoldRateTable({ rates, placeLabel }: { rates: GoldCaratRate[]; placeLabel: string }) {
    if (!rates.length) {
        return (
            <p className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
                सोने के भाव फ़िलहाल उपलब्ध नहीं हैं। कृपया थोड़ी देर बाद फिर देखें।
            </p>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-left">
                    <caption className="sr-only">{placeLabel} में आज सोने का भाव</caption>
                    <thead className="bg-amber-50 text-gray-700">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-semibold">शुद्धता</th>
                            <th scope="col" className="px-4 py-3 font-semibold text-right">1 ग्राम</th>
                            <th scope="col" className="px-4 py-3 font-semibold text-right">8 ग्राम</th>
                            <th scope="col" className="px-4 py-3 font-semibold text-right">10 ग्राम</th>
                            <th scope="col" className="px-4 py-3 font-semibold text-right">बदलाव (प्रति ग्राम)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rates.map((r) => {
                            const up = r.change >= 0;
                            return (
                                <tr key={r.purity}>
                                    <th scope="row" className="px-4 py-3 font-medium text-gray-900">{PURITY_LABEL[r.purity]}</th>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{inr(r.pricePerGram)}</td>
                                    <td className="px-4 py-3 text-right text-gray-700">{inr(r.pricePerGram * 8)}</td>
                                    <td className="px-4 py-3 text-right text-gray-700">{inr(r.pricePerGram * 10)}</td>
                                    <td className={`px-4 py-3 text-right font-medium ${up ? 'text-green-600' : 'text-red-600'}`}>
                                        {up ? '▲' : '▼'} {inr(Math.abs(r.change))} ({Math.abs(r.changePercent).toFixed(2)}%)
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="px-4 py-3 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                ये सांकेतिक अखिल भारतीय भाव हैं। {placeLabel} के जौहरियों के भाव में मेकिंग चार्ज, 3% GST और स्थानीय
                अंतर के कारण फ़र्क हो सकता है। ख़रीदने से पहले दुकान पर उस दिन का भाव ज़रूर पूछें।
            </p>
        </div>
    );
}
