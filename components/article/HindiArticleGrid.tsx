import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { Article } from '@/lib/articlesApi';
import { articlePath } from '@/lib/articleLocale';

// Card grid for Hindi article listings (/hi and /hi/category/[slug]).
export default function HindiArticleGrid({ articles, priorityCount = 3 }: { articles: Article[]; priorityCount?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
                <Link
                    key={article.id}
                    href={articlePath('hi', article.slug)}
                    className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
                >
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                        {article.image_url && (
                            <Image
                                src={article.image_url}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                priority={i < priorityCount}
                            />
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug mb-2">
                            {article.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <time dateTime={new Date(article.published_at).toISOString()}>
                                {new Date(article.published_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </time>
                            {article.read_time && (
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.read_time}</span>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
