// Owned list of silver rate cities and their AngelOne price symbols — dependency-free so
// client components can import it. Snapshot of AngelOne's silverCityList (2026-10-22);
// see lib/silverCities.ts for how it is used and how to refresh it.
import type { SilverCity } from '@/types';

export const SILVER_CITIES: SilverCity[] = [
    { city: 'Ahmedabad', slug: 'ahmedabad', symbol: 'XAG-AHME' },
    { city: 'Bangalore', slug: 'bangalore', symbol: 'XAG-BANG' },
    { city: 'Chandigarh', slug: 'chandigarh', symbol: 'XAG-CHAN' },
    { city: 'Chennai', slug: 'chennai', symbol: 'XAG-CHEN' },
    { city: 'Coimbatore', slug: 'coimbatore', symbol: 'XAG-COIM' },
    { city: 'Hyderabad', slug: 'hyderabad', symbol: 'XAG-HYDE' },
    { city: 'Jaipur', slug: 'jaipur', symbol: 'XAG-JAIP' },
    { city: 'Kolkata', slug: 'kolkata', symbol: 'XAG-KOLK' },
    { city: 'Lucknow', slug: 'lucknow', symbol: 'XAG-LUCK' },
    { city: 'Madurai', slug: 'madurai', symbol: 'XAG-MADU' },
    { city: 'Mangalore', slug: 'mangalore', symbol: 'XAG-MANG' },
    { city: 'Mumbai', slug: 'mumbai', symbol: 'XAG-MUMB' },
    { city: 'Mysore', slug: 'mysore', symbol: 'XAG-MYSO' },
    { city: 'Nagpur', slug: 'nagpur', symbol: 'XAG-NAGP' },
    { city: 'Patna', slug: 'patna', symbol: 'XAG-PATN' },
    { city: 'Pune', slug: 'pune', symbol: 'XAG-PUNE' },
    { city: 'Salem', slug: 'salem', symbol: 'XAG-SALE' },
    { city: 'Vijayawada', slug: 'vijayawada', symbol: 'XAG-VIJA' },
];
