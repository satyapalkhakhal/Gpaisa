'use client';

import { AgriculturePrice } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AgricultureTableProps {
    data: AgriculturePrice[];
}

export default function AgricultureTable({ data }: AgricultureTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Crop
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            State
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mandi
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Change
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => {
                        const isPositive = item.change !== undefined && item.change >= 0;
                        return (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{item.crop}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{item.state}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{item.mandi}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="text-sm font-semibold text-gray-900">
                                        ₹{item.price.toLocaleString('en-IN')}
                                        <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {item.change !== undefined && (
                                        <div className={`inline-flex items-center text-sm font-medium ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
                                            {isPositive ? (
                                                <TrendingUp className="h-4 w-4 mr-1" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4 mr-1" />
                                            )}
                                            {isPositive ? '+' : ''}₹{Math.abs(item.change)}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {new Date(item.date).toLocaleDateString('en-IN', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
