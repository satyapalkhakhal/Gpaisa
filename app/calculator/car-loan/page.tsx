import { Metadata } from 'next';
import CarLoanCalculatorClient from '@/components/car-loan/CarLoanCalculatorClient';
import CarLoanContent from '@/components/car-loan/CarLoanContent';

// ─── SSR: compute defaults (₹8L, 9.5%, 5yr) ──────────────────────────────────
function computeCarLoanDefaults() {
  const loanAmount = 800000;
  const annualRate = 9.5;
  const tenureMonths = 60;
  const monthlyRate = annualRate / (12 * 100);
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
  const totalAmount = emi * tenureMonths;
  const totalInterest = totalAmount - loanAmount;
  const interestPercent = ((totalInterest / loanAmount) * 100).toFixed(1);

  // Payoff date
  const now = new Date();
  const payoffDate = new Date(now.getFullYear(), now.getMonth() + tenureMonths, 1);
  const payoffStr = payoffDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return {
    loanAmount,
    annualRate,
    tenureMonths,
    emi,
    totalAmount,
    totalInterest,
    interestPercent,
    payoffDate: payoffStr,
  };
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Car Loan EMI Calculator 2026 — Interest Rate, Amortisation & Bank Comparison | gpaisa.in",
  description: "India's most complete car loan calculator. Calculate EMI for any car loan instantly. Compare SBI, HDFC, ICICI, Axis, Kotak, Bank of Baroda rates. With amortisation schedule, prepayment simulator, and tax benefits. Updated May 2026.",
  authors: [{ name: "Satyapal Khakhal", url: "https://www.gpaisa.in/about" }],
  alternates: { canonical: "https://www.gpaisa.in/calculator/car-loan" },
  openGraph: {
    title: "Car Loan EMI Calculator 2026 — Bank Rate Comparison & Amortisation | gpaisa.in",
    description: "Calculate car loan EMI instantly. Compare SBI, HDFC, ICICI, Axis, Kotak rates. ₹8 lakh at 9.5% for 5 years = ₹16,790/month EMI. Updated May 2026.",
    url: "https://www.gpaisa.in/calculator/car-loan",
    siteName: "gpaisa.in",
    locale: "en_IN",
    type: "website",
    images: [{
      url: "https://www.gpaisa.in/og-car-loan-calculator.jpg",
      width: 1200,
      height: 630,
      alt: "Car Loan EMI Calculator India 2026 — Bank Rate Comparison | gpaisa.in"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Loan Calculator 2026 — ₹8L at 9.5% for 5 yrs = ₹16,790/month | gpaisa.in",
    description: "Calculate car loan EMI instantly. Compare SBI, HDFC, ICICI, Axis, Kotak, Bank of Baroda rates. Updated May 2026.",
    images: ["https://www.gpaisa.in/og-car-loan-calculator.jpg"],
    creator: "@gpaisa_in",
    site: "@gpaisa_in"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
  }
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CarLoanCalculatorPage() {
  const defaults = computeCarLoanDefaults();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://www.gpaisa.in/calculator/car-loan#webpage",
      "url": "https://www.gpaisa.in/calculator/car-loan",
      "name": "Car Loan EMI Calculator 2026 — Bank Rate Comparison & Amortisation | gpaisa.in",
      "description": "India's most complete car loan calculator with bank rate comparison, amortisation schedule, and prepayment simulator.",
      "isPartOf": { "@id": "https://www.gpaisa.in/#website" },
      "author": { "@type": "Person", "name": "Satyapal Khakhal", "url": "https://www.gpaisa.in/about" },
      "breadcrumb": { "@id": "https://www.gpaisa.in/calculator/car-loan#breadcrumb" },
      "inLanguage": "en-IN",
      "dateModified": "2026-05-22"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "https://www.gpaisa.in/calculator/car-loan#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.gpaisa.in" },
        { "@type": "ListItem", "position": 2, "name": "Calculator", "item": "https://www.gpaisa.in/calculator" },
        { "@type": "ListItem", "position": 3, "name": "Car Loan Calculator", "item": "https://www.gpaisa.in/calculator/car-loan" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Car Loan EMI Calculator India 2026",
      "url": "https://www.gpaisa.in/calculator/car-loan",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
      "description": "Calculate car loan EMI with bank rate comparison, amortisation schedule, and prepayment simulator. Updated May 2026.",
      "featureList": [
        "New car and used car loan rates",
        "Bank-wise rate comparison (SBI, HDFC, ICICI, Axis, Kotak, BoB)",
        "Amortisation schedule",
        "Prepayment savings calculator",
        "EMI per lakh reference table",
        "Server-side rendered default results"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://www.gpaisa.in/calculator/car-loan#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the car loan interest rate in India in 2026?",
          "acceptedAnswer": { "@type": "Answer", "text": "Car loan interest rates in India range from 8.75% to 12.00% depending on the bank and your credit profile. SBI offers from 8.75%, HDFC from 9.10%, ICICI from 9.10%, Axis from 9.15%, and Kotak from 9.25%. Used car loans are typically 1–2% higher than new car loans." }
        },
        {
          "@type": "Question",
          "name": "What is the EMI for a ₹8 lakh car loan for 7 years?",
          "acceptedAnswer": { "@type": "Answer", "text": "For a ₹8 lakh car loan at 9.5% interest for 7 years, the EMI is approximately ₹13,102/month. Total interest paid = ₹2,99,568. Total amount paid = ₹10,99,568. Use the calculator above to get exact figures for your loan amount and tenure." }
        },
        {
          "@type": "Question",
          "name": "Which bank gives the lowest car loan interest rate in India?",
          "acceptedAnswer": { "@type": "Answer", "text": "SBI currently offers the lowest new car loan rate starting at 8.75% for salaried employees with a good credit score. Bank of Baroda also offers competitive rates from 8.80%. Rates vary based on credit score, employment type, loan amount, and vehicle category. Always compare the final on-road loan offer from multiple lenders." }
        },
        {
          "@type": "Question",
          "name": "What is the maximum tenure for a car loan in India?",
          "acceptedAnswer": { "@type": "Answer", "text": "Most banks offer car loan tenures from 1 to 7 years (12 to 84 months). Some lenders like HDFC and ICICI offer up to 8 years for select models. Longer tenure means lower EMI but higher total interest paid. A 7-year loan on ₹10 lakh at 9.5% costs ₹4.73 lakh more in interest than a 5-year loan." }
        },
        {
          "@type": "Question",
          "name": "Can I prepay my car loan without penalty?",
          "acceptedAnswer": { "@type": "Answer", "text": "Most banks allow car loan prepayment after 6–12 EMIs. RBI guidelines prohibit foreclosure charges on floating rate loans. Fixed rate car loans may have a prepayment penalty of 2–5% of the outstanding amount. SBI, HDFC, and ICICI charge nil foreclosure on floating rate car loans. Always check your loan agreement for specific terms." }
        },
        {
          "@type": "Question",
          "name": "What is the minimum down payment for a car loan?",
          "acceptedAnswer": { "@type": "Answer", "text": "Most banks finance up to 85–90% of the car's on-road price, meaning a minimum down payment of 10–15% is required. For a ₹10 lakh car, you need ₹1–1.5 lakh as down payment. Some banks offer 100% financing for select models to existing customers with excellent credit. A higher down payment reduces your EMI and total interest." }
        },
        {
          "@type": "Question",
          "name": "Does a car loan affect my credit score?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Taking a car loan creates a hard inquiry which may temporarily lower your CIBIL score by 5–10 points. However, making all EMIs on time consistently improves your credit score over time. Missing even one EMI can reduce your score by 50–100 points and negatively impact future loan eligibility." }
        },
        {
          "@type": "Question",
          "name": "Is car loan interest tax deductible in India?",
          "acceptedAnswer": { "@type": "Answer", "text": "For personal use vehicles, car loan interest is NOT tax deductible in India. However, if the vehicle is used for business purposes, you can claim the interest paid as a business expense under Section 37(1) of the Income Tax Act. Self-employed individuals and business owners can thus deduct car loan interest from their taxable income." }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use Car Loan EMI Calculator",
      "description": "Step-by-step guide to calculate your car loan EMI",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Enter Loan Amount", "text": "Enter the car loan amount you wish to borrow." },
        { "@type": "HowToStep", "position": 2, "name": "Set Tenure & Down Payment", "text": "Choose your loan tenure (in years or months) and down payment percentage." },
        { "@type": "HowToStep", "position": 3, "name": "Enter Interest Rate", "text": "Enter the annual interest rate offered by your bank." },
        { "@type": "HowToStep", "position": 4, "name": "View EMI & Amortization", "text": "The calculator shows your monthly EMI, total interest, payoff date, and amortization schedule." }
      ]
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CarLoanCalculatorClient
        initialEmi={defaults.emi}
        initialTotalInterest={defaults.totalInterest}
        initialTotalAmount={defaults.totalAmount}
        initialPayoffDate={defaults.payoffDate}
        initialInterestPercent={defaults.interestPercent}
      />
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <CarLoanContent />
      </div>
    </>
  );
}
