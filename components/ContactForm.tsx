'use client';

import { useState, FormEvent } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '', email: '', subject: '', category: '', message: '',
    });
    const [privacy, setPrivacy] = useState(false);
    const [status, setStatus] = useState<FormStatus>('idle');
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (status === 'error') { setStatus('idle'); setMessage(''); }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!privacy) { setStatus('error'); setMessage('Please agree to the Privacy Policy.'); return; }
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) { setStatus('error'); setMessage(data.error || 'Failed to send message.'); return; }
            setStatus('success');
            setMessage(data.message || 'Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', category: '', message: '' });
            setPrivacy(false);
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
                <div className="text-center py-8">
                    <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <button onClick={() => { setStatus('idle'); setMessage(''); }}
                        className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                        Send Another Message
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                        <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                            disabled={status === 'loading'}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                            placeholder="Your name" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                        <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                            disabled={status === 'loading'}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                            placeholder="your.email@example.com" />
                    </div>
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                    <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange}
                        disabled={status === 'loading'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                        placeholder="What is this regarding?" />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange}
                        disabled={status === 'loading'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50">
                        <option value="">Select a category</option>
                        <option value="general">General Inquiry</option>
                        <option value="feedback">Feedback</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="advertising">Advertising</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                    <textarea id="message" name="message" rows={6} required value={formData.message} onChange={handleChange}
                        disabled={status === 'loading'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:opacity-50"
                        placeholder="Tell us more about your inquiry..." />
                </div>

                <div className="flex items-start">
                    <input type="checkbox" id="privacy" checked={privacy} onChange={e => setPrivacy(e.target.checked)}
                        disabled={status === 'loading'} className="mt-1 mr-2" />
                    <label htmlFor="privacy" className="text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="/privacy-policy" className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</a>
                        {' '}and consent to being contacted regarding my inquiry.
                    </label>
                </div>

                {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg py-3 px-4">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{message}</span>
                    </div>
                )}

                <button type="submit" disabled={status === 'loading'}
                    className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {status === 'loading' ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
                    ) : (
                        <><Send className="w-5 h-5 mr-2" /> Send Message</>
                    )}
                </button>
            </form>
            <p className="text-sm text-gray-500 mt-6 text-center">
                We typically respond within 24-48 hours during business days.
            </p>
        </div>
    );
}
