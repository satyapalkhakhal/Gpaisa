import { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Disclaimer - gpaisa.in',
    description: 'Important disclaimer for gpaisa.in - Understand the limitations and risks associated with using financial information from our website.',
    alternates: {
        canonical: 'https://www.gpaisa.in/disclaimer',
    },
};

export const dynamic = 'force-static'; // Fully static page, cached permanently

export default function DisclaimerPage() {
    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
                    {/* Header with Warning Icon */}
                    <div className="flex items-center mb-6">
                        <div className="bg-yellow-100 p-3 rounded-full mr-4">
                            <AlertTriangle className="w-8 h-8 text-yellow-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Disclaimer</h1>
                            <p className="text-gray-600 mt-1">
                                <strong>Last Updated:</strong> May 10, 2026
                            </p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
                        <p className="text-gray-800 font-semibold mb-2">PLEASE READ CAREFULLY</p>
                        <p className="text-gray-700">
                            The information provided on gpaisa.in is for general informational and educational purposes only. By using this website, you acknowledge and accept the terms of this disclaimer.
                        </p>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Not Financial Advice</h2>
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                <p className="text-gray-800 font-semibold mb-2">IMPORTANT:</p>
                                <p className="text-gray-700">
                                    The content on this website does NOT constitute financial, investment, trading, tax, legal, or professional advice of any kind. We are NOT financial advisors, certified financial planners, registered investment advisors, or licensed brokers.
                                </p>
                            </div>

                            <p className="text-gray-700 mb-4">
                                All information provided on gpaisa.in, including but not limited to:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Gold and silver rates</li>
                                <li>Stock market data and indices</li>
                                <li>Commodity prices</li>
                                <li>Agricultural market prices</li>
                                <li>Financial news and articles</li>
                                <li>Investment insights and analysis</li>
                            </ul>
                            <p className="text-gray-700">
                                ...is for informational purposes only and should not be relied upon as the sole basis for making financial decisions.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Consult Professional Advisors</h2>
                            <p className="text-gray-700 mb-4">
                                <strong>Before making any financial or investment decisions, you should:</strong>
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Consult with a qualified and licensed financial advisor</li>
                                <li>Seek advice from certified tax professionals for tax-related matters</li>
                                <li>Conduct your own research and due diligence</li>
                                <li>Consider your individual financial situation, goals, and risk tolerance</li>
                                <li>Verify all information from official and authoritative sources</li>
                            </ul>
                            <p className="text-gray-700">
                                Every individual&apos;s financial situation is unique, and what may be suitable for one person may not be appropriate for another.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Investment Risks</h2>
                            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                                <p className="text-gray-800 font-semibold mb-2">RISK WARNING:</p>
                                <p className="text-gray-700">
                                    All investments involve risk, including the potential loss of principal. Past performance does not guarantee future results.
                                </p>
                            </div>

                            <p className="text-gray-700 mb-4">
                                <strong>You acknowledge that:</strong>
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Stock markets, commodities, and precious metals are subject to market volatility</li>
                                <li>Prices can fluctuate significantly and unpredictably</li>
                                <li>You may lose some or all of your invested capital</li>
                                <li>Historical data and trends do not predict future performance</li>
                                <li>Economic conditions, political events, and other factors can impact markets</li>
                                <li>You are solely responsible for your investment decisions and their outcomes</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Accuracy of Information</h2>
                            <p className="text-gray-700 mb-4">
                                While we make every effort to provide accurate, current, and reliable information, we make no warranties or guarantees regarding:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>Accuracy:</strong> Information may contain errors, inaccuracies, or omissions</li>
                                <li><strong>Completeness:</strong> Content may not include all relevant information</li>
                                <li><strong>Timeliness:</strong> Market data may be delayed or outdated</li>
                                <li><strong>Reliability:</strong> Third-party data sources may be unreliable</li>
                            </ul>

                            <p className="text-gray-700 mb-4">
                                <strong>Market Data Disclaimer:</strong>
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Gold and silver rates are indicative and may vary by location and vendor</li>
                                <li>Stock market data may be delayed by 15-20 minutes or more</li>
                                {/* <li>Agricultural prices are sourced from various mandis and may not reflect real-time rates</li> */}
                                <li>Currency exchange rates are approximate and subject to change</li>
                            </ul>

                            <p className="text-gray-700">
                                Always verify critical information from official sources such as stock exchanges, commodity boards, and authorized dealers before making decisions.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. No Guarantees or Warranties</h2>
                            <p className="text-gray-700 mb-4">
                                gpaisa.in is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We make no representations or warranties of any kind, express or implied, including but not limited to:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Warranties of merchantability or fitness for a particular purpose</li>
                                <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
                                <li>Warranties that the website will be uninterrupted, secure, or error-free</li>
                                <li>Warranties regarding the results obtained from using the website</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Content and Links</h2>
                            <p className="text-gray-700 mb-4">
                                Our website may contain links to third-party websites, advertisements, or content from external sources. We do not:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Endorse or recommend any third-party products, services, or websites</li>
                                <li>Verify the accuracy of third-party content</li>
                                <li>Control or assume responsibility for third-party websites</li>
                                <li>Guarantee the quality or reliability of external resources</li>
                            </ul>
                            <p className="text-gray-700">
                                Your use of third-party websites and services is at your own risk and subject to their terms and conditions.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. No Liability</h2>
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                <p className="text-gray-800 font-semibold mb-2">LIMITATION OF LIABILITY:</p>
                                <p className="text-gray-700">
                                    To the maximum extent permitted by law, gpaisa.in and its owners, employees, affiliates, and partners shall NOT be liable for any damages whatsoever arising from your use of this website.
                                </p>
                            </div>

                            <p className="text-gray-700 mb-4">
                                This includes, but is not limited to:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Direct, indirect, incidental, or consequential damages</li>
                                <li>Financial losses from investment decisions</li>
                                <li>Loss of profits, revenue, or business opportunities</li>
                                <li>Loss of data or information</li>
                                <li>Damages resulting from errors, omissions, or inaccuracies in content</li>
                                <li>Damages from website downtime or technical issues</li>
                                <li>Damages from unauthorized access or data breaches</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Personal Responsibility</h2>
                            <p className="text-gray-700 mb-4">
                                <strong>By using gpaisa.in, you agree that:</strong>
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>You are solely responsible for your financial decisions</li>
                                <li>You will conduct your own research and due diligence</li>
                                <li>You understand the risks associated with investing</li>
                                <li>You will not hold gpaisa.in liable for any losses</li>
                                <li>You will verify all information before acting upon it</li>
                                <li>You accept full responsibility for the consequences of your actions</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Educational Purpose Only</h2>
                            <p className="text-gray-700">
                                All content on gpaisa.in is intended for educational and informational purposes. It is designed to help users understand financial concepts, market trends, and economic news. However, education alone is not sufficient for making investment decisions. Always combine knowledge with professional advice and personal research.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Regulatory Compliance</h2>
                            <p className="text-gray-700 mb-4">
                                gpaisa.in is not registered with or regulated by:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Securities and Exchange Board of India (SEBI)</li>
                                <li>Reserve Bank of India (RBI)</li>
                                <li>Insurance Regulatory and Development Authority of India (IRDAI)</li>
                                <li>Any other financial regulatory authority</li>
                            </ul>
                            <p className="text-gray-700">
                                We do not offer regulated financial services and are not authorized to provide investment advice.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Content</h2>
                            <p className="text-gray-700">
                                We reserve the right to modify, update, or remove any content on this website at any time without prior notice. Market conditions change rapidly, and information that was accurate at the time of publication may become outdated.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Geographic Limitations</h2>
                            <p className="text-gray-700">
                                The information on gpaisa.in is primarily intended for users in India. If you access this website from other jurisdictions, you are responsible for compliance with local laws and regulations.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
                            <p className="text-gray-700 mb-4">
                                If you have questions about this disclaimer, please contact us:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:contact@gpaisa.in" className="text-primary-600 hover:underline">contact@gpaisa.in</a></p>
                                <p className="text-gray-700"><strong>Website:</strong> <a href="https://www.gpaisa.in/contact" className="text-primary-600 hover:underline">https://www.gpaisa.in/contact</a></p>
                            </div>
                        </section>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="bg-gray-100 p-6 rounded-lg">
                                <p className="text-gray-800 font-semibold mb-3">FINAL NOTICE:</p>
                                <p className="text-gray-700 mb-3">
                                    By continuing to use gpaisa.in, you acknowledge that you have read, understood, and agree to this disclaimer. If you do not agree with any part of this disclaimer, please discontinue use of this website immediately.
                                </p>
                                <p className="text-gray-700">
                                    <strong>Remember:</strong> When it comes to your finances, always seek professional advice, do your own research, and never invest money you cannot afford to lose.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">Related Pages:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/privacy-policy" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Privacy Policy
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Terms of Service
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
