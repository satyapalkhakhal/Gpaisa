'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import AgricultureTable from '@/components/AgricultureTable';
import LastUpdatedTime from '@/components/LastUpdatedTime';
import { agriculturePrices } from '@/lib/mockData';
import { Wheat, Filter } from 'lucide-react';

export default function AgriculturePage() {
    const [selectedState, setSelectedState] = useState<string>('all');
    const [selectedCrop, setSelectedCrop] = useState<string>('all');

    // Get unique states and crops for filters
    const states = ['all', ...Array.from(new Set(agriculturePrices.map(p => p.state)))];
    const crops = ['all', ...Array.from(new Set(agriculturePrices.map(p => p.crop)))];

    // Filter data
    const filteredData = agriculturePrices.filter(price => {
        const stateMatch = selectedState === 'all' || price.state === selectedState;
        const cropMatch = selectedCrop === 'all' || price.crop === selectedCrop;
        return stateMatch && cropMatch;
    });

    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <Wheat className="h-10 w-10 text-primary-600" />
                        <h1 className="text-4xl font-display font-bold text-gray-900">Agriculture Prices</h1>
                    </div>
                    <p className="text-lg text-gray-600">Live mandi prices for crops across India</p>
                </div>

                {/* Filters */}
                <section className="mb-8">
                    <div className="card">
                        <div className="flex items-center space-x-3 mb-4">
                            <Filter className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-display font-semibold text-gray-900">Filters</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                                    Select State
                                </label>
                                <select
                                    id="state"
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    {states.map(state => (
                                        <option key={state} value={state}>
                                            {state === 'all' ? 'All States' : state}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="crop" className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Crop
                                </label>
                                <select
                                    id="crop"
                                    value={selectedCrop}
                                    onChange={(e) => setSelectedCrop(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    {crops.map(crop => (
                                        <option key={crop} value={crop}>
                                            {crop === 'all' ? 'All Crops' : crop}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {(selectedState !== 'all' || selectedCrop !== 'all') && (
                            <div className="mt-4">
                                <button
                                    onClick={() => {
                                        setSelectedState('all');
                                        setSelectedCrop('all');
                                    }}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-semibold">{filteredData.length}</span> results
                    </p>
                </div>

                {/* Agriculture Table */}
                <section className="card overflow-hidden p-0">
                    {filteredData.length > 0 ? (
                        <AgricultureTable data={filteredData} />
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-gray-500">No results found. Try adjusting your filters.</p>
                        </div>
                    )}
                </section>

                {/* Information Box */}
                <div className="mt-8 card bg-green-50 border-green-200">
                    <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">About Mandi Prices</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                        <p>
                            Mandi prices are the rates at which agricultural produce is traded in Agricultural Produce Market Committees (APMCs) across India.
                        </p>
                        <p>
                            Prices vary based on quality, demand-supply dynamics, and regional factors. The rates shown are indicative and may vary at different mandis.
                        </p>
                        <p className="text-xs text-gray-600 mt-4">
                            Note: Prices are updated regularly but may not reflect real-time changes. Always verify with your local mandi.
                        </p>
                    </div>
                </div>

                {/* Last Updated */}
                <div className="mt-8 text-center">
                    <LastUpdatedTime />
                </div>
            </div>
        </div>
    );
}
