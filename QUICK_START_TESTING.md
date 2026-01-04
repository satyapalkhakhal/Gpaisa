# 🚀 Quick Start: Testing Your Article SEO

## Immediate Testing (5 Minutes)

### Step 1: Open an Article
```
http://localhost:3000/articles/{any-article-id}
```

### Step 2: View Page Source
- **Windows/Linux:** Press `Ctrl + U`
- **Mac:** Press `Cmd + Option + U`
- **Or:** Right-click → "View Page Source"

### Step 3: Search for These (Ctrl+F)
1. Search for: `"keywords"`
   - ✅ Should find dynamic keywords
   - ✅ Should be different for each article

2. Search for: `application/ld+json`
   - ✅ Should find 2 results
   - ✅ One for NewsArticle
   - ✅ One for BreadcrumbList

3. Search for: `itemProp`
   - ✅ Should find multiple results
   - ✅ headline, author, datePublished, image, articleBody

4. Search for: `og:title`
   - ✅ Should find Open Graph tags

5. Search for: `twitter:card`
   - ✅ Should find Twitter Card tags

---

## What You Should See

### ✅ Dynamic Keywords Example
```html
<meta name="keywords" content="stock, market, rally, continues, business, gpaisa, financial news, india finance, market news, investment news">
```
**Note:** Keywords should be DIFFERENT for each article!

### ✅ JSON-LD NewsArticle Schema
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Your Article Title",
  "description": "Your article excerpt...",
  "image": "https://...",
  "datePublished": "2026-01-04T...",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Gpaisa"
  }
}
</script>
```

### ✅ JSON-LD BreadcrumbList Schema
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://gpaisa.in"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "News",
      "item": "https://gpaisa.in/news"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title",
      "item": "https://gpaisa.in/articles/123"
    }
  ]
}
</script>
```

### ✅ Semantic HTML
```html
<article itemscope="" itemtype="https://schema.org/NewsArticle">
  <h1 itemprop="headline">Article Title</h1>
  
  <span itemprop="author" itemscope="" itemtype="https://schema.org/Person">
    <span itemprop="name">Author Name</span>
  </span>
  
  <time itemprop="datePublished" datetime="2026-01-04T...">
    4 January 2026
  </time>
  
  <img itemprop="image" src="..." alt="...">
  
  <div itemprop="articleBody">
    <!-- Article content -->
  </div>
</article>
```

---

## Quick Verification Checklist

Open 2-3 different articles and verify:

- [ ] Keywords are DIFFERENT for each article
- [ ] Article title appears in keywords
- [ ] Category name appears in keywords
- [ ] JSON-LD schemas are present (2 script tags)
- [ ] Open Graph tags are complete
- [ ] Twitter Card tags are present
- [ ] Semantic HTML attributes (itemProp) are present
- [ ] No console errors in browser DevTools

---

## Common Questions

### Q: How do I know if keywords are dynamic?
**A:** Open 2 different articles and compare the keywords meta tag. They should be different!

### Q: Where can I see the structured data?
**A:** View page source and search for `application/ld+json`. You'll see the JSON schemas.

### Q: How do I test social sharing?
**A:** After deploying to production, use:
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator

### Q: Will this work for all articles?
**A:** Yes! It's automatic. Every article page will have:
- Dynamic keywords from its title
- Structured data with its content
- Proper metadata for sharing

---

## Expected Results

### In Google Search (after indexing):
```
gpaisa.in › news › article-title
┌────────────────────────────────────┐
│ [IMAGE] Article Title Here         │
│                                    │
│ Article excerpt appears here with  │
│ relevant information about the...  │
│                                    │
│ By Author Name · 4 Jan 2026       │
└────────────────────────────────────┘
```

### When Shared on Social Media:
```
┌────────────────────────────────────┐
│ [LARGE FEATURED IMAGE 1200x630]    │
│                                    │
│ Article Title Here                 │
│ Article excerpt appears here...    │
│                                    │
│ gpaisa.in                          │
└────────────────────────────────────┘
```

---

## Next Steps

1. ✅ **Test locally** (you're here!)
2. 📝 **Verify with different articles**
3. 🚀 **Deploy to production**
4. 🔍 **Submit to Google Search Console**
5. 📊 **Monitor in analytics**

---

## Need Help?

Check these documentation files:
- `ARTICLE_SEO_SUMMARY.md` - Complete overview
- `ARTICLE_SEO_VERIFICATION.md` - Detailed testing guide
- `ARTICLE_SEO_ENHANCEMENTS.md` - Technical documentation
- `ARTICLE_SEO_QUICK_REFERENCE.md` - Examples and benefits

---

## Server Info

**Development Server:** http://localhost:3000
**Status:** ✅ Running
**File Modified:** `/app/articles/[id]/page.tsx`

---

**Ready to test!** 🎉
