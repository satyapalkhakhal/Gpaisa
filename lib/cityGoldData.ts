// ─── City-specific gold market data for unique SEO content (E-E-A-T) ────────

export interface CityGoldInfo {
    city: string;
    slug: string;
    state: string;
    mainMarkets: string[];
    tagline: string;
    heroDescription: string;
    uniqueDescription: string;
    goldCulture: string;
    keyHighlights: { icon: string; label: string; detail: string }[];
    buyingTips: string[];
    popularAreas: { name: string; specialty: string }[];
    faq: { question: string; answer: string }[];
    priceFactors: string[];
    investmentInsight: string;
    festivalsImpact: string;
}

export const CITY_GOLD_DATA: Record<string, CityGoldInfo> = {
    mumbai: {
        city: 'Mumbai',
        slug: 'mumbai',
        state: 'Maharashtra',
        mainMarkets: ['Zaveri Bazaar', 'Dhantoli'],
        tagline: "Home of Zaveri Bazaar, India's Bullion Trading Hub",
        heroDescription:
            "Mumbai is a major centre of India's gold trade — traders across the country watch the rates quoted in Zaveri Bazaar. Check today's live gold rate in Mumbai for 24K, 22K, and 18K.",
        uniqueDescription:
            "Zaveri Bazaar in South Mumbai is over 150 years old, and its lanes hold a large number of jewellers and bullion dealers, from retail showrooms to wholesale traders. The Multi Commodity Exchange (MCX), where gold futures trade, is headquartered in Mumbai, as are BSE and NSE, where Gold ETFs are bought and sold.",
        goldCulture:
            "Mumbai's gold culture is driven by its massive diamond-gold jewellery cluster in the Zaveri Bazaar–Opera House corridor. The city sees peak demand during Dhanteras, Gudi Padwa, and the wedding season (November–February). Mumbai's cosmopolitan buyer base demands everything from traditional Maharashtrian Thushi necklaces to contemporary Italian-style gold chains.",
        keyHighlights: [
            { icon: '🏛️', label: 'MCX Gold Hub', detail: "Home to India's Multi Commodity Exchange — the country's gold futures trading centre" },
            { icon: '🏦', label: 'Exchange City', detail: 'BSE and NSE are headquartered here — Gold ETFs and existing SGBs trade on them' },
            { icon: '💎', label: 'Diamond-Gold Cluster', detail: 'The Zaveri Bazaar–Opera House corridor is a dense cluster of diamond and gold traders' },
        ],
        buyingTips: [
            'Always verify the BIS hallmark and 6-digit HUID number on every gold piece — you can check the HUID in the BIS Care app.',
            'Compare making charges across Zaveri Bazaar shops — they range from 8% to 25% depending on design complexity.',
            'For investment gold (24K bars/coins), buy from MMTC-PAMP or authorized bank branches for certified purity.',
            'Check the day\'s MCX gold futures price before visiting — Mumbai jewellers closely track MCX rates.',
            "Request a detailed invoice mentioning gold weight, purity, making charges, and GST separately.",
        ],
        popularAreas: [
            { name: 'Zaveri Bazaar', specialty: 'Traditional gold jewellery, bullion trading, wholesale' },
            { name: 'Kalbadevi', specialty: 'Gold bars, coins, and investment gold' },
            { name: 'Bandra–Juhu', specialty: 'Designer and branded jewellery showrooms' },
            { name: 'Borivali–Kandivali', specialty: 'Affordable wedding jewellery and daily-wear gold' },
        ],
        faq: [
            {
                question: 'Why is Mumbai considered the gold capital of India?',
                answer: "Mumbai houses Zaveri Bazaar, a bullion and jewellery market more than 150 years old. The city is also home to MCX (Multi Commodity Exchange), where gold futures are traded, and to BSE and NSE. Traders across India watch the rates quoted in Zaveri Bazaar.",
            },
            {
                question: 'What is the average making charge for gold jewellery in Mumbai?',
                answer: 'Making charges in Mumbai typically range from 8% to 25% of gold value, depending on design complexity. Plain gold chains may have 8-12% charges, while intricate bridal sets can go up to 25%. Always ask for a making charge breakdown before purchase.',
            },
            {
                question: 'Is gold cheaper in Zaveri Bazaar compared to branded stores?',
                answer: "Gold metal rates are similar everywhere (set by international markets). However, Zaveri Bazaar shops generally offer lower making charges (8-15%) compared to branded stores (15-25%). But branded stores offer certified designs, buyback guarantees, and standardised billing.",
            },
            {
                question: 'When is the best time to buy gold in Mumbai?',
                answer: "Gold prices fluctuate daily. Traditionally, buying on Dhanteras, Akshaya Tritiya, and Gudi Padwa is considered auspicious. No month guarantees lower prices, since rates follow international markets — compare a few days' rates and making charges before buying.",
            },
        ],
        priceFactors: [
            'MCX gold futures price and international spot gold rates',
            'USD/INR exchange rate — a weaker rupee increases gold prices',
            'Import duty (15% since 13 May 2026) and GST (3%) on gold',
            'Seasonal demand during Dhanteras, Diwali, and wedding season',
            'Making charges by Mumbai jewellers (8-25% of gold value)',
            'Local competition in Zaveri Bazaar keeping margins competitive',
        ],
        investmentInsight:
            "With BSE and NSE headquartered here, Mumbai's investors are familiar with Gold ETFs and existing Sovereign Gold Bonds traded on the exchanges (no new SGBs have been issued since February 2024). For physical gold investment, MMTC-PAMP certified bars are widely available from authorised dealers in Zaveri Bazaar.",
        festivalsImpact:
            'Gold demand in Mumbai peaks during Dhanteras (October/November), Gudi Padwa (March/April), and the wedding season (November–February). Dhanteras is considered Zaveri Bazaar\'s busiest day of the year.',
    },

    delhi: {
        city: 'Delhi',
        slug: 'delhi',
        state: 'Delhi NCR',
        mainMarkets: ['Dariba Kalan', 'Karol Bagh'],
        tagline: 'Mughal Jewellery Legacy & North India Wholesale Hub',
        heroDescription:
            "Delhi's gold market is steeped in Mughal heritage — Dariba Kalan has sold gold since the 17th century. Check today's live gold rate in Delhi for 24K, 22K, and 18K.",
        uniqueDescription:
            "Dariba Kalan in Chandni Chowk is one of India's oldest jewellery markets, trading since the Mughal era (17th century). Delhi is the wholesale nerve centre for North India's gold jewellery trade, supplying to retailers across Uttar Pradesh, Haryana, Punjab, and Rajasthan. The city's markets are known for Kundan and Meenakari craftsmanship — gold work inlaid with gemstones and hand-painted enamel.",
        goldCulture:
            "Delhi's gold culture is deeply intertwined with its Mughal and Rajput heritage. The city is known for elaborate bridal jewellery sets — a typical Delhi wedding features heavy Kundan sets, Polki necklaces, and Meenakari bangles. Beyond weddings, Dhanteras and Karva Chauth drive significant gold purchases.",
        keyHighlights: [
            { icon: '🕌', label: 'Kundan & Meenakari', detail: "Delhi's markets are known for gem-set Kundan and enamelled Meenakari gold work" },
            { icon: '🏪', label: 'Chandni Chowk Heritage', detail: 'Dariba Kalan has traded jewellery since the Mughal era' },
            { icon: '📦', label: 'North India Wholesale', detail: 'Delhi supplies gold jewellery to retailers across UP, Haryana, Punjab, and Rajasthan' },
        ],
        buyingTips: [
            'In Dariba Kalan, bargaining on making charges is common — do not treat the first quoted charge as final.',
            "For Kundan jewellery, verify whether the stones are real or synthetic — this significantly affects price.",
            "Karol Bagh has more standardised pricing — better for first-time buyers unfamiliar with negotiation.",
            "Always check for BIS hallmark with HUID — Delhi has had issues with under-carating in unorganised shops.",
            "For investment, consider Gold ETFs or existing Sovereign Gold Bonds traded on NSE/BSE — new SGB issues have stopped since February 2024.",
        ],
        popularAreas: [
            { name: 'Dariba Kalan (Chandni Chowk)', specialty: 'Traditional Kundan, Polki, and Meenakari jewellery' },
            { name: 'Karol Bagh', specialty: 'Branded showrooms, standardised pricing, bridal jewellery' },
            { name: 'Rajouri Garden', specialty: 'Affordable gold jewellery and daily-wear designs' },
            { name: 'South Extension', specialty: 'Premium designer jewellery and luxury brands' },
        ],
        faq: [
            {
                question: 'What makes Delhi\'s gold jewellery unique?',
                answer: 'Delhi is known for Kundan and Meenakari craftsmanship — gold jewellery inlaid with gemstones (Kundan) and decorated with hand-painted enamel work (Meenakari). This Mughal-era craft is still seen in the shops of Dariba Kalan and Karol Bagh.',
            },
            {
                question: 'Which is the best market for gold in Delhi?',
                answer: "Dariba Kalan in Chandni Chowk is the oldest and most famous gold market. Karol Bagh offers more standardised pricing with branded stores. South Extension has premium designer jewellery. For wholesale, Dariba Kalan remains unmatched.",
            },
            {
                question: 'Are gold rates different in Delhi NCR cities (Noida, Gurgaon)?',
                answer: "Base gold rates are identical across Delhi NCR since they're set by international markets. However, making charges vary — branded mall showrooms usually charge more than traditional Chandni Chowk shops. GST (3%) applies uniformly.",
            },
            {
                question: 'What gold is typically bought for a Delhi wedding?',
                answer: "A Delhi bride's jewellery typically includes Kundan sets, Polki necklaces, gold bangles, and earrings. How much gold is bought depends entirely on the family's budget — get making charges and buyback terms in writing from several shops before a large purchase.",
            },
        ],
        priceFactors: [
            'International gold spot price and London Bullion Market rates',
            'USD/INR exchange rate fluctuations',
            'Import duty (15% since 13 May 2026) and GST (3%) on gold purchases',
            'High wedding season demand (October–February) means fewer discounts on making charges',
            'Making charges for Kundan/Meenakari work (15-30%) are higher than plain gold',
            'Wholesale competition in Dariba Kalan keeps base margins thin',
        ],
        investmentInsight:
            "Delhi NCR has a growing Gold ETF investor base. Investors interested in Sovereign Gold Bonds can buy existing SGBs on NSE/BSE, since no new SGBs have been issued since February 2024. For physical investment gold, MMTC-PAMP and Augmont-certified gold bars are available from authorised dealers.",
        festivalsImpact:
            'Delhi sees peak gold demand during Dhanteras, Karva Chauth, and Akshaya Tritiya. Dhanteras brings the year\'s biggest crowds to jewellery markets across Delhi NCR, and the wedding season (October–February) drives sustained high demand.',
    },

    chennai: {
        city: 'Chennai',
        slug: 'chennai',
        state: 'Tamil Nadu',
        mainMarkets: ['T. Nagar', 'Usman Road'],
        tagline: "T. Nagar: South India's Famous Jewellery Market",
        heroDescription:
            "Tamil Nadu is among India's biggest gold-buying states, and Chennai's T. Nagar is the epicentre. Check today's live gold rate in Chennai.",
        uniqueDescription:
            "Usman Road alone hosts dozens of large jewellery showrooms including flagship stores of Tanishq, GRT, Kalyan, and Joyalukkas. On Akshaya Tritiya, long queues form outside these stores from early morning. Chennai's gold market is dominated by traditional South Indian designs — temple jewellery, Kasu Malai (coin necklaces), and Jimikki Kammal (jhumka earrings).",
        goldCulture:
            "Gold in Tamil Nadu is not just jewellery — it's identity, security, and cultural pride. Every Tamil bride is expected to wear elaborate gold sets during the wedding, and gold gifting is a core part of the Thaali (mangalsutra) ceremony. Temple jewellery inspired by Chola-era temple sculptures is uniquely Tamilian. Chennai families often accumulate gold through monthly jewellery savings schemes (like GRT Gold Plan, Kalyan Gold Scheme), making gold ownership almost universal.",
        keyHighlights: [
            { icon: '🛕', label: 'Temple Jewellery', detail: 'Chola-inspired temple jewellery; Nagercoil temple jewellery (Kanyakumari district) has a GI tag' },
            { icon: '📊', label: 'Big Gold Buyer', detail: "Tamil Nadu is among India's biggest gold-buying states" },
            { icon: '🎉', label: 'Akshaya Tritiya', detail: 'T. Nagar sees long queues during the Akshaya Tritiya gold rush' },
        ],
        buyingTips: [
            "Jewellery savings schemes (such as GRT Gold Plan or Kalyan Gold Scheme) add a bonus at the end, but the money can only be spent at that jeweller — read the terms in writing before joining.",
            "T. Nagar shops offer competitive making charges (6-15%) due to intense competition — compare at least 3 stores.",
            "For temple jewellery, verify weight carefully — intricate designs can have high wastage (8-12%) added.",
            "Buy during Akshaya Tritiya for best promotional offers, but expect crowds — visit early morning.",
            "Always ask for the 'melting value' — this tells you the actual gold content value excluding making charges.",
        ],
        popularAreas: [
            { name: 'T. Nagar (Usman Road)', specialty: 'Largest concentration of jewellery showrooms — temple jewellery, bridal sets' },
            { name: 'Mylapore', specialty: 'Traditional temple jewellery and antique gold designs' },
            { name: 'Anna Nagar', specialty: 'Modern jewellery showrooms and branded stores' },
            { name: 'Sowcarpet', specialty: 'Wholesale gold jewellery and North Indian designs' },
        ],
        faq: [
            {
                question: 'Why is gold so important to Tamil Nadu culture?',
                answer: "Gold is central to Tamil identity, security, and cultural ceremonies. Every Tamil bride wears elaborate gold sets, and the Thaali (mangalsutra) ceremony is incomplete without gold. This is why Tamil Nadu is among India's biggest gold-buying states.",
            },
            {
                question: 'What is temple jewellery in Chennai?',
                answer: 'Temple jewellery is a unique South Indian gold jewellery style inspired by Chola-era temple sculptures. It features deities, peacocks, and temple motifs crafted in gold, often studded with rubies and emeralds. Its traditional centre is Nagercoil in Kanyakumari district, whose temple jewellery has a GI tag; Chennai showrooms stock it widely.',
            },
            {
                question: 'Are jewellery savings schemes in Chennai worth it?',
                answer: "Schemes like GRT Gold Plan and Kalyan Gold Scheme let you pay monthly instalments (e.g., for 11 months) and the jeweller adds a bonus, often equal to one instalment, or a discount on making charges. But the amount can only be used to buy jewellery from that jeweller, and the jeweller holds your money in the meantime. Choose a reputable jeweller and read the bonus, rate-fixing and early-exit terms before joining.",
            },
            {
                question: 'Is gold cheaper in Chennai compared to other cities?',
                answer: "Base gold rates are similar across India. However, intense competition in T. Nagar means good deals on making charges (typically 6-15%), so the final jewellery cost is often slightly lower.",
            },
        ],
        priceFactors: [
            'International gold prices and MCX rates set the base price',
            'USD/INR exchange rate directly impacts import costs',
            'Intense T. Nagar competition keeps making charges lower (6-15%)',
            'Akshaya Tritiya and Pongal drive seasonal demand spikes',
            'Tamil wedding season (January–July) sustains high demand',
            'Jewellery savings schemes create consistent year-round demand',
        ],
        investmentInsight:
            "Chennai's gold investment landscape is dominated by physical gold and jewellery savings schemes. Gold loan companies like Muthoot and Manappuram originated in South India, and gold-backed lending is ubiquitous. Gold ETFs and existing Sovereign Gold Bonds traded on NSE/BSE are gaining traction among Chennai's IT workforce, but physical gold remains king for most families.",
        festivalsImpact:
            'Akshaya Tritiya (April/May) is considered the biggest gold-buying day in Chennai, with T. Nagar stores seeing their biggest crowds of the year. Pongal (January) and the Tamil wedding season (January–July) sustain high demand. Navaratri also sees significant gold purchases.',
    },

    kolkata: {
        city: 'Kolkata',
        slug: 'kolkata',
        state: 'West Bengal',
        mainMarkets: ['Bowbazar', 'Barabazar'],
        tagline: "Bengal's Gold Craftsmanship Capital",
        heroDescription:
            "Kolkata is renowned for exquisite gold filigree (Tarkashi) work and delicate handcrafted jewellery. Check today's live gold rate in Kolkata.",
        uniqueDescription:
            "Kolkata is known for fine gold filigree work — called Tarkashi — where thin gold wires are twisted and soldered into intricate patterns. Bengali goldsmiths have practised this craft for generations. Bowbazar, the city's jewellery heart, houses hundreds of artisan workshops and retail stores. Kolkata's goldsmithing tradition emphasises lightweight, intricate designs over heavy pieces — a distinctive style that sets Bengali gold jewellery apart from the rest of India.",
        goldCulture:
            "Bengali brides are known for one of India's most elaborate gold jewellery traditions. The 'Shankha-Pola' (red and white bangles) paired with gold jewellery is iconic. Key bridal pieces include the Sitahar (multi-layered necklace), Chik (choker), and Ratanchur (hand ornament). Kolkata also has a tradition of saving in gold through jewellers' monthly savings schemes. For Bengalis, gold is as much about artistry as it is about investment.",
        keyHighlights: [
            { icon: '🧵', label: 'Tarkashi Filigree', detail: 'Fine gold filigree (Tarkashi) work — a long-standing Bengali craft of twisted gold wire' },
            { icon: '👰', label: 'Bridal Gold Tradition', detail: 'Bengali brides wear the Sitahar, Chik, and Ratanchur' },
            { icon: '🏪', label: 'Bowbazar Street', detail: "Kolkata's jewellery heart — hundreds of artisan workshops and stores in a single street" },
        ],
        buyingTips: [
            "For Tarkashi (filigree) jewellery, check that the work is genuine handcraft — machine-made imitations are significantly cheaper but lack artistry.",
            "Bowbazar offers the best prices for traditional Bengali designs — making charges range from 10-20%.",
            "During Durga Puja season, shops offer festive discounts on making charges — a good time to buy.",
            "For lightweight daily-wear gold, Kolkata excels — the city's speciality is intricate work with less gold weight.",
            "Always verify HUID hallmark — Kolkata's unorganised sector has historically had purity inconsistencies.",
        ],
        popularAreas: [
            { name: 'Bowbazar', specialty: 'Traditional Bengali gold jewellery, Tarkashi filigree, bridal sets' },
            { name: 'Barabazar', specialty: 'Wholesale gold and bullion trading' },
            { name: 'Gariahat', specialty: 'Modern jewellery stores and branded showrooms' },
            { name: 'New Market', specialty: 'Affordable gold jewellery and tourist-friendly shopping' },
        ],
        faq: [
            {
                question: 'What is Tarkashi gold jewellery from Kolkata?',
                answer: 'Tarkashi is a centuries-old Bengali gold filigree technique where thin gold wires are twisted, curled, and soldered into intricate lace-like patterns. Bengali artisans are known for this craft. Genuine handmade Tarkashi pieces command premium making charges.',
            },
            {
                question: 'What are the traditional Bengali bridal gold pieces?',
                answer: "Bengali bridal gold includes the Sitahar (multi-layered necklace), Chik (choker), Ratanchur (hand ornament), Bauti (arm bracelet), and Kankan (bangles), worn with Shankha-Pola. How much gold is bought depends on the family's budget.",
            },
            {
                question: 'Is gold cheaper in Kolkata than other metros?',
                answer: "Base gold rates are similar across India. Kolkata's advantage is in making charges — Bengali jewellers specialise in lightweight, intricate designs, so the total gold weight (and cost) is often lower for equally stunning pieces. Making charges range from 10-20%.",
            },
            {
                question: 'When is the best time to buy gold in Kolkata?',
                answer: "Durga Puja (September/October) is when Kolkata jewellers offer their best deals — festive discounts on making charges and bonus gifts. Dhanteras and Akshaya Tritiya are also peak buying times with promotional offers.",
            },
        ],
        priceFactors: [
            'International gold spot price forms the base rate',
            'USD/INR exchange rate fluctuations',
            'Durga Puja and Dhanteras drive seasonal demand peaks',
            'Bengali wedding season (November–February) sustains demand',
            'Filigree work commands 15-25% making charges vs 8-12% for plain designs',
            "Kolkata's lighter designs mean lower total cost per piece despite similar per-gram rates",
        ],
        investmentInsight:
            "In Kolkata, jewellery and jewellers' monthly savings schemes are the traditional way to save in gold. Gold loans are widespread. Digital gold and Gold ETF adoption is growing among the city's IT and corporate professionals, but physical gold and jewellery remain the dominant form of gold ownership.",
        festivalsImpact:
            'Durga Puja (September/October) is Kolkata\'s biggest festive shopping season, and jewellery stores are crowded during the festival. Dhanteras, Bengali New Year (Poila Boishakh), and the wedding season also drive strong demand.',
    },

    bangalore: {
        city: 'Bangalore',
        slug: 'bangalore',
        state: 'Karnataka',
        mainMarkets: ['Avenue Road', 'Chickpet'],
        tagline: 'Tech City, Modern Gold Buyer',
        heroDescription:
            "Bangalore combines old jewellery markets like Chickpet and Avenue Road with a tech workforce that is taking to Gold ETFs. Check today's live gold rate in Bangalore.",
        uniqueDescription:
            "Avenue Road and Chickpet are the city's traditional jewellery hubs, with decades of history. With its large IT workforce, Bangalore has also seen growing interest in Gold ETFs and app-based gold investing, and many companies gift gold coins to employees.",
        goldCulture:
            "Bangalore's gold culture straddles two worlds — the traditional Karnataka jewellery traditions of Chickpet and the modern, investment-driven approach of the IT corridor. Kannada brides wear distinctive Laxmi Haar (Lakshmi necklace) and Addige (multi-strand) sets. Corporate gold gifting — companies gifting gold coins to employees during Diwali and achievements — is common in Bangalore's tech ecosystem. The city also has a growing culture of 'gold SIPs' through digital platforms.",
        keyHighlights: [
            { icon: '📱', label: 'Gold ETF Interest', detail: 'Growing use of SEBI-regulated Gold ETFs among IT professionals' },
            { icon: '🎁', label: 'Corporate Gifting', detail: 'Many companies gift gold coins to employees at festivals' },
            { icon: '🏪', label: 'Chickpet & Avenue Road', detail: 'Decades-old traditional markets for Kannada bridal jewellery' },
        ],
        buyingTips: [
            "For investment, consider Gold ETFs (available through brokers such as Zerodha and Groww) or existing Sovereign Gold Bonds traded on NSE/BSE — Bangalore's tech-savvy investors prefer these over physical gold.",
            "Chickpet and Avenue Road offer competitive making charges (8-15%) for traditional Kannada jewellery designs.",
            "For corporate gold gifting (employee rewards, Diwali gifts), order MMTC-PAMP certified gold coins in bulk for best rates.",
            "Digital gold sold on apps (Paytm Gold, PhonePe Gold) is not regulated by SEBI or RBI — for small, regular investments, SEBI-regulated Gold ETFs or gold mutual funds are the safer route.",
            "Compare prices between Chickpet's traditional shops and Jayanagar/Indiranagar's branded stores for the best deal.",
        ],
        popularAreas: [
            { name: 'Avenue Road', specialty: 'Traditional gold jewellery and wholesale trading' },
            { name: 'Chickpet', specialty: 'Affordable jewellery, Kannada bridal sets, and daily-wear gold' },
            { name: 'Jayanagar', specialty: 'Premium branded jewellery showrooms' },
            { name: 'Indiranagar & Koramangala', specialty: 'Modern designer jewellery and contemporary gold pieces' },
        ],
        faq: [
            {
                question: 'Why are Gold ETFs and digital investing popular in Bangalore?',
                answer: "Bangalore's large IT workforce is used to investing through apps and demat accounts, and many prefer Gold ETFs over storing physical gold. Companies also contribute through corporate gold gifting programs.",
            },
            {
                question: 'What is the traditional jewellery style of Bangalore/Karnataka?',
                answer: "Karnataka's traditional jewellery includes the Laxmi Haar (Lakshmi necklace with goddess motifs), Addige (multi-strand gold necklace), Thaali (mangalsutra), and Vanki (armlet). These designs are distinctive to Kannada bridal wear and available across Chickpet's jewellery stores.",
            },
            {
                question: 'Is it better to buy physical gold or digital gold in Bangalore?',
                answer: 'It depends on your goal. For wearing/gifting, physical gold from Chickpet or Avenue Road offers best value. For investment, Gold ETFs (zero making charges, easy liquidity) or existing Sovereign Gold Bonds bought on NSE/BSE (they pay 2.5% annual interest, and the rest of the return depends on the gold price; no new SGBs have been issued since February 2024) avoid making charges, though ETFs carry an expense ratio. Many Bangalore investors use a mix of both.',
            },
            {
                question: 'Where is the cheapest gold market in Bangalore?',
                answer: "Chickpet and Avenue Road offer the lowest making charges (8-15%) for traditional designs. For branded jewellery, Kalyan and Joyalukkas in Jayanagar often run promotional offers. Base gold rates are identical across all stores — the savings come from lower making charges.",
            },
        ],
        priceFactors: [
            'International gold price and MCX rates set the base rate',
            'USD/INR exchange rate directly impacts prices',
            'Corporate purchases of gold coins for festival gifting',
            'Ugadi and Dhanteras are peak buying seasons in Karnataka',
            'Chickpet competition keeps traditional jewellery making charges low (8-15%)',
            'Growing digital gold demand doesn\'t directly affect physical jewellery prices',
        ],
        investmentInsight:
            "Bangalore's IT professionals are increasingly using Gold ETFs, gold mutual funds and existing Sovereign Gold Bonds traded on NSE/BSE. Many also buy digital gold on apps, but SEBI clarified in November 2025 that such digital gold is outside its regulation. For those preferring physical gold, Avenue Road's established dealers offer competitive rates on investment-grade 24K gold bars and coins.",
        festivalsImpact:
            'Ugadi (March/April) marks the Kannada New Year and is a major gold buying occasion. Dhanteras and Diwali see peak demand. Around Diwali, many companies also buy gold coins to gift employees.',
    },

    hyderabad: {
        city: 'Hyderabad',
        slug: 'hyderabad',
        state: 'Telangana',
        mainMarkets: ['Laad Bazaar', 'Abids'],
        tagline: 'City of Nizams & Gold',
        heroDescription:
            "Hyderabad's gold culture is inseparable from its Nizam heritage, still visible in the markets around Charminar. Check today's live gold rate in Hyderabad.",
        uniqueDescription:
            "Hyderabad's gold culture is inseparable from its Nizam heritage — the Nizams of Hyderabad were once among the richest people in the world, and their love for gold and gems shaped the city's jewellery identity. Laad Bazaar, near Charminar, is famous for lac bangles studded with stones — Hyderabad's lac bangles received a GI tag in 2024. The city's goldsmiths create intricate work influenced by Persian and Mughal styles, featuring Jadau (gemstone-inlaid) and Pacchi (enamel) techniques.",
        goldCulture:
            "Hyderabadi gold culture reflects a unique blend of Persian, Mughal, and South Indian influences. The city's signature pieces include Rani Haar (queen's necklace), Nath (nose ring), Jhumka (chandelier earrings), and Chudi (bangles). Hyderabadi weddings, especially in Muslim families, have a tradition of heavy bridal jewellery. The Nizam legacy lives on in the elaborate gold and gem work seen at Abids and Laad Bazaar, where craftsmen still use century-old techniques.",
        keyHighlights: [
            { icon: '👑', label: 'Nizam Heritage', detail: "The Nizams' legendary love for gold shapes Hyderabad's jewellery identity to this day" },
            { icon: '🪷', label: 'Laad Bazaar Bangles', detail: 'Stone-studded lac bangles near Charminar — GI-tagged in 2024' },
            { icon: '🎨', label: 'Persian Gold Influence', detail: 'Jadau and Pacchi goldwork influenced by Persian and Mughal techniques' },
        ],
        buyingTips: [
            "For authentic Hyderabadi jewellery, visit Laad Bazaar and Abids — the city's traditional gold corridor.",
            "Jadau jewellery (gemstone-inlaid) commands premium making charges (20-35%) — verify stone authenticity before purchase.",
            "For Hyderabadi lac bangles, Laad Bazaar near Charminar is the best-known market — note they are lac and stones, not gold.",
            "Check the gold rate at LBMA or MCX before visiting — Hyderabad jewellers closely track these benchmarks.",
            "For pure investment gold (24K bars), authorised dealers at Abids and Somajiguda offer competitive rates.",
        ],
        popularAreas: [
            { name: 'Laad Bazaar (near Charminar)', specialty: 'Lac bangles, traditional Nizam-style jewellery' },
            { name: 'Abids', specialty: 'Gold bullion, coins, and a mix of traditional and modern jewellery' },
            { name: 'Banjara Hills', specialty: 'Premium designer and branded jewellery stores' },
            { name: 'Somajiguda', specialty: 'Investment gold bars and coins, branded showrooms' },
        ],
        faq: [
            {
                question: 'What is Hyderabad\'s Nizam jewellery tradition?',
                answer: "The Nizams of Hyderabad were among the world's richest rulers, amassing a legendary jewellery collection including the Jacob Diamond and Nizam Jewellery collection. This legacy shaped the city's goldsmithing tradition — featuring elaborate Jadau (gemstone-inlaid), Pacchi (enamel), and Persian-influenced designs that remain unique to Hyderabad.",
            },
            {
                question: 'What is Laad Bazaar known for?',
                answer: "Laad Bazaar near Charminar is famous for lac (lacquer) bangles decorated with coloured stones and glass. The market is believed to date to the Qutb Shahi era, and Hyderabad's lac bangles received a GI tag in 2024. These bangles are not gold; jewellery shops in the surrounding lanes sell gold.",
            },
            {
                question: 'What jewellery does a Hyderabadi bride wear?',
                answer: "Hyderabadi brides — especially in Muslim weddings — traditionally wear heavy jewellery; how much depends on the family's tradition and budget. Key pieces include the Rani Haar, multiple Jhumkas, Nath (nose ring), Haath Phool (hand chain), and dozens of gold bangles. This tradition reflects the city's Nizam-era gold culture.",
            },
            {
                question: 'Is gold cheaper in Hyderabad?',
                answer: "Base gold rates are similar across India (set by international markets). Hyderabad's competitive market at Abids and Laad Bazaar keeps making charges between 10-20% for standard designs. However, Jadau and Nizam-style pieces have higher making charges (20-35%) due to intricate craftsmanship.",
            },
        ],
        priceFactors: [
            'International spot gold price and MCX futures price',
            'USD/INR exchange rate fluctuations',
            'Ramzan and Eid drive significant gold demand in Hyderabad',
            'Wedding season (November–March) pushes demand higher',
            'Jadau/Nizam jewellery commands premium making charges (20-35%)',
            'Competition between Laad Bazaar traditionals and Banjara Hills brands',
        ],
        investmentInsight:
            "Hyderabad's IT corridor (HITEC City, Gachibowli) is driving growth in digital gold and Gold ETF investments. The city's traditional gold market remains focused on physical jewellery, but younger professionals increasingly opt for Gold ETFs and existing Sovereign Gold Bonds traded on NSE/BSE. Gold loans from Muthoot and Manappuram are widely used across the city.",
        festivalsImpact:
            'Ramzan and Eid are major gold buying occasions in Hyderabad, with shopping around Charminar and Laad Bazaar at its peak. Dhanteras, Diwali, and the wedding season (November–March) also see strong demand.',
    },

    pune: {
        city: 'Pune',
        slug: 'pune',
        state: 'Maharashtra',
        mainMarkets: ['Laxmi Road', 'Raviwar Peth'],
        tagline: "Maharashtra's Peshwa-Era Gold Belt",
        heroDescription:
            "Pune is known for bold Kolhapuri-style gold jewellery inspired by the Peshwa era, with Laxmi Road as its oldest jewellery market. Check today's live gold rate in Pune.",
        uniqueDescription:
            "Pune is renowned for Kolhapuri-style gold jewellery — bold, statement designs inspired by the Peshwa era of the Maratha Empire. Laxmi Road is the city's traditional jewellery corridor, home to dozens of established jewellers serving generations of Pune families. The city hosts a significant goldsmithing community and is a major wholesale supplier to smaller Maharashtrian towns. Many Pune families settled abroad also buy gold here for relatives.",
        goldCulture:
            "Pune's gold culture reflects its Maratha and Peshwa heritage. Maharashtrian brides wear distinctive pieces like the Thushi (short choker necklace), Nath (large nose ring), Kolhapuri Saaj (bead necklace with gold pendant), and Putli Haar (figurine necklace). These designs are bolder and heavier than typical North Indian jewellery. Laxmi Road during Gudi Padwa sees festive gold shopping, and the city's gold artisans are known for their expertise in traditional Maharashtrian motifs.",
        keyHighlights: [
            { icon: '⚔️', label: 'Kolhapuri Style', detail: 'Bold gold jewellery designs inspired by the Maratha Peshwa era — unique to Maharashtra' },
            { icon: '🏛️', label: 'Peshwa-Era Designs', detail: 'Traditional Thushi, Nath, and Kolhapuri Saaj designs dating back to the Peshwa era' },
            { icon: '🌍', label: 'NRI Families', detail: 'Pune families settled abroad often buy gold for relatives here' },
        ],
        buyingTips: [
            "Laxmi Road jewellers specialize in Kolhapuri Saaj and Thushi — compare at least 3-4 shops for best making charges.",
            "For authentic Maharashtrian bridal jewellery, Raviwar Peth's family-run stores have the best traditional craftsmanship.",
            "Making charges in Pune typically range from 10-18% — slightly lower than Mumbai due to less overhead.",
            "If bringing jewellery from abroad, note the Baggage Rules 2026: passengers who lived abroad for over a year can bring 20 g (men) or 40 g (women) of gold jewellery duty-free; declare anything above that and pay duty.",
            "Pune's organised retailers (Waman Hari Pethe, PNG) offer standardised pricing and buyback guarantees.",
        ],
        popularAreas: [
            { name: 'Laxmi Road', specialty: 'Traditional Maharashtrian jewellery, Kolhapuri Saaj, bridal sets' },
            { name: 'Raviwar Peth', specialty: 'Wholesale gold jewellery and antique designs' },
            { name: 'FC Road', specialty: 'Modern designer jewellery and branded showrooms' },
            { name: 'Baner–Hinjewadi', specialty: 'Premium jewellery stores catering to IT professionals' },
        ],
        faq: [
            {
                question: 'What is Kolhapuri-style gold jewellery?',
                answer: "Kolhapuri-style jewellery originated in Kolhapur, Maharashtra, and is characterised by bold, heavy designs with Maratha warrior motifs. Key pieces include Kolhapuri Saaj (bead and gold pendant necklace), Thushi (short choker), and Putli Haar (figurine necklace). Pune's Laxmi Road is the best place to find authentic pieces.",
            },
            {
                question: 'Which are the long-established gold jewellers in Pune?',
                answer: "P.N. Gadgil (PNG) was founded in Sangli in 1832 and has had a store on Pune's Laxmi Road since 1958. Waman Hari Pethe was founded in Mumbai in 1909 and has showrooms in Pune. They offer standardised pricing, hallmarked gold, and buyback guarantees.",
            },
            {
                question: 'What are the rules for bringing gold jewellery from abroad?',
                answer: "Under the Baggage Rules in force since February 2026, passengers returning after more than a year abroad can bring up to 20 g (men) or 40 g (women) of gold jewellery duty-free. Anything above that, and gold coins or bars, must be declared and duty paid. Rules change, so check the latest on the CBIC website before travelling.",
            },
            {
                question: 'Is gold cheaper in Pune compared to Mumbai?',
                answer: "Base gold rates are identical (set by international markets). However, Pune's making charges are often slightly lower than Mumbai's due to lower shop rents and overheads. Laxmi Road's competitive market keeps traditional jewellery pricing attractive.",
            },
        ],
        priceFactors: [
            'International gold rates and MCX prices form the base',
            'USD/INR exchange rate affects import cost',
            'Gudi Padwa (Marathi New Year) and Dhanteras are peak demand periods',
            'Maharashtra wedding season (November–May) drives sustained demand',
            'Purchases by Pune families settled abroad add to demand',
            "Competition on Laxmi Road keeps making charges competitive (10-18%)",
        ],
        investmentInsight:
            "Pune's growing IT corridor (Hinjewadi, Kharadi) mirrors Bangalore in digital gold adoption. Gold ETFs and existing Sovereign Gold Bonds traded on NSE/BSE are popular among the city's tech professionals. For physical investment gold, Waman Hari Pethe and PNG offer certified 24K gold bars and coins. Gold loans through Muthoot and Manappuram are widely available.",
        festivalsImpact:
            "Gudi Padwa (March/April) is Pune's biggest gold buying festival — it marks the Marathi New Year and is considered highly auspicious for gold purchases. Dhanteras, Diwali, and Akshaya Tritiya also see strong demand. The wedding season (November–May) keeps Laxmi Road busy year-round.",
    },

    ahmedabad: {
        city: 'Ahmedabad',
        slug: 'ahmedabad',
        state: 'Gujarat',
        mainMarkets: ['Manek Chowk', 'Teen Darwaza'],
        tagline: "Gujarat's Gold Trading Powerhouse",
        heroDescription:
            "Old Ahmedabad's Manek Chowk is the city's bullion and jewellery market by day and a famous street-food market by night. Check today's live gold rate in Ahmedabad.",
        uniqueDescription:
            "Manek Chowk has a vegetable market in the morning, gold, silver and bullion shops during the day, and vegetarian food stalls at night. The area near Jama Masjid is the city's old bullion market. Gujarat's Jain and other trading communities regard gold as auspicious and as generational savings. The city also has jewellery manufacturers and exporters.",
        goldCulture:
            "Gujarat's gold culture is intimately tied to its trading community heritage. Jain and other trading families consider gold auspicious and buy it for weddings and festivals. Gujarati bridal jewellery features distinctive pieces like the Rani Haar (queen's necklace), Chokar (thick necklace), and Borla (maang tikka). Manek Chowk's old bullion market is known for trust-based trading.",
        keyHighlights: [
            { icon: '🌙', label: 'Manek Chowk', detail: 'Vegetables in the morning, bullion and jewellery by day, street food at night' },
            { icon: '🙏', label: 'Trading Communities', detail: 'Jain and other trading families treat gold as auspicious generational savings' },
            { icon: '🌐', label: 'Jewellery Trade', detail: 'The city also has jewellery manufacturers and exporters' },
        ],
        buyingTips: [
            "Manek Chowk's jewellery and bullion shops trade during the day (food stalls take over at night) — verify the hallmark and HUID carefully.",
            "If buying coins or bars in volume, negotiate the rate and get the per-gram price itemised on the bill.",
            "Teen Darwaza has long-established jewellers — compare rates and making charges across several shops before buying.",
            "Gujarati wedding jewellery sets are heavy — negotiate making charges for large orders.",
            "Consider gold coins and bars from certified dealers — Ahmedabad has a strong bullion market for investment gold.",
        ],
        popularAreas: [
            { name: 'Manek Chowk', specialty: 'Old bullion market, retail and wholesale jewellery trading' },
            { name: 'Teen Darwaza', specialty: 'Established jewellers and hallmarked gold' },
            { name: 'CG Road', specialty: 'Premium branded jewellery showrooms and modern designs' },
            { name: 'SG Highway', specialty: 'New-age jewellery stores' },
        ],
        faq: [
            {
                question: 'What is Manek Chowk known for?',
                answer: "Manek Chowk in old Ahmedabad has three lives: a vegetable market in the morning, a gold, silver and bullion market during the day, and vegetarian street-food stalls at night. Go during the day if you want to buy jewellery.",
            },
            {
                question: 'Why do Gujarati families value gold so much?',
                answer: "Gujarat's Jain and other trading communities consider gold a store of generational wealth and an auspicious metal. Buying gold at weddings and festivals is a strong tradition, and many families add a little every year.",
            },
            {
                question: 'How to buy gold for investment in Ahmedabad?',
                answer: "For coins or bars, buy hallmarked 24K pieces from certified bullion dealers and always take a bill. If you don't want to store physical gold, Gold ETFs or existing SGBs traded on NSE/BSE are alternatives; no new SGBs have been issued since February 2024.",
            },
            {
                question: 'What is the typical Gujarati bridal gold set?',
                answer: "A Gujarati bridal gold set includes Rani Haar (queen's necklace), Chokar (thick gold necklace), Borla (maang tikka), Nath (nose ring), Bangdi (bangles), and Kamar Band (waist chain). How much gold is bought depends on the family's budget.",
            },
        ],
        priceFactors: [
            'International spot price and MCX gold rates',
            'USD/INR exchange rate directly impacts gold prices',
            'Navratri and Dhanteras drive demand spikes',
            'Gujarati wedding season (November–May) sustains high demand',
            'Room to negotiate rates on bulk purchases',
            "Competition among Manek Chowk jewellers keeps retail margins thin",
        ],
        investmentInsight:
            "Ahmedabad's trading families have a long tradition of treating gold as long-term savings, and the city has many bullion dealers selling 24K coins and bars. Gold ETFs and existing Sovereign Gold Bonds traded on NSE/BSE are gaining popularity among the younger generation. Ahmedabad is also a centre for gold-backed lending, with numerous NBFCs and banks offering gold loans.",
        festivalsImpact:
            "Navratri and Dhanteras are major gold buying occasions in Ahmedabad, and Manek Chowk is crowded on Dhanteras. Akshaya Tritiya is also considered auspicious, and the Gujarati wedding season (November–May) keeps demand consistently high.",
    },

    coimbatore: {
        city: 'Coimbatore',
        slug: 'coimbatore',
        state: 'Tamil Nadu',
        mainMarkets: ['Big Bazaar Street', 'RS Puram'],
        tagline: "Tamil Nadu's Gold Jewellery Manufacturing Hub",
        heroDescription:
            "Coimbatore is a major gold jewellery manufacturing centre, where thousands of goldsmiths make jewellery for Tamil Nadu and Kerala. Check today's live gold rate in Coimbatore.",
        uniqueDescription:
            "Coimbatore is a major gold jewellery manufacturing centre, supplying finished pieces to retailers across Tamil Nadu and Kerala. The city has a dense cluster of gold artisans and small foundries, many of which have been operating for generations. Beyond manufacturing, gold-backed loans are widespread — banks, local finance companies and NBFCs like Muthoot and Manappuram lend against gold across the city. Gold is not just jewellery in Coimbatore; it's collateral, currency, and insurance for the city's entrepreneurial class.",
        goldCulture:
            "Coimbatore's gold culture combines Tamil Nadu's deep gold traditions with the city's industrial DNA. The city's business families have strong gold accumulation traditions. Gold is used extensively as collateral for business loans, making it a working asset. The city's jewellery artisans specialise in South Indian temple jewellery, with many workshops on Big Bazaar Street producing pieces for retailers across multiple states. Jewellery savings schemes are ubiquitous here.",
        keyHighlights: [
            { icon: '🏭', label: 'Jewellery Manufacturing', detail: "Major manufacturing hub supplying gold jewellery to retailers across Tamil Nadu and Kerala" },
            { icon: '🏦', label: 'Gold Loan Culture', detail: "Pledging gold for business loans is common among the city's entrepreneurs" },
            { icon: '👨‍🎨', label: 'Artisan Cluster', detail: 'Dense cluster of gold artisans and foundries, many operating for generations' },
        ],
        buyingTips: [
            "As a manufacturing centre, Coimbatore offers lower making charges (5-12%) than most cities — direct-from-artisan pieces are cheapest.",
            "Big Bazaar Street and RS Puram have many jewellers — shop around for the best rates.",
            "Before taking a gold loan, compare interest rates, processing fees and auction terms across banks and NBFCs.",
            "For temple jewellery, local artisans' prices are often lower than big-city showrooms due to lower overheads.",
            "Jewellery savings schemes are common here — get the bonus, rate-fixing and early-exit terms in writing before joining.",
        ],
        popularAreas: [
            { name: 'Big Bazaar Street', specialty: 'Dense jewellery corridor — manufacturing and retail combined' },
            { name: 'RS Puram', specialty: 'Premium jewellery showrooms and branded stores' },
            { name: 'Town Hall', specialty: 'Wholesale gold jewellery and artisan workshops' },
            { name: 'Gandhipuram', specialty: 'Modern jewellery stores and gold investment dealers' },
        ],
        faq: [
            {
                question: 'Why is Coimbatore called the gold manufacturing hub?',
                answer: "Coimbatore has a dense cluster of gold jewellery manufacturing workshops and small foundries, many operating for generations. The city supplies finished jewellery pieces to retailers across Tamil Nadu and Kerala. Lower overhead costs make Coimbatore-manufactured jewellery cheaper than city-finished pieces.",
            },
            {
                question: 'What is the gold loan culture in Coimbatore?',
                answer: "Gold loans are very common in Coimbatore. Banks, local finance companies, and NBFCs like Muthoot and Manappuram lend against gold, and many business owners use it for working capital. Interest rates vary widely by lender and scheme, so compare before borrowing.",
            },
            {
                question: 'Are gold making charges lower in Coimbatore?',
                answer: "Yes — as a jewellery manufacturing centre, Coimbatore enjoys lower making charges (5-12%) compared to most Indian cities. Direct purchase from artisan workshops on Big Bazaar Street offers the best value, especially for temple jewellery and traditional South Indian designs.",
            },
            {
                question: 'Where to buy gold in Coimbatore?',
                answer: "RS Puram and nearby areas have showrooms of large jewellery chains, with fixed pricing and buyback terms. For traditional pieces at workshop prices, look at the artisan shops on Big Bazaar Street and in the Town Hall area. Either way, insist on the BIS hallmark, HUID and a proper bill.",
            },
        ],
        priceFactors: [
            'International gold price and MCX rates form the base',
            'USD/INR exchange rate impacts import costs',
            'Manufacturing hub status keeps making charges very low (5-12%)',
            'Pongal and Akshaya Tritiya are peak demand periods',
            'Gold loan market creates consistent demand for gold as collateral',
            'Proximity to Kerala, a large gold market, drives wholesale volumes',
        ],
        investmentInsight:
            "In Coimbatore, gold doubles as collateral — the city's entrepreneurs often pledge gold for business loans, turning idle gold into working capital. If a gold loan is not repaid, the pledged gold can be auctioned, so understand the terms first. Traditional jewellery savings schemes are deeply embedded in the culture. Digital gold and Gold ETFs are still nascent but growing among the city's younger generation.",
        festivalsImpact:
            "Pongal (January) and Akshaya Tritiya (April/May) are Coimbatore's biggest gold buying festivals. The Tamil wedding season (January–July) drives sustained demand. Kartigai Deepam (November) also sees gold purchases. Manufacturing orders rise ahead of major festivals as shops build inventory.",
    },

    kerala: {
        city: 'Kerala',
        slug: 'kerala',
        state: 'Kerala',
        mainMarkets: ['Thrissur', 'MG Road Kochi'],
        tagline: "Birthplace of India's Big Jewellery Chains",
        heroDescription:
            "Kerala is one of India's biggest gold markets — driven by Gulf NRI remittances and deep cultural traditions. Check today's live gold rate in Kerala.",
        uniqueDescription:
            "Kerala's gold demand is driven by two forces: deep cultural traditions of gold gifting at weddings, and remittances from the lakhs of Keralites working in the Gulf. Thrissur, called the 'cultural capital', is also a major jewellery centre — Kalyan Jewellers and Joyalukkas are headquartered there, while Malabar Gold & Diamonds is headquartered in Kozhikode.",
        goldCulture:
            "Gold in Kerala is cultural identity. A Kerala Christian (Syrian Christian) bride's gold is famously lavish. The Kasavu saree with heavy gold necklaces is the quintessential Kerala bridal look. Key pieces include the Palakka Mala (leaf-shaped necklace with green stones), Manga Mala (mango-shaped necklace), and Elakkathali (shield-shaped pendant). Hindu Nair brides and Muslim Mappila brides also have distinctive gold traditions. Kerala's gold culture is so strong that jewellery brands like Malabar Gold, Kalyan Jewellers, and Joyalukkas — all founded in Kerala — have become national and international giants.",
        keyHighlights: [
            { icon: '🌊', label: 'Gulf NRI Remittance', detail: 'Earnings of lakhs of Keralites in the Gulf fund a large share of gold purchases' },
            { icon: '🏪', label: 'Home of Big Brands', detail: 'Kalyan and Joyalukkas are headquartered in Thrissur, Malabar Gold in Kozhikode' },
            { icon: '📈', label: 'Big Gold Market', detail: "Kerala is among India's biggest gold-buying states" },
        ],
        buyingTips: [
            "Thrissur is Kerala's jewellery capital — Malabar Gold, Kalyan, and Joyalukkas all have flagship stores here with competitive pricing.",
            "For traditional Palakka Mala and Manga Mala, Thrissur's artisan jewellers offer the most authentic designs.",
            "NRI shoppers comparing Dubai and Kerala rates should note the Baggage Rules 2026: 20 g (men) or 40 g (women) of jewellery is duty-free for those abroad over a year; customs duty applies above that, so add it before comparing.",
            "Large Kerala jewellers run monthly gold savings schemes — read the bonus and early-exit terms in writing before joining.",
            "Check exchange rate trends if remitting money for gold purchase — a 1% change in USD/INR significantly impacts the gold cost in rupees.",
        ],
        popularAreas: [
            { name: 'Thrissur (Swaraj Round)', specialty: "Kerala's jewellery capital — flagship stores of major national brands" },
            { name: 'MG Road, Kochi', specialty: 'Premium jewellery showrooms and modern designer pieces' },
            { name: 'Kozhikode (Calicut)', specialty: 'Traditional Malabar jewellery and Gulf NRI-driven market' },
            { name: 'Thiruvananthapuram', specialty: 'Traditional and temple jewellery' },
        ],
        faq: [
            {
                question: 'Why does Kerala consume so much gold?',
                answer: "Kerala's high gold consumption is driven by two factors: deeply ingrained traditions of heavy bridal gold, and remittances from the lakhs of Keralites working in Gulf nations. Gold is seen as financial security, social status, and cultural identity.",
            },
            {
                question: 'Which are the biggest jewellery brands from Kerala?',
                answer: "Several of India's big jewellery chains began in Kerala: Malabar Gold & Diamonds (headquartered in Kozhikode), Kalyan Jewellers (Thrissur), Joyalukkas (Thrissur), and Chemmanur International (Thrissur). Many of them now have stores across India and in the Gulf.",
            },
            {
                question: 'How does Gulf NRI remittance affect gold prices in Kerala?',
                answer: "Base gold rates in Kerala follow international prices and the rupee, so remittances do not change the rate itself — they raise demand. NRI remittances fund a significant portion of Kerala's gold purchases — families often pre-book gold months before weddings using Gulf earnings. The USD/INR exchange rate directly impacts how much gold NRI money can buy.",
            },
            {
                question: 'What are the traditional Kerala bridal gold pieces?',
                answer: "Key pieces include Palakka Mala (leaf necklace with green stones), Manga Mala (mango-shaped necklace), Elakkathali (shield pendant), Poothali (gold ball necklace), Jhimki (jhumka earrings), and Vanki (armlet). Syrian Christian weddings in particular have a tradition of heavy bridal gold.",
            },
        ],
        priceFactors: [
            'International gold prices set the base rate for Kerala',
            'USD/INR exchange rate directly impacts NRI purchasing power',
            'Gulf NRI remittances sustain demand through the year',
            'Onam, Vishu, and marriage season (October–May) are peak demand periods',
            "Competition among Kerala's jewellery giants keeps making charges reasonable (8-16%)",
            'A large number of jewellery showrooms in every town creates intense price competition',
        ],
        investmentInsight:
            "Kerala's gold market is primarily consumption-driven (jewellery) rather than investment-driven. However, gold loan companies like Muthoot Finance and Manappuram Finance — both born in Kerala — have created a massive gold-as-collateral economy. Gold loans in Kerala are used for everything from education to real estate. Digital gold and Gold ETFs are slowly gaining traction among younger Keralites, but physical gold remains the dominant preference.",
        festivalsImpact:
            'Onam (August/September) and Vishu (April) are Kerala\'s biggest gold buying festivals. The wedding season (October–May) drives sustained demand — Kerala weddings are among India\'s most gold-intensive. Akshaya Tritiya sees long queues at Thrissur\'s jewellery stores.',
    },
};

/**
 * Get city gold data by slug (lowercase city name)
 */
export function getCityGoldData(slug: string): CityGoldInfo | undefined {
    return CITY_GOLD_DATA[slug.toLowerCase()];
}

/**
 * Get all city slugs for static generation
 */
export function getAllCitySlugs(): string[] {
    return Object.keys(CITY_GOLD_DATA);
}
