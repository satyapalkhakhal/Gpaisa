# gpaisa.in - Financial Information Portal

A production-grade, SEO-optimized financial information website built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Live Market Updates**: Real-time Sensex, Nifty, and stock market data
- **Gold & Commodities**: 24K, 22K, 18K gold rates and commodity prices
- **Agriculture Prices**: Mandi prices across Indian states
- **Personal Finance**: Expert articles on investments, tax planning, and loans
- **Financial News**: Latest market and economic updates
- **Responsive Design**: Mobile-first, optimized for all devices
- **SEO Optimized**: Proper meta tags, semantic HTML, and structured data
- **Performance**: Fast loading with Next.js App Router

## 📁 Project Structure

```
gpaisa/
├── app/
│   ├── agriculture/          # Agriculture prices page
│   ├── articles/[id]/        # Dynamic article pages
│   ├── commodities/          # Gold & commodities page
│   ├── finance/              # Personal finance page
│   ├── markets/              # Stock markets page
│   ├── news/                 # News page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── AgricultureTable.tsx  # Agriculture price table
│   ├── ArticleCard.tsx       # Article card component
│   ├── ChartCard.tsx         # Chart component
│   ├── Footer.tsx            # Footer component
│   ├── Header.tsx            # Header with navigation
│   ├── MarketTicker.tsx      # Animated market ticker
│   └── PriceCard.tsx         # Price display card
├── lib/
│   └── mockData.ts           # Mock data for all sections
├── types/
│   └── index.ts              # TypeScript type definitions
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts 2.15
- **Icons**: Lucide React
- **Fonts**: Inter, Outfit (Google Fonts)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Design System

### Colors

- **Primary (Gold/Orange)**: Financial trust and warmth
  - `primary-600`: #e15a01
  - `primary-700`: #ba4104
  
- **Success (Green)**: Positive price changes
  - `success-600`: #16a34a
  
- **Danger (Red)**: Negative price changes
  - `danger-600`: #dc2626

### Typography

- **Display Font**: Outfit (headings)
- **Body Font**: Inter (content)

### Components

All components are reusable and follow consistent design patterns:
- Cards with hover effects
- Price change indicators (up/down)
- Responsive tables
- Interactive charts

## 📊 Data Structure

The application uses mock data defined in `lib/mockData.ts`:

- **Market Indices**: Sensex, Nifty, Bank Nifty, USD/INR
- **Stocks**: Top Indian stocks with live prices
- **Gold Rates**: 24K, 22K, 18K with per gram/tola prices
- **Commodities**: Gold, Silver, Crude Oil, Natural Gas, etc.
- **Agriculture**: Crop prices across states and mandis
- **Articles**: Financial content with categories

## 🔌 API Integration (Future)

Components are designed to be API-ready. To integrate real data:

1. Create API routes in `app/api/`
2. Replace mock data imports with API calls
3. Add loading states and error handling
4. Implement data caching with Next.js

## 🎯 SEO Features

- Semantic HTML structure
- Meta tags for all pages
- Open Graph tags
- Structured data ready
- Descriptive alt texts
- Fast Core Web Vitals

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚦 Performance

- Server-side rendering with Next.js
- Optimized images
- Code splitting
- CSS optimization with Tailwind
- Minimal JavaScript bundle

## 📄 Pages

1. **Home** (`/`): Overview with all sections
2. **Markets** (`/markets`): Stock market data and charts
3. **Commodities** (`/commodities`): Gold, silver, and commodity prices
4. **Agriculture** (`/agriculture`): Mandi prices with filters
5. **Finance** (`/finance`): Personal finance articles
6. **News** (`/news`): Financial news updates
7. **Article** (`/articles/[id]`): Individual article pages

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color palette.

### Fonts
Change fonts in `app/globals.css` by updating the Google Fonts import.

### Mock Data
Update `lib/mockData.ts` to change displayed data.

## 📝 License

This project is created for educational and demonstration purposes.

## 🤝 Contributing

This is a demo project. For production use, integrate with real financial APIs and add proper backend infrastructure.

---

**Built with ❤️ for the Indian financial community**
