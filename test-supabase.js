// Test Supabase API Connection
// Run this with: node test-supabase.js

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🧪 Testing Supabase API Connection...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('  SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('  SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log('\n❌ ERROR: Supabase credentials not found in .env.local');
    console.log('\n💡 Please add to .env.local:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here');
    process.exit(1);
}

console.log('\n  URL:', SUPABASE_URL);
console.log('  Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...');

// Test 1: Fetch Categories
async function testCategories() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🧪 Test 1: Fetching Categories');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const url = `${SUPABASE_URL}/rest/v1/categories?is_active=eq.true&order=display_order.asc`;
    console.log('  URL:', url);

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('  Status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('  ❌ Error Response:', errorText);
            return;
        }

        const categories = await response.json();
        console.log('  ✅ Success! Found', categories.length, 'categories');

        if (categories.length > 0) {
            console.log('\n  📂 Categories:');
            categories.forEach(cat => {
                console.log(`     - ${cat.name} (${cat.slug})`);
            });
        } else {
            console.log('  ⚠️  No categories found. Please create categories in your Supabase database.');
        }

        return categories;
    } catch (error) {
        console.log('  ❌ Error:', error.message);
        return [];
    }
}

// Test 2: Fetch Articles by Category
async function testArticles(categorySlug = 'business') {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🧪 Test 2: Fetching Articles (category: ${categorySlug})`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // First get category
    const categoryUrl = `${SUPABASE_URL}/rest/v1/categories?slug=eq.${categorySlug}&is_active=eq.true`;
    console.log('  Category URL:', categoryUrl);

    try {
        const catResponse = await fetch(categoryUrl, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!catResponse.ok) {
            console.log('  ❌ Failed to fetch category');
            return;
        }

        const categories = await catResponse.json();

        if (categories.length === 0) {
            console.log(`  ⚠️  Category "${categorySlug}" not found`);
            return;
        }

        const categoryId = categories[0].id;
        console.log('  ✅ Category found:', categories[0].name);
        console.log('  Category ID:', categoryId);

        // Fetch articles
        const articlesUrl = `${SUPABASE_URL}/rest/v1/articles?category_id=eq.${categoryId}&status=eq.published&order=published_at.desc&limit=10`;
        console.log('  Articles URL:', articlesUrl);

        const articlesResponse = await fetch(articlesUrl, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!articlesResponse.ok) {
            console.log('  ❌ Failed to fetch articles');
            return;
        }

        const articles = await articlesResponse.json();
        console.log('  ✅ Success! Found', articles.length, 'published articles');

        if (articles.length > 0) {
            console.log('\n  📰 Articles:');
            articles.slice(0, 3).forEach(article => {
                console.log(`     - ${article.title}`);
                console.log(`       Author: ${article.author || 'N/A'} | ${article.read_time || 'N/A'}`);
            });
        } else {
            console.log('  ⚠️  No published articles found for this category.');
            console.log('  💡 Make sure you have articles with status="published"');
        }

    } catch (error) {
        console.log('  ❌ Error:', error.message);
    }
}

// Run all tests
(async () => {
    const categories = await testCategories();
    await testArticles('top-news');
    await testArticles('business');
    await testArticles('world-affairs');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Test Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (!categories || categories.length === 0) {
        console.log('📝 Next Steps:');
        console.log('   1. Create categories in Supabase (see SUPABASE_SETUP.md)');
        console.log('   2. Add some published articles');
        console.log('   3. Restart your dev server: npm run dev\n');
    }
})();
