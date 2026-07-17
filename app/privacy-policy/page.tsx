import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy - gpaisa.in',
    description: 'Privacy Policy for gpaisa.in - Learn how we collect, use, and protect your personal information.',
    alternates: {
        canonical: 'https://www.gpaisa.in/privacy-policy',
    },
};

export const dynamic = 'force-static'; // Fully static page, cached permanently

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-600 mb-8">
                        <strong>Last Updated:</strong> July 17, 2026
                    </p>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="text-gray-700 mb-4">
                                Welcome to gpaisa.in (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website{' '}
                                <a href="https://www.gpaisa.in" className="text-primary-600 hover:underline">https://www.gpaisa.in</a>.
                            </p>
                            <p className="text-gray-700">
                                By using our website, you consent to the data practices described in this policy. If you do not agree with the terms of this Privacy Policy, please do not access the site.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">2.1 Personal Information</h3>
                            <p className="text-gray-700 mb-4">
                                We may collect personally identifiable information that you voluntarily provide to us when you:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Subscribe to our newsletter</li>
                                <li>Fill out a contact form</li>
                                <li>Participate in surveys or promotions</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                This information may include:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Phone number</li>
                                <li>Any other information you choose to provide</li>
                            </ul>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
                            <p className="text-gray-700 mb-4">
                                When you visit our website, we automatically collect certain information about your device and browsing behavior, including:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>IP address</li>
                                <li>Browser type and version</li>
                                <li>Operating system</li>
                                <li>Referring website</li>
                                <li>Pages visited and time spent on pages</li>
                                <li>Date and time of visits</li>
                                <li>Device information</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-700 mb-4">
                                We use the information we collect for various purposes, including:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>To provide and maintain our service:</strong> Ensuring our website functions properly and delivering the content you request</li>
                                <li><strong>To improve our website:</strong> Analyzing usage patterns to enhance user experience and content quality</li>
                                <li><strong>To communicate with you:</strong> Responding to inquiries, sending newsletters, and providing customer support</li>
                                <li><strong>To personalize content:</strong> Tailoring content and recommendations based on your interests</li>
                                <li><strong>To analyze trends:</strong> Understanding how users interact with our website</li>
                                <li><strong>To prevent fraud:</strong> Detecting and preventing fraudulent or unauthorized activities</li>
                                <li><strong>To comply with legal obligations:</strong> Meeting regulatory requirements and legal processes</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Tracking Technologies</h2>
                            <p className="text-gray-700 mb-4">
                                We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are small data files stored on your device.
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">Types of Cookies We Use:</h3>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website (e.g., Google Analytics)</li>
                                <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements (e.g., Google AdSense)</li>
                                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                            </ul>

                            <p className="text-gray-700 mb-4">
                                You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our website.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
                            <p className="text-gray-700 mb-4">
                                We may use third-party services that collect, monitor, and analyze information to improve our service. These third parties have their own privacy policies:
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">Google Analytics</h3>
                            <p className="text-gray-700 mb-4">
                                We use Google Analytics to analyze website traffic. Google Analytics uses cookies to collect information about your use of our website. For more information, visit{' '}
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                    Google&apos;s Privacy Policy
                                </a>.
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">Google AdSense</h3>
                            <p className="text-gray-700 mb-4">
                                We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting{' '}
                                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                    Google Ads Settings
                                </a>.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Sharing and Disclosure</h2>
                            <p className="text-gray-700 mb-4">
                                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>With service providers:</strong> Third-party vendors who assist us in operating our website and providing services</li>
                                <li><strong>For legal compliance:</strong> When required by law or to protect our rights and safety</li>
                                <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                                <li><strong>With your consent:</strong> When you explicitly agree to share your information</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Security</h2>
                            <p className="text-gray-700 mb-4">
                                We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>SSL/TLS encryption for data transmission</li>
                                <li>Secure servers and databases</li>
                                <li>Regular security audits</li>
                                <li>Access controls and authentication</li>
                            </ul>
                            <p className="text-gray-700">
                                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Data Rights</h2>
                            <p className="text-gray-700 mb-4">
                                You have certain rights regarding your personal information:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                                <li><strong>Withdraw consent:</strong> Withdraw consent for data processing at any time</li>
                            </ul>
                            <p className="text-gray-700">
                                To exercise these rights, please contact us at{' '}
                                <a href="mailto:contact@gpaisa.in" className="text-primary-600 hover:underline">contact@gpaisa.in</a>.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
                            <p className="text-gray-700">
                                Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
                            <p className="text-gray-700">
                                Your information may be transferred to and maintained on servers located outside of your country, where data protection laws may differ. By using our website, you consent to the transfer of your information to India and other countries.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
                            <p className="text-gray-700">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. We encourage you to review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about this Privacy Policy or our data practices, please contact us:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:contact@gpaisa.in" className="text-primary-600 hover:underline">contact@gpaisa.in</a></p>
                                <p className="text-gray-700"><strong>Website:</strong> <a href="https://www.gpaisa.in/contact" className="text-primary-600 hover:underline">https://www.gpaisa.in/contact</a></p>
                            </div>
                        </section>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                By using gpaisa.in, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">Related Pages:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Terms of Service
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
