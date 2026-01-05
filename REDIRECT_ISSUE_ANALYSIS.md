# Google Search Console: "Page with Redirect" Issue - Analysis & Solution

## Issue Report
**Date**: January 5, 2026  
**Status**: ⚠️ ACTIVE ON LIVE SITE  
**Impact**: Some pages not being indexed by Google

---

## What "Page with Redirect" Means

When Google Search Console reports "Page with redirect," it means:

1. **Googlebot found a URL** that it wants to index
2. **The URL redirects** to another URL (301, 302, 307, 308)
3. **Google cannot index** the redirecting page (only the final destination)

---

## Common Causes on gpaisa.in

### 1. **Trailing Slash Redirects** ⚠️
**Problem**: URLs with/without trailing slashes redirect to each other
```
https://gpaisa.in/gold-rate  → https://gpaisa.in/gold-rate/
OR
https://gpaisa.in/gold-rate/ → https://gpaisa.in/gold-rate
```

**Solution**: Ensure consistent URL structure (Next.js handles this by default)

### 2. **WWW vs Non-WWW Redirects** ⚠️
**Problem**: One version redirects to the other
```
https://www.gpaisa.in → https://gpaisa.in
OR
https://gpaisa.in → https://www.gpaisa.in
```

**Solution**: Choose one canonical version and stick with it

### 3. **HTTP to HTTPS Redirects** ✅ (This is GOOD)
**Problem**: HTTP redirects to HTTPS
```
http://gpaisa.in → https://gpaisa.in
```

**Note**: This is intentional and correct for security

### 4. **Old Article URLs** ⚠️ (FUTURE CONCERN)
**Problem**: After deploying slug-based URLs, old ID-based URLs will need redirects
```
/articles/33593 → /articles/hyderabad-gold-market-2026-trends-buying-guide
```

**Solution**: We'll implement 301 redirects (see below)

### 5. **Duplicate Content Redirects** ⚠️
**Problem**: Multiple URLs for the same content
```
/news → /articles
/blog → /news
```

**Solution**: Remove duplicate routes or add proper redirects

---

## Immediate Actions (Before Deployment)

### Step 1: Check Google Search Console
1. Go to **Search Console** → **Indexing** → **Pages**
2. Click on **"Page with redirect"** to see affected URLs
3. **Identify the pattern**: Are they article URLs? City pages? Other?

### Step 2: Verify Current Live Site
Check if these URLs are redirecting:
```bash
# Test from command line
curl -I https://gpaisa.in/gold-rate
curl -I https://www.gpaisa.in
curl -I https://gpaisa.in/articles/[some-id]
```

Look for:
- `301 Moved Permanently`
- `302 Found`
- `307 Temporary Redirect`
- `308 Permanent Redirect`

---

## Solution: Proper Redirect Strategy

### For New Deployment (Slug-based URLs)

We need to implement **301 redirects** from old article IDs to new slugs to:
1. Preserve SEO value from old URLs
2. Prevent 404 errors
3. Maintain user bookmarks

#### Implementation in `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost', 'mrvapygtxktrgilxqgqr.supabase.co'],
    },
    
    // Redirect old article IDs to new slugs
    async redirects() {
        return [
            // Example: Redirect old article ID to slug
            // You'll need to fetch this mapping from your database
            {
                source: '/articles/:id(\\d+)', // Match numeric IDs only
                destination: '/articles/redirect-handler?id=:id',
                permanent: true, // 301 redirect
            },
        ];
    },
};

export default nextConfig;
```

#### Create Redirect Handler API Route:

**File**: `/app/articles/redirect-handler/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { fetchArticleById } from '@/lib/supabaseApi';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.redirect(new URL('/news', request.url));
    }

    try {
        // Fetch article by ID to get its slug
        const article = await fetchArticleById(id);

        if (article && article.slug) {
            // 301 redirect to slug-based URL
            return NextResponse.redirect(
                new URL(`/articles/${article.slug}`, request.url),
                { status: 301 }
            );
        }

        // Article not found, redirect to news page
        return NextResponse.redirect(new URL('/news', request.url));
    } catch (error) {
        console.error('Redirect handler error:', error);
        return NextResponse.redirect(new URL('/news', request.url));
    }
}
```

---

## Alternative: Middleware Approach (More Efficient)

**File**: `/middleware.ts` (create in root directory)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Redirect old article IDs to slug-based URLs
    const articleIdMatch = pathname.match(/^\/articles\/(\d+)$/);
    
    if (articleIdMatch) {
        const articleId = articleIdMatch[1];
        
        // For now, redirect to news page
        // Later, you can fetch slug from database
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

---

## Recommended Deployment Strategy

### Phase 1: Pre-Deployment Checks ✅
1. ✅ Review Google Search Console for current redirect issues
2. ✅ Document all affected URLs
3. ✅ Test local changes thoroughly
4. ✅ Ensure all canonical URLs are absolute

### Phase 2: Deploy with Redirects 🚀
1. **Update `next.config.ts`** with redirect rules
2. **Create redirect handler** for old article IDs
3. **Deploy all changes** together
4. **Test redirects** immediately after deployment

### Phase 3: Monitor & Verify 📊
1. **Google Search Console**: Check for new indexing issues
2. **Test Old URLs**: Verify they redirect properly
3. **Monitor 404s**: Watch for broken links
4. **Resubmit Sitemap**: Force Google to re-crawl

---

## Quick Fix for Current Live Site

If the current redirect issue is urgent, check these common problems:

### 1. Check Vercel/Hosting Configuration
- Ensure no duplicate redirects in hosting settings
- Verify domain configuration (www vs non-www)
- Check SSL/HTTPS settings

### 2. Check for Duplicate Routes
Look for pages that might be redirecting:
```bash
# In your project
find app -name "page.tsx" | grep -E "(redirect|old)"
```

### 3. Remove Unnecessary Redirects
If you find any redirect logic in your code, review if it's needed

---

## Testing Checklist Before Deployment

- [ ] All new slug-based URLs work locally
- [ ] Canonical tags are absolute URLs
- [ ] Sitemap includes slug-based URLs
- [ ] Old article IDs redirect to slugs (if applicable)
- [ ] No redirect loops
- [ ] All internal links use slugs
- [ ] 404 page works correctly

---

## Post-Deployment Actions

### Week 1:
- Monitor Google Search Console daily
- Check for new indexing issues
- Verify redirect status codes (should be 301)
- Test user-reported broken links

### Week 2-4:
- Monitor organic traffic
- Check ranking changes
- Verify all pages are indexed
- Review crawl stats in GSC

---

## Summary

**Current Issue**: "Page with redirect" on live site (before our changes)  
**Likely Cause**: Existing redirects or configuration issues  
**Our Changes**: Will require 301 redirects from old IDs to slugs  
**Solution**: Implement proper redirect strategy before deployment  

**Next Steps**:
1. Check Google Search Console to identify affected URLs
2. Implement redirect handler for old article IDs
3. Deploy all changes together
4. Monitor and verify

---

## Need Help?

If you share the specific URLs from Google Search Console that are showing "Page with redirect," I can provide more targeted solutions!
