import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms of Service - gpaisa.in',
    description: 'Terms of Service for gpaisa.in - Read our terms and conditions for using our financial information portal.',
    alternates: {
        canonical: 'https://www.gpaisa.in/terms',
    },
};

export const dynamic = 'force-static'; // Fully static page, cached permanently

export default function TermsPage() {
    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-gray-600 mb-8">
                        <strong>Last Updated:</strong> July 17, 2026
                    </p>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 mb-4">
                                Welcome to gpaisa.in. By accessing and using this website, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use this website.
                            </p>
                            <p className="text-gray-700">
                                We reserve the right to modify these terms at any time. Your continued use of the website following any changes indicates your acceptance of the new terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Website</h2>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">2.1 Permitted Use</h3>
                            <p className="text-gray-700 mb-4">
                                You may use this website for lawful purposes only. You agree to use the website in accordance with all applicable laws and regulations.
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">2.2 Prohibited Activities</h3>
                            <p className="text-gray-700 mb-4">You agree NOT to:</p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Use the website for any illegal purpose or in violation of any local, state, national, or international law</li>
                                <li>Violate or infringe upon the intellectual property rights of others</li>
                                <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                                <li>Submit false or misleading information</li>
                                <li>Upload or transmit viruses or any other type of malicious code</li>
                                <li>Collect or track personal information of others without consent</li>
                                <li>Spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                                <li>Interfere with or circumvent the security features of the website</li>
                                <li>Use automated systems or software to extract data from the website (screen scraping)</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Intellectual Property Rights</h2>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">3.1 Our Content</h3>
                            <p className="text-gray-700 mb-4">
                                The content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, is the property of gpaisa.in or its content suppliers and is protected by Indian and international copyright laws.
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">3.2 Limited License</h3>
                            <p className="text-gray-700 mb-4">
                                We grant you a limited, non-exclusive, non-transferable license to access and use the website for personal, non-commercial purposes. You may not:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Reproduce, duplicate, copy, sell, or exploit any portion of the website without express written permission</li>
                                <li>Modify or create derivative works based on our content</li>
                                <li>Use our content for commercial purposes without authorization</li>
                            </ul>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">3.3 Trademarks</h3>
                            <p className="text-gray-700">
                                &quot;gpaisa.in&quot; and related logos are trademarks of gpaisa.in. You may not use these trademarks without our prior written consent.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User-Generated Content</h2>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">4.1 Your Content</h3>
                            <p className="text-gray-700 mb-4">
                                If you submit comments, feedback, or other content to our website, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and distribute such content.
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">4.2 Content Standards</h3>
                            <p className="text-gray-700 mb-4">
                                You are responsible for any content you submit. Your content must not:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Contain false, misleading, or fraudulent information</li>
                                <li>Infringe upon intellectual property rights</li>
                                <li>Contain offensive, defamatory, or inappropriate material</li>
                                <li>Violate any laws or regulations</li>
                                <li>Contain spam or advertising</li>
                            </ul>

                            <p className="text-gray-700">
                                We reserve the right to remove any content that violates these terms or is otherwise objectionable.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Financial Information Disclaimer</h2>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                <p className="text-gray-800 font-semibold mb-2">IMPORTANT DISCLAIMER:</p>
                                <p className="text-gray-700">
                                    The financial information, market data, and content provided on this website are for informational and educational purposes only. They do not constitute financial, investment, trading, or professional advice.
                                </p>
                            </div>

                            <p className="text-gray-700 mb-4">
                                <strong>You acknowledge and agree that:</strong>
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>We are not financial advisors, brokers, or investment professionals</li>
                                <li>All investment decisions are made at your own risk</li>
                                <li>Past performance does not guarantee future results</li>
                                <li>Market data may be delayed or inaccurate</li>
                                <li>You should consult with a qualified financial advisor before making investment decisions</li>
                                <li>We are not liable for any financial losses resulting from your use of this website</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Accuracy of Information</h2>
                            <p className="text-gray-700 mb-4">
                                While we strive to provide accurate and up-to-date information, we make no warranties or representations about the accuracy, completeness, or timeliness of the content on this website.
                            </p>
                            <p className="text-gray-700">
                                Market data, gold rates, silver prices, and other financial information may be subject to delays, errors, or omissions. Always verify information from official sources before making financial decisions.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links</h2>
                            <p className="text-gray-700 mb-4">
                                Our website may contain links to third-party websites or services that are not owned or controlled by gpaisa.in. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites.
                            </p>
                            <p className="text-gray-700">
                                You acknowledge and agree that we shall not be liable for any damage or loss caused by your use of any third-party websites or services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                                <p className="text-gray-800 font-semibold mb-2">LIMITATION OF LIABILITY:</p>
                                <p className="text-gray-700">
                                    To the fullest extent permitted by law, gpaisa.in, its owners, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses, resulting from:
                                </p>
                            </div>

                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Your use or inability to use the website</li>
                                <li>Any unauthorized access to or use of our servers</li>
                                <li>Any interruption or cessation of transmission to or from the website</li>
                                <li>Any bugs, viruses, or malware transmitted through the website</li>
                                <li>Any errors or omissions in content</li>
                                <li>Any financial losses resulting from investment decisions based on our content</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
                            <p className="text-gray-700">
                                You agree to indemnify, defend, and hold harmless gpaisa.in and its affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Your use of the website</li>
                                <li>Your violation of these Terms of Service</li>
                                <li>Your violation of any rights of another party</li>
                                <li>Any content you submit to the website</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy</h2>
                            <p className="text-gray-700">
                                Your use of the website is also governed by our Privacy Policy. Please review our{' '}
                                <Link href="/privacy-policy" className="text-primary-600 hover:underline font-semibold">
                                    Privacy Policy
                                </Link>{' '}
                                to understand our data collection and usage practices.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
                            <p className="text-gray-700">
                                We reserve the right to terminate or suspend your access to the website immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms of Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
                            <p className="text-gray-700">
                                These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Severability</h2>
                            <p className="text-gray-700">
                                If any provision of these Terms of Service is found to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable to the fullest extent permitted by law.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Entire Agreement</h2>
                            <p className="text-gray-700">
                                These Terms of Service, together with our Privacy Policy and Disclaimer, constitute the entire agreement between you and gpaisa.in regarding the use of this website.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:contact@gpaisa.in" className="text-primary-600 hover:underline">contact@gpaisa.in</a></p>
                                <p className="text-gray-700"><strong>Website:</strong> <a href="https://www.gpaisa.in/contact" className="text-primary-600 hover:underline">https://www.gpaisa.in/contact</a></p>
                            </div>
                        </section>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                By using gpaisa.in, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
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
                        <Link href="/disclaimer" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Disclaimer
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
