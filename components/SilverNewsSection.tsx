'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, Clock, ArrowRight } from 'lucide-react';

interface SilverNewsArticle {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    published_at: string;
    date: string;
    read_time: string;
}

export default function SilverNewsSection() {
    const [articles, setArticles] = useState<SilverNewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
                if (!supabaseUrl || !supabaseKey) { setLoading(false); return; }

                const response = await fetch(
                    `${supabaseUrl}/rest/v1/articles?select=id,title,slug,image_url,published_at,date,read_time&or=(content.ilike.*silver*,title.ilike.*silver*)&order=published_at.desc&limit=6`,
                    { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' } }
                );
                if (response.ok) {
                    const data = await response.json();
                    setArticles(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Failed to fetch silver news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) {
        return (
            <section className="mb-12">
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-5 sm:p-6 border border-gray-200/60">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200/50 rounded w-1/3" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white/50 rounded-xl" />)}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (articles.length === 0) return null;

    return (
        <section className="mb-12" aria-labelledby="silver-news-heading" id="silver-news">
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-5 sm:p-6 border border-gray-200/60">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-slate-500 to-gray-600" />
                        <Newspaper className="h-5 w-5 text-slate-600" />
                        <h2 id="silver-news-heading" className="text-lg font-bold text-gray-900 uppercase tracking-wide">Latest Silver News</h2>
                    </div>
                    <Link href="/news" className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1 transition-colors">
                        View All <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {articles.map(article => (
                        <Link key={article.id} href={`/articles/${article.slug}`} className="group flex gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                            <div className="w-20 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                                {article.image_url ? (
                                    <div className="relative w-full h-full">
                                        <Image src={article.image_url} alt={article.title} fill className="object-cover" sizes="80px" />
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-slate-300 flex items-center justify-center text-gray-500 text-xs font-bold">SILVER</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-slate-700 transition-colors">{article.title}</h3>
                                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-400">
                                    <span>{article.date || new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    {article.read_time && <><span>•</span><span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{article.read_time}</span></>}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
