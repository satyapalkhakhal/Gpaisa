require('dotenv').config({ path: '.env.local' });
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

(async () => {
    console.log('🔍 Checking Articles in Category: news');
    const catRes = await fetch(SUPABASE_URL + '/rest/v1/categories?slug=eq.news', {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY }
    });
    const stats = await catRes.json();

    if (!stats.length) {
        console.log('❌ Category "news" NOT FOUND!');
        return;
    }

    const catId = stats[0].id;
    console.log('✅ Category ID:', catId);

    const artRes = await fetch(SUPABASE_URL + '/rest/v1/articles?category_id=eq.' + catId + '&status=eq.published&limit=1', {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY }
    });

    const articles = await artRes.json();

    if (articles.length === 0) {
        console.log('⚠️  NO ARTICLES found in "news" category! (Falling back to mock data)');
    } else {
        console.log('✅ Found Supabase Article:');
        console.log('   Title:', articles[0].title);
        console.log('   Image:', articles[0].featured_image_url || 'NULL');
    }
})();
