'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { MandiPrice } from '@/lib/agriApi';

export default function AgricultureFilters() {
    const [states, setStates] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    const [mandis, setMandis] = useState<string[]>([]);
    const [commodities, setCommodities] = useState<string[]>([]);

    const [selectedState, setSelectedState] = useState<string>('all');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [selectedMandi, setSelectedMandi] = useState<string>('all');
    const [selectedCommodity, setSelectedCommodity] = useState<string>('all');

    const [prices, setPrices] = useState<MandiPrice[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch initial data
    useEffect(() => {
        fetchInitialData();
    }, []);

    // Fetch districts when state changes
    useEffect(() => {
        if (selectedState !== 'all') {
            fetchDistricts(selectedState);
        } else {
            setDistricts([]);
            setSelectedDistrict('all');
        }
        setMandis([]);
        setSelectedMandi('all');
    }, [selectedState]);

    // Fetch mandis when district changes
    useEffect(() => {
        if (selectedState !== 'all' && selectedDistrict !== 'all') {
            fetchMandis(selectedState, selectedDistrict);
        } else {
            setMandis([]);
            setSelectedMandi('all');
        }
    }, [selectedDistrict]);

    // Fetch prices when any filter changes
    useEffect(() => {
        if (selectedState !== 'all' || selectedDistrict !== 'all' ||
            selectedMandi !== 'all' || selectedCommodity !== 'all') {
            fetchPrices();
        }
    }, [selectedState, selectedDistrict, selectedMandi, selectedCommodity]);

    const fetchInitialData = async () => {
        try {
            const res = await fetch('/api/agriculture/states');
            const data = await res.json();
            setStates(data.states || []);
            setCommodities(data.commodities || []);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    const fetchDistricts = async (state: string) => {
        try {
            const res = await fetch(`/api/agriculture/districts?state=${encodeURIComponent(state)}`);
            const data = await res.json();
            setDistricts(data.districts || []);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const fetchMandis = async (state: string, district: string) => {
        try {
            const res = await fetch(`/api/agriculture/mandis?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`);
            const data = await res.json();
            setMandis(data.mandis || []);
        } catch (error) {
            console.error('Error fetching mandis:', error);
        }
    };

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedState !== 'all') params.append('state', selectedState);
            if (selectedDistrict !== 'all') params.append('district', selectedDistrict);
            if (selectedMandi !== 'all') params.append('market', selectedMandi);
            if (selectedCommodity !== 'all') params.append('commodity', selectedCommodity);

            const res = await fetch(`/api/agriculture/prices?${params.toString()}`);
            const data = await res.json();
            setPrices(data.records || []);
        } catch (error) {
            console.error('Error fetching prices:', error);
            setPrices([]);
        } finally {
            setLoading(false);
        }
    };

    const hasActiveFilters = selectedState !== 'all' || selectedDistrict !== 'all' ||
        selectedMandi !== 'all' || selectedCommodity !== 'all';

    const clearFilters = () => {
        setSelectedState('all');
        setSelectedDistrict('all');
        setSelectedMandi('all');
        setSelectedCommodity('all');
        setPrices([]);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Quick Price Lookup</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* State */}
                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State
                    </label>
                    <select
                        id="state"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="all">All States</option>
                        {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                {/* District */}
                <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                        District
                    </label>
                    <select
                        id="district"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={selectedState === 'all'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="all">All Districts</option>
                        {districts.map(district => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                </div>

                {/* Mandi/Market */}
                <div>
                    <label htmlFor="mandi" className="block text-sm font-medium text-gray-700 mb-2">
                        Market (Mandi)
                    </label>
                    <select
                        id="mandi"
                        value={selectedMandi}
                        onChange={(e) => setSelectedMandi(e.target.value)}
                        disabled={selectedDistrict === 'all'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="all">All Markets</option>
                        {mandis.map(mandi => (
                            <option key={mandi} value={mandi}>{mandi}</option>
                        ))}
                    </select>
                </div>

                {/* Commodity */}
                <div>
                    <label htmlFor="commodity" className="block text-sm font-medium text-gray-700 mb-2">
                        Commodity
                    </label>
                    <select
                        id="commodity"
                        value={selectedCommodity}
                        onChange={(e) => setSelectedCommodity(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="all">All Commodities</option>
                        {commodities.map(commodity => (
                            <option key={commodity} value={commodity}>{commodity}</option>
                        ))}
                    </select>
                </div>
            </div>

            {hasActiveFilters && (
                <div className="mt-4 flex items-center justify-between">
                    <button
                        onClick={clearFilters}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                        Clear All Filters
                    </button>
                    <p className="text-sm text-gray-600">
                        {loading ? 'Loading...' : `${prices.length} results found`}
                    </p>
                </div>
            )}

            {/* Filtered Results */}
            {prices.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Filtered Results</h3>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Market</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Commodity</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Modal Price</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {prices.slice(0, 10).map((price, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">{price.market}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{price.commodity}</td>
                                            <td className="px-4 py-3 text-sm text-right font-bold text-green-700">
                                                ₹{price.modal_price}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{price.arrival_date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {prices.length > 10 && (
                            <div className="bg-gray-100 px-4 py-2 text-center text-sm text-gray-600">
                                Showing 10 of {prices.length} results
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
