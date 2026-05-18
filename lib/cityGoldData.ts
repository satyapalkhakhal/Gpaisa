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
        tagline: "Asia's Largest Bullion Market",
        heroDescription:
            "Mumbai is India's gold price-setter — rates quoted in Zaveri Bazaar influence the entire country's gold market. Check today's live gold rate in Mumbai for 24K, 22K, and 18K.",
        uniqueDescription:
            "Zaveri Bazaar in South Mumbai is over 150 years old and houses more than 20,000 jewellers, making it Asia's largest bullion market. Mumbai is the epicentre of India's gold economy — the prices quoted here set the benchmark for the entire country. The city also hosts the bulk of India's gold futures trading via the Multi Commodity Exchange (MCX), headquartered in Mumbai. India's largest gold imports flow through Jawaharlal Nehru Port Trust (JNPT), further cementing Mumbai's role as the nation's gold gateway.",
        goldCulture:
            "Mumbai's gold culture is driven by its massive diamond-gold jewellery cluster in the Zaveri Bazaar–Opera House corridor. The city sees peak demand during Dhanteras, Gudi Padwa, and the wedding season (November–February). Mumbai's cosmopolitan buyer base demands everything from traditional Maharashtrian Thushi necklaces to contemporary Italian-style gold chains.",
        keyHighlights: [
            { icon: '🏛️', label: 'MCX Gold Hub', detail: "Home to India's Multi Commodity Exchange — the country's gold futures trading centre" },
            { icon: '🚢', label: 'Import Gateway', detail: "India's largest gold imports flow through JNPT port in Navi Mumbai" },
            { icon: '💎', label: 'Diamond-Gold Cluster', detail: 'Zaveri Bazaar–Opera House corridor is the largest diamond-gold jewellery cluster in Asia' },
        ],
        buyingTips: [
            'Always verify the BIS hallmark (HUID number) on every gold piece — Mumbai has the highest density of hallmarking centres.',
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
                answer: "Mumbai houses Zaveri Bazaar — Asia's largest bullion market with 20,000+ jewellers. The city is home to MCX (Multi Commodity Exchange) where gold futures are traded, and India's largest gold imports arrive through JNPT port. Rates quoted in Mumbai set the benchmark for the entire country.",
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
                answer: "Gold prices fluctuate daily. Traditionally, buying on Dhanteras, Akshaya Tritiya, and Gudi Padwa is considered auspicious. From a market perspective, prices tend to dip slightly during monsoon months (July–August) when demand reduces.",
            },
        ],
        priceFactors: [
            'MCX gold futures price and international spot gold rates',
            'USD/INR exchange rate — a weaker rupee increases gold prices',
            'Import duty (currently 15%) and GST (3%) on gold',
            'Seasonal demand during Dhanteras, Diwali, and wedding season',
            'Making charges by Mumbai jewellers (8-25% of gold value)',
            'Local competition in Zaveri Bazaar keeping margins competitive',
        ],
        investmentInsight:
            "Mumbai leads India in digital gold investments and Gold ETF trading. With BSE and NSE headquartered here, the city's investors have easy access to Sovereign Gold Bonds, Gold ETFs, and digital gold platforms. For physical gold investment, MMTC-PAMP certified bars are widely available from authorised dealers in Zaveri Bazaar.",
        festivalsImpact:
            'Gold demand in Mumbai peaks during Dhanteras (October/November), Gudi Padwa (March/April), and the wedding season (November–February). Zaveri Bazaar records its highest turnover on Dhanteras — estimated at ₹3,000–5,000 crore in a single day.',
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
            "Dariba Kalan in Chandni Chowk has been India's oldest continuously operating jewellery street since the Mughal era — over 400 years of gold trading history. Delhi is the wholesale nerve centre for North India's gold jewellery trade, supplying to retailers across Uttar Pradesh, Haryana, Punjab, and Rajasthan. The city is globally renowned for Kundan and Meenakari craftsmanship — intricate gold work inlaid with gemstones and hand-painted enamel, techniques perfected by Delhi's artisans over centuries.",
        goldCulture:
            "Delhi's gold culture is deeply intertwined with its Mughal and Rajput heritage. The city is known for elaborate bridal jewellery sets — a typical Delhi wedding features heavy Kundan sets, Polki necklaces, and Meenakari bangles. The NCR region (Delhi, Noida, Gurgaon) has one of the highest gold-gifting spends per wedding in India. Beyond weddings, Dhanteras and Karva Chauth drive significant gold purchases.",
        keyHighlights: [
            { icon: '🕌', label: 'Kundan & Meenakari', detail: 'World-renowned for intricate Kundan and Meenakari gold work — perfected over 400 years' },
            { icon: '🏪', label: 'Chandni Chowk Heritage', detail: "Dariba Kalan is India's oldest continuously operating jewellery market since the Mughal era" },
            { icon: '📦', label: 'North India Wholesale', detail: 'Delhi supplies gold jewellery to retailers across UP, Haryana, Punjab, and Rajasthan' },
        ],
        buyingTips: [
            'In Dariba Kalan, bargaining on making charges is standard practice — start at 50% of the quoted charge.',
            "For Kundan jewellery, verify whether the stones are real or synthetic — this significantly affects price.",
            "Karol Bagh has more standardised pricing — better for first-time buyers unfamiliar with negotiation.",
            "Always check for BIS hallmark with HUID — Delhi has had issues with under-carating in unorganised shops.",
            "For investment, consider Sovereign Gold Bonds from RBI — available through banks and post offices across Delhi NCR.",
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
                answer: 'Delhi is world-renowned for Kundan and Meenakari craftsmanship — gold jewellery inlaid with gemstones (Kundan) and decorated with hand-painted enamel work (Meenakari). These techniques have been perfected by Delhi artisans over 400+ years since the Mughal era.',
            },
            {
                question: 'Which is the best market for gold in Delhi?',
                answer: "Dariba Kalan in Chandni Chowk is the oldest and most famous gold market. Karol Bagh offers more standardised pricing with branded stores. South Extension has premium designer jewellery. For wholesale, Dariba Kalan remains unmatched.",
            },
            {
                question: 'Are gold rates different in Delhi NCR cities (Noida, Gurgaon)?',
                answer: "Base gold rates are identical across Delhi NCR since they're set by international markets. However, making charges may vary — Gurgaon's malls typically charge 15-25%, while Chandni Chowk offers 8-18%. GST (3%) applies uniformly.",
            },
            {
                question: 'How much gold is typically bought for a Delhi wedding?',
                answer: "A typical Delhi wedding involves 200-500 grams of gold jewellery for the bride, including Kundan sets, Polki necklaces, gold bangles, and earrings. The average gold spend for a Delhi wedding ranges from ₹15-50 lakhs depending on the family's budget.",
            },
        ],
        priceFactors: [
            'International gold spot price and London Bullion Market rates',
            'USD/INR exchange rate fluctuations',
            'Import duty (15%) and GST (3%) on gold purchases',
            'High wedding season demand (October–February) pushes prices up',
            'Making charges for Kundan/Meenakari work (15-30%) are higher than plain gold',
            'Wholesale competition in Dariba Kalan keeps base margins thin',
        ],
        investmentInsight:
            "Delhi NCR has a rapidly growing digital gold and Gold ETF investor base, driven by the region's high disposable income. Sovereign Gold Bonds (SGBs) are particularly popular among Delhi's salaried class. For physical investment gold, MMTC-PAMP and Augmont-certified gold bars are available at most bank branches and authorised dealers.",
        festivalsImpact:
            'Delhi sees peak gold demand during Dhanteras, Karva Chauth, and Akshaya Tritiya. The wedding season (October–February) drives sustained high demand. Dhanteras alone accounts for an estimated ₹2,000–3,000 crore in gold sales across Delhi NCR.',
    },

    chennai: {
        city: 'Chennai',
        slug: 'chennai',
        state: 'Tamil Nadu',
        mainMarkets: ['T. Nagar', 'Usman Road'],
        tagline: "India's Gold Consumption Capital",
        heroDescription:
            "Tamil Nadu consumes more gold per capita than any other Indian state, and Chennai's T. Nagar is the epicentre. Check today's live gold rate in Chennai.",
        uniqueDescription:
            "Tamil Nadu consumes more gold per capita than any other Indian state, and T. Nagar in Chennai is arguably the highest gold jewellery sales-per-square-kilometre street in the world. Usman Road alone hosts dozens of large jewellery showrooms including flagship stores of Tanishq, GRT, Kalyan, and Joyalukkas. On Akshaya Tritiya, the queues outside these stores stretch for kilometres. Chennai's gold market is dominated by traditional South Indian designs — temple jewellery, Kasu Malai (coin necklaces), and Jimikki Kammal (jhumka earrings).",
        goldCulture:
            "Gold in Tamil Nadu is not just jewellery — it's identity, security, and cultural pride. Every Tamil bride is expected to wear elaborate gold sets during the wedding, and gold gifting is a core part of the Thaali (mangalsutra) ceremony. Temple jewellery inspired by Chola-era temple sculptures is uniquely Tamilian. Chennai families often accumulate gold through monthly jewellery savings schemes (like GRT Gold Plan, Kalyan Gold Scheme), making gold ownership almost universal.",
        keyHighlights: [
            { icon: '🛕', label: 'Temple Jewellery', detail: 'Unique Chola-era temple jewellery designs found nowhere else in India' },
            { icon: '📊', label: 'Highest Per Capita', detail: 'Tamil Nadu has the highest gold consumption per capita among all Indian states' },
            { icon: '🎉', label: 'Akshaya Tritiya', detail: 'T. Nagar sees multi-kilometre queues during Akshaya Tritiya gold rush' },
        ],
        buyingTips: [
            "Join a jewellery savings scheme (GRT Gold Plan, Kalyan Gold Scheme) — you pay monthly instalments and get a bonus month's gold value.",
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
                answer: "Gold is central to Tamil identity, security, and cultural ceremonies. Every Tamil bride wears elaborate gold sets, and the Thaali (mangalsutra) ceremony is incomplete without gold. Tamil Nadu's gold consumption per capita is the highest in India, driven by deep cultural traditions and jewellery savings schemes.",
            },
            {
                question: 'What is temple jewellery in Chennai?',
                answer: 'Temple jewellery is a unique South Indian gold jewellery style inspired by Chola-era temple sculptures. It features deities, peacocks, and temple motifs crafted in gold, often studded with rubies and emeralds. Chennai is the primary centre for authentic temple jewellery making.',
            },
            {
                question: 'Are jewellery savings schemes in Chennai worth it?',
                answer: "Yes — schemes like GRT Gold Plan and Kalyan Gold Scheme let you pay monthly instalments (e.g., ₹5,000/month for 11 months) and get the 12th month free. This effectively gives you a ~8% bonus on your gold purchase. Most T. Nagar stores offer similar schemes.",
            },
            {
                question: 'Is gold cheaper in Chennai compared to other cities?',
                answer: "Base gold rates are similar across India. However, Chennai's intense competition (especially in T. Nagar) means making charges tend to be lower (6-15%) compared to cities like Delhi or Mumbai (10-25%). This makes the final jewellery cost often slightly lower in Chennai.",
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
            "Chennai's gold investment landscape is dominated by physical gold and jewellery savings schemes. Gold loan companies like Muthoot and Manappuram originated in South India, and gold-backed lending is ubiquitous. Sovereign Gold Bonds and Gold ETFs are gaining traction among Chennai's IT workforce, but physical gold remains king for most families.",
        festivalsImpact:
            'Akshaya Tritiya (April/May) is the single biggest gold-buying day in Chennai — T. Nagar stores record sales worth ₹1,000–2,000 crore. Pongal (January) and the Tamil wedding season (January–July) sustain high demand. Navaratri also sees significant gold purchases.',
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
            "Kolkata is India's centre for fine gold filigree work — called Tarkashi — where thin gold wires are twisted and soldered into intricate patterns. This centuries-old Bengali craft produces some of the most delicate gold jewellery in the world. Bowbazar, the city's jewellery heart, houses hundreds of artisan workshops and retail stores. Kolkata's goldsmithing tradition emphasises lightweight, intricate designs over heavy pieces — a distinctive style that sets Bengali gold jewellery apart from the rest of India.",
        goldCulture:
            "Bengali brides are known for one of India's most elaborate gold jewellery traditions. The 'Shankha-Pola' (red and white bangles) paired with gold jewellery is iconic. Key bridal pieces include the Mukut (gold crown), Sitahar (multi-layered necklace), and Ratanchur (hand ornament). Kolkata also has a strong legacy of gold-saving through chit funds, jewellery schemes, and 'gold deposit' traditions during Durga Puja. For Bengalis, gold is as much about artistry as it is about investment.",
        keyHighlights: [
            { icon: '🧵', label: 'Tarkashi Filigree', detail: "India's finest gold filigree (Tarkashi) work — centuries-old Bengali craft of twisted gold wire" },
            { icon: '👰', label: 'Bridal Gold Tradition', detail: 'Bengali brides wear elaborate Mukut, Sitahar, and Ratanchur — among the most ornate bridal gold in India' },
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
                answer: 'Tarkashi is a centuries-old Bengali gold filigree technique where thin gold wires are twisted, curled, and soldered into intricate lace-like patterns. Kolkata is the primary centre for this craft. Genuine handmade Tarkashi pieces are collector\'s items and command premium making charges.',
            },
            {
                question: 'What are the traditional Bengali bridal gold pieces?',
                answer: "Bengali bridal gold includes the Mukut (gold crown), Sitahar (seven-layered necklace), Chik (choker), Ratanchur (hand ornament), Bauti (arm bracelet), and Kankan (bangles). A complete Bengali bridal set typically weighs 150-400 grams and is among the most elaborate in India.",
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
            "Kolkata has a unique gold investment culture — chit fund-based gold savings and jewellery deposit schemes are deeply popular. Gold loans through local NBFCs are widespread. Digital gold and Gold ETF adoption is growing among the city's IT and corporate professionals, but physical gold and jewellery remain the dominant form of gold ownership.",
        festivalsImpact:
            'Durga Puja (September/October) is the biggest gold buying season in Kolkata — jewellery stores record their highest annual sales during the 10-day festival. Dhanteras, Bengali New Year (Poila Boishakh), and the wedding season also drive strong demand.',
    },

    bangalore: {
        city: 'Bangalore',
        slug: 'bangalore',
        state: 'Karnataka',
        mainMarkets: ['Avenue Road', 'Chickpet'],
        tagline: 'Tech City, Modern Gold Buyer',
        heroDescription:
            "Bangalore leads India in digital gold and Gold ETF investment, driven by its tech workforce. Check today's live gold rate in Bangalore.",
        uniqueDescription:
            "Bangalore has the highest proportion of digital gold buyers and Gold ETF investors in India, driven by its massive IT workforce. While Avenue Road and Chickpet are the traditional jewellery hubs with decades of history, the city leads the nation in gold investment apps, Sovereign Gold Bond (SGB) adoption, and corporate gold gifting. Bangalore represents India's transition from physical gold hoarding to smart gold investing — making it a unique gold market that blends tradition with technology.",
        goldCulture:
            "Bangalore's gold culture straddles two worlds — the traditional Karnataka jewellery traditions of Chickpet and the modern, investment-driven approach of the IT corridor. Kannada brides wear distinctive Laxmi Haar (Lakshmi necklace) and Addige (multi-strand) sets. Corporate gold gifting — companies gifting gold coins to employees during Diwali and achievements — is uniquely prominent in Bangalore's tech ecosystem. The city also has a growing culture of 'gold SIPs' through digital platforms.",
        keyHighlights: [
            { icon: '📱', label: 'Gold ETF Leaders', detail: "India's highest proportion of Gold ETF and digital gold investors — driven by IT sector" },
            { icon: '💰', label: 'Digital Gold Hub', detail: 'Leading adoption of gold investment apps, digital gold platforms, and gold SIPs' },
            { icon: '📜', label: 'SGB Investments', detail: 'Highest per-capita Sovereign Gold Bond investments among Indian cities' },
        ],
        buyingTips: [
            "For investment, consider Gold ETFs (available through Zerodha, Groww) or Sovereign Gold Bonds — Bangalore's tech-savvy investors prefer these over physical gold.",
            "Chickpet and Avenue Road offer competitive making charges (8-15%) for traditional Kannada jewellery designs.",
            "For corporate gold gifting (employee rewards, Diwali gifts), order MMTC-PAMP certified gold coins in bulk for best rates.",
            "Use digital gold platforms (Paytm Gold, PhonePe Gold) for small, regular investments — Bangalore leads in this adoption.",
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
                question: 'Why is Bangalore leading in digital gold investment?',
                answer: "Bangalore's massive IT workforce (over 15 lakh tech professionals) drives India's highest adoption of digital gold platforms, Gold ETFs, and Sovereign Gold Bonds. The tech-savvy population prefers hassle-free digital investment over physical gold storage. Companies also contribute through corporate gold gifting programs.",
            },
            {
                question: 'What is the traditional jewellery style of Bangalore/Karnataka?',
                answer: "Karnataka's traditional jewellery includes the Laxmi Haar (Lakshmi necklace with goddess motifs), Addige (multi-strand gold necklace), Thaali (mangalsutra), and Vanki (armlet). These designs are distinctive to Kannada bridal wear and available across Chickpet's jewellery stores.",
            },
            {
                question: 'Is it better to buy physical gold or digital gold in Bangalore?',
                answer: 'It depends on your goal. For wearing/gifting, physical gold from Chickpet or Avenue Road offers best value. For investment, Gold ETFs (zero making charges, easy liquidity) or Sovereign Gold Bonds (2.5% annual interest + gold appreciation) are more cost-effective. Many Bangalore investors use a mix of both.',
            },
            {
                question: 'Where is the cheapest gold market in Bangalore?',
                answer: "Chickpet and Avenue Road offer the lowest making charges (8-15%) for traditional designs. For branded jewellery, Kalyan and Joyalukkas in Jayanagar often run promotional offers. Base gold rates are identical across all stores — the savings come from lower making charges.",
            },
        ],
        priceFactors: [
            'International gold price and MCX rates set the base rate',
            'USD/INR exchange rate directly impacts prices',
            'IT sector bonus season (March–April) increases corporate gold gifting demand',
            'Ugadi and Dhanteras are peak buying seasons in Karnataka',
            'Chickpet competition keeps traditional jewellery making charges low (8-15%)',
            'Growing digital gold demand doesn\'t directly affect physical jewellery prices',
        ],
        investmentInsight:
            "Bangalore is India's gold fintech capital. The city's IT professionals are the largest cohort of Gold ETF, Sovereign Gold Bond, and digital gold investors. Platforms like Augmont, SafeGold, and MMTC-PAMP Digital Gold see their highest per-capita usage from Bangalore. For those preferring physical gold, Avenue Road's established dealers offer competitive rates on investment-grade 24K gold bars and coins.",
        festivalsImpact:
            'Ugadi (March/April) marks the Kannada New Year and is a major gold buying occasion. Dhanteras and Diwali see peak demand. Unique to Bangalore, the IT bonus season (March–April) drives significant corporate gold gifting — companies purchase gold coins worth ₹500-5,000 crore annually for employee rewards.',
    },

    hyderabad: {
        city: 'Hyderabad',
        slug: 'hyderabad',
        state: 'Telangana',
        mainMarkets: ['Laad Bazaar', 'Abids'],
        tagline: 'City of Nizams & Gold',
        heroDescription:
            "Hyderabad's gold culture is inseparable from its Nizam heritage — the city has one of India's richest jewellery traditions. Check today's live gold rate in Hyderabad.",
        uniqueDescription:
            "Hyderabad's gold culture is inseparable from its Nizam heritage — the Nizams of Hyderabad were once among the richest people in the world, and their love for gold and gems shaped the city's jewellery identity. Laad Bazaar, near Charminar, is famous for lac bangles inlaid with gold — a craft unique to Hyderabad. The city's goldsmiths create intricate work influenced by Persian and Mughal styles, featuring Jadau (gemstone-inlaid) and Pacchi (enamel) techniques. Hyderabadi brides famously wear more gold than brides in almost any other Indian city.",
        goldCulture:
            "Hyderabadi gold culture reflects a unique blend of Persian, Mughal, and South Indian influences. The city's signature pieces include Rani Haar (queen's necklace), Nath (nose ring), Jhumka (chandelier earrings), and Chudi (bangles). A Hyderabadi Muslim wedding typically involves 500g–1kg of gold jewellery for the bride — among the highest in India. The Nizam legacy lives on in the elaborate gold and gem work seen at Abids and Laad Bazaar, where craftsmen still use century-old techniques.",
        keyHighlights: [
            { icon: '👑', label: 'Nizam Heritage', detail: "The Nizams' legendary love for gold shapes Hyderabad's jewellery identity to this day" },
            { icon: '🪷', label: 'Laad Bazaar Bangles', detail: 'Famous lac bangles inlaid with gold — a craft unique to Hyderabad near Charminar' },
            { icon: '🎨', label: 'Persian Gold Influence', detail: 'Jadau and Pacchi goldwork influenced by Persian and Mughal techniques' },
        ],
        buyingTips: [
            "For authentic Hyderabadi jewellery, visit Laad Bazaar and Abids — the city's traditional gold corridor.",
            "Jadau jewellery (gemstone-inlaid) commands premium making charges (20-35%) — verify stone authenticity before purchase.",
            "For Hyderabadi lac bangles with gold work, Laad Bazaar near Charminar is the only authentic source.",
            "Check the gold rate at LBMA or MCX before visiting — Hyderabad jewellers closely track these benchmarks.",
            "For pure investment gold (24K bars), authorised dealers at Abids and Somajiguda offer competitive rates.",
        ],
        popularAreas: [
            { name: 'Laad Bazaar (near Charminar)', specialty: 'Gold-inlaid lac bangles, traditional Nizam jewellery' },
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
                question: 'What are Laad Bazaar gold bangles?',
                answer: "Laad Bazaar near Charminar is famous for lac (lacquer) bangles inlaid with gold strips and studded with stones. This is a 400-year-old craft unique to Hyderabad. Authentic Laad Bazaar bangles are handmade — prices range from ₹200 for simple designs to ₹50,000+ for heavy gold-inlaid sets.",
            },
            {
                question: 'How much gold does a typical Hyderabadi bride wear?',
                answer: "Hyderabadi brides — especially in Muslim weddings — wear some of the most gold in India, typically 500g to 1kg. Key pieces include the Rani Haar, multiple Jhumkas, Nath (nose ring), Haath Phool (hand chain), and dozens of gold bangles. This tradition reflects the city's Nizam-era gold culture.",
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
            "Hyderabad's IT corridor (HITEC City, Gachibowli) is driving growth in digital gold and Gold ETF investments. The city's traditional gold market remains focused on physical jewellery, but younger professionals increasingly opt for Sovereign Gold Bonds and digital gold. Gold loans from Muthoot and Manappuram are widely used across the city.",
        festivalsImpact:
            'Eid-ul-Fitr and Eid-ul-Adha are the biggest gold buying occasions unique to Hyderabad — driven by the city\'s large Muslim population. Dhanteras, Diwali, and the wedding season (November–March) also see strong demand. Hyderabad\'s gold markets see a 3-5x sales multiplier during Eid and Dhanteras.',
    },

    pune: {
        city: 'Pune',
        slug: 'pune',
        state: 'Maharashtra',
        mainMarkets: ['Laxmi Road', 'Raviwar Peth'],
        tagline: "Maharashtra's Peshwa-Era Gold Belt",
        heroDescription:
            "Pune is known for bold Kolhapuri-style gold jewellery inspired by the Peshwa era and a thriving NRI gold remittance market. Check today's live gold rate in Pune.",
        uniqueDescription:
            "Pune is renowned for Kolhapuri-style gold jewellery — bold, statement designs inspired by the Peshwa era of the Maratha Empire. Laxmi Road is the city's traditional jewellery corridor, home to dozens of established jewellers serving generations of Pune families. The city hosts a significant goldsmithing community and is a major wholesale supplier to smaller Maharashtrian towns. Pune is also witnessing growing NRI gold remittance flows, as its large diaspora sends gold and gold-backed gifts from abroad.",
        goldCulture:
            "Pune's gold culture reflects its Maratha and Peshwa heritage. Maharashtrian brides wear distinctive pieces like the Thushi (short choker necklace), Nath (large nose ring), Kolhapuri Saaj (bead necklace with gold pendant), and Putli Haar (figurine necklace). These designs are bolder and heavier than typical North Indian jewellery. Laxmi Road during Gudi Padwa sees festive gold shopping, and the city's gold artisans are known for their expertise in traditional Maharashtrian motifs.",
        keyHighlights: [
            { icon: '⚔️', label: 'Kolhapuri Style', detail: 'Bold gold jewellery designs inspired by the Maratha Peshwa era — unique to Maharashtra' },
            { icon: '🏛️', label: 'Peshwa-Era Designs', detail: 'Traditional Thushi, Nath, and Kolhapuri Saaj designs with 300+ years of heritage' },
            { icon: '🌍', label: 'NRI Gold Remittance', detail: "Pune's large diaspora drives significant gold remittance flows from abroad" },
        ],
        buyingTips: [
            "Laxmi Road jewellers specialize in Kolhapuri Saaj and Thushi — compare at least 3-4 shops for best making charges.",
            "For authentic Maharashtrian bridal jewellery, Raviwar Peth's family-run stores have the best traditional craftsmanship.",
            "Making charges in Pune typically range from 10-18% — slightly lower than Mumbai due to less overhead.",
            "If receiving gold from NRIs abroad, ensure proper customs declaration to avoid penalties (limit: 1kg for male, 500g for female passengers).",
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
                question: 'Which are the trusted gold jewellers in Pune?',
                answer: "Waman Hari Pethe (since 1909) and P.N. Gadgil (PNG, since 1832) are Pune's most established and trusted jewellers. Both are located on Laxmi Road with branches across the city. They offer standardised pricing, hallmarked gold, and buyback guarantees.",
            },
            {
                question: 'How does NRI gold remittance work in Pune?',
                answer: "Pune's large NRI community (especially in US, Gulf, and Europe) regularly sends gold to families. Under Indian customs rules, passengers can carry up to 1kg (male) or 500g (female) of gold with duty payment. Many NRIs also use digital gold platforms to gift gold to family in Pune.",
            },
            {
                question: 'Is gold cheaper in Pune compared to Mumbai?',
                answer: "Base gold rates are identical (set by international markets). However, Pune's making charges are often 2-5% lower than Mumbai due to lower shop rents and overheads. Laxmi Road's competitive market keeps traditional jewellery pricing attractive.",
            },
        ],
        priceFactors: [
            'International gold rates and MCX prices form the base',
            'USD/INR exchange rate affects import cost',
            'Gudi Padwa (Marathi New Year) and Dhanteras are peak demand periods',
            'Maharashtra wedding season (November–May) drives sustained demand',
            'NRI gold remittances create additional demand pressure',
            "Competition on Laxmi Road keeps making charges competitive (10-18%)",
        ],
        investmentInsight:
            "Pune's growing IT corridor (Hinjewadi, Kharadi) mirrors Bangalore in digital gold adoption. Gold ETFs and Sovereign Gold Bonds are popular among the city's tech professionals. For physical investment gold, Waman Hari Pethe and PNG offer certified 24K gold bars and coins. Gold loans through Muthoot and Manappuram are widely available.",
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
            "Ahmedabad hosts India's most unique night gold bazaar at Manek Chowk and is a centre for institutional gold buying. Check today's live gold rate in Ahmedabad.",
        uniqueDescription:
            "Manek Chowk in Ahmedabad transforms into a glittering gold and silver market after sunset — making it one of India's most unique night gold bazaars. By day, it's a vegetable market; by night, dozens of jewellers set up shop under the open sky, trading in gold, silver, and diamonds. Ahmedabad's Jain and Marwari communities are among India's largest institutional gold buyers, driving massive volumes. The city is also a leading centre for gold hallmarking and a hub for the organised gems and jewellery export trade, with many international buyers sourcing from Ahmedabad.",
        goldCulture:
            "Gujarat's gold culture is intimately tied to its trading community heritage. The Jain community considers gold auspicious and a store of wealth — institutional buying by Jain families often runs into kilograms per event. Gujarati bridal jewellery features distinctive pieces like the Rani Haar (queen's necklace), Chokar (thick necklace), and Borla (maang tikka). Ahmedabad's gold market operates on trust-based trading — many deals in Manek Chowk happen on verbal agreements worth crores, reflecting the city's strong trading ethics.",
        keyHighlights: [
            { icon: '🌙', label: 'Night Gold Bazaar', detail: 'Manek Chowk transforms into a unique open-air gold market after sunset — only in Ahmedabad' },
            { icon: '🙏', label: 'Jain Community', detail: "India's largest institutional gold buyers — Jain and Marwari families drive massive gold volumes" },
            { icon: '🌐', label: 'Gems Export Trade', detail: 'Major centre for gold hallmarking and organised gems & jewellery exports' },
        ],
        buyingTips: [
            "Visit Manek Chowk after 8 PM for the unique night gold bazaar experience — but verify hallmark carefully.",
            "Ahmedabad's institutional buyers get wholesale rates — if buying in volume (50g+), ask for wholesale pricing.",
            "For export-quality hallmarked gold, Ahmedabad's organised dealers near Teen Darwaza are among India's best.",
            "Gujarati wedding jewellery sets are heavy (300-800g) — negotiate making charges aggressively for large orders.",
            "Consider gold coins and bars from certified dealers — Ahmedabad has a strong bullion market for investment gold.",
        ],
        popularAreas: [
            { name: 'Manek Chowk', specialty: 'Famous night gold bazaar, retail and wholesale gold trading' },
            { name: 'Teen Darwaza', specialty: 'Established jewellers, hallmarked gold, export-quality pieces' },
            { name: 'CG Road', specialty: 'Premium branded jewellery showrooms and modern designs' },
            { name: 'SG Highway', specialty: 'New-age jewellery stores and digital-first gold platforms' },
        ],
        faq: [
            {
                question: 'What is the Manek Chowk night gold bazaar?',
                answer: "Manek Chowk in old Ahmedabad operates as a vegetable market by day and transforms into a glittering gold, silver, and diamond market after sunset. Dozens of jewellers set up mobile shops under the open sky. It's one of India's most unique gold trading experiences — operating for over 100 years.",
            },
            {
                question: 'Why do Gujarati families buy so much gold?',
                answer: "Gujarat's Jain and Marwari trading communities consider gold a store of generational wealth and an auspicious metal. Institutional gold buying by families often runs into kilograms during weddings and festivals. Gujarat consistently ranks among India's top 3 states in gold consumption.",
            },
            {
                question: 'Is Ahmedabad a good city for gold investment?',
                answer: "Yes — Ahmedabad has a strong bullion market with certified dealers offering competitive rates on investment-grade 24K gold bars and coins. The city's trading culture means prices are competitive. For paper gold, Ahmedabad's stock brokers actively promote Gold ETFs and SGBs.",
            },
            {
                question: 'What is the typical Gujarati bridal gold set?',
                answer: "A Gujarati bridal gold set includes Rani Haar (queen's necklace), Chokar (thick gold necklace), Borla (maang tikka), Nath (nose ring), Bangdi (bangles), and Kamar Band (waist chain). A complete set typically weighs 300-800 grams, making Gujarati weddings among the most gold-intensive in India.",
            },
        ],
        priceFactors: [
            'International spot price and MCX gold rates',
            'USD/INR exchange rate directly impacts gold prices',
            'Jain festivals (Paryushan) and Navratri drive demand spikes',
            'Gujarati wedding season (November–May) sustains high demand',
            'Institutional bulk buying by trading families gets wholesale rates',
            "Manek Chowk's competitive night market keeps retail margins thin",
        ],
        investmentInsight:
            "Ahmedabad's trading community has centuries of gold investment expertise. The city's bullion dealers offer some of India's most competitive rates on investment-grade 24K gold. Gold ETFs and Sovereign Gold Bonds are gaining popularity among the younger generation. Ahmedabad is also a centre for gold-backed lending, with numerous NBFCs and banks offering gold loans.",
        festivalsImpact:
            "Navratri (nine nights of celebration) is Ahmedabad's biggest gold buying season — families purchase gold during the auspicious festival. Dhanteras sees record sales at Manek Chowk. Paryushan (Jain festival) also drives significant gold demand. The Gujarati wedding season (November–May) keeps demand consistently high.",
    },

    coimbatore: {
        city: 'Coimbatore',
        slug: 'coimbatore',
        state: 'Tamil Nadu',
        mainMarkets: ['Big Bazaar Street', 'RS Puram'],
        tagline: "Tamil Nadu's Industrial Gold Hub",
        heroDescription:
            "Coimbatore is a major gold jewellery manufacturing centre with India's highest gold loan penetration. Check today's live gold rate in Coimbatore.",
        uniqueDescription:
            "Coimbatore is one of India's largest gold jewellery manufacturing centres, supplying finished pieces to retailers across Tamil Nadu and Kerala. The city has a dense cluster of gold artisans and small foundries, many of which have been operating for generations. Beyond manufacturing, Coimbatore is uniquely known for gold-backed loans — local finance companies and NBFCs like Muthoot and Manappuram have some of their highest penetration rates here. Gold is not just jewellery in Coimbatore; it's collateral, currency, and insurance for the city's entrepreneurial class.",
        goldCulture:
            "Coimbatore's gold culture combines Tamil Nadu's deep gold traditions with the city's industrial DNA. The Gounder and Nadar communities — prominent in Coimbatore — have strong gold accumulation traditions. Gold is used extensively as collateral for business loans, making it a working asset. The city's jewellery artisans specialise in South Indian temple jewellery, with many workshops on Big Bazaar Street producing pieces for retailers across multiple states. Jewellery savings schemes are ubiquitous here.",
        keyHighlights: [
            { icon: '🏭', label: 'Jewellery Manufacturing', detail: "Major manufacturing hub supplying gold jewellery to retailers across Tamil Nadu and Kerala" },
            { icon: '🏦', label: 'Gold Loan Capital', detail: "Among India's highest gold loan penetration — gold is collateral for the city's entrepreneurs" },
            { icon: '👨‍🎨', label: 'Artisan Cluster', detail: 'Dense cluster of gold artisans and foundries, many operating for generations' },
        ],
        buyingTips: [
            "As a manufacturing centre, Coimbatore offers lower making charges (5-12%) than most cities — direct-from-artisan pieces are cheapest.",
            "Big Bazaar Street and RS Puram have the highest concentration of trusted jewellers — shop around for best rates.",
            "Gold loan rates in Coimbatore are competitive (7-12% p.a.) — use gold as collateral for business needs rather than selling.",
            "For temple jewellery, Coimbatore artisans offer better prices than Chennai due to lower overheads.",
            "Join a local jewellery savings scheme — they're deeply embedded in Coimbatore's financial culture.",
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
                answer: "Coimbatore has one of India's highest gold loan penetration rates. Local finance companies, banks, and NBFCs like Muthoot and Manappuram offer gold loans at competitive rates (7-12% p.a.). The city's entrepreneurial class routinely uses gold as collateral for business needs — making gold a working financial asset.",
            },
            {
                question: 'Are gold making charges lower in Coimbatore?',
                answer: "Yes — as a jewellery manufacturing centre, Coimbatore enjoys lower making charges (5-12%) compared to most Indian cities. Direct purchase from artisan workshops on Big Bazaar Street offers the best value, especially for temple jewellery and traditional South Indian designs.",
            },
            {
                question: 'Which are the trusted gold jewellers in Coimbatore?',
                answer: "Kalyan Jewellers (headquartered nearby), GRT Jewellers, Lalithaa Jewellery, and Saravana Stores are among the most trusted names. For traditional pieces at workshop prices, the artisan shops on Big Bazaar Street and Town Hall area are well-regarded.",
            },
        ],
        priceFactors: [
            'International gold price and MCX rates form the base',
            'USD/INR exchange rate impacts import costs',
            'Manufacturing hub status keeps making charges very low (5-12%)',
            'Pongal and Akshaya Tritiya are peak demand periods',
            'Gold loan market creates consistent demand for gold as collateral',
            'Proximity to Kerala (highest per capita gold demand) drives wholesale volumes',
        ],
        investmentInsight:
            "Coimbatore's unique investment insight is gold-as-collateral — the city's entrepreneurs routinely pledge gold for business loans at 7-12% annual interest, effectively turning idle gold into working capital. Traditional jewellery savings schemes are deeply embedded in the culture. Digital gold and Gold ETFs are still nascent but growing among the city's younger generation.",
        festivalsImpact:
            "Pongal (January) and Akshaya Tritiya (April/May) are Coimbatore's biggest gold buying festivals. The Tamil wedding season (January–July) drives sustained demand. Kartigai Deepam (November) also sees gold purchases. Manufacturing orders peak 2-3 months before major festivals to build retail inventory.",
    },

    kerala: {
        city: 'Kerala',
        slug: 'kerala',
        state: 'Kerala',
        mainMarkets: ['Thrissur', 'MG Road Kochi'],
        tagline: "India's Most Gold-Hungry State",
        heroDescription:
            "Kerala imports more gold per capita than any Indian state — driven by Gulf NRI remittances and deep cultural traditions. Check today's live gold rate in Kerala.",
        uniqueDescription:
            "Kerala imports more gold per capita than any Indian state, consuming an estimated 20-25% of India's total gold despite having only 2.7% of the population. This extraordinary demand is driven by two forces: deep cultural traditions that mandate extensive gold gifting at weddings, and massive NRI remittances from the Gulf nations where over 2 million Keralites work. Thrissur is called the 'cultural capital' and doubles as Kerala's jewellery capital — it's the headquarters of Malabar Gold & Diamonds, one of India's largest jewellery chains. The state has the highest density of jewellery showrooms in India.",
        goldCulture:
            "Gold in Kerala is cultural identity. A Kerala Christian (Syrian Christian) bride's gold is famously extravagant — bridal sets weighing 500g–1.5kg are common. The Kasavu saree with heavy gold necklaces is the quintessential Kerala bridal look. Key pieces include the Palakka Mala (leaf-shaped necklace with green stones), Manga Mala (mango-shaped necklace), and Elakkathali (shield-shaped pendant). Hindu Nair brides and Muslim Mappila brides also have distinctive gold traditions. Kerala's gold culture is so strong that jewellery brands like Malabar Gold, Kalyan Jewellers, and Joyalukkas — all founded in Kerala — have become national and international giants.",
        keyHighlights: [
            { icon: '🌊', label: 'Gulf NRI Remittance', detail: "2+ million Keralites in Gulf nations drive massive gold remittance and gifting flows" },
            { icon: '🏪', label: 'Malabar Gold HQ', detail: "Thrissur is the headquarters of Malabar Gold & Diamonds — India's 6th largest jewellery chain" },
            { icon: '📈', label: 'Highest Per Capita', detail: 'Kerala consumes 20-25% of India\'s gold with just 2.7% of the population' },
        ],
        buyingTips: [
            "Thrissur is Kerala's jewellery capital — Malabar Gold, Kalyan, and Joyalukkas all have flagship stores here with competitive pricing.",
            "For traditional Palakka Mala and Manga Mala, Thrissur's artisan jewellers offer the most authentic designs.",
            "NRI gold shoppers should compare Dubai gold rate vs Kerala gold rate — sometimes buying in Dubai and paying duty is cheaper.",
            "Kerala jewellers offer aggressive savings schemes — Malabar Gold's 'Gold Deposit Scheme' is one of the most popular in India.",
            "Check exchange rate trends if remitting money for gold purchase — a 1% change in USD/INR significantly impacts the gold cost in rupees.",
        ],
        popularAreas: [
            { name: 'Thrissur (Swaraj Round)', specialty: "Kerala's jewellery capital — flagship stores of major national brands" },
            { name: 'MG Road, Kochi', specialty: 'Premium jewellery showrooms and modern designer pieces' },
            { name: 'Kozhikode (Calicut)', specialty: 'Traditional Malabar jewellery and Gulf NRI-driven market' },
            { name: 'Thiruvananthapuram', specialty: 'Government-backed gold retail and temple jewellery' },
        ],
        faq: [
            {
                question: 'Why does Kerala consume so much gold?',
                answer: "Kerala's extraordinary gold consumption (20-25% of India's total) is driven by two factors: deeply ingrained cultural traditions that mandate extensive gold at weddings (500g–1.5kg per bride), and massive NRI remittances from 2+ million Keralites working in Gulf nations. Gold is seen as financial security, social status, and cultural identity.",
            },
            {
                question: 'Which are the biggest jewellery brands from Kerala?',
                answer: "Four of India's top 10 jewellery chains originated in Kerala: Malabar Gold & Diamonds (Thrissur), Kalyan Jewellers (Thrissur), Joyalukkas (Kochi), and Chemmanur International (Thrissur). These brands have collectively expanded to 1,000+ stores across 20+ countries, proving Kerala's outsized influence on the gold industry.",
            },
            {
                question: 'How does Gulf NRI remittance affect gold prices in Kerala?',
                answer: "While base gold rates are set internationally, Kerala's NRI-driven demand creates consistent upward pressure on local prices. NRI remittances fund a significant portion of Kerala's gold purchases — families often pre-book gold months before weddings using Gulf earnings. The USD/INR exchange rate directly impacts how much gold NRI money can buy.",
            },
            {
                question: 'What are the traditional Kerala bridal gold pieces?',
                answer: "Key pieces include Palakka Mala (leaf necklace with green stones), Manga Mala (mango-shaped necklace), Elakkathali (shield pendant), Poothali (gold ball necklace), Jhimki (jhumka earrings), and Vanki (armlet). Syrian Christian brides traditionally wear the most gold, with bridal sets weighing 500g–1.5kg.",
            },
        ],
        priceFactors: [
            'International gold prices set the base rate for Kerala',
            'USD/INR exchange rate directly impacts NRI purchasing power',
            "Gulf NRI remittances create consistent demand pressure — India's largest gold import state",
            'Onam, Vishu, and marriage season (October–May) are peak demand periods',
            "Competition among Kerala's jewellery giants keeps making charges reasonable (8-16%)",
            'India\'s highest density of jewellery showrooms creates intense price competition',
        ],
        investmentInsight:
            "Kerala's gold market is primarily consumption-driven (jewellery) rather than investment-driven. However, gold loan companies like Muthoot Finance and Manappuram Finance — both born in Kerala — have created a massive gold-as-collateral economy. Gold loans in Kerala are used for everything from education to real estate. Digital gold and Gold ETFs are slowly gaining traction among younger Keralites, but physical gold remains the dominant preference.",
        festivalsImpact:
            'Onam (August/September) and Vishu (April) are Kerala\'s biggest gold buying festivals. The wedding season (October–May) drives sustained demand — Kerala weddings are among India\'s most gold-intensive. Akshaya Tritiya sees massive queues at Thrissur\'s jewellery stores. Gold sales spike 5-10x during these peak periods.',
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
