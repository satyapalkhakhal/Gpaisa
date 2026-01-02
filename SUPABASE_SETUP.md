# Supabase News Integration

## Overview
The homepage now fetches real news articles from Supabase instead of using mock data.

## Setup Instructions

### 1. Create Environment File
Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

### 2. Add Your Supabase Credentials
Edit `.env.local` and add your Supabase URL and API key:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Database Schema

Your Supabase database should have the following tables:

#### Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Articles Table
```sql
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    category_id UUID REFERENCES categories(id),
    status TEXT DEFAULT 'draft',  -- 'draft' or 'published'
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author TEXT,
    read_time TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Required Categories

Create these categories in your Supabase database with the following slugs:

| Category Name | Slug | Description |
|--------------|------|-------------|
| Top News | `top-news` | Main/featured news stories |
| Business | `business` | Business and finance news |
| World Affairs | `world-affairs` | International news |

Example SQL:
```sql
INSERT INTO categories (name, slug, display_order, is_active) VALUES
('Top News', 'top-news', 1, true),
('Business', 'business', 2, true),
('World Affairs', 'world-affairs', 3, true);
```

### 5. API Endpoints Used

The integration uses these Supabase REST API endpoints:

- **Get Categories**: `GET /rest/v1/categories?is_active=eq.true&order=display_order.asc`
- **Get Articles by Category**: `GET /rest/v1/articles?category_id=eq.{categoryId}&status=eq.published&order=published_at.desc&limit=10`

## Features

- ✅ **Top Stories Section**: Fetches from "Top News" category
- ✅ **Business News Section**: Fetches from "Business" category  
- ✅ **International News Section**: Fetches from "World Affairs" category
- ✅ **Automatic Fallback**: Uses mock data if API fails
- ✅ **Image Support**: Displays article images from `image_url` field
- ✅ **Caching**: 10-minute revalidation for optimal performance

## Homepage Sections Mapping

| Homepage Section | Supabase Category Slug |
|-----------------|------------------------|
| Top Stories | `top-news` |
| Business News | `business` |
| International News | `world-affairs` |

## Testing

1. Start the development server:
```bash
npm run dev
```

2. Visit `http://localhost:3000`

3. Check the browser console for any Supabase errors

4. If Supabase is not configured or fails, the site will automatically fall back to mock data

## Troubleshooting

- **No articles showing**: Check that you have published articles in your Supabase database with `status='published'`
- **Wrong categories**: Verify category slugs match exactly (`top-news`, `business`, `world-affairs`)
- **API errors**: Check your Supabase URL and API key in `.env.local`
- **Images not loading**: Verify `image_url` field contains valid URLs
