# Gold & Silver Daily Article Generator

This script automatically generates daily articles about gold and silver price changes for multiple Indian cities.

## Overview

The script:
- Fetches live gold and silver price data from Angel One API (same source as your gold-rate and silver pages)
- Generates SEO-optimized articles using GPT-4o
- Publishes articles to Supabase for 10 major Indian cities
- Includes price trends, market analysis, and local context

## API Sources

### Gold History API
```
https://kp-hl-httpapi-prod.angelone.in/goldhistory?city={city}&carat={carat}
```
- **Parameters:**
  - `city`: City name (default: "India")
  - `carat`: Gold carat - "24k", "22k", or "18k" (default: "24k")
- **Response:** Array of `{ date, rate, change }`

### Silver History API
```
https://kp-hl-httpapi-prod.angelone.in/silverhistory?symbol={symbol}&gram={gram}
```
- **Parameters:**
  - `symbol`: Silver symbol (default: "XAG")
  - `gram`: Weight in grams (default: 10)
- **Response:** `{ success, data: { gram, history: [{ date, price, differenceAmount, differencePercentage }] } }`

## Configuration

### Environment Variables Required
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### Cities Covered
The script generates articles for these cities:
- Mumbai
- Delhi
- Bangalore
- Chennai
- Kolkata
- Hyderabad
- Pune
- Ahmedabad
- Jaipur
- Lucknow

## Usage

### Run the Script
```bash
node scripts/goldupdate.js
```

### What It Does
1. Fetches latest gold prices (24k) for India
2. Fetches latest silver prices (10g)
3. Extracts today's and yesterday's prices
4. For each city:
   - Generates a unique, SEO-optimized article (320-380 words)
   - Creates title, excerpt, content, and meta tags
   - Publishes to Supabase `articles` table with category_id = 8
   - Waits 1.5 seconds between cities to avoid rate limiting

### Output Example
Each article includes:
- **Title:** City-specific, SEO-friendly
- **Content:** 320-380 words with:
  - Today's gold and silver prices
  - Price change percentages
  - Market analysis and trends
  - Impact on local buyers/investors
  - Brief outlook
- **SEO Metadata:**
  - Meta title
  - Meta description
  - 15-20 meta keywords targeting local searches
- **Images:** 4 Unsplash images related to gold

## Article Structure

```
1. Opening: Today's gold price and change
2. Analysis: Why prices moved (market factors, global trends)
3. Silver Update: Silver price movement
4. Impact: Effects on buyers, investors, jewellers in {city}
5. Outlook: What to expect
```

## Database Schema

Articles are inserted into the `articles` table with:
```javascript
{
  title: string,
  slug: string,
  excerpt: string,
  content: string (HTML with <p> tags),
  meta_title: string,
  meta_description: string,
  meta_keywords: string,
  category_id: 8,
  status: "published",
  featured_image_url: string,
  image_gallery: string[],
  published_at: ISO timestamp
}
```

## Customization

### Change Cities
Edit the `CITIES` array in the script:
```javascript
const CITIES = [
    "Mumbai",
    "Delhi",
    // Add or remove cities here
];
```

### Change Gold Carat
Modify the `fetchGoldHistory()` call:
```javascript
const goldHistory = await fetchGoldHistory("India", "22k"); // For 22k gold
```

### Change Article Length
Update the GPT prompt:
```javascript
- 320–380 words  // Change this range
```

### Change Category
Update the `CATEGORY_ID` constant:
```javascript
const CATEGORY_ID = 8; // Change to your desired category
```

## Scheduling

To run this daily automatically, set up a cron job:

```bash
# Run every day at 9:00 AM
0 9 * * * cd /path/to/Gpaisa && node scripts/goldupdate.js >> logs/goldupdate.log 2>&1
```

Or use a task scheduler like:
- **Vercel Cron Jobs** (if deployed on Vercel)
- **GitHub Actions** (scheduled workflows)
- **Linux crontab**
- **PM2** with cron feature

## Error Handling

The script includes error handling for:
- API failures (gold/silver data fetch)
- Invalid data responses
- Supabase insertion errors
- OpenAI API errors

Errors are logged to console with descriptive messages.

## Rate Limiting

- 1.5 second delay between city articles
- Prevents OpenAI API rate limiting
- Prevents Supabase connection issues

## Notes

- The script uses the same Angel One API as your live gold-rate and silver pages
- Articles are generated with strong SEO focus for local searches
- Each city gets a unique article with local context
- Images are sourced from Unsplash (consider replacing with your own)
