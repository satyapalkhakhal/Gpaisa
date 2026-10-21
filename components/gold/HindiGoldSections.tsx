import { Coins } from 'lucide-react';

// Static Hindi sections shared by /hi/gold-rate and /hi/gold-rate/[city].

export function HindiPurityGuide({ placeLabel }: { placeLabel: string }) {
    return (
        <section className="mb-10 card" id="purity-guide" aria-labelledby="purity-heading">
            <div className="flex items-center space-x-3 mb-4">
                <Coins className="h-7 w-7 text-primary-600" />
                <h2 id="purity-heading" className="text-2xl font-display font-bold text-gray-900">
                    सोने की शुद्धता — 24K, 22K और 18K में फ़र्क
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <h3 className="font-bold text-gray-900 text-base mb-2">24 कैरेट (99.9% शुद्ध)</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        सोने का सबसे शुद्ध रूप, निवेश के लिए सबसे अच्छा। रोज़ पहनने वाले गहनों के लिए बहुत नरम।
                        {placeLabel} में प्रमाणित डीलरों से बार और सिक्कों के रूप में मिलता है।
                    </p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                    <h3 className="font-bold text-gray-900 text-base mb-2">22 कैरेट (91.6% शुद्ध)</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        भारत में गहनों के लिए सबसे लोकप्रिय शुद्धता, जिसे 916 गोल्ड भी कहते हैं।
                        रोज़ पहनने के लिए शुद्धता और मज़बूती का सही संतुलन।
                    </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <h3 className="font-bold text-gray-900 text-base mb-2">18 कैरेट (75% शुद्ध)</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        आधुनिक डिज़ाइनर गहनों में इस्तेमाल होता है। ज़्यादा मिश्र धातु की वजह से ज़्यादा मज़बूत।
                        समकालीन और वेस्टर्न-स्टाइल डिज़ाइनों में लोकप्रिय।
                    </p>
                </div>
            </div>
        </section>
    );
}

export function HindiGoldDisclaimer({ placeLabel }: { placeLabel: string }) {
    return (
        <aside className="card bg-yellow-50 border-yellow-200 mb-8">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">ज़रूरी सूचना</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
                {placeLabel} के लिए दिखाए गए सोने के भाव सांकेतिक हैं और एक थर्ड-पार्टी मार्केट डेटा फ़ीड से लिए जाते हैं।
                मेकिंग चार्ज, 3% GST और दुकान के मार्जिन की वजह से जौहरियों के असल भाव थोड़े अलग हो सकते हैं। ख़रीदने से
                पहले उस दिन का भाव पूछें, BIS हॉलमार्क (HUID नंबर) जांचें और पूरा बिल लें। यह जानकारी केवल शैक्षिक उद्देश्य
                के लिए है और वित्तीय या निवेश सलाह नहीं है।
            </p>
        </aside>
    );
}
