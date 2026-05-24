'use client';

import { useState, FormEvent } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Mail } from 'lucide-react';

type SubscribeStatus = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

export default function NewsletterSubscribe({ variant = 'sidebar' }: { variant?: 'sidebar' | 'inline' }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<SubscribeStatus>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setStatus('loading');
        setMessage('');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            if (!res.ok) { setStatus('error'); setMessage(data.error || 'Something went wrong.'); return; }
            if (data.status === 'duplicate') { setStatus('duplicate'); setMessage(data.message); }
            else { setStatus('success'); setMessage(data.message); setEmail(''); }
        } catch { setStatus('error'); setMessage('Network error. Please try again.'); }
    };

    const resetOnChange = (val: string) => {
        setEmail(val);
        if (status === 'error' || status === 'duplicate') { setStatus('idle'); setMessage(''); }
    };

    const StatusMsg = () => {
        if (status === 'duplicate') return (
            <div className="flex items-center gap-1.5 mt-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg py-2 px-3">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /><span className="text-xs">{message}</span>
            </div>
        );
        if (status === 'error') return (
            <div className="flex items-center gap-1.5 mt-2 text-red-700 bg-red-50 border border-red-200 rounded-lg py-2 px-3">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /><span className="text-xs">{message}</span>
            </div>
        );
        return null;
    };

    const BtnContent = () => status === 'loading'
        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Subscribing...</>
        : <>Subscribe Now</>;

    if (status === 'success') {
        return (
            <div className={variant === 'sidebar'
                ? "bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-5 text-center border border-primary-200"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 sm:p-6"}>
                <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg py-3 px-4">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{message}</span>
                </div>
            </div>
        );
    }

    if (variant === 'sidebar') return (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-5 text-center border border-primary-200">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-primary-700" />
                <h4 className="font-bold text-primary-900">Stay Updated</h4>
            </div>
            <p className="text-sm text-primary-700 mb-4">Get the latest financial news delivered to your inbox.</p>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Your email" value={email} onChange={e => resetOnChange(e.target.value)}
                    required disabled={status === 'loading'}
                    className="w-full text-sm p-2.5 rounded-lg border border-primary-200 mb-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none disabled:opacity-50" />
                <button type="submit" disabled={status === 'loading' || !email.trim()}
                    className="w-full bg-primary-600 text-white font-bold text-xs uppercase py-2.5 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <BtnContent />
                </button>
                <StatusMsg />
            </form>
        </div>
    );

    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-gray-900">Stay Updated</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Get the latest financial news delivered to your inbox.</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input type="email" placeholder="Your email address" value={email} onChange={e => resetOnChange(e.target.value)}
                    required disabled={status === 'loading'}
                    className="flex-1 text-sm p-2.5 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none disabled:opacity-50" />
                <button type="submit" disabled={status === 'loading' || !email.trim()}
                    className="bg-emerald-600 text-white font-bold text-xs uppercase py-2.5 px-5 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap">
                    <BtnContent />
                </button>
            </form>
            <StatusMsg />
        </div>
    );
}
