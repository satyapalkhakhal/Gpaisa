// ─── City-specific silver market data for unique SEO content (E-E-A-T) ──────
// Editorial review 17 Nov 2026: unverifiable superlatives, unsourced numbers and brand
// recommendations removed; facts checked (see seo-audit/runs/content-2026-10-22/trend/
// silver-city-review.md). Keep market names and festivals consistent with cityGoldData.ts.

export interface CitySilverInfo {
    city: string;
    slug: string;
    state: string;
    mainMarkets: string[];
    tagline: string;
    heroDescription: string;
    uniqueDescription: string;
    silverCulture: string;
    keyHighlights: { icon: string; label: string; detail: string }[];
    buyingTips: string[];
    popularAreas: { name: string; specialty: string }[];
    faq: { question: string; answer: string }[];
    priceFactors: string[];
    investmentInsight: string;
    festivalsImpact: string;
}

export const CITY_SILVER_DATA: Record<string, CitySilverInfo> = {
    mumbai: {
        city: 'Mumbai',
        slug: 'mumbai',
        state: 'Maharashtra',
        mainMarkets: ['Zaveri Bazaar', 'Kalbadevi'],
        tagline: 'Zaveri Bazaar and the Home of MCX',
        heroDescription:
            "Mumbai's Zaveri Bazaar is one of India's main bullion markets, and MCX, where silver futures trade, is based in the city. Check today's live silver rate in Mumbai per gram and per kg.",
        uniqueDescription:
            "Zaveri Bazaar, in the Kalbadevi–Bhuleshwar area of South Mumbai, has bullion dealers and jewellers who trade silver as well as gold, from kilo bars to coins and ornaments. The Multi Commodity Exchange (MCX), where silver futures are traded, is headquartered in Mumbai, as are BSE and NSE, where Silver ETFs are bought and sold. Jewellers across the country watch MCX prices when setting their daily silver rates.",
        silverCulture:
            "Silver in Mumbai is bought both as metal and as ornament. Bullion dealers sell bars and coins, while neighbourhood jewellers sell anklets, toe rings, puja items and silver utensils. Silver coins and small items are a common Dhanteras purchase, and Gudi Padwa is another traditional buying day for Maharashtrian families.",
        keyHighlights: [
            { icon: '📊', label: 'MCX Silver Futures', detail: 'MCX, headquartered in Mumbai, lists silver futures from 30 kg lots down to 1 kg and 100 g contracts' },
            { icon: '🏦', label: 'Exchange City', detail: 'BSE and NSE are headquartered here — Silver ETFs trade on both' },
            { icon: '🏛️', label: 'Zaveri Bazaar', detail: 'Bullion dealers and jewellers in South Mumbai trade silver bars, coins and ornaments' },
        ],
        buyingTips: [
            'Silver hallmarking is voluntary, but since 1 September 2025 any hallmarked silver piece must carry a 6-digit HUID — check it in the BIS Care app.',
            'Ask for the per-gram (or per-kg) silver rate and making charges as separate lines on the bill; GST of 3% applies to the total.',
            'For bars and coins, check the fineness stamped on the piece (999 is the usual investment grade) and keep the invoice for resale.',
            "Check the day's MCX silver price before visiting — Mumbai dealers track it, and the gap tells you the dealer's premium.",
            'Compare making charges at two or three shops for the same design — they vary by shop and by how intricate the piece is.',
        ],
        popularAreas: [
            { name: 'Zaveri Bazaar', specialty: 'Bullion dealers, silver bars and coins, wholesale and retail jewellery' },
            { name: 'Kalbadevi', specialty: 'Silver bars, coins and traditional silver articles' },
            { name: 'Dadar', specialty: 'Neighbourhood jewellers selling silver puja items and utensils' },
            { name: 'Borivali–Kandivali', specialty: 'Retail silver jewellery and 925 sterling silver pieces' },
        ],
        faq: [
            {
                question: 'Why do traders watch Mumbai for the silver price?',
                answer: "MCX, India's main commodity exchange for silver futures, is headquartered in Mumbai, and Zaveri Bazaar is one of the country's main bullion markets. The underlying price still comes from the international silver price, the rupee-dollar rate and Indian import duty and GST.",
            },
            {
                question: 'What are the ways to invest in silver in Mumbai?',
                answer: 'You can buy physical silver bars or coins from bullion dealers and jewellers, or buy Silver ETFs on NSE/BSE through a demat account (available in India since 2022). Digital silver sold on apps is not a SEBI-regulated product. Each route has different costs — dealer premiums and GST for physical silver, an expense ratio for ETFs.',
            },
            {
                question: 'Is silver cheaper in Zaveri Bazaar than in branded stores?',
                answer: 'The base silver rate is broadly the same everywhere, since it follows MCX and international prices. The difference is in the dealer premium on bars and coins and in making charges on jewellery, which vary from shop to shop. Compare the total bill, not just the per-gram rate.',
            },
            {
                question: 'What sizes of silver bars are sold in Mumbai?',
                answer: 'Dealers sell bars from a few grams up to 1 kg for retail buyers; larger 30 kg bars are traded between bullion dealers. Check the refiner\'s stamp, weight and fineness (usually 999) on the bar and get a proper invoice.',
            },
        ],
        priceFactors: [
            'International silver price and MCX silver futures',
            'USD/INR exchange rate — a weaker rupee makes silver costlier',
            'Import duty (raised to 15% in May 2026) and GST (3%)',
            'Industrial demand for silver in electronics and solar panels',
            'Seasonal retail demand around Dhanteras and Gudi Padwa',
            'Dealer premiums and making charges set by individual shops',
        ],
        investmentInsight:
            "Mumbai investors can choose between physical silver (bars and coins) and Silver ETFs traded on NSE/BSE. Silver is used both as a precious metal and in industry, which makes its price more volatile than gold's — it can rise or fall sharply. Physical silver attracts 3% GST and a dealer premium, while ETFs charge an annual expense ratio.",
        festivalsImpact:
            'Silver demand in Mumbai is highest around Dhanteras (October/November), when silver coins and small items are popular purchases, and around Gudi Padwa (March/April). Demand rising does not mean prices rise — the rate still follows international markets, so compare a few days\' rates before buying.',
    },

    delhi: {
        city: 'Delhi',
        slug: 'delhi',
        state: 'Delhi NCR',
        mainMarkets: ['Dariba Kalan', 'Kinari Bazaar'],
        tagline: 'Chandni Chowk Silver and Wedding Gifting',
        heroDescription:
            "Delhi's Dariba Kalan in Chandni Chowk has traded jewellery, including silver, since the Mughal era. Check today's live silver rate in Delhi.",
        uniqueDescription:
            "Dariba Kalan in Chandni Chowk has been a jewellery lane since the Mughal era, when it was known for gold, silver and precious stones. Today many of its shops sell costume and oxidised jewellery alongside real silver, so buyers should check what they are paying for. The neighbouring Kinari Bazaar is known for zari, gota, laces and wedding trimmings. In North Indian weddings, silver gifts such as thalis, glasses, bowls and coins are a common tradition.",
        silverCulture:
            "Silver in Delhi is closely tied to weddings and household rituals. Families gift silver utensils, puja thalis, coins and decorative items at weddings and births, and silver idols of Lakshmi and Ganesh are bought for Diwali puja. Silver coins are a popular Dhanteras purchase across Delhi NCR.",
        keyHighlights: [
            { icon: '🏪', label: 'Dariba Kalan', detail: 'A Mughal-era jewellery lane in Chandni Chowk that still sells silver' },
            { icon: '🧵', label: 'Kinari Bazaar', detail: 'Known for zari, gota, laces and wedding trimmings' },
            { icon: '💒', label: 'Wedding Silver', detail: 'Silver utensils, thalis and coins are common wedding gifts in North India' },
        ],
        buyingTips: [
            'Many Chandni Chowk shops sell oxidised or silver-plated jewellery — ask whether a piece is solid silver and what its fineness is.',
            'Silver hallmarking is voluntary, but any hallmarked piece must carry a 6-digit HUID (since 1 September 2025) — verify it in the BIS Care app.',
            'Most zari sold today is imitation (metallic thread), not real silver — do not pay a silver price unless the seller states the silver content in writing.',
            'For utensils and gift items, ask for the weight, the per-gram rate and the making charge separately on the bill; GST is 3%.',
            'For bars and coins, check the fineness stamp (999 for investment-grade silver) and keep the invoice for resale.',
        ],
        popularAreas: [
            { name: 'Dariba Kalan (Chandni Chowk)', specialty: 'Silver jewellery, silverware and oxidised jewellery' },
            { name: 'Kinari Bazaar', specialty: 'Zari, gota, laces and wedding trimmings' },
            { name: 'Karol Bagh', specialty: 'Jewellery showrooms with standardised pricing' },
            { name: 'Sadar Bazaar', specialty: 'Wholesale market with small silver gift items' },
        ],
        faq: [
            {
                question: "What is Delhi's silver market known for?",
                answer: "Delhi's old markets are known for silver utensils, puja items and gift silverware as much as for jewellery. Dariba Kalan has traded jewellery since the Mughal era, and the neighbouring Kinari Bazaar sells zari and wedding trimmings.",
            },
            {
                question: 'What silver items are gifted at Delhi weddings?',
                answer: 'Common silver gifts include puja thalis, glass and bowl sets, coins, small idols and decorative boxes. How much is spent depends entirely on the family — get the weight and fineness written on the bill for every item.',
            },
            {
                question: 'Is silver cheaper in Chandni Chowk?',
                answer: 'The base silver rate is broadly the same across Delhi NCR, since it follows international prices and MCX. Differences come from making charges and dealer premiums, which vary by shop. Bargaining on making charges is common in the old markets.',
            },
            {
                question: 'Is silver a good investment?',
                answer: 'Silver is more volatile than gold — its price can rise or fall sharply because it is used in industry as well as jewellery. If you want exposure without storing metal, Silver ETFs on NSE/BSE are SEBI-regulated; physical bars and coins carry 3% GST and a dealer premium. Decide based on your own goals and time horizon.',
            },
        ],
        priceFactors: [
            'International silver price and MCX silver futures',
            'USD/INR exchange rate',
            'Import duty (raised to 15% in May 2026) and GST (3%)',
            'Wedding season (October–February) and Dhanteras raise retail demand',
            'Making charges on utensils and crafted silverware',
            'Competition among old-market dealers on premiums',
        ],
        investmentInsight:
            "In Delhi NCR, silver is bought mainly as gifts and household items, but investors can also buy 999 bars and coins or Silver ETFs on NSE/BSE. Silver's price moves more sharply than gold's, so treat it as a volatile holding. Digital silver sold on apps is not a SEBI-regulated product.",
        festivalsImpact:
            'Dhanteras is the busiest day for silver coin and utensil buying in Delhi. Diwali, Karva Chauth and the wedding season (October–February) also bring higher demand. Busy shops may be less willing to discount making charges, but the base rate still follows the market.',
    },

    chennai: {
        city: 'Chennai',
        slug: 'chennai',
        state: 'Tamil Nadu',
        mainMarkets: ['T. Nagar', 'Sowcarpet'],
        tagline: 'Silver for Temple and Home Puja',
        heroDescription:
            "In Chennai, silver is bought mainly for puja vessels, lamps and temple offerings, alongside jewellery. Check today's live silver rate in Chennai.",
        uniqueDescription:
            "Silver in Tamil Nadu is closely linked with worship. Temples use silver kavacham (ornamental covering for the deity), vessels and processional items, and many households keep silver lamps (vilakku), kumkum boxes and small ritual vessels such as panchapatra and udhrini for daily puja. In Chennai, T. Nagar's jewellery showrooms and Sowcarpet's older wholesale shops both sell silver articles.",
        silverCulture:
            "Tamil families commonly add silver puja items over the years, through weddings, festivals and family ceremonies. Silver lamps, plates and tumblers are popular gifts, and silver anklets (kolusu) are widely worn. Temple silverwork often uses repoussé, where designs are hammered into relief on silver sheet.",
        keyHighlights: [
            { icon: '🛕', label: 'Temple Kavacham', detail: 'Silver kavacham (ornamental covering) is made for deities in Tamil Nadu temples' },
            { icon: '🪔', label: 'Puja Vessels', detail: 'Silver lamps, kumkum boxes and ritual vessels are common in Tamil households' },
            { icon: '📦', label: 'Sowcarpet', detail: 'An old wholesale area in North Chennai with silver and jewellery shops' },
        ],
        buyingTips: [
            'For puja items, check that the weight on the bill matches the item — ask the shop to weigh it in front of you.',
            'Ask whether a lamp or vessel is solid silver or silver-plated (or "German silver", which contains no silver).',
            'Silver hallmarking is voluntary, but any hallmarked piece must carry a 6-digit HUID (since 1 September 2025) — verify it in the BIS Care app.',
            'Get the per-gram rate and making charge listed separately on the invoice; GST of 3% applies to the total.',
            'Read buyback or exchange terms before buying — ask whether the shop deducts anything for making charges or wear.',
        ],
        popularAreas: [
            { name: 'T. Nagar (Usman Road)', specialty: 'Jewellery showrooms with silver puja items and jewellery' },
            { name: 'Sowcarpet', specialty: 'Wholesale jewellery and silverware shops' },
            { name: 'Mylapore', specialty: 'Traditional puja items near the Kapaleeshwarar temple' },
            { name: 'Anna Nagar', specialty: 'Modern jewellery stores and 925 sterling silver' },
        ],
        faq: [
            {
                question: 'Why is silver important for temples in Tamil Nadu?',
                answer: 'Tamil Nadu has many temples that use silver for deity coverings (kavacham), ritual vessels, lamps and processional items. Devotees also offer silver items to temples, and households keep silver for daily puja.',
            },
            {
                question: 'What silver puja items are common in Tamil households?',
                answer: 'Common items include the vilakku (lamp), kumkum box, camphor holder, panchapatra and udhrini (ritual vessels), tumblers and plates. Most families build up these items gradually through festivals, weddings and ceremonies.',
            },
            {
                question: 'Is Sowcarpet good for buying silver?',
                answer: 'Sowcarpet is one of Chennai\'s older wholesale areas, with many jewellery and silverware shops. Prices and making charges vary by shop, so compare a few, check fineness and insist on an invoice that shows weight, purity, rate and making charges.',
            },
            {
                question: 'What is a silver kavacham?',
                answer: 'A kavacham is an ornamental covering, often in silver or gold, placed over a temple deity, usually for festivals and special occasions. Silversmiths shape it by hand, often using repoussé (hammered relief) work.',
            },
        ],
        priceFactors: [
            'International silver price and MCX rates',
            'USD/INR exchange rate',
            'Import duty (raised to 15% in May 2026) and GST (3%)',
            'Akshaya Tritiya and Pongal are busy buying periods',
            'Making charges on hand-crafted puja items and temple work',
            'Steady household demand for puja silver through the year',
        ],
        investmentInsight:
            "Most Chennai families hold silver as puja items and jewellery rather than as an investment. Those who want silver as an investment can buy 999 bars or coins, or Silver ETFs on NSE/BSE. Jewellers' monthly savings schemes are not regulated like bank deposits — read the terms in writing before joining.",
        festivalsImpact:
            'Akshaya Tritiya (April/May), Pongal (January) and Navaratri are busy times for silver purchases in Chennai, and temple festivals bring orders for silver items through the year. Busy periods do not change the base rate, which follows the market — compare rates and check fineness before buying.',
    },

    kolkata: {
        city: 'Kolkata',
        slug: 'kolkata',
        state: 'West Bengal',
        mainMarkets: ['Bowbazar', 'Barabazar'],
        tagline: 'Bowbazar Craft and Durga Puja Silver',
        heroDescription:
            "Kolkata's Bowbazar workshops make filigree and traditional Bengali silver, and silver buying picks up around Durga Puja and Dhanteras. Check today's live silver rate in Kolkata.",
        uniqueDescription:
            "Bowbazar is Kolkata's jewellery street, with artisan workshops and retail shops that make and sell silver as well as gold. Bengali filigree (tarkashi) work — thin wires twisted and soldered into lace-like patterns — is made in silver too. Neighbouring Odisha's Cuttack Rupa Tarakasi is India's GI-tagged silver filigree (2024). Barabazar is the city's wholesale trading area.",
        silverCulture:
            "Silver in Bengali homes is used mainly for puja and gifting — silver-mounted conch shells (shankha), small plates, bowls and coins for the home shrine. Durga Puja, Kojagari Lakshmi Puja that follows it, and Dhanteras are busy times for silver purchases. Silver items are also given at weddings and rice-feeding ceremonies (annaprashan).",
        keyHighlights: [
            { icon: '🪔', label: 'Festival Buying', detail: 'Durga Puja, Lakshmi Puja and Dhanteras are busy times for silver in Kolkata' },
            { icon: '🧵', label: 'Filigree Work', detail: 'Bengali tarkashi filigree is made in silver as well as gold' },
            { icon: '🏪', label: 'Bowbazar', detail: 'Kolkata\'s jewellery street, with artisan workshops and shops' },
        ],
        buyingTips: [
            'For filigree pieces, ask whether the work is handmade or machine-made — the difference shows in price and finish.',
            'Making charges on filigree are higher than on plain silver; get the silver weight and making charge listed separately.',
            'Silver hallmarking is voluntary, but any hallmarked piece must carry a 6-digit HUID (since 1 September 2025) — verify it in the BIS Care app.',
            'Demand rises before Durga Puja and Dhanteras — compare rates at a few shops and check the fineness (925 or 999) before you buy.',
            'For bars and coins, check the fineness stamp and keep the invoice; GST of 3% applies.',
        ],
        popularAreas: [
            { name: 'Bowbazar', specialty: 'Artisan workshops, filigree and traditional Bengali silver' },
            { name: 'Barabazar', specialty: 'Wholesale trading in bullion and coins' },
            { name: 'Gariahat', specialty: 'Jewellery showrooms and sterling silver designs' },
            { name: 'New Market', specialty: 'Small silver items and gifts' },
        ],
        faq: [
            {
                question: 'Why does silver buying pick up in Kolkata during Durga Puja?',
                answer: 'Durga Puja is Kolkata\'s biggest festival, and many families buy silver puja items and gifts around it, followed by Kojagari Lakshmi Puja and Dhanteras. Higher demand does not change the base silver rate, which follows international prices and the rupee.',
            },
            {
                question: 'What is silver filigree (tarkashi)?',
                answer: 'Filigree (tarkashi) is a craft where thin silver wires are twisted, curled and soldered into lace-like patterns. Bengal has a long filigree tradition, mostly known in gold; in silver, the GI-tagged craft is Cuttack Rupa Tarakasi from Odisha. Genuine handmade pieces carry higher making charges.',
            },
            {
                question: 'When is the best time to buy silver in Kolkata?',
                answer: 'No month guarantees a lower price — silver follows international markets and can move sharply in either direction. Some jewellers offer making-charge discounts around Durga Puja and Dhanteras. Track the rate for a few days and compare total bills before buying.',
            },
            {
                question: 'What silver items are given at Bengali weddings?',
                answer: 'Common silver gifts include puja items, silver-mounted shankha, plates, bowls and coins. How much is spent depends on the family\'s budget — ask for the weight and fineness on the bill.',
            },
        ],
        priceFactors: [
            'International silver price and MCX rates',
            'USD/INR exchange rate',
            'Import duty (raised to 15% in May 2026) and GST (3%)',
            'Durga Puja, Lakshmi Puja and Dhanteras raise retail demand',
            'Bengali wedding season (November–February)',
            'Higher making charges for filigree and hand-crafted work',
        ],
        investmentInsight:
            "In Kolkata, silver is held mostly as puja items, gifts and jewellery. For investment, 999 bars and coins or Silver ETFs on NSE/BSE are the main options. Crafted pieces such as filigree are priced well above their metal value, and that premium is usually not recovered on resale.",
        festivalsImpact:
            'Durga Puja (September/October), Kojagari Lakshmi Puja and Dhanteras are the busiest times for silver buying in Kolkata. Poila Boishakh (Bengali New Year, April) and the wedding season also bring demand. Prices themselves follow the market, not the festival calendar.',
    },

    bangalore: {
        city: 'Bangalore',
        slug: 'bangalore',
        state: 'Karnataka',
        mainMarkets: ['Avenue Road', 'Chickpet'],
        tagline: 'Old Markets and New Silver Investors',
        heroDescription:
            "Bangalore pairs old jewellery markets like Chickpet and Avenue Road with a growing number of investors using Silver ETFs. Check today's live silver rate in Bangalore.",
        uniqueDescription:
            "Avenue Road and Chickpet are Bangalore's traditional jewellery and silverware markets. Silver demand in Karnataka peaks around Varamahalakshmi, when families buy silver kalasha decorations and Lakshmi faces for the puja, and around Ugadi and Dhanteras. With its large IT workforce, the city has also seen growing interest in Silver ETFs and in 925 sterling silver jewellery for daily wear.",
        silverCulture:
            "Silver in Karnataka homes is used for puja — kalasha, lamps, plates and the silver face of Lakshmi used during Varamahalakshmi Vrata. Silver anklets and toe rings are commonly worn, and silver waist belts (vaddanam/oddiyana) are worn for festivals and weddings. Younger buyers increasingly pick 925 sterling silver for everyday jewellery.",
        keyHighlights: [
            { icon: '🪔', label: 'Varamahalakshmi', detail: 'Silver kalasha decorations and Lakshmi faces are bought for the August festival' },
            { icon: '💍', label: 'Sterling Silver', detail: 'Growing demand for 925 sterling silver daily-wear jewellery' },
            { icon: '📱', label: 'Silver ETFs', detail: 'Many investors use SEBI-regulated Silver ETFs instead of storing metal' },
        ],
        buyingTips: [
            'Silver ETFs (available through any broker with a demat account) avoid making charges and storage, but charge an annual expense ratio.',
            'Digital silver sold on apps is not regulated by SEBI — if you want silver without storing it, Silver ETFs or silver mutual funds are the regulated route.',
            'For 925 sterling silver, check for the "925" stamp; silver hallmarking is voluntary, but hallmarked pieces must carry a 6-digit HUID.',
            'Demand rises before Varamahalakshmi and Dhanteras — compare rates and check whether a Lakshmi face or kalasha cover is solid silver or plated.',
            'Ask for the silver weight, per-gram rate and making charge separately on the bill; GST of 3% applies.',
        ],
        popularAreas: [
            { name: 'Avenue Road', specialty: 'Traditional jewellery and silverware shops, wholesale trade' },
            { name: 'Chickpet', specialty: 'Traditional Karnataka silver and puja items' },
            { name: 'Indiranagar–Koramangala', specialty: 'Sterling silver boutiques and designer pieces' },
            { name: 'Jayanagar', specialty: 'Branded jewellery showrooms' },
        ],
        faq: [
            {
                question: 'How do Silver ETFs work?',
                answer: 'Silver ETFs are SEBI-regulated mutual fund schemes that hold physical silver and trade on NSE/BSE like shares. They have been available in India since 2022. You need a demat account; there are no making charges, but the fund charges an annual expense ratio.',
            },
            {
                question: 'Is 925 sterling silver popular in Bangalore?',
                answer: 'Yes, sterling silver (92.5% silver) is popular for daily-wear and office jewellery, and boutiques in areas like Indiranagar and Koramangala sell it. Check for the 925 stamp and ask whether the piece is plated.',
            },
            {
                question: 'Where can I buy silver puja items in Bangalore?',
                answer: 'Avenue Road and Chickpet have many shops selling silver kalasha, lamps, plates and Lakshmi faces, especially before Varamahalakshmi. Compare a few shops and confirm whether items are solid silver or plated.',
            },
            {
                question: 'Is silver a better investment than gold?',
                answer: 'Neither is better for everyone. Silver is more volatile — its price can rise or fall faster than gold\'s — partly because much of its demand comes from industry. Many investors hold both. Decide based on your own goals and risk tolerance.',
            },
        ],
        priceFactors: [
            'International silver price and MCX silver futures',
            'USD/INR exchange rate',
            'Import duty (raised to 15% in May 2026) and GST (3%)',
            'Varamahalakshmi, Ugadi and Dhanteras raise retail demand',
            'Growing demand for sterling silver jewellery',
            'Making charges set by individual shops',
        ],
        investmentInsight:
            "Bangalore's investors can hold silver as 999 bars and coins or as Silver ETFs on NSE/BSE. Many also buy digital silver on apps, but these products are outside SEBI's regulation (SEBI cautioned in November 2025 that similar digital gold products are unregulated). Silver's price is more volatile than gold's.",
        festivalsImpact:
            'Varamahalakshmi (July/August) is a major occasion for silver puja items in Karnataka. Ugadi (March/April) and Dhanteras also bring higher demand. The base rate follows the market rather than the festival, so compare rates before buying.',
    },

    hyderabad: {
        city: 'Hyderabad',
        slug: 'hyderabad',
        state: 'Telangana',
        mainMarkets: ['Laad Bazaar', 'Begum Bazaar'],
        tagline: 'Bidriware and Old City Markets',
        heroDescription:
            "Hyderabad's markets sell Bidriware — silver inlaid on blackened metal, a craft from nearby Bidar — and traditional silver jewellery. Check today's live silver rate in Hyderabad.",
        uniqueDescription:
            "Bidriware is a craft in which silver wire and sheet are inlaid into a blackened zinc-copper alloy, creating silver-on-black patterns. It takes its name from Bidar in Karnataka, the craft's GI-registered home (2006), and Hyderabad has long been a major centre for making and selling it. Laad Bazaar near Charminar is known for stone-studded lac bangles, which received a GI tag in 2024, and the jewellers in the surrounding lanes sell silver and gold. Begum Bazaar is one of the city's old wholesale markets.",
        silverCulture:
            "Silver in Hyderabad reflects its Nizam-era heritage. Bidri boxes, vases and cufflinks are popular gifts, and silver anklets (payal), bangles and decorative boxes feature in weddings across communities. Eid and the wedding season are busy times for silver shopping around Charminar.",
        keyHighlights: [
            { icon: '🏺', label: 'Bidriware', detail: 'Silver inlay on blackened alloy — a GI-registered craft of Bidar, widely made and sold in Hyderabad' },
            { icon: '🪷', label: 'Laad Bazaar', detail: 'Stone-studded lac bangles near Charminar — GI-tagged in 2024' },
            { icon: '🦶', label: 'Silver Payal', detail: 'Silver anklets are a staple of Hyderabadi bridal and festive wear' },
        ],
        buyingTips: [
            'In Bidriware, most of the weight is the zinc-copper base — the silver inlay is a small part, so price reflects craft, not silver weight.',
            'Check Bidri pieces for real silver inlay; cheaper imitations use other white metals.',
            'Lac bangles from Laad Bazaar are lac with stones and glass, not silver — buy silver bangles by weight from jewellers.',
            'Silver hallmarking is voluntary, but any hallmarked piece must carry a 6-digit HUID (since 1 September 2025) — verify it in the BIS Care app.',
            'Ask for the silver weight, per-gram rate and making charge separately on the bill; GST of 3% applies.',
        ],
        popularAreas: [
            { name: 'Laad Bazaar (near Charminar)', specialty: 'Lac bangles, Bidriware and traditional jewellery shops' },
            { name: 'Begum Bazaar', specialty: 'Old wholesale market, including silverware' },
            { name: 'Abids', specialty: 'Bullion, coins and a mix of traditional and modern jewellery' },
            { name: 'Banjara Hills', specialty: 'Designer stores and branded showrooms' },
        ],
        faq: [
            {
                question: 'What is Bidriware?',
                answer: 'Bidriware is a metal craft in which silver is inlaid into a zinc-copper alloy that is then blackened, so the silver stands out against a black surface. It originated in Bidar, Karnataka, during the Bahmani period, and "Bidriware" is a registered Geographical Indication. Hyderabad is a major centre for making and selling it.',
            },
            {
                question: 'What should I look for in silver payal?',
                answer: 'Ask for the weight and fineness of the silver, check the clasp and links, and get the per-gram rate and making charge on the bill. Hallmarked anklets carry a 6-digit HUID you can check in the BIS Care app.',
            },
            {
                question: 'Is Bidriware a good investment?',
                answer: 'Bidriware is best seen as a craft or gift, not an investment. Its silver content is small, and resale value depends on finding a buyer for the craft rather than on the silver price. Buy it because you like the piece.',
            },
            {
                question: 'Where can I buy silver bars and coins in Hyderabad?',
                answer: 'Bullion dealers and jewellers in Abids and the old city sell 999 silver bars and coins. Check the fineness stamp, compare the premium over the day\'s rate across a few shops, and keep the invoice.',
            },
        ],
        priceFactors: [
            'International silver price and MCX rates',
            'USD/INR exchange rate',
            'Import duty (raised to 15% in May 2026) and GST (3%)',
            'Eid and Ramzan bring higher demand for silver jewellery and gifts',
            'Wedding season (November–March)',
            'Craft pieces like Bidriware are priced for workmanship, not silver weight',
        ],
        investmentInsight:
            "For investment, Hyderabad buyers use 999 silver bars and coins or Silver ETFs on NSE/BSE. Crafted items such as Bidriware are priced mainly for workmanship and are not a substitute for investment silver. Silver is more volatile than gold.",
        festivalsImpact:
            'Ramzan and Eid are busy times for silver jewellery and gifts in Hyderabad, especially around Charminar. Dhanteras brings silver coin buying, and the wedding season (November–March) and Bonalu also bring demand. The base rate follows the market.',
    },

    pune: {
        city: 'Pune',
        slug: 'pune',
        state: 'Maharashtra',
        mainMarkets: ['Laxmi Road', 'Raviwar Peth'],
        tagline: 'Laxmi Road Silver and Maharashtrian Traditions',
        heroDescription:
            "Pune's Laxmi Road and Raviwar Peth sell silver puja items, Ganesh idols and Maharashtrian silver jewellery. Check today's live silver rate in Pune.",
        uniqueDescription:
            "Laxmi Road is Pune's traditional jewellery street, and the nearby peths, including Raviwar Peth, have long-established jewellers and silverware shops. Silver Ganesh idols, puja items and utensils are bought for Ganesh Chaturthi, the city's biggest festival. Much of the silver anklet (painjan) work sold in Maharashtra comes from Hupari in Kolhapur district, whose silver craft received a GI tag in 2021.",
        silverCulture:
            "Pune was the seat of the Peshwas for much of the 18th century, until 1818, and its old peths still hold family-run jewellers. Maharashtrian households buy silver puja items, lamps and small idols, and silver anklets and toe rings (jodvi) are traditionally worn by married women. Ganesh Chaturthi, Gudi Padwa and Dhanteras are the main silver buying occasions.",
        keyHighlights: [
            { icon: '🐘', label: 'Ganesh Chaturthi', detail: 'Silver Ganesh idols and puja items are bought for the city\'s biggest festival' },
            { icon: '🦶', label: 'Hupari Silver', detail: 'Anklets from Hupari in Kolhapur district — GI-tagged silver craft (2021)' },
            { icon: '🏛️', label: 'Old Peths', detail: 'Laxmi Road and Raviwar Peth host long-established jewellers' },
        ],
        buyingTips: [
            'Ask whether a Ganesh idol or puja item is solid silver or silver-plated, and get the weight on the bill.',
            'Laxmi Road has many silver shops — compare making charges for the same item at three or four of them.',
            'Silver hallmarking is voluntary, but any hallmarked piece must carry a 6-digit HUID (since 1 September 2025) — verify it in the BIS Care app.',
            'For antique silver, ask for provenance and a written description; antiques are priced on rarity, and their resale value is uncertain.',
            'Demand rises before Ganesh Chaturthi — compare rates and check fineness (925/999) before buying. GST of 3% applies to the total bill.',
        ],
        popularAreas: [
            { name: 'Laxmi Road', specialty: 'Silver puja items, Ganesh idols and Maharashtrian jewellery' },
            { name: 'Raviwar Peth', specialty: 'Long-established jewellers and wholesale trade' },
            { name: 'FC Road–JM Road', specialty: 'Modern jewellery stores and 925 sterling silver' },
            { name: 'Baner–Hinjewadi', specialty: 'Newer jewellery stores serving the IT corridor' },
        ],
        faq: [
            {
                question: 'What silver items are popular in Pune?',
                answer: 'Silver Ganesh idols, puja thalis, lamps, utensils, anklets and toe rings (jodvi) are the most common purchases. Ganesh Chaturthi, Gudi Padwa and Dhanteras are the main buying occasions.',
            },
            {
                question: 'What is Hupari silver?',
                answer: 'Hupari is a town in Kolhapur district, Maharashtra, known for silver anklets (painjan) and other silver ornaments. Hupari silver craft received a GI tag in 2021. It is from Kolhapur district, not Pune, though Pune jewellers sell it.',
            },
            {
                question: 'Is there an antique silver market in Pune?',
                answer: 'Some old-city dealers sell antique and vintage silver. Prices depend on rarity and condition rather than silver weight, so ask for a written description and provenance, and remember that resale is not guaranteed.',
            },
            {
                question: 'Does Ganesh Chaturthi affect silver prices in Pune?',
                answer: 'It raises demand for silver idols and puja items, but the base silver rate follows international prices and the rupee, not the festival. Compare a few days\' rates and making charges before buying.',
            },
        ],
        priceFactors: [
            'International silver price and MCX rates',
            'USD/INR exchange rate',
            'Import duty (raised to 15% in May 2026) and GST (3%)',
            'Ganesh Chaturthi, Gudi Padwa and Dhanteras raise retail demand',
            'Maharashtra wedding season (November–May)',
            'Antique silver is priced on rarity, not metal value',
        ],
        investmentInsight:
            "Pune investors can buy 999 silver bars and coins from jewellers and bullion dealers, or Silver ETFs on NSE/BSE. Antique silver is a collectible rather than an investment — its value depends on finding a buyer. Silver's price is more volatile than gold's.",
        festivalsImpact:
            'Ganesh Chaturthi (August/September) is a major occasion for silver idols and puja items in Pune. Gudi Padwa (March/April), Dhanteras and the wedding season (November–May) also bring demand. The base rate follows the market rather than the festival.',
    },

    ahmedabad: {
        city: 'Ahmedabad',
        slug: 'ahmedabad',
        state: 'Gujarat',
        mainMarkets: ['Manek Chowk', 'Teen Darwaza'],
        tagline: 'Manek Chowk Bullion and Kutch Silver Traditions',
        heroDescription:
            "Old Ahmedabad's Manek Chowk trades gold and silver by day, and Gujarat has strong traditions of silver jewellery from Kutch. Check today's live silver rate in Ahmedabad.",
        uniqueDescription:
            "Manek Chowk has a vegetable market in the morning, gold, silver and bullion shops during the day, and food stalls at night. Teen Darwaza nearby has long-established jewellers. Gujarat has well-known traditions of heavy silver jewellery among pastoral communities of Kutch, such as the Rabari and Ahir, and Jain temples and households use silver in worship.",
        silverCulture:
            "Silver in Gujarat is used in worship, at weddings and as everyday jewellery. Jain and Hindu families buy silver puja items and offerings, and silver anklets, toe rings and waist chains are widely worn. During Navratri, garba jewellery is in demand — much of it is oxidised or costume jewellery rather than silver.",
        keyHighlights: [
            { icon: '🏛️', label: 'Manek Chowk', detail: 'Vegetables in the morning, bullion and jewellery by day, street food at night' },
            { icon: '🏔️', label: 'Kutch Silver', detail: 'Rabari and Ahir communities of Kutch have distinctive silver jewellery traditions' },
            { icon: '🙏', label: 'Silver in Worship', detail: 'Jain and Hindu families use silver puja items and temple offerings' },
        ],
        buyingTips: [
            "Manek Chowk's bullion and jewellery shops trade during the day — food stalls take over at night.",
            'Much "oxidised" Navratri jewellery is not silver — ask for the fineness and weight if you are paying a silver price.',
            'For traditional Kutch-style pieces, ask whether the item is old or newly made and get the silver content in writing.',
            'Silver hallmarking is voluntary, but any hallmarked piece must carry a 6-digit HUID (since 1 September 2025) — verify it in the BIS Care app.',
            'For bars and coins in volume, negotiate the premium and get the per-gram rate itemised on the bill; GST of 3% applies.',
        ],
        popularAreas: [
            { name: 'Manek Chowk', specialty: 'Old bullion market, silver and gold trading' },
            { name: 'Teen Darwaza', specialty: 'Long-established jewellers' },
            { name: 'Law Garden', specialty: 'Night market for garba wear and costume/oxidised jewellery' },
            { name: 'CG Road–SG Highway', specialty: 'Modern jewellery showrooms and 925 sterling silver' },
        ],
        faq: [
            {
                question: 'What is Kutch tribal silver jewellery?',
                answer: 'Pastoral communities of the Kutch region, such as the Rabari and Ahir, have long worn heavy silver jewellery — neck rings, earrings, armlets and anklets with bold designs. Older pieces are sought by collectors; newer pieces in the same style are widely made. Ask whether a piece is old or new and for its silver content.',
            },
            {
                question: 'Is Manek Chowk good for buying silver?',
                answer: 'Manek Chowk is the old city\'s bullion and jewellery market and trades silver and gold during the day (it becomes a food market at night). Compare rates and premiums across shops, check fineness and take a proper bill.',
            },
            {
                question: 'Is Navratri jewellery real silver?',
                answer: 'Often not. Much of the oxidised jewellery sold for garba is made of other metals or "German silver", which contains no silver. If you want real silver, buy from a jeweller and ask for the fineness and weight on the bill.',
            },
            {
                question: 'When is the best time to buy silver in Ahmedabad?',
                answer: 'No month guarantees a lower price — silver follows international markets. Demand rises around Navratri and Dhanteras, so shops are busier then. Track the rate for a few days and compare making charges before buying.',
            },
        ],
        priceFactors: [
            'International silver price and MCX rates',
            'USD/INR exchange rate',
            'Import duty (raised to 15% in May 2026) and GST (3%)',
            'Navratri and Dhanteras raise retail demand',
            'Old or crafted tribal pieces are priced above metal value',
            'Competition among Manek Chowk dealers on premiums',
        ],
        investmentInsight:
            "Ahmedabad's trading families have long held precious metals as savings, and the city has many bullion dealers selling 999 silver bars and coins. Silver ETFs on NSE/BSE are an alternative to storing metal. Crafted or antique pieces are collectibles; their resale value is uncertain.",
        festivalsImpact:
            'Navratri and Dhanteras are the busiest times for silver buying in Ahmedabad, and Akshaya Tritiya and the wedding season (November–May) also bring demand. The base rate follows the market, not the festival.',
    },

    coimbatore: {
        city: 'Coimbatore',
        slug: 'coimbatore',
        state: 'Tamil Nadu',
        mainMarkets: ['Big Bazaar Street', 'RS Puram'],
        tagline: 'Jewellery Manufacturing City of Western Tamil Nadu',
        heroDescription:
            "Coimbatore is a jewellery manufacturing centre, and its markets sell silver puja items, lamps and anklets alongside gold. Check today's live silver rate in Coimbatore.",
        uniqueDescription:
            "Coimbatore is a jewellery manufacturing centre that supplies retailers across Tamil Nadu and Kerala, and its Big Bazaar Street and Town Hall area have many jewellers and workshops. Silver lamps, puja vessels and anklets are sold widely. Salem, also in western Tamil Nadu, is a major centre for silver anklet (kolusu) manufacturing. Under RBI directions in force since 1 April 2026, regulated lenders can lend against silver jewellery and coins, as they do against gold.",
        silverCulture:
            "Coimbatore families follow Tamil Nadu's tradition of silver for puja — lamps (kuthuvilakku), plates, tumblers and kumkum boxes — and silver kolusu (anklets) are commonly worn and gifted. Silver items are bought for Pongal, Akshaya Tritiya and weddings, and silver lamps for Karthigai Deepam.",
        keyHighlights: [
            { icon: '🏭', label: 'Jewellery Manufacturing', detail: 'Workshops supply finished jewellery to retailers across Tamil Nadu and Kerala' },
            { icon: '🏦', label: 'Loans Against Silver', detail: 'RBI rules from April 2026 allow regulated lenders to lend against silver jewellery and coins' },
            { icon: '🪔', label: 'Puja Silver', detail: 'Silver lamps, vessels and kolusu are staples in western Tamil Nadu homes' },
        ],
        buyingTips: [
            'Big Bazaar Street and RS Puram have many jewellers — compare making charges for the same item at a few shops.',
            'Before borrowing against silver, compare interest rates, loan-to-value, fees and auction terms across banks and NBFCs; loans are given against jewellery and coins, not bars.',
            'Ask whether a lamp or vessel is solid silver, silver-plated or "German silver" (which contains no silver).',
            'Silver hallmarking is voluntary, but any hallmarked piece must carry a 6-digit HUID (since 1 September 2025) — verify it in the BIS Care app.',
            'Jewellers\' savings schemes are not regulated like bank deposits — get the bonus, rate-fixing and early-exit terms in writing before joining.',
        ],
        popularAreas: [
            { name: 'Big Bazaar Street', specialty: 'Dense jewellery corridor — manufacturing and retail' },
            { name: 'RS Puram', specialty: 'Jewellery showrooms and branded stores' },
            { name: 'Town Hall', specialty: 'Wholesale jewellery and artisan workshops' },
            { name: 'Gandhipuram', specialty: 'Modern jewellery stores' },
        ],
        faq: [
            {
                question: 'Is Coimbatore a jewellery manufacturing centre?',
                answer: 'Yes. Coimbatore has a large cluster of jewellery workshops, mainly known for gold, that supply retailers across Tamil Nadu and Kerala. Its markets also sell silver puja items and jewellery.',
            },
            {
                question: 'Can I take a loan against silver?',
                answer: 'Yes. Under the RBI\'s directions on lending against gold and silver collateral, in force since 1 April 2026, regulated banks and NBFCs can lend against silver jewellery and coins (not bars), within limits on the quantity pledged. Interest rates and terms vary by lender — compare before borrowing, and remember that unpaid loans can lead to the silver being auctioned.',
            },
            {
                question: 'Are silver making charges lower in Coimbatore?',
                answer: 'Charges vary by shop and design. Buying from manufacturers or workshop-linked shops can be cheaper than big-city showrooms, but compare the total bill — weight, rate, making charge and 3% GST — before deciding.',
            },
            {
                question: 'What silver items are commonly bought in Coimbatore?',
                answer: 'Silver lamps (kuthuvilakku), puja plates, tumblers, kumkum boxes and kolusu (anklets) are the most common. Many are bought for Pongal, Akshaya Tritiya, Karthigai Deepam and weddings.',
            },
        ],
        priceFactors: [
            'International silver price and MCX rates',
            'USD/INR exchange rate',
            'Import duty (raised to 15% in May 2026) and GST (3%)',
            'Pongal and Akshaya Tritiya raise retail demand',
            'Making charges set by individual shops and workshops',
            'Demand from retailers in Tamil Nadu and Kerala',
        ],
        investmentInsight:
            "In Coimbatore, silver is held mostly as puja items and jewellery. Since April 2026, RBI rules let regulated lenders give loans against silver jewellery and coins — useful as a source of credit, but pledged silver can be auctioned if the loan is not repaid. For investment, 999 bars and coins or Silver ETFs on NSE/BSE are the main options.",
        festivalsImpact:
            'Pongal (January) and Akshaya Tritiya (April/May) are the main silver buying occasions in Coimbatore, with silver lamps also bought for Karthigai Deepam (November/December). The wedding season brings steady demand. The base rate follows the market rather than the festival.',
    },

    kerala: {
        city: 'Kerala',
        slug: 'kerala',
        state: 'Kerala',
        mainMarkets: ['Thrissur', 'MG Road Kochi'],
        tagline: 'Silver in Ritual and Everyday Wear',
        heroDescription:
            "In Kerala, silver is used for anklets, children's waist chains, temple offerings and church items. Check today's live silver rate in Kerala.",
        uniqueDescription:
            "Silver in Kerala is used across communities: anklets for women and girls, waist chains (aranjanam) for children, lamps and offerings for temples, and crosses and vessels for churches. Thrissur and Kozhikode are major jewellery centres — Kalyan Jewellers and Joyalukkas are headquartered in Thrissur and Malabar Gold & Diamonds in Kozhikode — and most large jewellers also sell silver.",
        silverCulture:
            "Hindu families use silver lamps, puja items and offerings; Christian families use silver crosses and church vessels, often given as offerings; and silver anklets are worn widely across communities. Silver waist chains are a common gift for babies.",
        keyHighlights: [
            { icon: '🦶', label: 'Silver Anklets', detail: 'Silver anklets are widely worn across Kerala\'s communities' },
            { icon: '⛪', label: 'Church Silver', detail: 'Silver crosses and vessels are given as offerings in Kerala churches' },
            { icon: '🛕', label: 'Temple Offerings', detail: 'Silver lamps and offerings are common at Kerala temples' },
        ],
        buyingTips: [
            'Ask for the silver weight, per-gram rate and making charge separately on the bill; GST of 3% applies.',
            'Silver hallmarking is voluntary, but any hallmarked piece must carry a 6-digit HUID (since 1 September 2025) — verify it in the BIS Care app.',
            'For church or temple items, ask whether the piece is solid silver or silver-plated.',
            'If bringing silver from the Gulf, check the current CBIC baggage rules and duty before comparing prices.',
            'Jewellers\' savings schemes are not regulated like bank deposits — read the bonus and early-exit terms in writing before joining.',
        ],
        popularAreas: [
            { name: 'Thrissur (Swaraj Round)', specialty: 'Major jewellery centre with large showrooms' },
            { name: 'MG Road, Kochi', specialty: 'Jewellery showrooms and designer pieces' },
            { name: 'Kozhikode (Calicut)', specialty: 'Traditional Malabar jewellery market' },
            { name: 'Thiruvananthapuram', specialty: 'Jewellery shops and temple items' },
        ],
        faq: [
            {
                question: 'How is silver used in Kerala?',
                answer: 'Silver is used for anklets, children\'s waist chains, temple lamps and offerings, and church crosses and vessels. Families often buy silver items for festivals and as gifts at ceremonies.',
            },
            {
                question: 'What is the church silver tradition in Kerala?',
                answer: 'Kerala\'s Christian communities, including the Syrian Christians, use silver crosses, chalices and other vessels in churches, and families often give silver items as offerings.',
            },
            {
                question: 'Does temple demand affect silver prices in Kerala?',
                answer: 'No. Temple and church purchases add to demand, but the silver rate in Kerala follows international prices, the rupee, and Indian import duty and GST.',
            },
            {
                question: 'Do Kerala jewellers offer silver savings schemes?',
                answer: 'Some jewellers offer monthly savings schemes that can be used for silver. The money can only be spent at that jeweller and is not protected like a bank deposit, so read the bonus, rate-fixing and early-exit terms before joining.',
            },
        ],
        priceFactors: [
            'International silver price and MCX rates',
            'USD/INR exchange rate',
            'Import duty (raised to 15% in May 2026) and GST (3%)',
            'Onam, Vishu and the wedding season raise retail demand',
            'Making charges set by individual jewellers',
            'Gulf remittances support household spending on silver',
        ],
        investmentInsight:
            "In Kerala, silver is bought mostly for use — anklets, offerings and gifts — rather than as an investment. For investment, 999 bars and coins or Silver ETFs on NSE/BSE are the main options. Since April 2026, regulated lenders can also lend against silver jewellery and coins.",
        festivalsImpact:
            'Onam (August/September) and Vishu (April) are major buying occasions in Kerala, and the wedding season brings steady demand. Christmas and temple festivals bring purchases of church and temple items. The base rate follows the market.',
    },
};

/**
 * Get city silver data by slug (lowercase city name)
 */
export function getCitySilverData(slug: string): CitySilverInfo | undefined {
    return CITY_SILVER_DATA[slug.toLowerCase()];
}

/**
 * Get all city slugs for static generation
 */
export function getAllSilverCitySlugs(): string[] {
    return Object.keys(CITY_SILVER_DATA);
}
