// REST India API Service for Agriculture Data
import { INDIA_STATES, COMMON_COMMODITIES, getDistrictsForState } from './constants';

// Government of India Mandi Prices API
const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

export interface MandiPrice {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    arrival_date: string;
    min_price: string;
    max_price: string;
    modal_price: string;
}

export interface StateResponse {
    states: string[];
}

export interface DistrictResponse {
    districts: string[];
}

/**
 * Get all Indian states and union territories
 * Uses local constants for better performance
 */
export async function getStates(): Promise<string[]> {
    return [...INDIA_STATES];
}

/**
 * Get districts for a specific state
 * Uses local constants for better performance
 */
export async function getDistrictsByState(state: string): Promise<string[]> {
    return getDistrictsForState(state);
}

/**
 * Get mandis/markets for a specific district
 * Fetches from Government API and returns unique market names
 */
export async function getMandisByDistrict(state: string, district: string): Promise<string[]> {
    try {
        const data = await fetchMandiPrices({ state, district, limit: 1000 });
        const mandis = [...new Set(data.records.map(r => r.market))].filter(Boolean).sort();
        return mandis;
    } catch (error) {
        console.log('Error fetching mandis:', error);
        return [];
    }
}

/**
 * Get commodities list
 * Uses local constants for better performance
 */
export async function getCommodities(): Promise<string[]> {
    return [...COMMON_COMMODITIES];
}

/**
 * Fetch mandi prices with filters from Government of India API
 */
export async function fetchMandiPrices(filters?: {
    state?: string;
    district?: string;
    market?: string;
    commodity?: string;
    variety?: string;
    grade?: string;
    limit?: number;
    offset?: number;
}): Promise<{ records: MandiPrice[]; total: number }> {
    try {
        const params = new URLSearchParams({
            'api-key': API_KEY,
            format: 'json',
            limit: (filters?.limit || 100).toString(),
            offset: (filters?.offset || 0).toString(),
        });

        // Add filters with correct parameter names for Government API
        if (filters?.state) {
            params.append('filters[state.keyword]', filters.state);
        }
        if (filters?.district) {
            params.append('filters[district]', filters.district);
        }
        if (filters?.market) {
            params.append('filters[market]', filters.market);
        }
        if (filters?.commodity) {
            params.append('filters[commodity]', filters.commodity);
        }
        if (filters?.variety) {
            params.append('filters[variety]', filters.variety);
        }
        if (filters?.grade) {
            params.append('filters[grade]', filters.grade);
        }

        const url = `${BASE_URL}?${params.toString()}`;

        const response = await fetch(url, {
            next: { revalidate: 86400 }, // Cache for 24 hours (1 day)
            cache: 'force-cache'
        });

        if (!response.ok) {
            console.log(`Government API Error: ${response.status} ${response.statusText}`);
            console.log(`Request URL: ${url}`);

            // Try to get error details from response
            try {
                const errorText = await response.text();
                console.log('API Error Response:', errorText.substring(0, 500));
            } catch (e) {
                // Ignore if can't read error
            }

            // Return empty data instead of crashing
            return { records: [], total: 0 };
        }

        const data = await response.json();

        // Validate response structure
        if (!data || typeof data !== 'object') {
            console.log('Invalid API response structure');
            return { records: [], total: 0 };
        }

        return {
            records: data.records || [],
            total: data.total || 0
        };
    } catch (error) {
        console.log('Error fetching mandi prices:', error);

        // Log detailed error information
        if (error instanceof Error) {
            console.log('Error details:', {
                message: error.message,
                name: error.name,
                filters: filters
            });
        }

        return { records: [], total: 0 };
    }
}

/**
 * Format state name for URL (lowercase, replace spaces with hyphens)
 */
export function formatStateForUrl(state: string): string {
    return state.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Format state name from URL
 */
export function formatStateFromUrl(urlState: string): string {
    return urlState
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
