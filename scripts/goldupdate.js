/**
 * Daily Gold Rate News Auto Publisher
 * Category ID = 8
 * 
 * This script generates daily articles about gold and silver price changes
 * using the Angel One API (same as used in gold-rate and silver pages)
 */

import { config } from "dotenv";
import { resolve } from "path";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

config({ path: resolve(process.cwd(), ".env.local") });

// ---------------- INIT ----------------

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// API URLs - Angel One endpoints (same as used in gold-rate and silver pages)
const GOLD_HISTORY_API = "https://kp-hl-httpapi-prod.angelone.in/goldhistory";
const SILVER_HISTORY_API = "https://kp-hl-httpapi-prod.angelone.in/silverhistory";

const CATEGORY_ID = 8;

// Major Indian cities for gold rate articles
const CITIES = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow"
];

// ---------------- HELPERS ----------------

/**
 * Fetch gold history from Angel One API
 * @param {string} city - City name (default: "India")
 * @param {string} carat - Gold carat (default: "24k")
 */
async function fetchGoldHistory(city = "India", carat = "24k") {
    const url = `${GOLD_HISTORY_API}?city=${city}&carat=${carat}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.success || !data.data || data.data.length < 2) {
        throw new Error(`Failed to fetch gold history for ${city}`);
    }

    return data.data; // Array of GoldHistoryItem[]
}

/**
 * Fetch silver history from Angel One API
 * @param {string} symbol - Silver symbol (default: "XAG")
 * @param {number} gram - Grams (default: 10)
 */
async function fetchSilverHistory(symbol = "XAG", gram = 10) {
    const url = `${SILVER_HISTORY_API}?symbol=${symbol}&gram=${gram}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.success || !data.data || !data.data.history || data.data.history.length < 2) {
        throw new Error("Failed to fetch silver history");
    }

    return data.data.history; // Array of SilverHistoryItem[]
}

/**
 * Extract today's and yesterday's gold prices from history API
 * API returns: { date, rate, change }
 */
function extractGoldPriceData(historyData) {
    const today = historyData[0];
    const yesterday = historyData[1];

    return {
        today: parseFloat(today.rate),
        yesterday: parseFloat(yesterday.rate),
        change: today.change,
        todayDate: today.date,
        yesterdayDate: yesterday.date
    };
}

/**
 * Extract today's and yesterday's silver prices from history API
 * API returns: { date, price, differenceAmount, differencePercentage }
 */
function extractSilverPriceData(historyData) {
    const today = historyData[0];
    const yesterday = historyData[1];

    return {
        today: parseFloat(today.price),
        yesterday: parseFloat(yesterday.price),
        change: today.differencePercentage,
        todayDate: today.date,
        yesterdayDate: yesterday.date
    };
}

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function generateImageUrls(city) {
    return [
        `https://mrvapygtxktrgilxqgqr.supabase.co/storage/v1/object/public/news-images/news/gold1.png`,
        `https://mrvapygtxktrgilxqgqr.supabase.co/storage/v1/object/public/news-images/news/gold4.jpeg`,
        `https://mrvapygtxktrgilxqgqr.supabase.co/storage/v1/object/public/news-images/news/gold6.jpeg`,
        `https://mrvapygtxktrgilxqgqr.supabase.co/storage/v1/object/public/news-images/news/gold5.jpeg`,
        `https://mrvapygtxktrgilxqgqr.supabase.co/storage/v1/object/public/news-images/news/gold3.jpeg`,
        `https://mrvapygtxktrgilxqgqr.supabase.co/storage/v1/object/public/news-images/news/gold2.jpeg`
    ];
}

// ---------------- GPT ARTICLE ----------------

async function generateGoldArticle(city, gold, silver) {
    const goldTrend = parseFloat(gold.change) > 0 ? "increased" : parseFloat(gold.change) < 0 ? "decreased" : "remained stable";
    const silverTrend = parseFloat(silver.change) > 0 ? "increased" : parseFloat(silver.change) < 0 ? "decreased" : "remained stable";

    const prompt = `
You are a senior financial journalist writing gold price news for Indian readers.

CITY: ${city}

GOLD PRICES:
- Today (${gold.todayDate}): ₹${gold.today} per 10 grams
- Yesterday (${gold.yesterdayDate}): ₹${gold.yesterday} per 10 grams
- Change: ${gold.change}% (${goldTrend})

SILVER PRICES:
- Today (${silver.todayDate}): ₹${silver.today} per kg
- Yesterday (${silver.yesterdayDate}): ₹${silver.yesterday} per kg
- Change: ${silver.change}% (${silverTrend})

TASK:
Write a DAILY gold and silver rate news article focused on ${city}.

STRUCTURE:
1. Opening: Lead with today's gold price and the change
2. Analysis: Explain why prices moved (market factors, global trends, rupee movement)
3. Silver Update: Mention silver price movement
4. Impact: How this affects buyers, investors, and jewellers in ${city}
5. Outlook: Brief mention of what to expect

RULES:
- 320–380 words
- Strong SEO + buyer intent keywords
- Explain price movement clearly with context
- Mention impact on buyers & investors
- Indian market context only
- No sources, no links, no citations
- Conversational but authoritative tone
- Use <p> tags only for HTML formatting
- Include specific numbers and percentages
- Make it locally relevant to ${city}

SEO REQUIREMENTS:
- Target: "${city} gold rate today", "gold price in ${city}", "silver rate ${city}"
- Generate VERY STRONG meta keywords (15-20 keywords)
- Include variations: 22k gold, 24k gold, silver price, today's rate

OUTPUT JSON ONLY:
{
  "title": "",
  "excerpt": "",
  "content": "",
  "meta_title": "",
  "meta_description": "",
  "meta_keywords": ""
}
`;

    const res = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.85,
        max_tokens: 1500,
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: "You are an expert Indian financial journalist specializing in commodity markets and precious metals." },
            { role: "user", content: prompt }
        ]
    });

    return JSON.parse(res.choices[0].message.content);
}

// ---------------- MAIN ----------------

async function publishDailyGoldNews() {
    console.log("🚀 Publishing daily gold rate news...\n");

    try {
        // Fetch gold and silver history data from Angel One API
        console.log("📊 Fetching gold and silver price data...");
        const goldHistory = await fetchGoldHistory();
        const silverHistory = await fetchSilverHistory();

        const goldPriceData = extractGoldPriceData(goldHistory);
        const silverPriceData = extractSilverPriceData(silverHistory);

        console.log(`✅ Gold: ₹${goldPriceData.today} (${goldPriceData.change}%)`);
        console.log(`✅ Silver: ₹${silverPriceData.today} (${silverPriceData.change}%)\n`);

        // Generate articles for each city
        for (const city of CITIES) {
            console.log(`🟡 Generating article for ${city}...`);

            const ai = await generateGoldArticle(city, goldPriceData, silverPriceData);
            const slug = slugify(ai.title);
            const images = generateImageUrls(city);

            // Randomly select one image as the featured image
            const featuredImage = images[Math.floor(Math.random() * images.length)];

            const { error } = await supabase.from("articles").insert({
                title: ai.title,
                slug,
                excerpt: ai.excerpt,
                content: ai.content,
                meta_title: ai.meta_title,
                meta_description: ai.meta_description,
                meta_keywords: ai.meta_keywords,
                category_id: CATEGORY_ID,
                status: "published",
                featured_image_url: featuredImage,
                image_gallery: images,
                published_at: new Date().toISOString()
            });

            if (!error) {
                console.log(`✅ Published: ${ai.title}`);
            } else {
                console.error(`❌ Error publishing ${city}:`, error.message);
            }

            // Wait 1.5 seconds between API calls to avoid rate limiting
            await new Promise(r => setTimeout(r, 1500));
        }

        console.log("\n🎉 Daily gold news published successfully!");
    } catch (error) {
        console.error("❌ Fatal error:", error.message);
        throw error;
    }
}

publishDailyGoldNews().catch(console.error);
