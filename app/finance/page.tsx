'use client';

import { useState } from 'react';
import ArticleCard from '@/components/ArticleCard';
import { articles } from '@/lib/mockData';
import { BookOpen, Filter } from 'lucide-react';

const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'investments', label: 'Investments' },
    { value: 'tax-saving', label: 'Tax Saving' },
    { value: 'loans', label: 'Loans' },
    { value: 'basics', label: 'Basics' },
    { value: 'news', label: 'News' },
];

export default function FinancePage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredArticles = selectedCategory === 'all'
        ? articles
        : articles.filter(article => article.category === selectedCategory);

    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <BookOpen className="h-10 w-10 text-primary-600" />
                        <h1 className="text-4xl font-display font-bold text-gray-900">Personal Finance</h1>
                    </div>
                    <p className="text-lg text-gray-600">Expert advice on investments, tax planning, loans, and financial basics</p>
                </div>

                {/* Category Filter */}
                <section className="mb-8">
                    <div className="card">
                        <div className="flex items-center space-x-3 mb-4">
                            <Filter className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-display font-semibold text-gray-900">Filter by Category</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {categories.map(category => (
                                <button
                                    key={category.value}
                                    onClick={() => setSelectedCategory(category.value)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category.value
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-semibold">{filteredArticles.length}</span> articles
                    </p>
                </div>

                {/* Articles Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </section>

                {/* Featured Topics */}
                <section className="mt-12">
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">Popular Topics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card bg-blue-50 border-blue-200">
                            <h3 className="font-display font-semibold text-gray-900 mb-2">Investment Strategies</h3>
                            <p className="text-sm text-gray-600">Learn about mutual funds, stocks, bonds, and portfolio diversification.</p>
                        </div>
                        <div className="card bg-green-50 border-green-200">
                            <h3 className="font-display font-semibold text-gray-900 mb-2">Tax Planning</h3>
                            <p className="text-sm text-gray-600">Maximize your savings with Section 80C, 80D, and other tax benefits.</p>
                        </div>
                        <div className="card bg-purple-50 border-purple-200">
                            <h3 className="font-display font-semibold text-gray-900 mb-2">Loan Management</h3>
                            <p className="text-sm text-gray-600">Compare home loans, personal loans, and understand EMI calculations.</p>
                        </div>
                        <div className="card bg-orange-50 border-orange-200">
                            <h3 className="font-display font-semibold text-gray-900 mb-2">Financial Basics</h3>
                            <p className="text-sm text-gray-600">Start your financial journey with budgeting and savings tips.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
