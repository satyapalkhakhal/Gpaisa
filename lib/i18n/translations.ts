export type Language = 'en' | 'hi';

export const translations = {
    // ─── Navigation ──────────────────────────────────────────────────
    nav: {
        markets: { en: 'Markets', hi: 'बाज़ार' },
        goldRate: { en: 'Gold Rate', hi: 'सोने का भाव' },
        silverRate: { en: 'Silver Rate', hi: 'चांदी का भाव' },
        commodities: { en: 'Commodities', hi: 'कमोडिटी' },
        agriculture: { en: 'Agriculture', hi: 'कृषि' },
        calculators: { en: 'Calculators', hi: 'कैलकुलेटर' },
        personalFinance: { en: 'Business News', hi: 'व्यापार समाचार' },
        news: { en: 'News', hi: 'समाचार' },
        glossary: { en: 'Glossary', hi: 'शब्दकोश' },
    },

    // ─── Calculator Dropdown ────────────────────────────────────────
    calculators: {
        sipCalculator: { en: 'SIP Calculator', hi: 'SIP कैलकुलेटर' },
        ppfCalculator: { en: 'PPF Calculator', hi: 'PPF कैलकुलेटर' },
        swpCalculator: { en: 'SWP Calculator', hi: 'SWP कैलकुलेटर' },
        epfCalculator: { en: 'EPF Calculator', hi: 'EPF कैलकुलेटर' },
        emiCalculator: { en: 'EMI Calculator', hi: 'EMI कैलकुलेटर' },
        homeLoanCalculator: { en: 'Home Loan Calculator', hi: 'होम लोन कैलकुलेटर' },
        gstCalculator: { en: 'GST Calculator', hi: 'GST कैलकुलेटर' },
        cagrCalculator: { en: 'CAGR Calculator', hi: 'CAGR कैलकुलेटर' },
        fdCalculator: { en: 'FD Calculator', hi: 'FD कैलकुलेटर' },
        npsCalculator: { en: 'NPS Calculator', hi: 'NPS कैलकुलेटर' },
        hraCalculator: { en: 'HRA Calculator', hi: 'HRA कैलकुलेटर' },
        gratuityCalculator: { en: 'Gratuity Calculator', hi: 'ग्रेच्युटी कैलकुलेटर' },
        simpleInterest: { en: 'Simple Interest', hi: 'साधारण ब्याज' },
        mutualFundCalculator: { en: 'Mutual Fund Calculator', hi: 'म्यूचुअल फंड कैलकुलेटर' },
        carLoanCalculator: { en: 'Car Loan Calculator', hi: 'कार लोन कैलकुलेटर' },
        incomeTaxCalculator: { en: 'Income Tax Calculator', hi: 'आयकर कैलकुलेटर' },
        ssyCalculator: { en: 'SSY Calculator', hi: 'SSY कैलकुलेटर' },
        nscCalculator: { en: 'NSC Calculator', hi: 'NSC कैलकुलेटर' },
        scssCalculator: { en: 'SCSS Calculator', hi: 'SCSS कैलकुलेटर' },
    },

    // ─── Footer ─────────────────────────────────────────────────────
    footer: {
        about: {
            en: 'gpaisa.in is founded by Satyapal Khakhal. We provide accurate gold and silver rate data, 19 free financial calculators, and daily financial news to help Indian investors make better decisions. Data sourced from MCX, IBJA, LBMA, BSE, and NSE.',
            hi: 'gpaisa.in की स्थापना सत्यपाल खाखल ने की है। हम भारतीय निवेशकों को बेहतर निर्णय लेने में मदद करने के लिए सटीक सोने और चांदी के भाव, 19 मुफ्त वित्तीय कैलकुलेटर और दैनिक वित्तीय समाचार प्रदान करते हैं। डेटा MCX, IBJA, LBMA, BSE और NSE से प्राप्त।'
        },
        quickLinks: { en: 'Quick Links', hi: 'त्वरित लिंक' },
        legalInfo: { en: 'Legal & Info', hi: 'कानूनी और जानकारी' },
        aboutUs: { en: 'About Us', hi: 'हमारे बारे में' },
        contactUs: { en: 'Contact Us', hi: 'संपर्क करें' },
        sitemap: { en: 'Sitemap', hi: 'साइटमैप' },
        privacyPolicy: { en: 'Privacy Policy', hi: 'गोपनीयता नीति' },
        terms: { en: 'Terms of Service', hi: 'सेवा की शर्तें' },
        disclaimer: { en: 'Disclaimer', hi: 'अस्वीकरण' },
        goldCommodities: { en: 'Gold & Commodities', hi: 'सोना और कमोडिटी' },
        agriculturePrices: { en: 'Agriculture Prices', hi: 'कृषि मूल्य' },
        disclaimerText: {
            en: 'The information provided on gpaisa.in is for informational purposes only and should not be considered as financial advice. Market data, prices, and rates are indicative and may not reflect real-time values. Always consult with a qualified financial advisor before making investment decisions. We are not responsible for any financial losses incurred based on information from this website.',
            hi: 'gpaisa.in पर दी गई जानकारी केवल सूचनात्मक उद्देश्यों के लिए है और इसे वित्तीय सलाह के रूप में नहीं माना जाना चाहिए। बाज़ार डेटा, कीमतें और दरें सांकेतिक हैं और रीयल-टाइम मूल्यों को प्रतिबिंबित नहीं कर सकती हैं। निवेश निर्णय लेने से पहले हमेशा एक योग्य वित्तीय सलाहकार से परामर्श करें। इस वेबसाइट की जानकारी के आधार पर हुए किसी भी वित्तीय नुकसान के लिए हम जिम्मेदार नहीं हैं।'
        },
        copyright: {
            en: 'All rights reserved. Market data is provided for informational purposes only.',
            hi: 'सर्वाधिकार सुरक्षित। बाज़ार डेटा केवल सूचनात्मक उद्देश्यों के लिए प्रदान किया गया है।'
        },
        sebiDisclaimer: {
            en: 'gpaisa.in is not registered with SEBI. All content is for informational purposes only. Please consult a SEBI-registered investment advisor before making investment decisions.',
            hi: 'gpaisa.in SEBI के साथ पंजीकृत नहीं है। सभी सामग्री केवल सूचनात्मक उद्देश्यों के लिए है। निवेश निर्णय लेने से पहले कृपया SEBI-पंजीकृत निवेश सलाहकार से परामर्श करें।'
        },
    },

    // ─── Homepage ───────────────────────────────────────────────────
    home: {
        topStories: { en: 'Top Stories', hi: 'मुख्य समाचार' },
        trendingNow: { en: 'Trending Now', hi: 'अभी ट्रेंडिंग' },
        businessFinance: { en: 'Business & Finance', hi: 'व्यापार और वित्त' },
        technology: { en: 'Technology', hi: 'प्रौद्योगिकी' },
        travel: { en: 'Travel', hi: 'यात्रा' },
        goldNews: { en: 'Gold News', hi: 'सोने की खबरें' },
        silverNews: { en: 'Silver News', hi: 'चांदी की खबरें' },
        goldRateToday: { en: 'Gold Rate Today', hi: 'आज सोने का भाव' },
        silverRates: { en: 'Silver Rates', hi: 'चांदी के भाव' },
        goldSilverRatesByCity: { en: 'Gold & Silver Rates by City', hi: 'शहर के अनुसार सोने और चांदी के भाव' },
        goldRates: { en: 'Gold Rates', hi: 'सोने के भाव' },
        live: { en: 'LIVE', hi: 'लाइव' },
        check10DaysHistory: { en: 'Check 10 Days History', hi: '10 दिनों का इतिहास देखें' },
        checkDetailedRates: { en: 'Check detailed rates', hi: 'विस्तृत दरें देखें' },
        mustRead: { en: 'Must Read', hi: 'ज़रूर पढ़ें' },
        todaysFuelPrice: { en: "Today's Fuel Price", hi: 'आज का ईंधन मूल्य' },
        petrol: { en: 'Petrol', hi: 'पेट्रोल' },
        diesel: { en: 'Diesel', hi: 'डीज़ल' },
        unchanged: { en: 'unchanged', hi: 'अपरिवर्तित' },
        marketTools: { en: 'Market Tools', hi: 'बाज़ार टूल' },
        sipCalc: { en: 'SIP Calc', hi: 'SIP कैल्क' },
        goldCalc: { en: 'Gold Calc', hi: 'गोल्ड कैल्क' },
        emiCalc: { en: 'EMI Calc', hi: 'EMI कैल्क' },
        fdCalc: { en: 'FD Calc', hi: 'FD कैल्क' },
        adSpace: { en: 'Ad Space', hi: 'विज्ञापन स्थान' },
        viewAll: { en: 'View All', hi: 'सभी देखें' },
    },

    // ─── Agriculture Pages ──────────────────────────────────────────
    agriculture: {
        kisanMandiPrices: { en: 'Kisan Mandi Prices', hi: 'किसान मंडी के भाव' },
        heroSubtitle: {
            en: 'Check rate of wheat today and access real-time kisan mandi prices for all agricultural commodities across India. Updated daily from official government sources.',
            hi: 'आज गेहूं का भाव जानें और भारत भर में सभी कृषि वस्तुओं के रीयल-टाइम किसान मंडी के भाव देखें। सरकारी स्रोतों से प्रतिदिन अपडेट।'
        },
        browseByState: { en: 'Browse by State', hi: 'राज्य के अनुसार देखें' },
        browseByCommCrop: { en: 'Browse by Crop/Commodity', hi: 'फसल/कमोडिटी के अनुसार देखें' },
        viewAllMandis: { en: 'View all mandis →', hi: 'सभी मंडियां देखें →' },
        latestMandiPrices: { en: 'Latest Mandi Prices', hi: 'ताज़ा मंडी के भाव' },
        state: { en: 'State', hi: 'राज्य' },
        district: { en: 'District', hi: 'जिला' },
        market: { en: 'Market', hi: 'मंडी' },
        commodity: { en: 'Commodity', hi: 'कमोडिटी' },
        modalPrice: { en: 'Modal Price', hi: 'मॉडल मूल्य' },
        date: { en: 'Date', hi: 'तारीख' },
        variety: { en: 'Variety', hi: 'किस्म' },
        minPrice: { en: 'Min Price', hi: 'न्यूनतम मूल्य' },
        maxPrice: { en: 'Max Price', hi: 'अधिकतम मूल्य' },
        seoHeading: {
            en: 'Rate of Wheat Today & Kisan Mandi Prices in India',
            hi: 'आज गेहूं का भाव और भारत में किसान मंडी के भाव'
        },
        seoContent1: {
            en: 'Looking for the rate of wheat today? Our kisan mandi platform provides live wholesale prices for wheat, rice, onion, potato, cotton, and all major agricultural commodities across India. Mandi prices (APMC rates) represent the wholesale rates at which farmers and traders buy and sell crops in government-regulated markets.',
            hi: 'आज गेहूं का भाव ढूंढ रहे हैं? हमारा किसान मंडी प्लेटफॉर्म भारत भर में गेहूं, चावल, प्याज, आलू, कपास और सभी प्रमुख कृषि वस्तुओं के लाइव थोक भाव प्रदान करता है। मंडी भाव (APMC दरें) वे थोक दरें हैं जिन पर किसान और व्यापारी सरकार द्वारा विनियमित बाज़ारों में फसलों की खरीद-बिक्री करते हैं।'
        },
        seoContent2: {
            en: "Whether you want to check today's wheat rate, rice price, or any other crop rate today, simply browse by state or search by commodity to compare kisan mandi prices across different states and districts. All data is sourced from the Government of India's Open Data Portal and updated daily.",
            hi: "चाहे आप आज गेहूं का भाव, चावल की कीमत, या किसी अन्य फसल का भाव जानना चाहते हों, बस राज्य या कमोडिटी के अनुसार खोजें और विभिन्न राज्यों और जिलों में किसान मंडी के भावों की तुलना करें। सभी डेटा भारत सरकार के ओपन डेटा पोर्टल से प्राप्त और प्रतिदिन अपडेट किया जाता है।"
        },
        dataSource: { en: 'Data Source: Government of India Open Data Platform', hi: 'डेटा स्रोत: भारत सरकार ओपन डेटा प्लेटफॉर्म' },
        averagePrice: { en: 'Average Price', hi: 'औसत मूल्य' },
        perQuintal: { en: 'per quintal', hi: 'प्रति क्विंटल' },
        tradingStates: { en: 'Trading States', hi: 'व्यापारिक राज्य' },
        acrossIndia: { en: 'across India', hi: 'पूरे भारत में' },
        activeMarkets: { en: 'Active Markets', hi: 'सक्रिय मंडियां' },
        mandisReporting: { en: 'mandis reporting', hi: 'मंडियों से रिपोर्ट' },
        viewPrices: { en: 'View prices →', hi: 'भाव देखें →' },
        viewMandis: { en: 'View mandis →', hi: 'मंडियां देखें →' },
    },

    // ─── Gold Rate Pages ────────────────────────────────────────────
    gold: {
        goldRateTodayIndia: { en: 'Gold Rate Today in India', hi: 'भारत में आज सोने का भाव' },
        goldRateSubtitle: {
            en: 'Check live gold rates across major Indian cities. Updated in real-time with 24K, 22K, and 18K gold prices.',
            hi: 'प्रमुख भारतीय शहरों में लाइव सोने के भाव देखें। 24K, 22K और 18K सोने की कीमतों के साथ रीयल-टाइम अपडेट।'
        },
        allIndiaGoldRates: { en: 'All India Gold Rates', hi: 'अखिल भारतीय सोने के भाव' },
        cityWiseGoldRates: { en: 'City-Wise Gold Rates', hi: 'शहर के अनुसार सोने के भाव' },
        cityWiseSubtitle: {
            en: 'Select your city to view detailed gold rates, historical data, and use our gold calculator',
            hi: 'विस्तृत सोने के भाव, ऐतिहासिक डेटा और हमारे गोल्ड कैलकुलेटर का उपयोग करने के लिए अपना शहर चुनें'
        },
        viewLiveGoldRates: { en: 'View live gold rates →', hi: 'लाइव सोने के भाव देखें →' },
        whyChoose: { en: 'Why Choose gpaisa.in for Gold Rates?', hi: 'सोने के भाव के लिए gpaisa.in क्यों चुनें?' },
        realTimeUpdates: { en: 'Real-Time Updates', hi: 'रीयल-टाइम अपडेट' },
        realTimeUpdatesDesc: {
            en: 'Live gold rates updated throughout the day to reflect current market prices',
            hi: 'दिन भर लाइव सोने के भाव अपडेट होते हैं जो वर्तमान बाज़ार कीमतों को दर्शाते हैं'
        },
        citySpecificRates: { en: 'City-Specific Rates', hi: 'शहर-विशिष्ट दरें' },
        citySpecificRatesDesc: {
            en: 'Accurate gold prices for 10+ major Indian cities with local variations',
            hi: '10+ प्रमुख भारतीय शहरों में स्थानीय भिन्नताओं के साथ सटीक सोने की कीमतें'
        },
        goldCalculator: { en: 'Gold Calculator', hi: 'गोल्ड कैलकुलेटर' },
        goldCalculatorDesc: {
            en: 'Calculate total gold price including weight, purity, and making charges',
            hi: 'वजन, शुद्धता और मेकिंग चार्ज सहित कुल सोने की कीमत की गणना करें'
        },
        understandingGoldRates: { en: 'Understanding Gold Rates in India', hi: 'भारत में सोने के भाव को समझें' },
        goldRatesIntro: {
            en: 'Gold rates in India fluctuate daily based on various factors including international gold prices, currency exchange rates, import duties, and local demand. Our platform provides real-time gold rates for major Indian cities, helping you stay informed about current market prices.',
            hi: 'भारत में सोने के भाव अंतरराष्ट्रीय सोने की कीमतों, मुद्रा विनिमय दरों, आयात शुल्क और स्थानीय मांग सहित विभिन्न कारकों के आधार पर दैनिक रूप से उतार-चढ़ाव करते हैं। हमारा प्लेटफॉर्म प्रमुख भारतीय शहरों के लिए रीयल-टाइम सोने के भाव प्रदान करता है।'
        },
        goldPurityStandards: { en: 'Gold Purity Standards', hi: 'सोने की शुद्धता मानक' },
        gold24k: {
            en: '24K Gold (99.9% pure): Purest form, ideal for investment and coins',
            hi: '24K सोना (99.9% शुद्ध): सबसे शुद्ध रूप, निवेश और सिक्कों के लिए आदर्श'
        },
        gold22k: {
            en: '22K Gold (91.67% pure): Most popular for jewelry in India',
            hi: '22K सोना (91.67% शुद्ध): भारत में आभूषणों के लिए सबसे लोकप्रिय'
        },
        gold18k: {
            en: '18K Gold (75% pure): Used for modern and designer jewelry',
            hi: '18K सोना (75% शुद्ध): आधुनिक और डिज़ाइनर आभूषणों के लिए उपयोग'
        },
        whyGoldRatesVary: { en: 'Why Gold Rates Vary by City', hi: 'शहर के अनुसार सोने के भाव अलग क्यों होते हैं' },
        goldRatesVaryDesc: {
            en: "Gold prices differ across Indian cities due to factors like local taxes, transportation costs, demand-supply dynamics, and making charges. Metropolitan cities like Mumbai, Delhi, and Bangalore may have different rates compared to smaller cities. Always check your local city's gold rate before making a purchase.",
            hi: 'स्थानीय करों, परिवहन लागत, मांग-आपूर्ति की गतिशीलता और मेकिंग चार्ज जैसे कारकों के कारण भारतीय शहरों में सोने की कीमतें भिन्न होती हैं। मुंबई, दिल्ली और बैंगलोर जैसे महानगरों में छोटे शहरों की तुलना में अलग दरें हो सकती हैं। खरीदारी करने से पहले हमेशा अपने स्थानीय शहर का सोने का भाव जांचें।'
        },
        bestTimeToBuy: { en: 'Best Time to Buy Gold', hi: 'सोना खरीदने का सबसे अच्छा समय' },
        bestTimeToBuyDesc: {
            en: 'While gold is traditionally purchased during festivals like Dhanteras, Akshaya Tritiya, and weddings, the best time to buy gold is when prices are favorable. Monitor daily gold rates and historical trends to make informed investment decisions.',
            hi: 'जबकि परंपरागत रूप से धनतेरस, अक्षय तृतीया और शादियों जैसे त्योहारों पर सोना खरीदा जाता है, सोना खरीदने का सबसे अच्छा समय तब होता है जब कीमतें अनुकूल हों। सूचित निवेश निर्णय लेने के लिए दैनिक सोने के भाव और ऐतिहासिक रुझानों की निगरानी करें।'
        },
        stayUpdated: { en: 'Stay Updated with Daily Gold Rates', hi: 'दैनिक सोने के भाव से अपडेट रहें' },
        stayUpdatedDesc: {
            en: 'Bookmark this page to check gold rates daily and make informed investment decisions',
            hi: 'दैनिक सोने के भाव जांचने और सूचित निवेश निर्णय लेने के लिए इस पेज को बुकमार्क करें'
        },
        viewAllCommodityPrices: { en: 'View All Commodity Prices', hi: 'सभी कमोडिटी कीमतें देखें' },
        // City page
        todaysGoldRatesIn: { en: "Today's Gold Rates in", hi: 'आज सोने के भाव -' },
        goldPriceCalcFor: { en: 'Gold Price Calculator for', hi: 'गोल्ड प्राइस कैलकुलेटर -' },
        goldRateHistoryIn: { en: 'Gold Rate History in', hi: 'सोने के भाव का इतिहास -' },
        goldRateIn: { en: 'Gold Rate in', hi: 'सोने का भाव -' },
        today: { en: 'Today', hi: 'आज' },
        liveGoldDesc: {
            en: 'Live 24K, 22K, and 18K gold prices. Updated in real-time with historical data and price calculator.',
            hi: 'लाइव 24K, 22K और 18K सोने की कीमतें। ऐतिहासिक डेटा और प्राइस कैलकुलेटर के साथ रीयल-टाइम अपडेट।'
        },
        aboutGoldRatesIn: { en: 'About Gold Rates in', hi: 'सोने के भाव के बारे में -' },
        aboutGoldDesc: {
            en: 'varies daily based on international market trends, currency exchange rates, and local demand-supply dynamics. Our platform provides real-time updates on 24K, 22K, and 18K gold prices to help you make informed decisions.',
            hi: 'अंतरराष्ट्रीय बाज़ार के रुझान, मुद्रा विनिमय दरों और स्थानीय मांग-आपूर्ति की गतिशीलता के आधार पर दैनिक रूप से बदलता रहता है। हमारा प्लेटफॉर्म 24K, 22K और 18K सोने की कीमतों पर रीयल-टाइम अपडेट प्रदान करता है।'
        },
        factorsAffecting: { en: 'Factors Affecting Gold Prices in', hi: 'सोने की कीमतों को प्रभावित करने वाले कारक -' },
        factor1: { en: 'International gold prices and global market trends', hi: 'अंतरराष्ट्रीय सोने की कीमतें और वैश्विक बाज़ार के रुझान' },
        factor2: { en: 'Currency exchange rates (USD to INR)', hi: 'मुद्रा विनिमय दरें (USD से INR)' },
        factor3: { en: 'Local demand during festivals and wedding seasons', hi: 'त्योहारों और शादी के मौसम में स्थानीय मांग' },
        factor4: { en: 'Import duties and GST (Goods and Services Tax)', hi: 'आयात शुल्क और GST (वस्तु एवं सेवा कर)' },
        factor5: { en: 'Making charges and jeweler margins', hi: 'मेकिंग चार्ज और ज्वेलर का मार्जिन' },
        goldPurityExplained: { en: 'Gold Purity Explained', hi: 'सोने की शुद्धता समझें' },
        gold24kFull: {
            en: '24K Gold (99.9% pure): The purest form of gold, ideal for investment purposes. Softer and more expensive than other purities.',
            hi: '24K सोना (99.9% शुद्ध): सोने का सबसे शुद्ध रूप, निवेश उद्देश्यों के लिए आदर्श। अन्य शुद्धता से नरम और अधिक महंगा।'
        },
        gold22kFull: {
            en: '22K Gold (91.67% pure): Most popular for jewelry in India. Offers a good balance between purity and durability.',
            hi: '22K सोना (91.67% शुद्ध): भारत में आभूषणों के लिए सबसे लोकप्रिय। शुद्धता और टिकाऊपन के बीच अच्छा संतुलन।'
        },
        gold18kFull: {
            en: '18K Gold (75% pure): Commonly used for modern and designer jewelry. More durable due to higher alloy content.',
            hi: '18K सोना (75% शुद्ध): आधुनिक और डिज़ाइनर आभूषणों के लिए सामान्यतः उपयोग। उच्च मिश्र धातु सामग्री के कारण अधिक टिकाऊ।'
        },
        howToBuyIn: { en: 'How to Buy Gold in', hi: 'सोना कैसे खरीदें -' },
        howToBuyDesc: {
            en: ', always verify the current market rate, check for hallmark certification (BIS), ask for detailed invoices including making charges and GST, and compare prices from multiple jewelers. Our gold calculator helps you estimate the total cost including all charges.',
            hi: 'में सोना खरीदते समय, हमेशा वर्तमान बाज़ार दर को सत्यापित करें, हॉलमार्क प्रमाणपत्र (BIS) जांचें, मेकिंग चार्ज और GST सहित विस्तृत चालान मांगें, और कई ज्वेलर्स से कीमतों की तुलना करें। हमारा गोल्ड कैलकुलेटर सभी शुल्कों सहित कुल लागत का अनुमान लगाने में मदद करता है।'
        },
        goldRatesOtherCities: { en: 'Gold Rates in Other Cities', hi: 'अन्य शहरों में सोने के भाव' },
        viewRates: { en: 'View Rates →', hi: 'भाव देखें →' },
        importantNote: { en: 'Important Note', hi: 'महत्वपूर्ण सूचना' },
        importantNoteDesc: {
            en: 'The gold rates displayed are indicative and may vary slightly from actual market prices. Prices shown do not include making charges, GST, or other applicable taxes. Always verify the current rate with your local jeweler before making a purchase. We update our rates regularly to ensure accuracy.',
            hi: 'प्रदर्शित सोने के भाव सांकेतिक हैं और वास्तविक बाज़ार कीमतों से थोड़े भिन्न हो सकते हैं। दिखाई गई कीमतों में मेकिंग चार्ज, GST या अन्य लागू कर शामिल नहीं हैं। खरीदारी करने से पहले हमेशा अपने स्थानीय ज्वेलर से वर्तमान दर की पुष्टि करें।'
        },
        home: { en: 'Home', hi: 'होम' },
        goldRates: { en: 'Gold Rates', hi: 'सोने के भाव' },
    },

    // ─── Silver Rate Pages ──────────────────────────────────────────
    silver: {
        silverRateTodayIndia: { en: 'Silver Rate Today in India', hi: 'भारत में आज चांदी का भाव' },
        silverRateSubtitle: {
            en: 'Check live silver rates across major Indian cities. Updated in real-time with prices per gram and per kg.',
            hi: 'प्रमुख भारतीय शहरों में लाइव चांदी के भाव देखें। प्रति ग्राम और प्रति किलो कीमतों के साथ रीयल-टाइम अपडेट।'
        },
        currentSilverRates: { en: 'Current Silver Rates', hi: 'वर्तमान चांदी के भाव' },
        cityWiseSilverRates: { en: 'City-Wise Silver Rates', hi: 'शहर के अनुसार चांदी के भाव' },
        cityWiseSubtitle: {
            en: 'Select your city to view detailed silver rates',
            hi: 'विस्तृत चांदी के भाव देखने के लिए अपना शहर चुनें'
        },
        viewLiveRates: { en: 'View live rates →', hi: 'लाइव भाव देखें →' },
        whyTrack: { en: 'Why Track Silver Rates on gpaisa.in?', hi: 'gpaisa.in पर चांदी के भाव क्यों ट्रैक करें?' },
        liveMarketData: { en: 'Live Market Data', hi: 'लाइव बाज़ार डेटा' },
        liveMarketDataDesc: {
            en: 'Real-time silver prices updated directly from market feeds.',
            hi: 'बाज़ार फीड से सीधे अपडेट की गई रीयल-टाइम चांदी की कीमतें।'
        },
        citySpecificRates: { en: 'City-Specific Rates', hi: 'शहर-विशिष्ट दरें' },
        citySpecificRatesDesc: {
            en: 'Accurate rates for over 15 major Indian cities.',
            hi: '15+ प्रमुख भारतीय शहरों के लिए सटीक दरें।'
        },
        smartCalculator: { en: 'Smart Calculator', hi: 'स्मार्ट कैलकुलेटर' },
        smartCalculatorDesc: {
            en: 'Calculate value for any weight instantly.',
            hi: 'किसी भी वजन का मूल्य तुरंत गणना करें।'
        },
        understandingSilverRates: { en: 'Understanding Silver Rates in India', hi: 'भारत में चांदी के भाव को समझें' },
        silverIntro: {
            en: 'Silver is a popular precious metal in India, used extensively in jewelry, silverware, and industry. Like gold, silver rates in India are influenced by international prices, currency fluctuations, import duties, and local demand.',
            hi: 'चांदी भारत में एक लोकप्रिय कीमती धातु है, जिसका उपयोग आभूषण, चांदी के बर्तन और उद्योग में व्यापक रूप से किया जाता है। सोने की तरह, भारत में चांदी के भाव अंतरराष्ट्रीय कीमतों, मुद्रा उतार-चढ़ाव, आयात शुल्क और स्थानीय मांग से प्रभावित होते हैं।'
        },
        factorsImpacting: { en: 'Factors Impacting Silver Prices', hi: 'चांदी की कीमतों को प्रभावित करने वाले कारक' },
        industrialDemand: {
            en: 'Industrial Demand: Silver has massive industrial applications in electronics, solar panels, and medical devices.',
            hi: 'औद्योगिक मांग: चांदी का इलेक्ट्रॉनिक्स, सोलर पैनल और चिकित्सा उपकरणों में व्यापक औद्योगिक उपयोग है।'
        },
        investmentDemand: {
            en: 'Investment Demand: Investors buy silver as a hedge against inflation and currency devaluation.',
            hi: 'निवेश मांग: निवेशक मुद्रास्फीति और मुद्रा अवमूल्यन के खिलाफ बचाव के रूप में चांदी खरीदते हैं।'
        },
        usdInrRate: {
            en: 'USD/INR Rate: A weaker Rupee makes imported silver more expensive.',
            hi: 'USD/INR दर: कमजोर रुपया आयातित चांदी को अधिक महंगा बनाता है।'
        },
        silverWeightUnits: { en: 'Silver Weight Units', hi: 'चांदी की वजन इकाइयां' },
        silverWeightDesc: {
            en: 'Silver is commonly traded in kilograms (kg) in the wholesale market, while retail prices are often quoted per 10 grams or per gram. 1 Kg = 1000 Grams.',
            hi: 'चांदी का थोक बाज़ार में आमतौर पर किलोग्राम (किग्रा) में कारोबार होता है, जबकि खुदरा कीमतें अक्सर प्रति 10 ग्राम या प्रति ग्राम उद्धृत की जाती हैं। 1 किग्रा = 1000 ग्राम।'
        },
    },

    // ─── Common / Shared ────────────────────────────────────────────
    common: {
        language: { en: 'English', hi: 'हिन्दी' },
        openMenu: { en: 'Open main menu', hi: 'मुख्य मेनू खोलें' },
    },
} as const;

export type TranslationKey = keyof typeof translations;
