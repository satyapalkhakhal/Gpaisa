// Server-rendered bank-specific SEO content for individual bank home loan calculator pages
// Renders as static HTML — visible in View Source with JS disabled

import Link from 'next/link';
import type { BankHomeLoanData } from '@/lib/bankHomeLoanData';

const thClass = 'px-3 py-2.5 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap';
const tdClass = 'px-3 py-2.5 text-sm text-gray-800';
const tdBoldClass = 'px-3 py-2.5 text-sm text-gray-900 font-semibold';

// Generate pros/cons content per bank
function getBankProsConsContent(data: BankHomeLoanData): { pros: string; cons: string } {
  const slug = data.slug;

  const content: Record<string, { pros: string; cons: string }> = {
    'sbi-home-loan-calculator': {
      pros: `SBI is ideal if you want the lowest possible interest rate and are comfortable with a PSU bank's processing timeline. The MaxGain overdraft facility is unmatched — it lets you park surplus funds to reduce your effective interest cost without any formal prepayment, making it the smartest choice for disciplined savers. Government employees, defence personnel, and women borrowers get additional rate concessions that bring SBI's effective cost well below any private bank.`,
      cons: `SBI's loan processing is typically slower than private banks — expect 2–4 weeks versus 3–5 days at HDFC or ICICI. The branch experience can vary significantly depending on your location, and the digital application process, while improved, is not as seamless as the top private bank offerings. If speed of approval is your priority, a private bank may serve you better.`,
    },
    'hdfc-home-loan-calculator': {
      pros: `HDFC Bank is the best choice if you value speed, convenience, and a premium service experience. Loan approvals in 3–5 working days, dedicated relationship managers, and doorstep document pickup make the process hassle-free. HDFC's wide developer network means pre-approved projects are readily available, reducing legal verification delays. The 0.05% concession for women borrowers is a nice added benefit.`,
      cons: `HDFC's interest rates are typically 0.15–0.30% higher than the best PSU bank rates for the same credit profile. On a ₹50 lakh loan over 20 years, this difference costs ₹1.8–3.6 lakh in additional interest over the full tenure. The processing fee of 0.5% is also higher than most PSU banks. If you have a strong credit profile and can wait a bit longer, SBI or Bank of Baroda may save you more money overall.`,
    },
    'icici-home-loan-calculator': {
      pros: `ICICI Bank is excellent for young professionals who want a larger loan amount with lower initial EMIs through the Step-Up EMI facility. The fully digital application process with instant sanction letters is best-in-class. ICICI's balance transfer product is also very competitive — if you are currently paying a higher rate at another bank, ICICI can often offer a lower rate to switch.`,
      cons: `ICICI's base rates are marginally higher than SBI and Bank of Baroda for equivalent credit profiles. The Step-Up EMI facility, while helpful initially, means you pay more interest over the full tenure compared to a flat EMI structure. Processing fees of 0.5% + GST add to the upfront cost. Self-employed borrowers may find ICICI's documentation requirements more stringent than PSU banks.`,
    },
    'axis-home-loan-calculator': {
      pros: `Axis Bank's Shubh Aarambh 3-EMI waiver is genuinely unique — no other major bank offers this. It provides immediate cash flow relief after the large down payment. Axis also offers strong balance transfer rates and doorstep service across major cities. The bank's digital experience has improved significantly and is now on par with HDFC and ICICI.`,
      cons: `Axis Bank's processing fee of 1% + GST is the highest among the banks featured here — on a ₹50 lakh loan, that is ₹59,000 compared to ₹17,500 at SBI. The rate range of 8.00%–11.90% is also wider than most banks, meaning borrowers with average credit profiles may end up paying rates closer to the upper end. Carefully evaluate whether the 3-EMI waiver offsets the higher processing fee for your specific loan amount.`,
    },
    'kotak-home-loan-calculator': {
      pros: `Kotak Mahindra is the go-to choice for high-value home loans — offering up to ₹10 crore with personalised rate negotiations for premium customers. If you maintain a strong banking relationship with Kotak (savings, investments, salary account), you can often negotiate rates below their published floor rate. The service quality and relationship management are among the best in the industry.`,
      cons: `Kotak's maximum tenure of 20 years is shorter than the 30-year maximum at most other banks — this means significantly higher EMIs for the same loan amount. A ₹50 lakh loan at 8.75% costs ₹44,100/month for 20 years versus ₹38,450/month for 30 years. The minimum CIBIL requirement of 720 is also higher than most competitors, making it harder for borrowers with average credit histories to qualify.`,
    },
    'pnb-home-loan-calculator': {
      pros: `PNB is an excellent choice for government employees, defence personnel, and PSU workers — the PNB Pride scheme offers below-market rates exclusively for this segment. The processing fee of 0.35% (max ₹15,000) is among the lowest in the industry, making PNB particularly cost-effective for large loan amounts where processing fees can be substantial at private banks.`,
      cons: `PNB's loan processing timeline is typically longer than private banks — expect 3–4 weeks for full disbursement. The digital application experience is less polished than HDFC, ICICI, or Axis, and branch-level service quality can be inconsistent. If you are not a government employee and need fast processing, a private bank may be a better fit despite the higher cost.`,
    },
    'bank-of-baroda-home-loan-calculator': {
      pros: `Bank of Baroda offers the lowest starting rate among the featured banks, making it worth checking first if you have a CIBIL score above 750. BOB's digital pre-approved home loan is genuinely useful — you can get a sanction letter before identifying a property, giving you negotiating power with builders and sellers. The processing fee of 0.25%–0.50% is also very competitive.`,
      cons: `BOB's best rates require a strong credit profile — borrowers with CIBIL scores below 700 may be offered rates closer to the 9.00% upper end, which is not competitive. Like most PSU banks, processing times are longer than private banks, and the digital experience, while improving, is not yet on par with HDFC or ICICI. Branch availability in some metro areas may be limited compared to SBI.`,
    },
    'canara-bank-home-loan-calculator': {
      pros: `Canara Bank's starting rate of 7.15% is among the absolute lowest in the market — if you qualify for the prime tier, it is hard to beat on cost. The Budget Home Loan product is well-suited for affordable housing purchases with simplified documentation. Canara's extensive branch network in South India and Tier-2/3 cities provides accessibility that some private banks cannot match.`,
      cons: `Canara's rate range extends up to 10.00% — borrowers with weaker credit profiles may end up paying significantly more than the advertised starting rate. Processing times are on the slower side, and the digital loan application experience is limited compared to private banks. Customer service quality can vary widely between branches.`,
    },
    'union-bank-home-loan-calculator': {
      pros: `Union Bank's 7.15% starting rate ties with Canara Bank as the lowest available. The Union Awas NRI scheme is specifically designed for Indians abroad who want to buy property in India — with streamlined documentation and dedicated NRI processing cells. Government employees benefit from preferential rate tiers that can bring the effective rate below 7.5%.`,
      cons: `Union Bank's digital infrastructure is less developed than private banks, and the online application process may require in-person branch visits for verification and document submission. Processing timelines are typically 3–4 weeks. Borrowers in metropolitan areas who value speed and digital convenience may prefer a private bank despite the higher rate.`,
    },
    'idbi-home-loan-calculator': {
      pros: `IDBI Bank's flexible eligibility norms make it a viable option for self-employed individuals and business owners who struggle with documentation at other banks. The Neev joint loan product allows multiple co-applicants to combine their incomes, significantly increasing eligibility. IDBI's rates in the 7.35% starting range are competitive for a mid-tier bank.`,
      cons: `IDBI's maximum rate of 10.05% is on the higher end — borrowers who do not qualify for the prime tier could face expensive borrowing costs. The branch network is smaller than SBI, HDFC, or ICICI, which may limit accessibility in some cities. Processing speed and digital experience are behind the top-tier private banks. Ensure you confirm your actual offered rate before committing.`,
    },
    'yes-bank-home-loan-calculator': {
      pros: `Yes Bank's 35-year maximum tenure is the longest available, resulting in the lowest possible monthly EMI for any given loan amount. The digital onboarding process is fast and efficient for a mid-size bank. Yes Bank has stabilised significantly since its restructuring and is now a viable option for borrowers looking for lower monthly outflows over a longer period.`,
      cons: `The longer 35-year tenure means significantly more total interest paid — a ₹50 lakh loan at 9.40% costs ₹92.5 lakh in interest over 35 years versus ₹58 lakh over 20 years. Yes Bank's starting rate of 8.50% is higher than most PSU banks. The processing fee of 1% + GST is also on the expensive side. Consider whether the lower monthly EMI justifies the substantially higher total cost.`,
    },
    'indusind-home-loan-calculator': {
      pros: `IndusInd's personalised relationship management approach — with a dedicated loan officer throughout the process — significantly reduces the friction and back-and-forth that frustrates many home loan borrowers. For salaried professionals with CIBIL scores above 750, the 48-hour approval turnaround is impressive. The overall service quality and attention to detail are among the best in the private banking space.`,
      cons: `IndusInd's minimum CIBIL requirement of 720 is higher than most banks, limiting accessibility for borrowers with moderate credit histories. Self-employed applicants and those with non-standard income documentation may find it difficult to meet IndusInd's eligibility criteria. The bank's home loan portfolio is smaller than the market leaders, which means less flexibility in rate negotiations for borderline profiles.`,
    },
    'idfc-first-home-loan-calculator': {
      pros: `IDFC FIRST's fully digital, paperless loan process is genuinely end-to-end — from application to disbursement, everything can be done online. The flexible repayment structures (step-up and step-down EMI) provide genuine flexibility for borrowers whose income is expected to change. The bank caters well to high-value property purchases in metro cities with competitive terms.`,
      cons: `IDFC FIRST's starting rate of 8.85% is higher than most PSU banks and some large private banks. The processing fee range of 0.25%–1.5% is wide and unpredictable — your specific fee depends on multiple factors that may not be clear upfront. As a newer entrant in the home loan space, IDFC FIRST's branch network and track record are smaller than established players like SBI or HDFC.`,
    },
    'bandhan-bank-home-loan-calculator': {
      pros: `Bandhan Bank's strength lies in its deep penetration of semi-urban and eastern India markets — West Bengal, Assam, Odisha, and Bihar — where larger private banks have limited branch presence. For home buyers in these regions, Bandhan offers faster local processing, in-person support, and a better understanding of regional property markets than a national bank operating remotely.`,
      cons: `Bandhan's maximum tenure of 25 years is shorter than the 30-year option at most banks, which means higher monthly EMIs for the same loan amount. The starting rate of 8.75% and default rate of 9.15% are on the higher side compared to PSU banks. Bandhan's home loan portfolio is relatively small, and in metro cities, borrowers may be better served by a larger bank with more competitive rates and faster processing.`,
    },
    'rbl-home-loan-calculator': {
      pros: `RBL Bank is a viable alternative for borrowers who have been declined by larger banks due to non-standard income documentation — self-employed individuals, freelancers, and business owners with irregular income patterns. RBL's flexible documentation norms and willingness to assess non-salaried profiles give it a genuine niche that the top 5 banks often do not serve well.`,
      cons: `RBL's starting rate of 9.00% is among the highest in this comparison, and the processing fee of 1% + GST adds significant upfront cost. The maximum tenure of 25 years means higher EMIs than banks offering 30-year options. RBL should be considered primarily when other banks have declined your application — if you qualify at SBI, HDFC, or ICICI, those banks will almost certainly offer better overall value.`,
    },
  };

  return content[slug] || {
    pros: `${data.bankName} offers competitive home loan rates and a range of features designed to suit different borrower profiles. Evaluate the interest rate, processing fee, and tenure options to see if it matches your requirements.`,
    cons: `Compare ${data.bankName}'s total cost of borrowing (including processing fees) against other banks before making your final decision. Interest rates alone do not tell the full story — factor in processing speed, service quality, and prepayment flexibility.`,
  };
}

type Props = {
  data: BankHomeLoanData;
};

export default function BankSpecificContent({ data }: Props) {
  const prosCons = getBankProsConsContent(data);

  return (
    <div className="space-y-5 md:space-y-6">

      {/* Section 1 — Interest Rates */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">
            {data.bankName} Home Loan Interest Rates — May 2026
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Current {data.bankName} home loan rates for salaried, self-employed, and NRI borrowers.
          </p>
        </div>
        <div className="overflow-x-auto px-4 md:px-6 pb-4 md:pb-5">
          <table className="w-full text-xs md:text-sm min-w-[420px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={thClass}>Borrower Type</th>
                <th className={thClass}>Interest Rate</th>
                <th className={thClass}>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 bg-white">
                <td className={tdBoldClass}>Regular / Salaried</td>
                <td className={`${tdClass} text-emerald-700 font-bold`}>{data.regularRateText}</td>
                <td className={`${tdClass} text-gray-500`}>Best rate requires 750+ CIBIL</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50/40">
                <td className={tdBoldClass}>NRI Home Loan</td>
                <td className={`${tdClass} text-blue-700 font-bold`}>{data.nriRateText}</td>
                <td className={`${tdClass} text-gray-500`}>For Indian citizens residing abroad</td>
              </tr>
              <tr className="bg-white">
                <td className={tdBoldClass}>Self-Employed</td>
                <td className={`${tdClass} text-orange-700 font-medium`}>Typically +0.25–0.50% above salaried</td>
                <td className={`${tdClass} text-gray-500`}>Varies by income documentation</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[10px] text-gray-400 mt-2 italic">
            *Rates indicative as of May 2026. Actual rate depends on loan amount, CIBIL score, and property type. Verify current rates on {data.bankName}&apos;s official website before applying.
          </p>
        </div>
      </div>

      {/* Section 2 — Key Details */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">
            {data.bankName} Home Loan Key Details
          </h2>
        </div>
        <div className="overflow-x-auto px-4 md:px-6 pb-4 md:pb-5">
          <table className="w-full text-xs md:text-sm">
            <tbody>
              {[
                { feature: 'Processing Fee', detail: data.processingFee },
                { feature: 'Prepayment Charges', detail: 'Nil on floating rate loans (RBI mandate)' },
                { feature: 'Maximum Tenure', detail: data.maxTenure },
                { feature: 'Minimum CIBIL Score', detail: data.minCibil },
                { feature: 'NRI Eligibility', detail: 'Yes — see NRI rate above' },
              ].map((row, idx) => (
                <tr key={row.feature} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                  <td className={`${tdClass} font-bold text-gray-700 w-[40%]`}>{row.feature}</td>
                  <td className={tdClass}>{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3 — Why Choose This Bank */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-base flex-shrink-0">⭐</span>
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              Why Choose {data.bankName}? Key Advantage
            </h2>
          </div>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200">
            <p className="text-sm text-emerald-800 font-semibold leading-relaxed">{data.usp}</p>
          </div>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{data.intro}</p>
        </div>
      </div>

      {/* Section 4 — Is This Bank Right for You? */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base flex-shrink-0">🤔</span>
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              Is {data.bankName} the Right Lender for You?
            </h2>
          </div>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">✅ Pros</h4>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{prosCons.pros}</p>
          </div>
          <div className="bg-orange-50/60 rounded-xl p-3.5 border border-orange-100">
            <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1.5">⚠️ Cons</h4>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{prosCons.cons}</p>
          </div>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
            Compare {data.bankName} against all major banks using our{' '}
            <Link href="/calculator/home-loan" className="text-primary-600 font-semibold hover:underline">
              main home loan calculator
            </Link>.
          </p>
        </div>
      </div>

      {/* Section 5 — Author & Update Line */}
      <div className="flex items-center justify-between px-1 py-2 text-[10px] md:text-xs text-gray-400">
        <span>Content by <strong className="text-gray-500">Satyapal Khakhal</strong>, Founder, gpaisa.in</span>
        <span>Rates updated: May 2026</span>
      </div>
    </div>
  );
}
