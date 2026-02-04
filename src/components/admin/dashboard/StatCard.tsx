/**
 * Stat Card Component
 * Displays a single dashboard metric
 */

import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'gold' | 'green' | 'blue' | 'red';
}

const colorClasses = {
    gold: 'bg-gold/10 text-gold border-gold/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function StatCard({ title, value, icon, trend, color = 'gold' }: StatCardProps) {
    return (
        <div className="bg-[#111] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>

                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={trend.isPositive ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'}
                                />
                            </svg>
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default StatCard;
