// Market Data Types
export interface MarketIndex {
    name: string;
    symbol: string;
    value: number;
    change: number;
    changePercent: number;
    lastUpdated: string;
}

export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    marketCap: string;
}

// Commodity Types
export interface GoldRate {
    purity: '24K' | '22K' | '18K';
    pricePerGram: number;
    pricePerTola: number;
    change: number;
    changePercent: number;
}

export interface Commodity {
    name: string;
    symbol: string;
    price: number;
    unit: string;
    change: number;
    changePercent: number;
}

// Gold History Types
export interface GoldHistoryItem {
    date: string;
    rate: string;
    change: string;
}

export interface GoldHistoryResponse {
    success: boolean;
    data: GoldHistoryItem[];
}

// Gold Calculator Types
export interface GoldCalculatorData {
    city: string;
    grams: number;
    carat: string;
    price: string;
    difference: string;
    percentage: string;
}

export interface GoldCalculatorResponse {
    success: boolean;
    data: GoldCalculatorData;
}

export type IndianCity =
    | "Delhi"
    | "Chennai"
    | "Mumbai"
    | "Pune"
    | "Hyderabad"
    | "Bangalore"
    | "Coimbatore"
    | "Kolkata"
    | "Ahmedabad"
    | "Kerala";

// Agriculture Types
export interface AgriculturePrice {
    id: string;
    crop: string;
    state: string;
    mandi: string;
    price: number;
    unit: string;
    date: string;
    change?: number;
}

// Article Types
export interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: 'investments' | 'tax-saving' | 'loans' | 'basics' | 'news' | string;
    author: string;
    publishedAt: string;
    readTime: string;
    image?: string;
    content?: string;
    tags?: string[];
    featured_image_url?: string;
    published_at?: string;
}

// Chart Data Types
export interface ChartDataPoint {
    time: string;
    value: number;
}
