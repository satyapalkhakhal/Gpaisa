import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceCardProps {
    title: string;
    value: string | number;
    change?: number;
    changePercent?: number;
    subtitle?: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'gold' | 'silver' | 'success' | 'danger';
    children?: React.ReactNode;
}

export default function PriceCard({
    title,
    value,
    change,
    changePercent,
    subtitle,
    icon,
    variant = 'default',
    children
}: PriceCardProps) {
    const isPositive = change !== undefined && change >= 0;

    const variantStyles = {
        default: 'bg-white border-gray-200',
        gold: 'bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200',
        silver: 'bg-gradient-to-br from-gray-50 to-gray-200 border-gray-300',
        success: 'bg-gradient-to-br from-success-50 to-success-100 border-success-200',
        danger: 'bg-gradient-to-br from-danger-50 to-danger-100 border-danger-200',
    };

    return (
        <div className={`card ${variantStyles[variant]}`}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
                {icon && <div className="text-gray-400">{icon}</div>}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mt-2">
                <div>
                    <p className="text-2xl font-display font-bold text-gray-900 break-words">
                        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
                    </p>
                </div>

                {change !== undefined && changePercent !== undefined && (
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-md self-start sm:self-auto ${isPositive ? 'price-up' : 'price-down'}`}>
                        {isPositive ? (
                            <TrendingUp className="h-4 w-4" />
                        ) : (
                            <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-semibold whitespace-nowrap">
                            {isPositive ? '+' : ''}{change.toFixed(2)}
                        </span>
                        <span className="text-xs whitespace-nowrap">
                            ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
                        </span>
                    </div>
                )}
            </div>

            {children && (
                <div className="mt-3 pt-3 border-t border-black/5">
                    {children}
                </div>
            )}
        </div>
    );
}
