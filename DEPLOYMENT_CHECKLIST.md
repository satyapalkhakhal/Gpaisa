# Pre-Deployment Checklist for gpaisa.in

## 🎯 Objective
Deploy slug-based URLs and canonical URL improvements while maintaining SEO and preventing indexing issues.

---

## ✅ Pre-Deployment Checks

### 1. Code Review
- [x] Slug field added to Article interfaces
- [x] `fetchArticleBySlug()` function created
- [x] Article page uses slug routing
- [x] All article links updated to use slugs
- [x] Sitemap updated to use slugs
- [x] Mock data includes slugs
- [x] Canonical URLs are absolute
- [x] All major pages have canonical tags

### 2. Local Testing
- [ ] Run `npm run build` successfully
- [ ] Test article pages with slug URLs
- [ ] Verify canonical tags in page source
- [ ] Check sitemap.xml generation
- [ ] Test all internal navigation
- [ ] Verify no console errors

### 3. Database Preparation
- [ ] Verify `slug` column exists in `articles` table
- [ ] Ensure all existing articles have slugs
- [ ] Check for duplicate slugs (should be unique)
- [ ] Test `goldupdate.js` script generates slugs correctly

---

## 🚀 Deployment Steps

### Step 1: Backup Current State
```bash
# Backup database (if possible)
# Document current live URLs
# Take screenshots of Google Search Console stats
```

### Step 2: Deploy Code Changes
```bash
# Commit all changes
git add .
git commit -m "feat: implement slug-based URLs and canonical tags for SEO"

# Push to production
git push origin main
```

### Step 3: Verify Deployment
- [ ] Check homepage loads correctly
- [ ] Test article pages with slugs
- [ ] Verify canonical tags in production
- [ ] Check sitemap.xml on live site
- [ ] Test navigation and links

### Step 4: Handle Old URLs (IMPORTANT!)
Since you're changing article URLs, you need to decide:

**Option A: Let old URLs 404** (Not Recommended)
- Old bookmarks will break
- SEO value lost
- Poor user experience

**Option B: Implement 301 Redirects** (Recommended)
- Preserves SEO value
- Maintains user bookmarks
- Better user experience

---

## 🔄 Implementing 301 Redirects (Recommended)

### Create Middleware for Redirects

**File**: `/middleware.ts` (create in project root)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if it's an old article ID URL
    const articleIdMatch = pathname.match(/^\/articles\/(\d+)$/);
    
    if (articleIdMatch) {
        const articleId = articleIdMatch[1];
        
        try {
            // Fetch article slug from your API
            const response = await fetch(
                `${request.nextUrl.origin}/api/article-redirect?id=${articleId}`,
                { cache: 'no-store' }
            );
            
            if (response.ok) {
                const { slug } = await response.json();
                if (slug) {
                    // 301 redirect to slug-based URL
                    return NextResponse.redirect(
                        new URL(`/articles/${slug}`, request.url),
                        { status: 301 }
                    );
                }
            }
        } catch (error) {
            console.error('Redirect error:', error);
        }
        
        // If slug not found, redirect to news page
        return NextResponse.redirect(
            new URL('/news', request.url),
            { status: 301 }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/articles/:path*',
};
```

### Create API Route for Redirect Lookup

**File**: `/app/api/article-redirect/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { fetchArticleById } from '@/lib/supabaseApi';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    try {
        const article = await fetchArticleById(id);

        if (article && article.slug) {
            return NextResponse.json({ slug: article.slug });
        }

        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    } catch (error) {
        console.error('Article redirect lookup error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
```

---

## 📊 Post-Deployment Monitoring

### Day 1: Immediate Checks
- [ ] All pages loading correctly
- [ ] No 500 errors in logs
- [ ] Canonical tags visible in page source
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Test old article URLs redirect properly

### Week 1: Daily Monitoring
- [ ] Google Search Console for new errors
- [ ] Check "Page with redirect" status
- [ ] Monitor 404 errors
- [ ] Verify new pages being indexed
- [ ] Check organic traffic trends

### Week 2-4: Weekly Monitoring
- [ ] Review indexing coverage
- [ ] Check for duplicate content issues
- [ ] Monitor keyword rankings
- [ ] Verify canonical URLs in GSC
- [ ] Review crawl stats

---

## 🔍 Google Search Console Actions

### Immediately After Deployment:
1. **Request Indexing** for key pages:
   - Homepage
   - Main gold rate page
   - Main silver rate page
   - Top 5-10 articles

2. **Resubmit Sitemap**:
   - Go to Sitemaps section
   - Remove old sitemap (if any)
   - Submit: `https://gpaisa.in/sitemap.xml`

3. **Monitor Indexing**:
   - Check "Pages" report daily
   - Watch for "Page with redirect" changes
   - Monitor "Discovered - currently not indexed"

### Week 1:
4. **URL Inspection Tool**:
   - Test 5-10 random article URLs
   - Verify canonical URLs are correct
   - Check mobile usability

5. **Coverage Report**:
   - Review all indexed pages
   - Check for errors or warnings
   - Verify excluded pages are intentional

---

## 🚨 Rollback Plan (If Needed)

If something goes wrong:

### Immediate Rollback:
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

### Partial Rollback:
- Keep canonical URL improvements
- Revert slug-based URLs only
- Fix specific issues

---

## 📝 Deployment Checklist Summary

### Before Deployment:
- [ ] All code changes tested locally
- [ ] Database has slug column
- [ ] Existing articles have slugs
- [ ] Build succeeds without errors
- [ ] Redirect strategy decided

### During Deployment:
- [ ] Code deployed successfully
- [ ] No build errors
- [ ] Site loads correctly
- [ ] Basic navigation works

### After Deployment:
- [ ] Canonical tags verified
- [ ] Sitemap resubmitted
- [ ] Old URLs redirect (if implemented)
- [ ] Google Search Console monitored
- [ ] No critical errors

---

## 🎯 Success Metrics

### Week 1:
- ✅ All pages load without errors
- ✅ Canonical tags present on all pages
- ✅ Sitemap includes all articles
- ✅ No increase in 404 errors

### Week 2-4:
- ✅ "Page with redirect" issue resolved
- ✅ New articles being indexed quickly
- ✅ Organic traffic stable or improving
- ✅ No duplicate content issues

### Month 1-3:
- ✅ Improved search rankings
- ✅ Better click-through rates
- ✅ Increased organic traffic
- ✅ More pages indexed

---

## 💡 Pro Tips

1. **Deploy during low-traffic hours** (late night/early morning)
2. **Have rollback plan ready** before deployment
3. **Monitor logs closely** for first 24 hours
4. **Communicate with team** about changes
5. **Document everything** for future reference

---

## ✅ Ready to Deploy?

Once you've completed all pre-deployment checks and have a redirect strategy in place, you're ready to deploy!

**Recommended**: Implement the redirect middleware before deploying to ensure smooth transition from old URLs to new slug-based URLs.

---

**Status**: 📋 CHECKLIST READY  
**Next Action**: Complete pre-deployment checks and deploy!
