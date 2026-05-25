'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'gpaisa_cookie_consent';

type ConsentStatus = 'accepted' | 'rejected' | null;

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const stored = localStorage.getItem(CONSENT_KEY) as ConsentStatus;
        if (!stored) {
            // Small delay so it doesn't flash on page load
            const timer = setTimeout(() => setVisible(true), 1200);
            return () => clearTimeout(timer);
        }

        // If already accepted, ensure GA consent is granted
        if (stored === 'accepted') {
            grantConsent();
        }
    }, []);

    function grantConsent() {
        // Google Consent Mode v2 — grant all
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted',
            });
        }
    }

    function denyConsent() {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
            });
        }
    }

    function dismiss(accepted: boolean) {
        setAnimateOut(true);
        localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'rejected');

        if (accepted) {
            grantConsent();
        } else {
            denyConsent();
        }

        // Wait for exit animation before unmounting
        setTimeout(() => setVisible(false), 400);
    }

    if (!visible) return null;

    return (
        <div
            className={`fixed bottom-0 inset-x-0 z-[9999] px-4 pb-4 sm:pb-6 sm:px-6 lg:px-8 pointer-events-none
                ${animateOut ? 'animate-cookie-out' : 'animate-cookie-in'}`}
        >
            <div className="pointer-events-auto mx-auto max-w-4xl">
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/10">
                    {/* Subtle top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

                    <div className="px-5 py-5 sm:px-6 sm:py-5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Icon + Text */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                <span className="text-2xl flex-shrink-0 mt-0.5">🍪</span>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                                        We value your privacy
                                    </h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        We use cookies and similar technologies to enhance your experience, analyze site traffic, and serve personalized content and ads.
                                        By clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
                                        <Link
                                            href="/privacy-policy"
                                            className="text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-800 transition-colors"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-2.5 flex-shrink-0 sm:ml-2">
                                <button
                                    id="cookie-reject-btn"
                                    onClick={() => dismiss(false)}
                                    className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 whitespace-nowrap"
                                >
                                    Reject All
                                </button>
                                <button
                                    id="cookie-accept-btn"
                                    onClick={() => dismiss(true)}
                                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/20 transition-all duration-200 whitespace-nowrap hover:shadow-md hover:shadow-emerald-600/25"
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
