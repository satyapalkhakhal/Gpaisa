import { Metadata } from 'next';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us - gpaisa.in | Get in Touch',
    description: 'Contact gpaisa.in for inquiries, feedback, or support. We\'re here to help with your financial information needs.',
    keywords: 'contact gpaisa, financial portal contact, customer support',
    alternates: {
        canonical: 'https://gpaisa.in/contact',
    },
    openGraph: {
        title: 'Contact Us - gpaisa.in',
        description: 'Get in touch with gpaisa.in team for support and inquiries.',
        type: 'website',
        url: 'https://gpaisa.in/contact',
    },
};

export default function ContactPage() {
    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Contact <span className="text-primary-600">Us</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Have questions or feedback? We&apos;d love to hear from you. Reach out to us through any of the channels below.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Contact Information Cards */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                        <p className="text-gray-600 mb-3">Send us an email anytime</p>
                        <a 
                            href="mailto:contact@gpaisa.in" 
                            className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                            contact@gpaisa.in
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-8 h-8 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                        <p className="text-gray-600 mb-3">Mon-Fri, 9 AM - 6 PM IST</p>
                        <a 
                            href="tel:+911234567890" 
                            className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                            +91 123 456 7890
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                        <p className="text-gray-600 mb-3">Our office location</p>
                        <p className="text-gray-700">
                            Mumbai, Maharashtra<br />
                            India
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="What is this regarding?"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
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
                            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                Message *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={6}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                placeholder="Tell us more about your inquiry..."
                            />
                        </div>

                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="privacy"
                                name="privacy"
                                required
                                className="mt-1 mr-2"
                            />
                            <label htmlFor="privacy" className="text-sm text-gray-600">
                                I agree to the{' '}
                                <a href="/privacy-policy" className="text-primary-600 hover:text-primary-700 underline">
                                    Privacy Policy
                                </a>{' '}
                                and consent to being contacted regarding my inquiry.
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-700 transition flex items-center justify-center"
                        >
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                        </button>
                    </form>

                    <p className="text-sm text-gray-500 mt-6 text-center">
                        We typically respond within 24-48 hours during business days.
                    </p>
                </div>

                {/* FAQ Section */}
                <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                How often is the market data updated?
                            </h3>
                            <p className="text-gray-700">
                                Our market data, including gold rates, silver prices, and stock indices, is updated in real-time throughout trading hours. We source data from reliable market feeds to ensure accuracy.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Can I use your data for commercial purposes?
                            </h3>
                            <p className="text-gray-700">
                                Please contact us at contact@gpaisa.in for commercial licensing inquiries. Personal use of data displayed on our website is permitted for informational purposes only.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Do you provide personalized financial advice?
                            </h3>
                            <p className="text-gray-700">
                                We provide general financial information and educational content. For personalized financial advice, we recommend consulting with a certified financial advisor who can assess your individual circumstances.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                How can I report an error or inaccuracy?
                            </h3>
                            <p className="text-gray-700">
                                If you notice any errors or inaccuracies in our content or data, please email us immediately at contact@gpaisa.in with details. We take data accuracy seriously and will investigate promptly.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Business Hours */}
                <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6 max-w-3xl mx-auto">
                    <h3 className="text-lg font-bold text-primary-900 mb-3">Business Hours</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-primary-800">
                        <div>
                            <p className="font-semibold">Monday - Friday</p>
                            <p>9:00 AM - 6:00 PM IST</p>
                        </div>
                        <div>
                            <p className="font-semibold">Saturday - Sunday</p>
                            <p>Closed (Email support available)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
