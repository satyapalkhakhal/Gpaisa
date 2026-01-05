import Link from 'next/link';
import { Article } from '@/types';
import { Calendar, Clock, User } from 'lucide-react';

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const categoryColors = {
        investments: 'bg-blue-100 text-blue-800',
        'tax-saving': 'bg-green-100 text-green-800',
        loans: 'bg-purple-100 text-purple-800',
        basics: 'bg-orange-100 text-orange-800',
        news: 'bg-red-100 text-red-800',
    };

    const categoryLabels = {
        investments: 'Investments',
        'tax-saving': 'Tax Saving',
        loans: 'Loans',
        basics: 'Basics',
        news: 'News',
    };

    return (
        <Link href={`/articles/${article.slug}`}>
            <div className="card group cursor-pointer h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[article.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}`}>
                        {categoryLabels[article.category as keyof typeof categoryLabels] || article.category}
                    </span>
                    <span className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime}
                    </span>
                </div>

                <h3 className="text-lg font-display font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {article.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {article.author}
                    </span>
                    <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>
        </Link>
    );
}
