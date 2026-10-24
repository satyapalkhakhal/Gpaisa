// Expanded glossary entries (24 Oct 2026): fuller explanations with current Indian rules,
// worked examples, common mistakes and FAQs, merged over the base entries in glossaryData.ts.
// Rules and figures were checked against SEBI, Income Tax Department, AMFI, RBI, PFRDA, EPFO, BIS and GST Council sources;
// see seo-audit/runs/content-2026-10-22/trend/glossary-sources.md and glossary-batch2-*-sources.md.
import type { GlossaryTerm } from './glossaryData';

export const GLOSSARY_EXPANSIONS: Record<string, Partial<GlossaryTerm>> = {
    "sip": {
        "shortDefinition": "A SIP (Systematic Investment Plan) is a way of investing a fixed amount in a mutual fund scheme at regular intervals, usually every month, through an automatic debit from your bank account. Each instalment buys units at the NAV that applies on that day.",
        "details": [
            "When you register a SIP you pick a scheme, an amount, a frequency and a date. On each SIP date the money is debited and units are allotted at the applicable NAV. Since 1 February 2021, the NAV you get depends on when the money actually reaches the mutual fund, not just when the order is placed. For most schemes, money available to the fund before the 3 pm cut-off on a business day gets that day's NAV; money that arrives later gets the NAV of the next business day. Purchases in liquid and overnight funds have an earlier cut-off of 1:30 pm.",
            "Because the instalment is fixed while the NAV moves, the same ₹5,000 buys more units when prices are low and fewer when they are high. This is called rupee-cost averaging. It spreads your purchases across different market levels so you do not have to choose one entry point. It does not guarantee a profit and does not stop losses in a falling market. It only takes the timing decision out of your hands.",
            "Each scheme sets its own minimum SIP amount, stated in its scheme information document. In January 2025 SEBI proposed small-ticket SIPs of ₹250 to bring in first-time investors, and in February 2025 the industry body AMFI announced a ₹250 'Chhoti SIP' programme. Most fund houses let you choose a monthly or quarterly frequency, raise the amount each year through a step-up (top-up) option, or stop the SIP. Tax-saving ELSS SIPs work differently: every instalment is locked in for three years from its own date.",
            "For tax, every SIP instalment counts as a separate purchase with its own date. In equity-oriented funds, units held for more than 12 months are long-term: gains above ₹1.25 lakh in a financial year are taxed at 12.5%. Units sold within 12 months attract short-term capital gains tax at 20%. These rates apply to transfers on or after 23 July 2024, and Budget 2026 did not change them. So if you redeem from a SIP that started only a year or so ago, part of your gain may still be short-term.",
            "A SIP is a way of investing, not a product. Your return depends entirely on the scheme you choose and on how markets move. A SIP calculator's figure is only a projection that assumes a constant rate, which real markets never deliver. Money goes in on many different dates, so the right way to measure a SIP's actual performance is XIRR, not the simple percentage gain or CAGR."
        ],
        "example": "Suppose you invest ₹5,000 a month for 10 years and assume a 12% annual return, which the formula treats as 1% a month. So P = ₹5,000, r = 0.01 and n = 120. Step 1: (1.01)^120 = 3.300387. Step 2: (3.300387 − 1) ÷ 0.01 = 230.0387. Step 3: 230.0387 × 1.01 = 232.3391. Step 4: 232.3391 × ₹5,000 = about ₹11,61,695. You invested ₹5,000 × 120 = ₹6,00,000, so the projected gain is about ₹5,61,695. Two caveats. Real returns are never a steady 12% a year. And 1% a month compounds to about 12.68% a year (1.01^12 = 1.1268), so a calculator that converts 12% a year into a smaller monthly rate will show a lower corpus.",
        "mistakes": [
            "Stopping SIPs when markets fall, which skips the cheaper purchases that rupee-cost averaging relies on.",
            "Judging a SIP by its absolute gain or CAGR instead of XIRR.",
            "Treating a calculator's projected corpus as a promised return.",
            "Running SIPs in several funds with overlapping portfolios and assuming that is diversification."
        ],
        "faq": [
            {
                "question": "Can I stop a SIP at any time?",
                "answer": "Yes, in regular open-ended funds. Stopping future instalments carries no penalty, but an exit load may apply if you redeem units within the scheme's exit-load period. ELSS units cannot be redeemed until each instalment completes three years."
            },
            {
                "question": "SIP or lump sum: which gives better returns?",
                "answer": "Neither is always better. If markets rise steadily after you invest, a lump sum usually ends higher because more money is invested for longer. A SIP spreads your entry over time and fits people who invest from monthly income. The result depends on how markets move after you invest."
            },
            {
                "question": "Are SIP returns guaranteed?",
                "answer": "No. A SIP in an equity or debt fund carries the same market risk as the fund itself. The value of your investment can fall below the amount you put in, especially over short periods."
            },
            {
                "question": "What happens if a SIP instalment fails?",
                "answer": "If the auto-debit fails, for example because of a low bank balance, no units are bought that month. Your bank may charge a fee for the failed mandate, and fund houses have rules on cancelling SIPs after repeated failures, so check your fund house's terms."
            }
        ],
        "updated": "2026-10-24",
        "formula": "FV = P × [((1 + r)^n − 1) ÷ r] × (1 + r), where P is the monthly instalment, r is the monthly rate (annual rate ÷ 12) and n is the number of instalments. It assumes each instalment is invested at the start of the month and earns a constant return."
    },
    "cagr": {
        "shortDefinition": "CAGR (Compound Annual Growth Rate) is the steady yearly rate at which an amount would have to grow, with gains reinvested, to go from its starting value to its ending value over a given number of years. It turns an uneven multi-year return into one comparable annual figure.",
        "details": [
            "CAGR answers one question: what constant yearly growth rate would take my starting value to my ending value over N years? It looks only at those two points. What happened in between, whether the investment rose smoothly or swung up and down, does not enter the calculation. That makes CAGR a smoothed, hypothetical rate. It is not the return you earned in any particular year.",
            "Fund performance tables, company results and business news commonly quote multi-year returns and growth figures as CAGR. A fund's 5-year return, a company's 3-year revenue growth or a property's appreciation since purchase are usually CAGR numbers. Because CAGR converts different holding periods into a yearly rate, you can compare a fund held for 3 years with a deposit held for 5 years on the same footing.",
            "CAGR can hide volatility. Take an investment that gains 50% in year one and loses 50% in year two. The simple average of the two yearly returns is 0%, but ₹1,00,000 would have become ₹1,50,000 and then ₹75,000. The CAGR is about −13.4% a year, which is what actually happened to your money. The average return looks fine; the CAGR shows the real result.",
            "CAGR works only for a single amount invested at the start and valued at the end. It cannot handle money added or withdrawn along the way, such as SIP instalments, top-ups or partial redemptions. For those, use XIRR, which accounts for the date and size of every cash flow. CAGR is also point-to-point: change the start or end date by a few weeks, especially around a market high or low, and the figure can move a lot.",
            "Use CAGR to compare lump-sum investments, to check whether an investment has beaten inflation or its benchmark index over the same period, and to read company growth figures. For periods shorter than a year, annualising can exaggerate the result, so many statements show the absolute return instead. Past CAGR describes what has happened; it does not predict future returns."
        ],
        "example": "You invested ₹2,50,000 in a fund in April 2021 and it was worth ₹4,40,000 in April 2026, exactly 5 years later. Step 1: Final ÷ Initial = 4,40,000 ÷ 2,50,000 = 1.76. Step 2: 1.76^(1 ÷ 5) = 1.76^0.2 = 1.1197. Step 3: 1.1197 − 1 = 0.1197, or about 11.97% a year. Check: ₹2,50,000 × 1.1197^5 = ₹2,50,000 × 1.7601 = about ₹4,40,000. The absolute return is (4,40,000 − 2,50,000) ÷ 2,50,000 = 76%, but spread over 5 years with compounding it works out to about 12% a year. For the volatility case above: ₹75,000 ÷ ₹1,00,000 = 0.75, and 0.75^(1 ÷ 2) = 0.8660, so the CAGR is 0.8660 − 1 = −13.4%.",
        "mistakes": [
            "Using CAGR for a SIP or any investment with several deposits or withdrawals.",
            "Confusing the absolute return (76% over 5 years) with the annual return (about 12%).",
            "Comparing CAGRs calculated over different start and end dates.",
            "Assuming a high past CAGR will continue."
        ],
        "faq": [
            {
                "question": "Is XIRR better than CAGR?",
                "answer": "Neither is better in general; they suit different cases. For a single lump sum with no further cash flows, CAGR and XIRR give the same answer. When money goes in or out on several dates, as in a SIP, only XIRR gives a correct annual return."
            },
            {
                "question": "What is a good CAGR?",
                "answer": "There is no fixed number. Compare the CAGR with inflation, with fixed deposit rates and with the investment's benchmark index over the same period. An equity fund's CAGR is meaningful only next to its benchmark and similar funds."
            },
            {
                "question": "Can CAGR be negative?",
                "answer": "Yes. If the final value is lower than the starting value, the ratio is below 1 and the CAGR is negative, as in the −13.4% example above."
            },
            {
                "question": "How do I calculate CAGR in Excel?",
                "answer": "Use =(End/Start)^(1/Years)-1, for example =(440000/250000)^(1/5)-1, which returns about 11.97%. Excel's RRI function, =RRI(5,250000,440000), gives the same result."
            }
        ],
        "updated": "2026-10-24",
        "formula": "CAGR = (Final Value ÷ Initial Value)^(1 ÷ Years) − 1"
    },
    "xirr": {
        "shortDefinition": "XIRR (Extended Internal Rate of Return) is the annualised return on an investment where money goes in or comes out on different dates and in different amounts, such as a SIP. It uses the exact date and size of every cash flow, which CAGR cannot do.",
        "details": [
            "In a monthly SIP, each instalment is invested on a different date, so each one has been growing for a different length of time. A single CAGR on the total amount invested ignores this and usually understates or misstates the return. XIRR treats every instalment, top-up and withdrawal as a separate dated cash flow. It then finds the one annual rate at which the present value of all those cash flows adds up to zero.",
            "You can calculate XIRR in Excel or Google Sheets with =XIRR(values, dates). Enter money you invest as negative numbers and money you receive, including today's value of your holding, as positive numbers, each next to its date. Microsoft's documentation explains that the function discounts every flow on a 365-day year and needs at least one negative and one positive value; otherwise it returns a #NUM! error. There is no direct formula: the rate is found by trial and error (iteration), starting from a default guess of 10%.",
            "Use XIRR for SIPs, step-up SIPs, portfolios with irregular top-ups, systematic withdrawal plans, and loans or insurance policies where payments and payouts fall on different dates. Many mutual fund statements and investment apps show XIRR for a SIP portfolio because it is the correct annual measure when contributions are staggered.",
            "XIRR has limitations. Over short periods, a few months for example, annualising can produce extreme figures, so a 3% gain in two months may show up as an XIRR of about 19%. XIRR is also sensitive to timing: a market fall just before the valuation date can pull it down sharply even if your long-term returns are reasonable. And like any IRR, it assumes the interim returns could be reinvested at the same rate.",
            "To judge a SIP's XIRR, compare it with the XIRR of a SIP of the same amounts on the same dates in the fund's benchmark index or in similar funds. Comparing your SIP's XIRR with a fund's published point-to-point CAGR is not a like-for-like comparison, because the two measure different patterns of investment."
        ],
        "example": "You invest ₹1,00,000 on 1 April 2024 and another ₹1,00,000 on 1 April 2025. On 1 April 2026 the holding is worth ₹2,30,000. Each gap is exactly 365 days, so the exponents are 0, 1 and 2. Measured from the end date, the equation is ₹1,00,000 × (1 + r)^2 + ₹1,00,000 × (1 + r) = ₹2,30,000. Let x = 1 + r: x² + x − 2.3 = 0. Solving, x = (−1 + √10.2) ÷ 2 = (−1 + 3.19374) ÷ 2 = 1.09687. So XIRR is about 9.69%. Check: ₹1,00,000 × 1.09687² = ₹1,20,313 and ₹1,00,000 × 1.09687 = ₹1,09,687; together ₹2,30,000. Compare the simpler measures: the absolute gain is ₹30,000 on ₹2,00,000, or 15%, and a 2-year CAGR on the total would be 1.15^0.5 − 1 = 7.24%. That understates the return because half the money was invested for only one year.",
        "mistakes": [
            "Entering investments as positive numbers in Excel, which gives a #NUM! error or a wrong answer.",
            "Forgetting to add today's market value as the final positive cash flow.",
            "Reading too much into XIRR for holdings less than a year old.",
            "Comparing a SIP's XIRR with a fund's lump-sum CAGR."
        ],
        "faq": [
            {
                "question": "Is XIRR better than CAGR?",
                "answer": "For investments with several cash flows, yes, because XIRR accounts for each date and amount. For a single lump sum with no other flows, both give the same result, and CAGR is simpler."
            },
            {
                "question": "Why is my SIP's XIRR so high or so negative in the first few months?",
                "answer": "XIRR annualises the return. A small gain or loss over a few weeks, when converted to a yearly rate, can look very large. The figure becomes more meaningful after a few years of investing."
            },
            {
                "question": "What is the difference between IRR and XIRR?",
                "answer": "IRR assumes cash flows occur at equal intervals, such as once a year. XIRR uses the actual dates, so it suits real-life investments where payments do not fall on a fixed schedule."
            },
            {
                "question": "How do I calculate XIRR for my SIP?",
                "answer": "List every instalment as a negative amount with its date, add the current value as a positive amount with today's date, then use =XIRR(amounts, dates) in Excel or Google Sheets."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Sum of [ Cᵢ ÷ (1 + XIRR)^((dᵢ − d₁) ÷ 365) ] = 0, where Cᵢ is each cash flow (outflows negative, inflows positive), dᵢ is its date and d₁ is the date of the first cash flow. XIRR is the rate that makes this sum zero, found by iteration."
    },
    "nav": {
        "shortDefinition": "NAV (Net Asset Value) is the per-unit value of a mutual fund scheme: the market value of everything the scheme owns, minus what it owes, divided by the number of units outstanding. It is calculated and published for every business day.",
        "details": [
            "To calculate NAV, the fund house values every security in the portfolio at that day's market prices, adds cash and income receivable, and subtracts liabilities, including expenses accrued but not yet paid. The result is divided by the number of units in issue. The scheme's expense ratio is accrued every day, so the NAV you see is already net of costs. Each plan and option of a scheme, such as direct and regular or growth and IDCW, has its own NAV.",
            "Fund houses must publish NAVs on the AMFI website and their own websites by 11 pm on every business day, as scheme documents filed with SEBI state. Schemes that hold overseas securities get until 10 am on the next business day, because foreign markets close later. If a NAV is delayed beyond that, the fund house has to explain the reason.",
            "The NAV you get depends on the cut-off time and on when your money reaches the fund. Under the rule in force since 1 February 2021, for purchases in most schemes the money must be available to the fund before 3 pm on a business day for you to get that day's NAV. Otherwise you get the NAV of the next business day on which the money is available before the cut-off. Liquid and overnight fund purchases have a 1:30 pm cut-off. Redemptions use a 3 pm cut-off. Since 1 July 2020, a stamp duty of 0.005% is deducted from purchase amounts, including SIP instalments, before units are allotted.",
            "A low NAV does not make a fund cheap and a high NAV does not make it expensive. Two funds with identical portfolios will give the same percentage return whether their NAV is ₹15 or ₹500; the only difference is how many units your money buys. New fund offers at ₹10 a unit are not bargains for the same reason. When a scheme pays out under the IDCW option, its NAV falls by roughly the amount paid out, because that money leaves the fund.",
            "NAV is a price, not a performance measure. To judge a fund, look at how its NAV has changed over time compared with its benchmark and similar funds, and at its costs and risk. For ETFs, the price on the stock exchange during the day can differ slightly from the NAV, depending on demand and supply."
        ],
        "example": "A scheme holds securities worth ₹520 crore at today's closing prices, plus ₹8 crore in cash and income receivable. Its liabilities, including accrued expenses, are ₹3 crore. It has 25 crore units outstanding. NAV = (520 + 8 − 3) ÷ 25 = 525 ÷ 25 = ₹21.00. You invest ₹10,000 and the money reaches the fund before 3 pm, so you get today's NAV. Stamp duty is worked out as ₹10,000 ÷ 100.005 × 0.005 = about ₹0.50, leaving ₹9,999.50 to invest. Units allotted = ₹9,999.50 ÷ ₹21.00 = 476.167 units. If the NAV later rises to ₹23.10, your holding is worth 476.167 × ₹23.10 = about ₹10,999.",
        "mistakes": [
            "Choosing a fund because its NAV is low.",
            "Expecting today's NAV for money that reaches the fund after the cut-off.",
            "Comparing NAVs of two different funds as if they showed performance.",
            "Treating an IDCW payout as an extra gain when the NAV falls by about the same amount."
        ],
        "faq": [
            {
                "question": "Is a fund with a lower NAV better?",
                "answer": "No. NAV only tells you the price of one unit. Returns depend on how the fund's investments perform, measured as the percentage change in NAV, not on the NAV level."
            },
            {
                "question": "When is mutual fund NAV updated?",
                "answer": "Once every business day, after markets close. Fund houses publish it on the AMFI website and their own sites by 11 pm, or by 10 am the next business day for schemes with overseas holdings."
            },
            {
                "question": "Why did I not get today's NAV even though I invested before 3 pm?",
                "answer": "The NAV depends on when the money reaches the fund house, not only on when you placed the order. If the funds were credited after the cut-off, the next business day's NAV applies."
            },
            {
                "question": "Does NAV include the expense ratio?",
                "answer": "Yes. Expenses are accrued daily and deducted from the scheme's assets, so the published NAV is already net of the expense ratio. You do not pay it separately."
            }
        ],
        "updated": "2026-10-24",
        "formula": "NAV = (Market value of investments + Cash and other assets − Liabilities) ÷ Number of units outstanding"
    },
    "expense-ratio": {
        "shortDefinition": "The expense ratio, or Total Expense Ratio (TER), is the annual cost of running a mutual fund scheme, expressed as a percentage of its daily net assets. It is deducted from the scheme every day, so the NAV you see is already after costs.",
        "details": [
            "The expense ratio covers the fund house's management fee and other running costs. You never receive a separate bill: the cost is accrued daily as a small fraction of the annual rate and taken out of the scheme's assets before the NAV is published. A 1% expense ratio on ₹1,00,000 therefore costs roughly ₹1,000 over a year, more if the value rises and less if it falls.",
            "From 1 April 2026, expenses are governed by the SEBI (Mutual Funds) Regulations, 2026, which replaced the 1996 regulations. TER now has two parts: a Base Expense Ratio (BER), which covers the fund house's own fees and costs, plus brokerage, regulatory levies and statutory levies such as GST, stamp duty and STT, which are charged separately at actual cost. The BER caps fall as a scheme's assets grow. For the smallest slab, schemes with assets up to ₹500 crore, the cap is 2.10% for equity schemes (down from 2.25%) and 1.85% for other schemes (down from 2.00%). Index funds and ETFs have a BER cap of 0.90%, down from 1.00%. Brokerage on cash-market trades is capped at 6 basis points.",
            "Because statutory levies now sit outside the BER, analysts expect the total cost investors pay to fall only slightly, not by the full cut in the caps. The change mainly makes it clearer what the fund house keeps and what goes to taxes and transaction costs. Fund houses revised their expense ratios when the rules took effect, and they file notices whenever they change a scheme's BER.",
            "Every scheme has a direct plan and a regular plan. SEBI made direct plans mandatory from 1 January 2013. A direct plan is bought straight from the fund house without a distributor and pays no distribution commission, so it has a lower expense ratio and a separate NAV that grows slightly faster. The regular plan includes the distributor's commission. The portfolio is identical; only the cost differs.",
            "Compare expense ratios only within the same category, for example large-cap with large-cap or one Nifty 50 index fund with another. A lower cost does not guarantee better returns from an actively managed fund, but costs are certain while returns are not. For index funds and ETFs, where every fund tracks the same index, cost and tracking error are the main differences. The expense ratio does not include exit load, which is a separate charge on early redemption."
        ],
        "example": "Two plans of the same fund earn 12% a year before costs. The direct plan charges 0.5% and the regular plan 1.5%, so for simplicity the net returns are 11.5% and 10.5% a year. You invest ₹10,00,000 once and hold for 20 years. Direct: 1.115^20 = 8.8206, so ₹10,00,000 × 8.8206 = about ₹88.21 lakh. Regular: 1.105^20 = 7.3662, so ₹10,00,000 × 7.3662 = about ₹73.66 lakh. The 1 percentage point difference in cost leaves you about ₹14.54 lakh poorer after 20 years. In the first year alone the cost is about ₹5,000 in the direct plan (0.5% of ₹10 lakh) against ₹15,000 in the regular plan; the gap widens because the money lost to costs also stops compounding. This is a simplified calculation: in practice expenses are deducted daily and returns vary each year.",
        "mistakes": [
            "Ignoring the expense ratio because the yearly amount looks small.",
            "Comparing the cost of an index fund with an actively managed fund as if they were the same product.",
            "Assuming the cheapest active fund will deliver the best returns.",
            "Confusing the expense ratio with exit load."
        ],
        "faq": [
            {
                "question": "Do I pay the expense ratio separately?",
                "answer": "No. It is deducted from the scheme's assets every day and is already reflected in the NAV. Your account statement will not show it as a separate charge."
            },
            {
                "question": "What is a good expense ratio for a mutual fund?",
                "answer": "There is no single number. Index funds and ETFs usually cost much less than actively managed funds, and direct plans cost less than regular plans. Compare a fund with others in the same category."
            },
            {
                "question": "Why is the direct plan cheaper than the regular plan?",
                "answer": "A direct plan pays no commission to a distributor, so its expense ratio is lower. The underlying portfolio is the same as the regular plan's."
            },
            {
                "question": "What changed in mutual fund expense ratios in April 2026?",
                "answer": "SEBI's new mutual fund regulations took effect on 1 April 2026. Expense ratios are now split into a Base Expense Ratio, with lower caps, plus brokerage and statutory levies such as GST charged at actuals."
            }
        ],
        "updated": "2026-10-24"
    },
    "elss": {
        "shortDefinition": "ELSS (Equity Linked Savings Scheme) is a type of equity mutual fund whose investments qualify for a tax deduction within the ₹1.5 lakh yearly limit under the old tax regime. Every investment is locked in for three years.",
        "details": [
            "An ELSS fund invests at least 80% of its money in equities and equity-related instruments, in line with the Equity Linked Saving Scheme, 2005, notified by the Ministry of Finance. SEBI's revised categorisation circular of 26 February 2026 keeps ELSS as a separate equity category. The fund manager can invest across large, mid and small companies, so the portfolio and its risk vary from fund to fund.",
            "Investments in ELSS can be deducted from taxable income, but only within a combined limit of ₹1.5 lakh a year that is shared with PPF, EPF, life insurance premiums and other eligible items. Up to FY 2025-26 this deduction sat in Section 80C of the Income-tax Act, 1961. From 1 April 2026 (tax year 2026-27), the Income-tax Act, 2025 applies, and the same deduction is in Section 123, with eligible items listed in Schedule XV. The limit is unchanged at ₹1.5 lakh. The deduction is available only if you choose the old tax regime. The new regime, which is the default, does not allow it.",
            "The lock-in is three years from the date of each investment. For a lump sum, the whole amount unlocks together. For a SIP, every monthly instalment unlocks on its own three-year anniversary, so a SIP started in April 2026 becomes redeemable month by month from April 2029. You cannot redeem units during the lock-in. After it ends you can redeem or stay invested; units do not have to be withdrawn.",
            "Because units are held for at least three years, any gain on redemption is a long-term capital gain. Long-term gains on equity funds are taxed at 12.5% on the amount above ₹1.25 lakh in a financial year, counting all your equity shares and equity fund gains together. These rates apply to transfers on or after 23 July 2024, and Budget 2026 left them unchanged. So ELSS gives a deduction when you invest, but the gains are not fully tax-free.",
            "ELSS carries full equity-market risk: the value can be lower than your investment when the lock-in ends. It adds no tax benefit if you are in the new regime, or if your EPF contributions, insurance premiums, home loan principal or tuition fees already use up the ₹1.5 lakh limit. Investing in March just to save tax often means putting a large sum into the market at one point in time."
        ],
        "example": "Ritu is a salaried taxpayer in the old regime with taxable income in the 30% slab, below ₹50 lakh so no surcharge applies, and no other eligible deductions. She runs an ELSS SIP of ₹12,500 a month from April 2026 to March 2027, a total of ₹12,500 × 12 = ₹1,50,000. Tax saved: ₹1,50,000 × 30% = ₹45,000, plus 4% cess of ₹1,800, a total of ₹46,800. Her April 2026 instalment unlocks in April 2029 and her March 2027 instalment in March 2030. Suppose that in a later year she redeems the whole holding, now worth ₹2,10,000, a gain of ₹60,000. If that is her only equity gain that year, it is within the ₹1.25 lakh exemption and no tax is due. If she also has ₹1,00,000 of long-term gains from shares in the same year, total gains are ₹1,60,000. Taxable: ₹1,60,000 − ₹1,25,000 = ₹35,000. Tax: ₹35,000 × 12.5% = ₹4,375, plus 4% cess of ₹175, a total of ₹4,550.",
        "mistakes": [
            "Investing in ELSS for tax saving after choosing the new tax regime.",
            "Assuming a SIP's whole holding unlocks three years after the first instalment.",
            "Investing in ELSS when EPF and insurance premiums already fill the ₹1.5 lakh limit.",
            "Treating ELSS maturity as tax-free when long-term gains above ₹1.25 lakh are taxable."
        ],
        "faq": [
            {
                "question": "Can I withdraw from ELSS before three years?",
                "answer": "No. Each investment is locked in for three years from its date of purchase, and units cannot be redeemed during that time."
            },
            {
                "question": "Is ELSS useful under the new tax regime?",
                "answer": "Not for tax saving, because the new regime does not allow the Section 80C (now Section 123) deduction. It still works as an ordinary equity fund with a three-year lock-in."
            },
            {
                "question": "How does the lock-in work for an ELSS SIP?",
                "answer": "Each instalment has its own three-year lock-in. An instalment invested on 5 June 2026 can be redeemed only after 5 June 2029, even if earlier instalments have already unlocked."
            },
            {
                "question": "Is ELSS return tax-free?",
                "answer": "No. Gains on redemption are long-term capital gains, taxed at 12.5% on the amount above ₹1.25 lakh in a financial year, counting all your equity gains together."
            }
        ],
        "updated": "2026-10-24"
    },
    "emi": {
        "shortDefinition": "An EMI (Equated Monthly Instalment) is the fixed monthly payment you make to repay a loan, such as a home, car or personal loan, over an agreed tenure. Each EMI is part interest and part principal; the interest share is highest at the start and falls over time.",
        "details": [
            "EMIs are calculated on a reducing balance. Each month, interest is charged only on the principal still outstanding, and the rest of the EMI repays principal. In the early years most of the EMI goes towards interest. As the outstanding amount falls, the interest share shrinks and more of each EMI repays the loan. A longer tenure lowers the EMI but sharply increases the total interest you pay.",
            "Most floating-rate home and personal loans from banks are linked to an external benchmark, usually the RBI repo rate. RBI made this mandatory for new floating-rate retail loans from 1 October 2019, and the rate must be reset at least once every three months. When the benchmark changes, your interest rate changes. Lenders often keep the EMI the same and change the number of remaining instalments instead.",
            "Under an RBI circular of 18 August 2023, which lenders had to apply to existing and new loans by 31 December 2023, borrowers with EMI-based floating-rate personal loans must be given choices when the rate is reset: a higher EMI, a longer tenure, or a mix of both; a switch to a fixed rate, which the lender may charge a fee for; and prepayment in part or in full at any time. Lenders must tell you how a rate change affects your EMI or tenure and send quarterly statements showing principal and interest recovered and the EMIs left.",
            "Under the RBI (Pre-payment Charges on Loans) Directions, 2025, issued on 2 July 2025, lenders cannot charge any prepayment or foreclosure fee on floating-rate loans to individuals for non-business purposes, with or without co-borrowers. The directions apply to loans sanctioned or renewed on or after 1 January 2026. Fixed-rate loans can still carry prepayment charges under each lender's policy, which must be disclosed in the loan documents.",
            "The EMI formula tells you the repayment, not the full cost of borrowing. Processing fees, insurance bundled with the loan and other charges are extra, so compare the annual percentage rate shown in the Key Fact Statement. Under the old tax regime, home loan principal repayment counts towards the ₹1.5 lakh limit of Section 80C, now Section 123 under the Income-tax Act, 2025."
        ],
        "example": "A home loan of ₹30,00,000 at 8.5% a year for 20 years. P = ₹30,00,000; R = 8.5 ÷ 12 ÷ 100 = 0.0070833; N = 240. Step 1: (1.0070833)^240 = 5.44124. Step 2: P × R = ₹30,00,000 × 0.0070833 = ₹21,250. Step 3: 5.44124 ÷ (5.44124 − 1) = 5.44124 ÷ 4.44124 = 1.22516. Step 4: EMI = ₹21,250 × 1.22516 = about ₹26,035. Total paid over 240 months: ₹26,034.70 × 240 = about ₹62.48 lakh, of which about ₹32.48 lakh is interest. In month one, interest is ₹30,00,000 × 0.0070833 = ₹21,250 and only ₹26,035 − ₹21,250 = ₹4,785 repays principal. Stretch the same loan to 25 years (N = 300): (1.0070833)^300 = 8.31041, EMI = ₹21,250 × 8.31041 ÷ 7.31041 = about ₹24,157. The EMI falls by about ₹1,878, but total interest rises to about ₹42.47 lakh (₹24,156.81 × 300 − ₹30,00,000), roughly ₹10 lakh more.",
        "mistakes": [
            "Choosing the longest tenure for the lowest EMI without checking the extra interest.",
            "Not noticing that a rate rise on a floating loan has extended the tenure instead of raising the EMI.",
            "Comparing loans on the interest rate alone and ignoring processing fees and bundled insurance.",
            "Assuming every loan can be prepaid free; the RBI waiver covers floating-rate loans to individuals for non-business purposes."
        ],
        "faq": [
            {
                "question": "When prepaying a loan, should I reduce the EMI or the tenure?",
                "answer": "Reducing the tenure while keeping the EMI the same usually saves more interest, because the loan is paid off sooner. Reducing the EMI eases your monthly budget but saves less interest. The right choice depends on your cash flow."
            },
            {
                "question": "What happens to my EMI when RBI changes the repo rate?",
                "answer": "If your floating-rate loan is linked to the repo rate, your interest rate changes at the next reset, which must happen at least once every three months. The lender may change your EMI, your tenure or both, and must tell you."
            },
            {
                "question": "Is there a penalty for prepaying a home loan?",
                "answer": "Not on floating-rate home loans taken by individuals for non-business purposes. RBI's 2025 directions bar prepayment charges on these for loans sanctioned or renewed from 1 January 2026. Fixed-rate loans may carry charges."
            },
            {
                "question": "Can I switch my floating-rate loan to a fixed rate?",
                "answer": "Yes. RBI requires lenders to offer a switch to a fixed rate at the time of a rate reset on EMI-based personal loans. Lenders may charge a fee and limit how many times you can switch."
            }
        ],
        "updated": "2026-10-24",
        "formula": "EMI = [P × R × (1 + R)^N] ÷ [(1 + R)^N − 1], where P is the loan amount, R is the monthly interest rate (annual rate ÷ 12 ÷ 100) and N is the number of monthly instalments."
    },
    "ipo-gmp": {
        "shortDefinition": "IPO GMP (Grey Market Premium) is the unofficial premium over the issue price at which an IPO's shares are informally traded before they list on a stock exchange. It is an unregulated sentiment indicator, not an official price.",
        "details": [
            "Before an IPO lists, some people trade in the expected shares, or in the right to them, through informal dealers. The extra amount buyers are willing to pay over the issue price is called the grey market premium. If the issue price is ₹200 and the GMP is ₹30, the grey market is implying a listing price of about ₹230, or a 15% gain. A negative GMP means the shares are being quoted below the issue price.",
            "GMP is unofficial and unregulated. It is not published by SEBI, NSE, BSE or the company, and no exchange or clearing corporation stands behind these deals, so there is no investor protection if a counterparty does not pay. SEBI's investor education material advises investors not to deal in shares in the grey market. Different websites and dealers often quote different GMPs for the same IPO on the same day.",
            "Since 1 December 2023, SEBI has required IPO shares to list within three working days of the issue closing (the T+3 timeline), down from six. GMP is usually quoted from before the issue opens until listing day, and it can change sharply with subscription figures, broader market moves and news about the company. In January 2025 SEBI's then chairperson said the regulator was working with exchanges on a 'when-listed' facility for regulated trading between allotment and listing, aimed at curbing grey-market activity.",
            "GMP can mislead. It reflects short-term trading demand, not the company's business, finances or valuation. Grey-market trading is thin and opaque, so a small number of deals can move the figure, and actual listing prices often differ from what GMP implied. Even a correct GMP tells you nothing about how the share will perform after the first day.",
            "If you follow GMP at all, treat it as one rough signal of short-term sentiment. Read the red herring prospectus for the company's financials, risks, valuation and the objects of the issue. Remember that allotment is not guaranteed: when the retail portion is oversubscribed, shares are allotted through a computerised draw of lots so that as many applicants as possible get the minimum lot. A SEBI study reported in September 2024 found that 54% of IPO shares allotted to investors were sold within a week of listing, which shows how much IPO activity is driven by short-term listing expectations."
        ],
        "example": "A hypothetical IPO has a price band of ₹190 to ₹200 and a lot size of 75 shares. Applying for one lot at the upper end costs 75 × ₹200 = ₹15,000. The day before listing, the grey market quotes a GMP of ₹30. Implied listing price = ₹200 + ₹30 = ₹230. Implied gain = ₹30 ÷ ₹200 × 100 = 15%, or ₹30 × 75 = ₹2,250 per lot. None of this is official. Suppose the shares actually list at ₹190. An allotted investor who sells at the open loses (₹200 − ₹190) × 75 = ₹750 per lot, the opposite of what the GMP suggested. And if the retail portion is heavily oversubscribed, many applicants receive no shares at all and their money is simply unblocked.",
        "mistakes": [
            "Treating GMP as an official or guaranteed listing price.",
            "Applying to an IPO only because of a high GMP without reading the prospectus.",
            "Dealing with grey-market operators, where there is no investor protection.",
            "Assuming a high GMP means allotment is more likely or that the stock will keep rising after listing."
        ],
        "faq": [
            {
                "question": "Is IPO GMP official?",
                "answer": "No. GMP is an informal, unregulated figure from the grey market. SEBI, the stock exchanges and the company do not publish or endorse it."
            },
            {
                "question": "How accurate is GMP in predicting listing price?",
                "answer": "It is not reliable. GMP can change sharply up to listing day, varies between sources, and listing prices often differ from what it implied. Use it, if at all, as a rough sentiment signal."
            },
            {
                "question": "What does a negative GMP mean?",
                "answer": "It means shares are being quoted in the grey market below the issue price, suggesting weak short-term demand. The actual listing can still be higher or lower."
            },
            {
                "question": "How is the IPO listing gain calculated from GMP?",
                "answer": "Divide the GMP by the issue price and multiply by 100. A GMP of ₹30 on a ₹200 issue implies about 15%, but this is an unofficial estimate, not a forecast."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Implied listing price (unofficial) = Issue price + GMP. Implied listing gain (%) = GMP ÷ Issue price × 100."
    },
    "old-vs-new-tax-regime": {
        "shortDefinition": "India has two income tax structures for individuals. The new regime, the default, has lower slab rates and a larger rebate but allows very few deductions. The old regime has higher rates but allows deductions such as Section 80C (now Section 123), HRA and home loan interest.",
        "details": [
            "The new regime became the default from FY 2023-24, so it applies unless you opt out. From 1 April 2026 the Income-tax Act, 2025 replaced the 1961 Act, and the new regime moved from Section 115BAC to Section 202. The new Act also replaces 'previous year' and 'assessment year' with a single 'tax year', so FY 2026-27 is tax year 2026-27. Budget 2026 kept the slabs unchanged.",
            "New regime slabs for FY 2026-27: up to ₹4 lakh, nil; ₹4 to 8 lakh, 5%; ₹8 to 12 lakh, 10%; ₹12 to 16 lakh, 15%; ₹16 to 20 lakh, 20%; ₹20 to 24 lakh, 25%; above ₹24 lakh, 30%. Salaried taxpayers get a standard deduction of ₹75,000. A rebate of up to ₹60,000, under Section 156 of the new Act (formerly Section 87A), means no tax is payable when taxable income is up to ₹12 lakh, or ₹12.75 lakh of salary after the standard deduction. The rebate does not apply to tax on income taxed at special rates, such as capital gains on shares and equity funds. Marginal relief applies to income just above ₹12 lakh.",
            "Old regime slabs for individuals below 60: up to ₹2.5 lakh, nil; ₹2.5 to 5 lakh, 5%; ₹5 to 10 lakh, 20%; above ₹10 lakh, 30%. The nil slab is ₹3 lakh for those aged 60 to 79 and ₹5 lakh for those 80 and above. The rebate is up to ₹12,500 for taxable income up to ₹5 lakh. The standard deduction is ₹50,000. In return you can claim deductions such as the ₹1.5 lakh limit under Section 80C, now Section 123, HRA exemption and home loan interest. A 4% health and education cess applies under both regimes.",
            "Under the rules in force up to FY 2025-26, salaried people and others without business income could choose either regime every year when filing their return. Those with business or professional income had to opt out of the new regime through a separate form before the return due date, and could switch back to the new regime only once. Your employer deducts TDS based on the regime you declare at the start of the year, but for salaried people the final choice is made in the return. Check the current form and conditions for tax year 2026-27 when you file.",
            "There is no rule of thumb that fits everyone. The old regime helps only if your deductions are large enough to outweigh the lower new-regime rates, and those deductions usually mean actually paying rent, a home loan or locking money into eligible investments. Work out your tax under both regimes with your own numbers before choosing."
        ],
        "example": "Amit earns a salary of ₹15,00,000 in FY 2026-27. New regime: taxable income = ₹15,00,000 − ₹75,000 = ₹14,25,000. Tax: 5% of ₹4 lakh (₹4–8 lakh) = ₹20,000; 10% of ₹4 lakh (₹8–12 lakh) = ₹40,000; 15% of ₹2,25,000 (₹12–14.25 lakh) = ₹33,750. Total ₹93,750; no rebate, as income is above ₹12 lakh. Add 4% cess of ₹3,750: ₹97,500. Old regime with only the ₹50,000 standard deduction and ₹1,50,000 under Section 123: taxable = ₹15,00,000 − ₹50,000 − ₹1,50,000 = ₹13,00,000. Tax: 5% of ₹2.5 lakh = ₹12,500; 20% of ₹5 lakh = ₹1,00,000; 30% of ₹3 lakh = ₹90,000. Total ₹2,02,500; with cess ₹2,10,600. The new regime is cheaper by ₹1,13,100. Break-even: old-regime tax before cess equals ₹93,750 when ₹12,500 + 20% × (taxable − ₹5,00,000) = ₹93,750, so taxable income = ₹9,06,250. Amit would need ₹15,00,000 − ₹9,06,250 = ₹5,93,750 of total deductions, or ₹5,43,750 beyond the standard deduction, for the old regime to match.",
        "mistakes": [
            "Assuming the old regime is better just because you have some Section 80C investments.",
            "Forgetting that the ₹12 lakh rebate does not cover capital gains taxed at special rates.",
            "Not comparing both regimes each year when your salary or deductions change.",
            "Missing the deadline to opt out when you have business income."
        ],
        "faq": [
            {
                "question": "Can I use both old and new tax regime?",
                "answer": "Not in the same year. You must choose one regime for all your income in a tax year. Salaried people without business income have been able to pick a different regime in a different year."
            },
            {
                "question": "Is income up to ₹12 lakh tax-free in the new regime?",
                "answer": "Tax on normal income up to ₹12 lakh is fully offset by a rebate of up to ₹60,000. It is a rebate, not an exemption, and it does not cover income taxed at special rates such as capital gains."
            },
            {
                "question": "Which tax regime is better for a ₹15 lakh salary?",
                "answer": "It depends on your deductions. With only the standard deduction and ₹1.5 lakh under Section 123, the new regime costs about ₹1.13 lakh less. The old regime matches it only with total deductions of about ₹5.94 lakh."
            },
            {
                "question": "What is Section 202 of the Income-tax Act, 2025?",
                "answer": "It is the section that sets out the new tax regime from tax year 2026-27, replacing Section 115BAC of the 1961 Act."
            }
        ],
        "updated": "2026-10-24"
    },
    "section-80c": {
        "shortDefinition": "Section 80C of the Income-tax Act, 1961 allowed individuals and HUFs to deduct up to ₹1.5 lakh a year for specified investments and payments, such as PPF, EPF, ELSS, life insurance premiums and children's tuition fees. From 1 April 2026 the same deduction is in Section 123 of the Income-tax Act, 2025. It is available only under the old tax regime.",
        "details": [
            "The deduction reduces your taxable income, not your tax directly. The ₹1.5 lakh is a combined limit across all eligible items, not ₹1.5 lakh per item. Only individuals and Hindu Undivided Families can claim it, and only if they choose the old tax regime. The new regime, which is the default, does not allow it.",
            "The Income-tax Act, 2025 applies from 1 April 2026, that is, tax year 2026-27. Section 80C has been renumbered as Section 123, and the list of eligible investments and payments has moved to Schedule XV. The CBDT has said the cap remains ₹1.5 lakh. For FY 2025-26 and earlier years, including returns filed in 2026, you still claim under Section 80C of the 1961 Act.",
            "Eligible items include: life insurance premiums for yourself, your spouse or children; your own contribution to EPF (the employer's share does not count); PPF deposits; ELSS mutual funds; National Savings Certificates; Sukanya Samriddhi Yojana deposits; Senior Citizens Savings Scheme deposits; 5-year tax-saver bank fixed deposits; principal repayment of a home loan for a residential house, along with stamp duty and registration charges in the year paid; and full-time tuition fees for up to two children at an Indian school, college or university.",
            "Conditions matter. For life insurance policies issued on or after 1 April 2012, the premium qualifies only up to 10% of the sum assured. ELSS units are locked in for three years and tax-saver FDs for five years. A PPF account runs for 15 years and accepts ₹500 to ₹1,50,000 a year, a cap shared with PPF accounts you operate for your minor children. Interest on tax-saver FDs is taxable even though the deposit qualifies.",
            "How much you save depends on your slab. A full ₹1.5 lakh deduction saves ₹46,800 a year if all of it falls in the 30% slab, or ₹31,200 if it falls in the 20% slab, including 4% cess and before any surcharge. Many salaried people reach the limit through EPF, insurance premiums and home loan principal alone, so adding ELSS or PPF on top gives no extra deduction. Choose eligible products for their own merits, not only to save tax."
        ],
        "example": "Priya, a salaried employee in the old regime, has taxable income of ₹11,00,000 after the standard deduction and before Section 123. During the year: EPF employee contribution ₹72,000 (12% of ₹6,00,000 basic pay), life insurance premium ₹25,000, ELSS ₹40,000 and tuition fees for one child ₹30,000. Total = ₹1,67,000, but the deduction is capped at ₹1,50,000, so ₹17,000 gives no benefit. Taxable income = ₹11,00,000 − ₹1,50,000 = ₹9,50,000. Tax before the deduction: 5% of ₹2.5 lakh = ₹12,500; 20% of ₹5 lakh = ₹1,00,000; 30% of ₹1 lakh = ₹30,000; total ₹1,42,500, or ₹1,48,200 with cess. Tax after: ₹12,500 + 20% of ₹4,50,000 (₹90,000) = ₹1,02,500, or ₹1,06,600 with cess. Saving = ₹41,600. That is ₹1,00,000 saved at 30% plus ₹50,000 at 20%, which is ₹40,000, plus 4% cess.",
        "mistakes": [
            "Claiming Section 80C or Section 123 after choosing the new tax regime.",
            "Assuming each eligible item has its own ₹1.5 lakh limit.",
            "Counting the employer's EPF contribution towards the limit.",
            "Buying an insurance policy or other product only for the deduction without checking whether it suits you."
        ],
        "faq": [
            {
                "question": "Is Section 80C available in the new tax regime?",
                "answer": "No. The deduction, now under Section 123, can be claimed only under the old tax regime."
            },
            {
                "question": "What is Section 123 of the Income-tax Act, 2025?",
                "answer": "It replaces Section 80C from tax year 2026-27, which starts on 1 April 2026. The eligible items are listed in Schedule XV and the ₹1.5 lakh limit is unchanged."
            },
            {
                "question": "Can I claim more than ₹1.5 lakh under Section 80C?",
                "answer": "No. The ₹1.5 lakh limit is a combined cap for all eligible items. Amounts invested above it do not reduce your taxable income under this section."
            },
            {
                "question": "Does home loan principal count under Section 80C?",
                "answer": "Yes. Principal repaid on a home loan for a residential house, and stamp duty and registration charges in the year paid, count towards the ₹1.5 lakh limit under the old regime."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Deduction = Lower of (total eligible investments and payments in the year) or ₹1,50,000. Tax saved ≈ Deduction × your marginal slab rate × 1.04 (including 4% cess, before surcharge)."
    },
    "tds": {
        "shortDefinition": "TDS (Tax Deducted at Source) is income tax that the payer, such as your employer, bank or tenant company, deducts before paying you and deposits with the government in your name. It is an advance payment of your own tax, not an extra tax, and it is adjusted against your final liability when you file your return.",
        "details": [
            "The law lists the kinds of payments on which tax must be deducted, the threshold above which deduction starts and the rate. The payer deducts the tax, deposits it with the government and files a TDS statement quoting your PAN. The amount then shows up against your PAN in your annual tax statement, and you claim it as tax already paid when you file your income tax return.",
            "From 1 April 2026 the Income-tax Act, 2025 applies. Salary TDS now falls under Section 392, and most other TDS, including on interest, rent and professional fees, is in a single table under Section 393, replacing the old Sections 192 and 194-series. Forms have new numbers under the Income-tax Rules, 2026: Form 16 (salary TDS certificate) becomes Form 130, Form 16A becomes Form 131, and Form 26AS becomes Form 168. Returns for FY 2025-26 and earlier years still use the old sections and form names.",
            "Thresholds were raised from 1 April 2025 and carried into the new Act. A bank, co-operative bank or post office deducts TDS on deposit interest only if the interest paid to you in the year exceeds ₹50,000, or ₹1,00,000 if you are a senior citizen. The earlier limits were ₹40,000 and ₹50,000. The limit applies per bank across all branches, and once it is crossed TDS applies to the whole interest, not just the excess. The rate is 10% if you have given your PAN; without a PAN a higher rate, generally 20%, applies. Other Budget 2025 changes: TDS on dividends starts above ₹10,000 a year (from ₹5,000), and TDS on rent starts above ₹50,000 a month.",
            "On salary there is no fixed threshold or rate. Your employer estimates your income for the whole year under the tax regime you have chosen, works out the tax, and deducts it in roughly equal monthly amounts at the average rate. Tell your employer your regime and declare other income or a previous employer's salary early in the year, or you may face a shortfall when you file. Taxable EPF withdrawals are also covered: if you withdraw ₹50,000 or more before five years of continuous service, 10% TDS applies.",
            "If your total income is below the taxable limit, you can ask the bank not to deduct TDS by giving a self-declaration. Under the Income-tax Rules, 2026 this is Form 121, which replaces Forms 15G and 15H; submit it at the start of the year, before the first interest credit. A wrong declaration can attract penalties. If TDS was deducted but your actual tax is lower, the excess is refunded after you file your return, so filing matters even when your income is small."
        ],
        "example": "Meena, aged 65, has a pension of ₹6,00,000 and fixed deposits in one bank that pay ₹1,20,000 interest in tax year 2026-27. She did not submit Form 121. Step 1: her interest of ₹1,20,000 crosses the senior-citizen threshold of ₹1,00,000, so TDS applies to the whole amount: ₹1,20,000 × 10% = ₹12,000. Step 2: her actual tax under the new regime. Pension after the ₹75,000 standard deduction = ₹6,00,000 − ₹75,000 = ₹5,25,000. Total income = ₹5,25,000 + ₹1,20,000 = ₹6,45,000. Tax on slabs: nil on the first ₹4,00,000, then 5% of (₹6,45,000 − ₹4,00,000) = 5% of ₹2,45,000 = ₹12,250. Step 3: her income is below ₹12 lakh, so the Section 156 (old 87A) rebate wipes out the ₹12,250 and her tax is nil. Step 4: the full ₹12,000 TDS is refunded once she files her return. Since her estimated tax was nil, she could have given the bank Form 121 at the start of the year and avoided the deduction altogether.",
        "mistakes": [
            "Treating TDS as the final tax and not paying the balance when your slab rate is higher than 10%.",
            "Not filing a return when TDS was deducted but no tax was due, and so never getting the refund.",
            "Submitting a declaration to stop TDS when your income is actually taxable.",
            "Not checking the annual tax statement (Form 26AS, now Form 168) for missing or wrong TDS entries before filing."
        ],
        "faq": [
            {
                "question": "What is the TDS limit on FD interest for senior citizens?",
                "answer": "From 1 April 2025, banks deduct TDS only if a senior citizen's interest from that bank exceeds ₹1,00,000 in the year. For others the limit is ₹50,000. The same limits apply under Section 393 of the Income-tax Act, 2025."
            },
            {
                "question": "How do I get TDS refunded?",
                "answer": "File your income tax return and claim the TDS shown in your annual tax statement. If the TDS is more than your actual tax, the department refunds the excess to your bank account after processing the return."
            },
            {
                "question": "What replaced Form 15G and 15H?",
                "answer": "From tax year 2026-27, Form 121 under the Income-tax Rules, 2026 replaces both. You give it to the bank or payer to request no TDS when your estimated tax for the year is nil."
            },
            {
                "question": "Why was 20% TDS deducted on my FD interest?",
                "answer": "Usually because the bank does not have a valid PAN for you, so a higher rate applies. Update your PAN with the bank; the extra TDS can still be claimed when you file your return."
            }
        ],
        "updated": "2026-10-24"
    },
    "hra": {
        "shortDefinition": "HRA (House Rent Allowance) is a part of salary paid to help an employee meet the cost of rented accommodation. Under the old tax regime part or all of it can be tax-free, limited to the lowest of three amounts; under the new regime it is fully taxable.",
        "details": [
            "The exempt amount is the lowest of: (1) the HRA actually received; (2) rent actually paid minus 10% of salary; and (3) 50% of salary if you live in a notified metro city, or 40% elsewhere. Here salary generally means basic pay plus dearness allowance that counts for retirement benefits, plus any commission fixed as a percentage of turnover. The calculation is done for the months you actually paid rent, and whatever HRA is not exempt is added to your taxable salary.",
            "Under the Income-tax Act, 1961 this exemption was Section 10(13A) with Rule 2A. From 1 April 2026 the Income-tax Act, 2025 lists it among exempt allowances in Schedule III, with the details in the Income-tax Rules, 2026. The rules notified in March 2026 extend the 50% limit to eight cities: Delhi, Mumbai, Kolkata and Chennai as before, plus Bengaluru, Hyderabad, Pune and Ahmedabad. For FY 2025-26 and earlier years, only the original four cities get 50%.",
            "The exemption is available only if you live in rented accommodation and actually pay rent. It is not available if you live in a house you own, or if you pay no rent. Paying rent to parents is possible if they own the house, the rent is genuinely paid, and they show it as income in their own return. Rent paid to a spouse is commonly challenged and best avoided.",
            "Keep rent receipts or a rent agreement and proof of payment, such as bank transfers. If the rent you pay exceeds ₹1 lakh in the year, your employer needs the landlord's PAN; the new rules also ask for details of your relationship with the landlord. If you miss declaring rent to your employer in time, you can still claim the exemption in your return under the old regime, provided you have the proofs.",
            "HRA exemption is not allowed under the new tax regime, which is the default; the whole HRA is taxable there. If your HRA exemption is large, compare both regimes before choosing. Salaried people who get no HRA at all may be able to claim a separate rent deduction under the old regime, subject to its own limits and conditions."
        ],
        "example": "Arjun works in Pune and is in the old regime for tax year 2026-27. His basic pay plus DA is ₹50,000 a month (₹6,00,000 a year), his HRA is ₹25,000 a month (₹3,00,000 a year) and he pays rent of ₹28,000 a month (₹3,36,000 a year). Step 1: actual HRA = ₹3,00,000. Step 2: rent minus 10% of salary = ₹3,36,000 − ₹60,000 = ₹2,76,000. Step 3: Pune now gets 50%, so 50% of ₹6,00,000 = ₹3,00,000. Exempt HRA = the lowest = ₹2,76,000; taxable HRA = ₹3,00,000 − ₹2,76,000 = ₹24,000. Under the earlier 40% rule for Pune, limit (3) would have been ₹2,40,000, making ₹60,000 taxable. The extra ₹36,000 exemption saves ₹36,000 × 30% × 1.04 = ₹11,232 if he is in the 30% slab. Because his rent is above ₹1 lakh a year, he must give his employer the landlord's PAN.",
        "mistakes": [
            "Expecting HRA exemption after choosing the new tax regime.",
            "Assuming the whole HRA is tax-free instead of the lowest of the three amounts.",
            "Claiming HRA with fake or cash rent receipts and no proof of payment.",
            "Not giving the landlord's PAN when the rent exceeds ₹1 lakh a year."
        ],
        "faq": [
            {
                "question": "Which cities get 50% HRA exemption?",
                "answer": "From tax year 2026-27, under the Income-tax Rules, 2026: Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune and Ahmedabad. All other places get 40%. For FY 2025-26 and earlier, only the first four cities qualify for 50%."
            },
            {
                "question": "Can I claim HRA if I pay rent to my parents?",
                "answer": "Yes, if the house belongs to them, you actually pay the rent and they report it as income in their return. Keep a rent agreement and bank transfer records."
            },
            {
                "question": "Is HRA exempt in the new tax regime?",
                "answer": "No. Under the new regime the full HRA is taxable. The exemption is available only under the old regime."
            },
            {
                "question": "I forgot to submit rent receipts to my employer. Can I still claim HRA?",
                "answer": "Yes. If you file under the old regime, you can claim the exemption in your income tax return and keep the receipts and payment proof in case the department asks for them."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Exempt HRA = Lowest of: (1) actual HRA received; (2) rent paid − 10% of salary; (3) 50% of salary in Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune or Ahmedabad (from tax year 2026-27), 40% elsewhere. Salary = basic + DA forming part of retirement benefits + turnover-based commission."
    },
    "gst": {
        "shortDefinition": "GST (Goods and Services Tax) is India's single indirect tax on the supply of goods and services, collected at each stage with credit for tax already paid. After the GST 2.0 rate changes effective 22 September 2025, most items are taxed at 5% or 18%, with a 40% rate for a small list of luxury and sin goods and nil for exempt items.",
        "details": [
            "GST replaced a range of central and state taxes from 1 July 2017. It is charged on each sale in the chain, but a registered business can set off the GST it paid on its purchases, called input tax credit, against the GST it collects on its sales. So the tax is effectively on the value added at each stage, and the final consumer bears the full rate on the final price.",
            "For a supply within one state, the tax is split equally into CGST (central) and SGST or UTGST (state or union territory). An 18% rate means 9% CGST plus 9% SGST. For a supply from one state to another, a single IGST at the full rate applies instead. The total rate is the same; only the split between the Centre and the states differs.",
            "On the GST Council's recommendation at its 56th meeting on 3 September 2025, the earlier 5%, 12%, 18% and 28% structure was rationalised from 22 September 2025 into two main rates: 5% (merit rate) and 18% (standard rate), plus a 40% demerit rate for select luxury and sin goods. Some items keep special rates, for example 3% on gold and silver. Tobacco products stayed on the old rates plus compensation cess until that cess ended; from 1 February 2026 cigarettes, pan masala and similar products attract 40% GST along with a new excise duty or cess, while biris are at 18%.",
            "One change that matters for households: from 22 September 2025, premiums on individual life insurance and individual or family health insurance policies are exempt from GST. Group policies, such as employer-provided group health or group term cover, still attract 18%. Exempt and nil-rated items also include many unprocessed foods; check the current rate schedule for a specific item, because rates are set item by item.",
            "A business generally must register once its annual turnover crosses ₹40 lakh if it supplies only goods, or ₹20 lakh for services, with lower limits in some special-category states. For an individual buyer, GST is already included in the price you pay; you cannot claim it back unless you are a registered business using the purchase for business. GST is separate from income tax and has no connection with your tax regime."
        ],
        "example": "A Mumbai consultant bills a client in Mumbai ₹10,000 for a service taxed at 18%. Step 1: GST = ₹10,000 × 18% = ₹1,800. Step 2: within the same state it splits into CGST 9% = ₹900 and SGST 9% = ₹900. Step 3: the invoice total is ₹10,000 + ₹1,800 = ₹11,800. If the client were in Bengaluru, the invoice would show IGST of ₹1,800 instead, and the total would still be ₹11,800. Working backwards from a GST-inclusive price: GST = ₹11,800 × 18 ÷ 118 = ₹1,800, and the pre-tax value = ₹11,800 − ₹1,800 = ₹10,000. For an item taxed at 5% with a pre-tax price of ₹2,000: GST = ₹2,000 × 5% = ₹100, and the price including GST is ₹2,100.",
        "mistakes": [
            "Working out the GST in an inclusive price by applying the rate to the full price, instead of using price × rate ÷ (100 + rate).",
            "Assuming every item moved to 5% or 18% under GST 2.0 without checking the current rate for that item.",
            "Expecting an employer's group health policy to be GST-free; only individual and family policies are exempt.",
            "Charging CGST plus SGST on an interstate sale, where IGST applies."
        ],
        "faq": [
            {
                "question": "What are the current GST slabs?",
                "answer": "Since 22 September 2025, the main rates are 5% and 18%, with 40% for select luxury and sin goods and nil for exempt items. A few goods carry special rates, such as 3% on gold and silver."
            },
            {
                "question": "Is there GST on health insurance now?",
                "answer": "Not on individual or family health insurance or individual life insurance, from 22 September 2025. Group policies still attract 18% GST."
            },
            {
                "question": "How do I calculate GST from an inclusive price?",
                "answer": "GST = inclusive price × rate ÷ (100 + rate). For ₹11,800 at 18%, that is ₹11,800 × 18 ÷ 118 = ₹1,800."
            },
            {
                "question": "What is the difference between CGST, SGST and IGST?",
                "answer": "CGST and SGST are charged in equal halves on sales within a state, going to the Centre and the state. IGST is charged at the full rate on sales between states and is later shared between them."
            }
        ],
        "updated": "2026-10-24",
        "formula": "GST on a pre-tax price = Price × Rate ÷ 100. GST inside an inclusive price = Inclusive price × Rate ÷ (100 + Rate). Within a state, CGST = SGST = half the rate; between states, IGST = the full rate."
    },
    "section-87a-rebate": {
        "shortDefinition": "The Section 87A rebate cuts the income tax of a resident individual to nil, up to a cap, when total income is below a set limit. From 1 April 2026 it is Section 156 of the Income-tax Act, 2025: up to ₹60,000 for income up to ₹12 lakh under the new regime and up to ₹12,500 for income up to ₹5 lakh under the old regime.",
        "details": [
            "The rebate is a reduction in tax, not in income. You first compute tax on your total income at the slab rates, then subtract the rebate, then add 4% health and education cess on whatever tax remains. Only resident individuals can claim it; non-residents and HUFs cannot. It is claimed in the return and is also allowed by employers when they work out salary TDS.",
            "Under the new regime, Budget 2025 raised the limit from ₹7 lakh to ₹12 lakh and the maximum rebate from ₹25,000 to ₹60,000. Tax on exactly ₹12 lakh at the new slabs is ₹60,000, so income up to ₹12 lakh pays no tax. For a salaried person, adding the ₹75,000 standard deduction means a salary of up to ₹12.75 lakh is tax-free. Budget 2026 kept these figures for tax year 2026-27. Under the old regime the limit stays ₹5 lakh with a maximum rebate of ₹12,500.",
            "From tax year 2026-27 the rebate is in Section 156 of the Income-tax Act, 2025, which repeats the same limits. For FY 2025-26 and earlier years, including returns filed in 2026, you still claim it under Section 87A of the 1961 Act.",
            "If your income is just above ₹12 lakh under the new regime, marginal relief applies: your tax cannot be more than the amount by which your income exceeds ₹12 lakh. This relief stops mattering at about ₹12.70 lakh of taxable income, where the normal tax becomes lower than the excess. Without it, earning ₹1 more than ₹12 lakh would cost ₹60,000 in tax.",
            "Under the new regime the rebate does not cover tax on income taxed at special rates, such as short-term gains on listed shares and equity funds (20%) or long-term gains above ₹1.25 lakh (12.5%). That income is also kept out when testing the ₹12 lakh limit. So someone with ₹10 lakh of salary income and some short-term equity gains will still pay tax on the gains even though the rest of their income is covered by the rebate."
        ],
        "example": "Case 1: Rohit's salary is ₹12,75,000 in tax year 2026-27 under the new regime. Taxable income = ₹12,75,000 − ₹75,000 standard deduction = ₹12,00,000. Tax: nil on ₹4,00,000; 5% of ₹4,00,000 (₹4–8 lakh) = ₹20,000; 10% of ₹4,00,000 (₹8–12 lakh) = ₹40,000; total ₹60,000. Rebate = ₹60,000, so tax = nil and no cess. Case 2: Sana's taxable income is ₹12,50,000. Tax = ₹60,000 + 15% of ₹50,000 (₹7,500) = ₹67,500. Her income exceeds ₹12 lakh by only ₹50,000, so marginal relief limits her tax to ₹50,000; the rebate is ₹67,500 − ₹50,000 = ₹17,500. Cess = 4% of ₹50,000 = ₹2,000, so she pays ₹52,000. Relief ends where ₹60,000 + 15% of the excess equals the excess: excess = ₹60,000 ÷ 0.85 = ₹70,588, that is at about ₹12,70,588 of taxable income.",
        "mistakes": [
            "Expecting the rebate to cover tax on short-term or long-term capital gains on shares and equity funds.",
            "Forgetting marginal relief when income is slightly above ₹12 lakh.",
            "Applying the new-regime ₹12 lakh limit after choosing the old regime, where it is ₹5 lakh.",
            "Assuming NRIs or HUFs can claim it; only resident individuals can."
        ],
        "faq": [
            {
                "question": "Is income up to ₹12 lakh tax-free?",
                "answer": "Under the new regime, yes, for resident individuals, because the rebate of up to ₹60,000 cancels the tax on income up to ₹12 lakh. Salaried people effectively pay no tax up to ₹12.75 lakh after the ₹75,000 standard deduction. Tax on special-rate income such as capital gains on shares is not covered."
            },
            {
                "question": "What is Section 156 of the Income-tax Act, 2025?",
                "answer": "It is the new home of the Section 87A rebate from tax year 2026-27. The limits are the same: ₹60,000 up to ₹12 lakh in the new regime and ₹12,500 up to ₹5 lakh in the old regime."
            },
            {
                "question": "What is marginal relief under the new regime?",
                "answer": "If your income is slightly above ₹12 lakh, your tax is capped at the amount by which your income exceeds ₹12 lakh. It ensures a small rise in income does not lead to a much larger rise in tax."
            },
            {
                "question": "Can I claim the 87A rebate on STCG from shares?",
                "answer": "Not under the new regime. Short-term gains on listed shares and equity funds are taxed at 20% and the rebate does not reduce that tax."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Rebate (new regime) = Lower of tax on total income or ₹60,000, if total income ≤ ₹12,00,000. Above ₹12 lakh, marginal relief: tax payable cannot exceed (total income − ₹12,00,000). Rebate (old regime) = Lower of tax or ₹12,500, if total income ≤ ₹5,00,000. Cess of 4% applies to tax left after the rebate."
    },
    "standard-deduction": {
        "shortDefinition": "The standard deduction is a fixed amount subtracted from salary or pension income before tax is worked out, with no bills or proofs needed. It is ₹75,000 under the new tax regime and ₹50,000 under the old regime, or the salary itself if that is lower.",
        "details": [
            "The deduction is allowed from income under the head 'Salaries', which includes pension received from a former employer. It reduces taxable income, not tax directly. You do not need to spend money or show receipts; your employer allows it automatically while working out TDS, and you claim it in your return.",
            "Budget 2024 raised the new-regime amount from ₹50,000 to ₹75,000 from FY 2024-25, while the old regime stayed at ₹50,000. From 1 April 2026 the deduction is in Section 19 of the Income-tax Act, 2025: ₹75,000 or the salary, whichever is less, under the new regime (Section 202), and ₹50,000 or the salary, whichever is less, in other cases. Budget 2026 did not change these amounts.",
            "It is available only once per year, however many employers you have. If you changed jobs and both employers allowed it, claim it only once when you file and pay any shortfall. It does not apply to business or professional income, rent, interest or capital gains, and a person with no salary or pension cannot claim it.",
            "Family pension, received by a family member after an employee's death, is taxed under 'Income from other sources', so the standard deduction does not apply. Instead there is a separate deduction of one-third of the family pension, up to ₹25,000 under the new regime or ₹15,000 under the old regime.",
            "Because it works in both regimes, the standard deduction is one of the few salary breaks left in the new regime. Together with the Section 156 (old 87A) rebate, it is why a salary of up to ₹12.75 lakh pays no tax under the new regime in tax year 2026-27. Its value in rupees is ₹75,000 times your marginal slab rate, plus cess."
        ],
        "example": "Kavita's salary is ₹18,00,000 in tax year 2026-27 and she uses the new regime. Step 1: taxable income = ₹18,00,000 − ₹75,000 = ₹17,25,000. Step 2: tax on slabs: nil on ₹4 lakh; 5% of ₹4 lakh = ₹20,000; 10% of ₹4 lakh = ₹40,000; 15% of ₹4 lakh = ₹60,000; 20% of ₹1,25,000 (₹16 lakh to ₹17.25 lakh) = ₹25,000; total ₹1,45,000. Cess at 4% = ₹5,800, so tax = ₹1,50,800. Step 3: without the deduction, tax on ₹18,00,000 would be ₹20,000 + ₹40,000 + ₹60,000 + 20% of ₹2,00,000 (₹40,000) = ₹1,60,000, plus cess ₹6,400 = ₹1,66,400. Saving = ₹1,66,400 − ₹1,50,800 = ₹15,600, which equals ₹75,000 × 20% × 1.04.",
        "mistakes": [
            "Claiming the deduction twice after changing jobs because both employers allowed it.",
            "Claiming it against freelance, business or rental income.",
            "Applying it to family pension instead of the separate family pension deduction.",
            "Using ₹75,000 in an old-regime calculation, where it is ₹50,000."
        ],
        "faq": [
            {
                "question": "What is the standard deduction for FY 2026-27?",
                "answer": "₹75,000 under the new regime and ₹50,000 under the old regime, limited to your salary if that is lower. It is now in Section 19 of the Income-tax Act, 2025."
            },
            {
                "question": "Do pensioners get the standard deduction?",
                "answer": "Yes, if the pension is from a former employer, because it is taxed as salary. Family pension received after the employee's death gets a different deduction of up to ₹25,000 (new regime) or ₹15,000 (old regime)."
            },
            {
                "question": "Do I need to submit proof for the standard deduction?",
                "answer": "No. It is a flat deduction for anyone with salary or pension income, with no bills or investments needed."
            },
            {
                "question": "Can freelancers claim the standard deduction?",
                "answer": "No. It applies only to salary and pension. Freelancers deduct actual business expenses, or use presumptive taxation if eligible."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Standard deduction = Lower of salary or ₹75,000 (new regime); Lower of salary or ₹50,000 (old regime). Tax saved ≈ deduction × marginal slab rate × 1.04."
    },
    "gratuity": {
        "shortDefinition": "Gratuity is a lump sum an employer pays an employee for long service, usually after at least five years of continuous service, on retirement, resignation, termination, death or disablement. Since 21 November 2025 it is governed by the Code on Social Security, 2020, which replaced the Payment of Gratuity Act, 1972; for non-government employees up to ₹20 lakh is tax-free.",
        "details": [
            "Gratuity is paid at 15 days' wages for every completed year of service. For monthly-paid employees, a month is treated as 26 working days, so the payment is last drawn monthly wages × 15 ÷ 26 × years of service. Wages here mean basic pay plus dearness allowance. Service of more than six months in the final year counts as a full year, so 12 years and 7 months counts as 13 years.",
            "The four labour codes took effect on 21 November 2025, and the Code on Social Security, 2020 replaced the Payment of Gratuity Act, 1972. The five-year minimum does not apply on death or disablement, and fixed-term employees now qualify after one year of service, paid pro rata. Under the Code's definition of wages, if excluded allowances exceed half of total pay, the excess is added back to wages, which can raise gratuity for employees with a low basic pay.",
            "The employer must pay within 30 days of the date gratuity becomes payable; delays attract simple interest. The statutory ceiling on gratuity is ₹20 lakh, and an employer may pay more under a contract or settlement. Many employers fund gratuity through a group gratuity scheme with an insurer, but the liability stays with the employer.",
            "Tax treatment depends on who you work for. Gratuity received by central and state government employees is fully tax-free. For others, the tax-free amount is the lowest of the gratuity calculated under the statutory formula, ₹20 lakh, and the gratuity actually received. The ₹20 lakh is a lifetime limit across all employers, so gratuity received from earlier jobs reduces it. Any excess is taxed as salary.",
            "For employees not covered by the gratuity law, the tax-free amount is the lowest of half a month's average salary (over the last 10 months) for each completed year of service, ₹20 lakh, and the amount received. Because the ₹20 lakh limit is shared across all the gratuity you receive in your working life, keep a record of gratuity received from earlier employers. Your employer deducts TDS on any taxable part, and it is reported in your salary TDS certificate."
        ],
        "example": "Ramesh leaves his private-sector job after 12 years and 7 months. His last drawn basic pay plus DA is ₹80,000 a month. Step 1: service of 7 months in the last year is more than six months, so it counts as 13 years. Step 2: gratuity = ₹80,000 × 15 ÷ 26 × 13 = ₹80,000 × 195 ÷ 26 = ₹6,00,000. Step 3: this is below ₹20 lakh and he has received no gratuity before, so all ₹6,00,000 is tax-free. A second case: a senior manager with last wages of ₹2,00,000 a month and 25 years of service would work out to ₹2,00,000 × 15 ÷ 26 × 25 = ₹28,84,615. The statutory ceiling is ₹20 lakh, but if the employer's policy pays the full ₹28,84,615, only ₹20,00,000 is tax-free and ₹8,84,615 is taxed as salary.",
        "mistakes": [
            "Using total CTC or gross salary instead of basic pay plus DA in the formula.",
            "Dividing by 30 instead of 26 for employees covered by the gratuity law.",
            "Forgetting that the ₹20 lakh tax-free limit is a lifetime limit across employers.",
            "Assuming fixed-term contract staff get nothing; they now qualify after one year."
        ],
        "faq": [
            {
                "question": "Who is eligible for gratuity?",
                "answer": "Generally, employees who complete five years of continuous service with the employer. The five-year minimum does not apply on death or disablement, and fixed-term employees qualify after one year of service, paid pro rata."
            },
            {
                "question": "Is gratuity taxable?",
                "answer": "For government employees it is fully tax-free. For others, up to ₹20 lakh in a lifetime is tax-free, subject to the statutory formula; anything above is taxed as salary."
            },
            {
                "question": "What changed for gratuity under the new labour codes?",
                "answer": "From 21 November 2025, the Code on Social Security, 2020 replaced the Payment of Gratuity Act. Fixed-term employees qualify after one year, and the new definition of wages can raise the base for employees whose allowances exceed half of pay."
            },
            {
                "question": "What is the maximum gratuity amount?",
                "answer": "The statutory ceiling is ₹20 lakh. An employer can pay more under its own policy, but for non-government employees only ₹20 lakh is tax-free."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Gratuity = Last drawn monthly wages (basic + DA) × 15 ÷ 26 × completed years of service (service above six months in the last year counts as a full year). Tax-free amount (non-government) = Lowest of formula amount, ₹20,00,000 (lifetime) and gratuity received."
    },
    "epf": {
        "shortDefinition": "EPF (Employees' Provident Fund) is the retirement savings scheme run by the EPFO for salaried employees, to which both employee and employer contribute 12% of basic pay plus DA every month. The balance earns interest declared every year, 8.25% for 2025-26, and is tax-free on withdrawal after five years of continuous service.",
        "details": [
            "The employee contributes 12% of basic pay plus DA. The employer also contributes 12%, but part of it goes to the Employees' Pension Scheme (EPS): 8.33% of wages up to the wage ceiling, which meant at most ₹1,250 a month under the old ₹15,000 ceiling. The rest of the employer's share goes to your EPF account. The employee can contribute more through the Voluntary Provident Fund, but the employer is not required to match it.",
            "The wage ceiling for mandatory EPF coverage was raised from ₹15,000 to ₹25,000 a month from 17 September 2026, after a Union Cabinet decision on 16 September 2026, the first revision since 2014. Employees earning between ₹15,000 and ₹25,000 come under mandatory coverage and EPS, and contributions linked to the ceiling go up. Check your EPF passbook to see how your own contributions are split after the change.",
            "The EPFO's Central Board of Trustees recommends the interest rate each year and the government ratifies it. The rate was 8.25% for 2023-24, 2024-25 and 2025-26; the 2025-26 rate was set on 2 March 2026, ratified in June 2026 and credited in July 2026. Interest is worked out monthly on the running balance and credited once a year after the financial year ends.",
            "Tax: the employee's contribution qualifies for the ₹1.5 lakh deduction under Section 123 (old 80C), only under the old regime. Interest on your own contributions above ₹2.5 lakh a year (₹5 lakh if the employer does not contribute) is taxable each year. Employer contributions to EPF, NPS and superannuation together above ₹7.5 lakh a year are taxable as a perquisite. If you withdraw before five years of continuous service, the withdrawal is taxable, and TDS of 10% applies if the amount is ₹50,000 or more; service with earlier employers counts if you transferred the balance.",
            "When you change jobs, transfer your balance to the new employer's account under the same UAN instead of withdrawing; it keeps your service continuous for the five-year tax rule and for EPS. In October 2025 the Central Board approved simpler partial withdrawals, merging 13 reasons into three categories (essential needs, housing and special circumstances) with a uniform 12-month minimum service. Full withdrawal is generally allowed on retirement or after a period of unemployment."
        ],
        "example": "Neha's EPF balance on 1 April 2025 is ₹5,00,000, and ₹6,000 a month is credited to it (her 12% share plus the employer's EPF portion) from April 2025 to March 2026. Simplified method: each month's contribution starts earning interest from the next month; the monthly rate is 8.25% ÷ 12 = 0.6875%. Step 1: interest on the opening balance for 12 months = ₹5,00,000 × 8.25% = ₹41,250. Step 2: the April contribution earns interest for 11 months, May for 10, and so on to March for 0; total = 66 contribution-months. Interest = ₹6,000 × 66 × 0.6875% = ₹2,722.50. Step 3: total interest for 2025-26 = ₹41,250 + ₹2,722.50 = ₹43,972.50. Step 4: closing balance on 31 March 2026 = ₹5,00,000 + ₹72,000 + ₹43,972.50 = ₹6,15,972.50. Her own contribution is well below ₹2.5 lakh a year, so the interest is tax-free.",
        "mistakes": [
            "Withdrawing the EPF balance on changing jobs instead of transferring it, which can break the five-year continuity and attract tax.",
            "Assuming the whole employer contribution goes to EPF; part goes to the pension scheme (EPS).",
            "Ignoring that interest on employee contributions above ₹2.5 lakh a year is taxable.",
            "Not linking Aadhaar and bank details to the UAN, which delays claims and transfers."
        ],
        "faq": [
            {
                "question": "What is the EPF interest rate for 2025-26?",
                "answer": "8.25%, the same as for 2023-24 and 2024-25. It was set by the Central Board of Trustees on 2 March 2026 and ratified by the government in June 2026."
            },
            {
                "question": "Is EPF withdrawal taxable?",
                "answer": "Not after five years of continuous service, including service with earlier employers if the balance was transferred. Before five years it is taxable, and 10% TDS applies on withdrawals of ₹50,000 or more."
            },
            {
                "question": "What is the new EPF wage ceiling?",
                "answer": "₹25,000 a month from 17 September 2026, up from ₹15,000. Employees earning up to this amount are covered compulsorily."
            },
            {
                "question": "How much of my EPF can I withdraw for a house or medical need?",
                "answer": "After the October 2025 changes, partial withdrawals fall into three categories with a 12-month minimum service. Limits depend on the category, so check the current rules on the EPFO member portal before applying."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Monthly interest = Running balance × (annual rate ÷ 12); for 2025-26, rate ÷ 12 = 8.25% ÷ 12 = 0.6875%. Annual interest = sum of monthly interest, credited after the financial year ends."
    },
    "nps": {
        "shortDefinition": "NPS (National Pension System) is a market-linked, defined-contribution retirement scheme regulated by PFRDA, in which your contributions are invested in equity, corporate bonds and government securities. Under PFRDA's December 2025 rules, non-government subscribers can take up to 80% of the corpus as a lump sum at exit and must use at least 20% to buy an annuity.",
        "details": [
            "The Tier I account is the retirement account: it has the tax benefits and withdrawal limits. Tier II is an optional, flexible investment account. You choose a pension fund manager and either let the money be allocated automatically by age or choose your own mix of equity, corporate bonds and government securities within PFRDA's limits. Returns depend on markets and are not guaranteed.",
            "Tax benefits under the old regime: your own contribution is deductible within the overall ₹1.5 lakh limit, and an extra ₹50,000 is available only for NPS (Section 80CCD(1B) of the 1961 Act). From 1 April 2025 this extra ₹50,000 also covers contributions to NPS Vatsalya accounts for minor children. Under the new regime your own contributions get no deduction, but the employer's contribution is deductible up to 14% of basic pay plus DA. Under the old regime, the employer limit is 14% for government employees and 10% for others. In the Income-tax Act, 2025 these deductions are in Section 124. Employer contributions to NPS, EPF and superannuation together above ₹7.5 lakh a year are taxable.",
            "Exit rules changed when PFRDA's amended exit and withdrawal regulations took effect in December 2025. For non-government subscribers at normal exit, up to 80% of the corpus can be taken as a lump sum and at least 20% must buy an annuity; if the corpus is ₹8 lakh or less, the whole amount can be withdrawn. Government sector subscribers still use at least 40% for an annuity. On premature exit, 80% must go to an annuity unless the corpus is ₹5 lakh or less. You can now stay invested until age 85, and partial withdrawals of up to 25% of your own contributions are allowed four times before 60.",
            "Tax on exit has not caught up with the 80% rule. Under the tax law, 60% of the corpus withdrawn at retirement is tax-free. Budget 2026 did not extend this to 80%, so the extra 20% lump sum may be taxed at your slab rate unless the law changes. The money used to buy an annuity is not taxed, but the pension you receive from the annuity is taxable each year.",
            "Two related schemes: NPS Vatsalya, for children, lets parents contribute to an NPS account in a minor's name that moves to a regular Tier I account at 18. The Unified Pension Scheme (UPS), from 1 April 2025, is an option within NPS for central government employees that offers an assured pension; the deadline for existing employees to choose it was 30 September 2025."
        ],
        "example": "Contribution stage: Vikram, a private-sector employee in the new regime, has basic pay plus DA of ₹1,00,000 a month. His employer puts 14% (₹14,000 a month) into his NPS. Deduction = ₹14,000 × 12 = ₹1,68,000 a year, within the ₹7.5 lakh overall cap. His colleague Anil, in the old regime at the 30% slab, puts ₹50,000 of his own money into NPS for the extra deduction; tax saved = ₹50,000 × 30% × 1.04 = ₹15,600. Exit stage: Vikram retires at 60 with a corpus of ₹50,00,000. He can take up to 80% = ₹40,00,000 as a lump sum and must use at least 20% = ₹10,00,000 for an annuity. Only 60% of the corpus (₹30,00,000) is clearly tax-free under current law; the other ₹10,00,000 of the lump sum (₹40,00,000 − ₹30,00,000) may be taxed at his slab rate. The annuity income will be taxed as he receives it.",
        "mistakes": [
            "Expecting the extra ₹50,000 deduction under the new regime; it is available only under the old regime.",
            "Assuming the full 80% lump sum is tax-free; the tax law still exempts only 60%.",
            "Choosing an annuity option without comparing rates and features across providers.",
            "Ignoring the employer NPS benefit under the new regime, which can be worth more than personal contributions."
        ],
        "faq": [
            {
                "question": "How much can I withdraw from NPS at 60?",
                "answer": "Under PFRDA's December 2025 rules, a non-government subscriber can take up to 80% as a lump sum and must use at least 20% for an annuity. If the corpus is ₹8 lakh or less, the whole amount can be withdrawn."
            },
            {
                "question": "Is NPS deduction available in the new tax regime?",
                "answer": "Only the employer's contribution, up to 14% of basic pay plus DA. Your own contributions, including the extra ₹50,000, are deductible only under the old regime."
            },
            {
                "question": "Is the NPS lump sum tax-free?",
                "answer": "60% of the corpus withdrawn at retirement is tax-free. The extra 20% allowed under the new PFRDA rules is not covered by that exemption and may be taxed at your slab rate."
            },
            {
                "question": "What is NPS Vatsalya?",
                "answer": "An NPS account opened by a parent or guardian in a minor's name. It converts to a regular NPS Tier I account when the child turns 18, and from 1 April 2025 contributions qualify for the extra ₹50,000 deduction under the old regime."
            }
        ],
        "updated": "2026-10-24"
    },
    "simple-interest": {
        "shortDefinition": "Simple interest is interest worked out only on the original principal, for the whole period of a deposit or loan. Interest already earned does not itself earn interest, so the amount grows by the same rupee figure every year.",
        "details": [
            "To calculate simple interest you need three numbers: the principal (P), the annual rate in per cent (R) and the time in years (T). Multiply them and divide by 100. For a period shorter than a year, T is a fraction, so a 146-day period at an annual rate is counted as 146 ÷ 365 of a year. Because the principal never changes, the interest for every year is the same, and a chart of the balance is a straight line rather than an upward curve.",
            "In India the best-known product that works this way is the Senior Citizens' Savings Scheme (SCSS). Interest is paid out every quarter, on the first working day of April, July, October and January, and is not added back to the deposit, so the account itself earns only simple interest. The government reviews small savings rates every quarter; for October to December 2026 it kept the SCSS rate at 8.2% a year, unchanged from the previous quarter. An individual can invest up to ₹30 lakh in SCSS. The Post Office Monthly Income Scheme similarly pays interest out every month instead of compounding it.",
            "Simple interest also turns up in tax and loans. The Income Tax Department charges simple interest at 1% for every month or part of a month on shortfalls in advance tax under sections 234B and 234C of the Income-tax Act, 1961, so even a few days into a new month counts as a full month. Some lenders quote a 'flat' interest rate on personal or vehicle loans, which is worked out as simple interest on the original loan amount for the whole tenure. Because you repay part of the principal every month, a flat rate costs much more than the same reducing-balance rate, so compare loans on their reducing-balance rate or annual percentage rate.",
            "Interest income is taxed at your slab rate, whether it is calculated as simple or compound interest. Banks, co-operative banks and post offices deduct TDS at 10% when interest paid to you in a year crosses a threshold: since 1 April 2025 the limit is ₹1 lakh for senior citizens and ₹50,000 for others. TDS is only an advance collection; the interest still has to be shown in your return. SCSS deposits qualify for the ₹1.5 lakh deduction under Section 123 of the Income-tax Act, 2025 (formerly Section 80C), but only under the old tax regime.",
            "Over the same period and rate, simple interest always gives less than compound interest, and the gap widens with time. A scheme that pays interest out is not worse than one that compounds; it simply hands you the money instead of reinvesting it. If you reinvest each payout yourself, your overall return comes closer to the compounded figure, depending on the rate you get. Simple interest is useful when you need a regular income, and it makes the income easy to predict."
        ],
        "example": "You put ₹5,00,000 into SCSS at 8.2% a year for 5 years. Yearly interest = (5,00,000 × 8.2 × 1) ÷ 100 = ₹41,000. Since it is paid quarterly, each payout is ₹41,000 ÷ 4 = ₹10,250. Over 5 years, SI = (5,00,000 × 8.2 × 5) ÷ 100 = ₹2,05,000, so you receive ₹2,05,000 in interest and get your ₹5,00,000 back at maturity. Compare a deposit that compounds once a year at the same 8.2%: 1.082^5 = 1.48298, so ₹5,00,000 grows to ₹5,00,000 × 1.48298 = about ₹7,41,492, which is ₹2,41,492 of interest. The difference of about ₹36,492 is the interest earned on interest. For a short period: ₹2,00,000 at 7% for 146 days gives SI = 2,00,000 × 7 × (146 ÷ 365) ÷ 100 = ₹5,600.",
        "mistakes": [
            "Comparing a flat loan rate with a reducing-balance rate as if they were the same.",
            "Expecting SCSS payouts to compound inside the account; they are paid out, not reinvested.",
            "Forgetting that interest is taxable at your slab rate even when TDS has not been deducted.",
            "Using months or days directly as T in the formula instead of converting them to years."
        ],
        "faq": [
            {
                "question": "What is the formula for simple interest?",
                "answer": "SI = (P × R × T) ÷ 100, where P is the principal, R is the annual rate in per cent and T is the time in years. The total amount at the end is P + SI."
            },
            {
                "question": "Which is better, simple or compound interest?",
                "answer": "For a saver, compound interest gives more over the same period and rate, because interest earns interest. For a borrower, simple interest on a reducing balance costs less. Simple-interest products that pay out regularly suit people who need steady income."
            },
            {
                "question": "Does SCSS pay simple or compound interest?",
                "answer": "SCSS pays interest every quarter and does not add it back to the deposit, so the account earns simple interest. The rate for October to December 2026 is 8.2% a year. You can reinvest the payouts elsewhere if you do not need them."
            },
            {
                "question": "How do I calculate simple interest for days?",
                "answer": "Convert the days into years by dividing by 365, then use the formula. For example, ₹2,00,000 at 7% for 146 days gives 2,00,000 × 7 × (146 ÷ 365) ÷ 100 = ₹5,600. Some banks use their own day-count rules, so the bank's figure can differ slightly."
            }
        ],
        "updated": "2026-10-24",
        "formula": "SI = (P × R × T) ÷ 100, where P is the principal, R is the annual interest rate in per cent and T is the time in years (days ÷ 365 for shorter periods). Maturity amount A = P + SI."
    },
    "swp": {
        "shortDefinition": "A Systematic Withdrawal Plan (SWP) lets you take out a fixed amount from a mutual fund scheme at regular intervals, usually monthly, by redeeming units. The units you do not redeem stay invested, so their value keeps rising or falling with the market.",
        "details": [
            "When you set up an SWP you choose the scheme, the amount, the frequency and the date. On each date the fund house redeems enough units at that day's NAV to pay you the fixed amount and credits it to your bank account. If the NAV is ₹50 and you withdraw ₹20,000, 400 units are redeemed; if the NAV later falls to ₹40, the same ₹20,000 needs 500 units. So in a falling market an SWP eats into your units faster, and in a rising market it uses fewer units.",
            "Each SWP payment is a redemption, not interest or a dividend. Only the gain on the units sold is taxed; the rest is your own money coming back. Fund houses redeem the oldest units first (first in, first out), which decides both the cost of the units sold and whether the gain is short-term or long-term. For equity-oriented funds (at least 65% in equity), units held more than 12 months give long-term gains taxed at 12.5% on the total above ₹1.25 lakh in a financial year, and units held 12 months or less give short-term gains taxed at 20%. These rates apply to transfers on or after 23 July 2024 and were unchanged for 2026-27.",
            "Debt funds are taxed differently. Gains on units of a specified mutual fund, now defined as one that invests more than 65% in debt and money market instruments, bought on or after 1 April 2023 are added to your income and taxed at your slab rate, however long you hold them. Units bought before 1 April 2023 can still qualify for 12.5% long-term tax after the required holding period. Gold, silver and international funds and hybrid funds with 35% to 65% in equity have their own holding periods, so check the rule for your scheme before planning withdrawals.",
            "An SWP from a resident individual's mutual fund holding does not attract TDS on the capital gains; you pay the tax yourself through advance tax or your return. Exit loads can apply if the units redeemed are still within the scheme's exit-load period, which is stated in the scheme documents, so many investors start an SWP only after that period ends. Compared with the IDCW (dividend) option, where the whole payout is taxed at your slab rate, an SWP is usually more tax-efficient because only the gain portion is taxed.",
            "The main risk is running out of money. If your withdrawals are larger than what the fund earns, the corpus shrinks every year, and a market fall early in retirement can deplete it much faster because more units are sold at low prices. A lower withdrawal rate, a mix of equity and debt funds, and a yearly review make the plan more durable. Nothing in an SWP guarantees the income; it depends on the scheme's returns."
        ],
        "example": "You invest ₹12,00,000 in an equity fund at a NAV of ₹40, getting 12,00,000 ÷ 40 = 30,000 units (ignoring the small stamp duty). After two years the NAV is ₹50 and you start an SWP of ₹20,000 a month. Units redeemed each month = 20,000 ÷ 50 = 400. Cost of those units = 400 × ₹40 = ₹16,000. Taxable gain = 20,000 − 16,000 = ₹4,000; the other ₹16,000 is your own money. If the NAV stayed at ₹50 for 12 months, yearly gain = 4,000 × 12 = ₹48,000. These are long-term gains (held over 12 months) and below the ₹1.25 lakh exemption, so no tax is due if you have no other equity gains that year. After 12 withdrawals you hold 30,000 − (400 × 12) = 25,200 units, worth 25,200 × 50 = ₹12,60,000. Had the same ₹4,000 gain come from a debt fund bought after 1 April 2023, it would be taxed at your slab rate: at 30% plus 4% cess, 4,000 × 0.30 × 1.04 = ₹1,248 a month. How much can a corpus pay? At an assumed 0.5% a month for 240 months: 1.005^240 = 3.31020; 1 ÷ 3.31020 = 0.30210; 1 − 0.30210 = 0.69790; ₹12,00,000 × 0.005 = ₹6,000; 6,000 ÷ 0.69790 = about ₹8,597 a month, after which the corpus would be fully used up.",
        "mistakes": [
            "Setting a withdrawal amount higher than the fund can realistically earn, which steadily drains the corpus.",
            "Starting an SWP within the exit-load period and paying the load on every withdrawal.",
            "Treating the whole SWP payout as taxable income, or ignoring tax entirely.",
            "Running an SWP from a pure equity fund for near-term income needs, where a market fall forces selling units at low prices."
        ],
        "faq": [
            {
                "question": "How is SWP taxed?",
                "answer": "Each withdrawal is a redemption, and only the gain on the units sold is taxed. For equity funds, long-term gains above ₹1.25 lakh a year are taxed at 12.5% and short-term gains at 20%. For debt funds bought on or after 1 April 2023, gains are taxed at your slab rate."
            },
            {
                "question": "Is SWP better than the IDCW (dividend) option?",
                "answer": "For tax, usually yes. An IDCW payout is fully taxed at your slab rate, while an SWP taxes only the gain portion of each withdrawal. An SWP also lets you choose the amount and date, whereas IDCW payouts depend on the fund house."
            },
            {
                "question": "Is TDS deducted on SWP?",
                "answer": "For resident individuals, no TDS is deducted on capital gains from mutual fund redemptions, including SWPs. You must still calculate and pay the tax. Non-residents face TDS on redemptions."
            },
            {
                "question": "Can I stop or change an SWP?",
                "answer": "Yes. You can stop or change an SWP through the fund house or your investment platform. The request has to reach them some days before the next withdrawal date, so check your fund house's processing time."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Monthly withdrawal that uses up a corpus exactly over n months: W = C × r ÷ [1 − (1 + r)^−n], where C is the starting corpus, r is the assumed monthly return and n is the number of months. Units redeemed per withdrawal = Withdrawal amount ÷ NAV on that day."
    },
    "mutual-fund": {
        "shortDefinition": "A mutual fund pools money from many investors and invests it in shares, bonds, money market instruments or other assets according to a stated objective, under a professional fund manager. Each investor holds units, and the value of a unit (the NAV) rises or falls with the fund's investments.",
        "details": [
            "A mutual fund scheme in India is run by an asset management company (AMC). It is regulated by SEBI, whose new SEBI (Mutual Funds) Regulations, 2026 came into force on 1 April 2026, replacing the 1996 regulations. When you invest, you are allotted units at the applicable NAV after a 0.005% stamp duty on the purchase amount. You can invest a lump sum or through a SIP, and most open-ended schemes let you redeem on any business day at that day's NAV, subject to any exit load.",
            "SEBI requires every scheme to fit into a defined category so that similar funds can be compared. The 2017 categorisation framework grouped schemes into equity, debt, hybrid, solution-oriented and other schemes. A SEBI circular of 26 February 2026 revised this into equity, debt, hybrid, life cycle funds and other schemes (such as index funds, ETFs and funds of funds), discontinued the solution-oriented category for retirement and children's funds, and barred return-focused words in scheme names. Each scheme also carries a riskometer with six levels, from Low to Very High, which has been reviewed every month since 1 January 2021.",
            "Every scheme has a direct plan and a regular plan. Direct plans, available since 1 January 2013, are bought straight from the fund house or through a platform that does not take commission from the fund, and have a lower expense ratio. Regular plans pay commission to a distributor out of the scheme's expenses, so their NAV grows a little slower. Both plans hold the same portfolio. Units can be held in a statement of account with the fund house; a demat account is needed only for exchange-traded units such as ETFs, or if you choose to hold units in demat form.",
            "Tax depends on the kind of fund. Equity-oriented funds (at least 65% in equity) are taxed like listed shares: gains on units held over 12 months are taxed at 12.5% on the total above ₹1.25 lakh a year, and gains within 12 months at 20%, for transfers on or after 23 July 2024. Gains from specified mutual funds, defined for 2026-27 as funds with more than 65% in debt and money market instruments, are taxed at your slab rate for units bought on or after 1 April 2023, regardless of holding period. Income paid out under the IDCW option is taxed at your slab rate, and from 1 April 2025 TDS of 10% applies when IDCW from a fund house exceeds ₹10,000 in a year.",
            "Returns are not guaranteed. Even debt and liquid funds can lose value if interest rates move sharply or a borrower defaults, and equity funds can fall a lot over short periods. Before investing, read the scheme information document, check the category, riskometer, expense ratio and benchmark, and compare the fund's past returns with its benchmark index over several periods. Past performance does not guarantee future returns."
        ],
        "example": "You invest ₹1,00,000 in the direct plan of an equity fund at a NAV of ₹50. Stamp duty = 1,00,000 ÷ 100.005 × 0.005 = about ₹5.00, leaving ₹99,995 to invest. Units allotted = 99,995 ÷ 50 = 1,999.900 units. Three years later the NAV is ₹80, so the holding is worth 1,999.900 × 80 = ₹1,59,992. Gain = 1,59,992 − 99,995 = ₹59,997. The units were held over 12 months, so this is a long-term capital gain. It is below the ₹1.25 lakh yearly exemption, so no tax is payable if you have no other equity gains that year. If the same gain came from a debt fund bought after 1 April 2023, it would be taxed at your slab rate: at 30% plus 4% cess, 59,997 × 0.30 × 1.04 = about ₹18,719.",
        "mistakes": [
            "Picking a fund only on last year's return without checking its category, risk level and long-term record against its benchmark.",
            "Assuming a debt or liquid fund cannot lose money.",
            "Buying the regular plan without realising a direct plan of the same scheme has lower costs.",
            "Holding several funds from the same category and assuming that is diversification."
        ],
        "faq": [
            {
                "question": "Is a mutual fund safe?",
                "answer": "Mutual funds are regulated by SEBI, which sets rules on how they invest, disclose their portfolios and charge expenses. But the investments themselves carry market risk, so the value of your units can fall. The riskometer shows how risky each scheme is."
            },
            {
                "question": "Do I need a demat account to invest in mutual funds?",
                "answer": "No. You can invest directly with a fund house or through a platform and hold units in a statement of account. A demat account is needed only for exchange-traded units such as ETFs, or if you choose demat holding."
            },
            {
                "question": "What is the difference between direct and regular plans?",
                "answer": "Both invest in the same portfolio. A regular plan pays a commission to the distributor from the scheme's expenses, so it has a higher expense ratio and a lower NAV growth than the direct plan."
            },
            {
                "question": "How are mutual fund gains taxed?",
                "answer": "Equity-oriented funds: 12.5% on long-term gains above ₹1.25 lakh a year (held over 12 months) and 20% on short-term gains. Debt-oriented funds bought on or after 1 April 2023: slab rate on all gains. Other funds such as gold or international funds have separate rules."
            }
        ],
        "updated": "2026-10-24"
    },
    "sensex": {
        "shortDefinition": "The Sensex is the benchmark stock index of BSE (formerly the Bombay Stock Exchange), made up of 30 large, liquid companies across major sectors. Its movement is widely used as a quick measure of how India's large listed companies are doing.",
        "details": [
            "The Sensex was first compiled in 1986. Its base year is 1978-79 and its base value is 100, so its level shows how the combined value of its constituents has grown since then. It is maintained by Asia Index Pvt Ltd, which became a wholly owned BSE subsidiary in May 2024 when BSE bought out S&P Dow Jones Indices' stake. The index was earlier co-branded as the S&P BSE Sensex and is now generally called the BSE Sensex.",
            "Since 1 September 2003 the Sensex has been calculated on free-float market capitalisation. Instead of counting all of a company's shares, it counts only those available for trading, leaving out shares held by promoters, the government and other locked-in holders. Each stock's weight is its free-float market cap as a share of the total. So a company with a large promoter holding can have a smaller weight than its full market value suggests, and the biggest stocks move the index the most.",
            "The index value is the current free-float market cap of the 30 stocks divided by a base market cap, multiplied by 100. The base figure is adjusted for corporate actions such as rights issues and for changes in constituents, so the index level does not jump just because a stock was replaced. The constituents are reviewed twice a year, in June and December, using criteria such as listing history, free-float market cap and trading activity, and changes are announced in advance.",
            "The Sensex is a price index; it does not include dividends. Its total return variant adds dividends back, which is the fairer benchmark when comparing a mutual fund's returns. BSE also offers derivatives on the Sensex: since 1 September 2025 its weekly and monthly contracts expire on Thursdays, while NSE's expire on Tuesdays. If an expiry day is a trading holiday, the expiry usually moves to the previous trading day.",
            "You cannot buy the Sensex itself, but you can invest in it through index funds and ETFs that track it. These are taxed like other equity investments: 12.5% on long-term gains above ₹1.25 lakh a year (held over 12 months) and 20% on short-term gains. Daily Sensex moves reflect only 30 companies, so they do not always match how mid-cap and small-cap stocks, or your own portfolio, performed."
        ],
        "example": "A hypothetical illustration of free-float weighting. A Sensex company has a total market value of ₹10,00,000 crore and its promoters hold 55%. Free-float factor = 1 − 0.55 = 0.45, so its free-float market cap = 10,00,000 × 0.45 = ₹4,50,000 crore. Suppose the combined free-float market cap of all 30 stocks is ₹90,00,000 crore. The company's weight = 4,50,000 ÷ 90,00,000 = 5%. If this stock rises 10% and the other 29 are unchanged, its free-float cap becomes 4,50,000 × 1.10 = ₹4,95,000 crore and the total becomes 90,00,000 + 45,000 = ₹90,45,000 crore. The index rises by 90,45,000 ÷ 90,00,000 − 1 = 0.5%, which is the same as weight × price move: 5% × 10% = 0.5%. A stock with a 1% weight rising by the same 10% would lift the index by only 1% × 10% = 0.1%. (Figures are illustrative, not actual Sensex data.)",
        "mistakes": [
            "Comparing a mutual fund's return with the Sensex price index instead of its total return index, which includes dividends.",
            "Treating a big Sensex move as a signal about the whole market, when it covers only 30 large companies.",
            "Assuming every constituent has equal influence; the largest free-float stocks drive most of the movement.",
            "Judging market direction from points instead of percentage changes, which become larger in points as the index rises."
        ],
        "faq": [
            {
                "question": "What is the difference between Sensex and Nifty?",
                "answer": "The Sensex is BSE's index of 30 stocks with base year 1978-79 and base value 100. The Nifty 50 is NSE's index of 50 stocks with base date 3 November 1995 and base value 1,000. Both use free-float market cap weighting, and they usually move in the same direction."
            },
            {
                "question": "How often are Sensex stocks changed?",
                "answer": "The Sensex is reviewed twice a year, in June and December. Stocks can be added or removed based on free-float market cap, liquidity and other eligibility criteria, and changes are announced before they take effect."
            },
            {
                "question": "Can I invest in the Sensex?",
                "answer": "Yes, through index funds or ETFs that track the Sensex. They hold the same stocks in roughly the same weights, and returns differ slightly from the index because of costs and tracking error."
            },
            {
                "question": "Why does the Sensex move when only a few stocks rise?",
                "answer": "Because it is weighted by free-float market cap, a few large companies make up a big share of the index. A sharp move in one heavyweight can move the Sensex more than small moves in many smaller constituents."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Sensex = (Total free-float market capitalisation of the 30 constituents ÷ Base market capitalisation) × 100, where free-float market cap = share price × shares outstanding × free-float factor. The base market cap is adjusted for corporate actions and constituent changes."
    },
    "nifty-50": {
        "shortDefinition": "The Nifty 50 is the National Stock Exchange's benchmark index of 50 large, liquid Indian companies, weighted by free-float market capitalisation. It is the most widely tracked Indian index for index funds, ETFs and derivatives.",
        "details": [
            "The Nifty 50 is maintained by NSE Indices Ltd. Its base date is 3 November 1995 and its base value is 1,000, so its level shows how the free-float market value of its constituents has changed since then. Like the Sensex, each stock's weight depends on its free-float market cap, the value of shares actually available for trading, which excludes promoter and other locked-in holdings.",
            "To be eligible, a company must be allowed to trade in NSE's futures and options segment and must have a listing history of at least one month as of the cut-off date. It must also be liquid enough: its average impact cost over the previous six months must be 0.50% or less for 90% of observations, for a basket of ₹10 crore. Eligible stocks are then selected mainly on the basis of free-float market capitalisation.",
            "The index is reviewed and rebalanced twice a year. The cut-off dates are 31 January and 31 July, and the review uses average data for the six months ending on the cut-off date. Changes are announced in advance, which is why stocks entering or leaving the Nifty 50 often see heavy trading from index funds around the effective date. The list can also change between reviews because of corporate events such as a merger or delisting.",
            "The Nifty 50 is a price index and does not include dividends. NSE also publishes a Nifty 50 Total Returns Index, which adds back dividends and is the right benchmark for comparing an index or large-cap fund's returns. Since 1 September 2025, NSE's equity derivatives, including Nifty weekly and monthly options, expire on Tuesdays, with the expiry moved to the previous trading day if Tuesday is a holiday.",
            "You can invest in the Nifty 50 through index funds and ETFs. They are taxed as equity: long-term gains (held over 12 months) above ₹1.25 lakh a year at 12.5%, and short-term gains at 20%. When comparing such funds, look at the expense ratio and tracking error, since all of them hold the same 50 stocks."
        ],
        "example": "A hypothetical day's move shows how weights work. Suppose stock A has a 12% weight in the Nifty 50 and rises 3%, stock B has an 8% weight and falls 2%, and the other 48 stocks (80% weight together) are unchanged. Contribution of A = 0.12 × 3% = +0.36%. Contribution of B = 0.08 × (−2%) = −0.16%. Others = 0.80 × 0% = 0%. Net index change = 0.36% − 0.16% = +0.20%. If the index were at a hypothetical 10,000 points, that would be 10,000 × 0.0020 = 20 points. So even though one large stock fell, the index rose, because the stock that rose had a bigger weight and a bigger move. (Weights and levels are illustrative, not actual Nifty data.)",
        "mistakes": [
            "Comparing a fund's return with the Nifty 50 price index instead of the Total Returns Index.",
            "Choosing a Nifty 50 index fund on past returns rather than expense ratio and tracking error, since all such funds hold the same stocks.",
            "Assuming the 50 stocks are equally weighted; a handful of large companies account for a large part of the index.",
            "Reading point changes without the percentage, which makes moves look bigger as the index level rises."
        ],
        "faq": [
            {
                "question": "What is the base value of the Nifty 50?",
                "answer": "The Nifty 50 has a base value of 1,000 as of its base date, 3 November 1995. Its current level shows the change in the free-float market value of its constituents since then."
            },
            {
                "question": "How often does the Nifty 50 change its stocks?",
                "answer": "The index is reviewed twice a year, using six-month average data up to the cut-off dates of 31 January and 31 July. Stocks can also be replaced between reviews in special cases such as delisting or a merger."
            },
            {
                "question": "What is the Nifty expiry day?",
                "answer": "Since 1 September 2025, NSE's equity derivatives, including Nifty 50 options, expire on Tuesdays: weekly contracts every Tuesday and monthly contracts on the last Tuesday of the month. If Tuesday is a trading holiday, expiry moves to the previous trading day."
            },
            {
                "question": "Is a Nifty 50 index fund safe?",
                "answer": "It spreads money across 50 large companies, which reduces the risk of any single stock, but it carries full equity market risk and can fall sharply in a market decline. It is better suited to long holding periods."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Nifty 50 = (Current free-float market capitalisation of the 50 constituents ÷ Base market capitalisation) × 1,000, with the base set at 3 November 1995 and adjusted for corporate actions and constituent changes. A stock's contribution to the day's move ≈ its weight × its percentage price change."
    },
    "demat-account": {
        "shortDefinition": "A demat (dematerialised) account holds shares, bonds, ETFs and other securities in electronic form, in place of paper certificates. You need one to buy, sell or receive listed shares in India, including shares allotted in an IPO.",
        "details": [
            "India has two depositories, NSDL and CDSL, which hold securities electronically. You open a demat account through a depository participant (DP), such as a broker or bank, after completing KYC with your PAN. The demat account only stores securities. To buy or sell on a stock exchange you also need a trading account, and the two are usually opened together with the same broker.",
            "Since 1 April 2019, SEBI has required listed shares to be in demat form before they can be transferred, with exceptions for transmission (for example, to heirs) and transposition of names. You can still hold old physical certificates, but to sell or transfer them you must first convert them through your DP. Stock trades in India settle on a T+1 basis, fully in force since 27 January 2023, so shares you buy are credited to your demat account one trading day after the trade, and the pay-out for shares you sell is also settled one trading day later.",
            "SEBI's revised nomination rules took effect on 1 September 2026 under a circular dated 29 May 2026. For demat accounts held by a single person and opened from that date, you must give a nomination unless you submit an opt-out declaration; for joint accounts nomination is optional. You can name up to three nominees, and only the nominee's name and relationship are mandatory, with date of birth required if the nominee is a minor. Existing account holders who have not nominated are not forced to, but receive reminders twice a year.",
            "Small investors can use a Basic Services Demat Account (BSDA). Under SEBI rules in force since 1 September 2024, an individual can have one BSDA, as sole or first holder, if the total value of securities held is up to ₹10 lakh. There is no annual maintenance charge if holdings are worth up to ₹4 lakh, and a maximum of ₹100 a year for ₹4 lakh to ₹10 lakh. Above ₹10 lakh the account is no longer a BSDA and normal charges can apply.",
            "A demat account is not required for ordinary mutual fund investments; units can be held in a statement of account with the fund house, though you can choose to hold them in demat. Holding securities in demat has no tax effect by itself. Tax arises only when you sell or receive income, such as dividends taxed at your slab rate or capital gains on shares. Keep your demat account secure: use two-factor login, check the statements and transaction alerts from NSDL or CDSL, and do not share your login or OTPs."
        ],
        "example": "An illustration of BSDA charges and T+1 settlement. Your BSDA holds securities worth ₹3,85,000, so the annual maintenance charge is nil (up to ₹4 lakh). On a Monday you buy 25 shares at ₹840: 25 × 840 = ₹21,000 (before brokerage and taxes). With T+1 settlement, the shares are credited on Tuesday, the next trading day. Your holdings are now 3,85,000 + 21,000 = ₹4,06,000. That is above ₹4 lakh but below ₹10 lakh, so the maximum annual maintenance charge in this band is ₹100. If your holdings grew above ₹10 lakh, the account would stop being a BSDA and the DP's regular charges could apply. Had you bought on a Friday, the shares would be credited on Monday, assuming no holiday.",
        "mistakes": [
            "Thinking a demat account is needed for mutual funds; it is optional except for exchange-traded units.",
            "Not adding a nominee or opting out formally, which can delay the transfer of holdings to family members.",
            "Opening several demat accounts and paying maintenance on all of them, when a single BSDA might suit a small portfolio.",
            "Ignoring depository SMS and email alerts, which are the quickest way to spot unauthorised transactions."
        ],
        "faq": [
            {
                "question": "What is the difference between a demat account and a trading account?",
                "answer": "A demat account holds your securities. A trading account is used to place buy and sell orders on the exchange. You need both to trade shares, and brokers usually open them together."
            },
            {
                "question": "How many nominees can I add to a demat account?",
                "answer": "Under SEBI rules effective 1 September 2026, up to three. New single-holder accounts must have a nomination unless you file an opt-out declaration; for joint accounts nomination is optional."
            },
            {
                "question": "What is a BSDA demat account?",
                "answer": "A Basic Services Demat Account is a low-cost demat account for individuals with holdings up to ₹10 lakh. There is no annual maintenance charge up to ₹4 lakh and a maximum of ₹100 a year between ₹4 lakh and ₹10 lakh. You can hold only one BSDA."
            },
            {
                "question": "When are shares credited to my demat account after buying?",
                "answer": "India uses T+1 settlement, so shares are credited one trading day after the trade date. Shares bought on a Friday are usually credited on Monday, unless there is a holiday."
            }
        ],
        "updated": "2026-10-24"
    },
    "gold-purity": {
        "shortDefinition": "Gold purity tells you how much pure gold an item contains, expressed in karats (out of 24) or fineness (parts per thousand). 22K gold is 91.6% pure and is hallmarked 22K916; 18K is 75% pure (18K750); 24K, used for coins and bars, is 99.5% or 99.9% pure.",
        "details": [
            "Karat is the number of parts of pure gold in 24 parts of metal; fineness is the same thing expressed per thousand. To convert, divide the karat by 24 and multiply by 1,000: 22K is 916.7, marked 916; 18K is exactly 750; 20K is 833; 23K is 958. 14K works out to 583.3, but the Indian hallmark grade is 585. Under the Indian standard (IS 1417), 999 (fine gold) and 995 are the grades for bullion and coins, while jewellery is made in lower grades because pure gold is too soft; it is alloyed with metals such as copper and silver for strength.",
            "Hallmarking of gold jewellery and artefacts by the Bureau of Indian Standards (BIS) became mandatory on 23 June 2021, starting in 256 districts. Coverage has been widened in phases; a sixth phase from 2 March 2026 took it to 380 districts, and further districts have been added since. The mandatory grades are 14K, 18K, 20K, 22K, 23K and 24K. Jewellers with an annual turnover up to ₹40 lakh and some handcrafted jewellery such as kundan, polki and jadau are exempt.",
            "Since 1 April 2023, hallmarked gold jewellery can be sold only if it carries a six-digit alphanumeric HUID (Hallmark Unique Identification) code. A current hallmark has three marks: the BIS logo, the purity grade (for example 22K916) and the HUID. You can check the HUID in BIS's free BIS CARE app using 'Verify HUID', which shows the item's details and the jeweller's registration. Older jewellery with the earlier four-mark hallmark remains valid, and you can sell or exchange old hallmarked or unhallmarked jewellery to a jeweller.",
            "If hallmarked jewellery tests lower than the purity marked on it, the BIS Rules, 2018 entitle you to compensation of twice the value of the purity shortfall, based on the item's weight, plus testing charges. You can get a piece tested at a BIS-recognised assaying and hallmarking centre and complain through the BIS CARE app or portal. Purity also affects price: jewellers quote separate rates for 24K and 22K gold, and you pay making charges and GST on top.",
            "For tax, physical gold, coins and jewellery sold after more than 24 months give long-term gains taxed at 12.5% without indexation, for transfers on or after 23 July 2024. Sold within 24 months, the gain is added to your income and taxed at your slab rate. Purity does not change the tax rule, but it determines how much gold you actually own and therefore your resale value."
        ],
        "example": "A 20 g necklace marked 22K916 contains 20 × 916 ÷ 1,000 = 18.32 g of pure gold. (22 ÷ 24 = 0.9167, which is why 22K is marked 916.) A 20 g piece in 18K750 contains 20 × 750 ÷ 1,000 = 15.00 g, which is 18.32 − 15.00 = 3.32 g less gold for the same weight. Now suppose a 10 g chain marked 22K916 tests at 875 fineness at a BIS centre. Shortfall = (916 − 875) ÷ 1,000 × 10 = 0.41 g of pure gold. At a hypothetical ₹10,000 per gram of pure gold, the shortfall is worth 0.41 × 10,000 = ₹4,100, so the compensation would be 2 × ₹4,100 = ₹8,200, plus testing charges. (The gold rate here is only for illustration.)",
        "mistakes": [
            "Paying the 24K rate for 22K or 18K jewellery; check that the rate on the bill matches the purity marked.",
            "Buying jewellery without checking the six-digit HUID in the BIS CARE app.",
            "Assuming a jeweller's own purity stamp is the same as a BIS hallmark.",
            "Expecting 24K jewellery; most gold jewellery is 22K or lower because pure gold is too soft for everyday wear."
        ],
        "faq": [
            {
                "question": "What does 916 mean on gold?",
                "answer": "916 means the gold is 91.6% pure, which is 22 karat (22 ÷ 24 × 1,000 = 916.7, marked 916). It appears as part of the BIS hallmark, written as 22K916."
            },
            {
                "question": "How do I check if my gold is hallmarked?",
                "answer": "Look for three marks: the BIS logo, the purity grade such as 22K916, and a six-digit alphanumeric HUID. Enter the HUID in the BIS CARE app under 'Verify HUID' to see the item's details and the jeweller's registration."
            },
            {
                "question": "Is old jewellery without HUID still valid?",
                "answer": "Yes. Jewellery hallmarked under the older system remains valid, and you can sell or exchange old hallmarked or unhallmarked jewellery to a jeweller. The HUID rule applies to new sales by jewellers since 1 April 2023."
            },
            {
                "question": "Which is better to buy, 22K or 24K gold?",
                "answer": "24K (999 or 995) is used for coins and bars as an investment because it is almost pure. 22K is the usual choice for jewellery because it is harder. Compare price per gram of pure gold, making charges and resale terms."
            }
        ],
        "updated": "2026-10-24",
        "formula": "Fineness = (Karat ÷ 24) × 1,000; Purity % = Fineness ÷ 10; Pure gold content (g) = Weight of item (g) × Fineness ÷ 1,000."
    },
    "ppf": {
        "shortDefinition": "PPF (Public Provident Fund) is a government-backed savings scheme with a 15-year term, open to resident individuals through post offices and authorised banks. Deposits can be claimed as a deduction under the old tax regime, and the interest and maturity amount are tax-free, which is why PPF is called an EEE (exempt-exempt-exempt) product.",
        "details": [
            "You can deposit between ₹500 and ₹1,50,000 in a financial year, as a lump sum or in instalments. The ₹1.5 lakh cap is shared with any PPF account you run for a minor child, and amounts above it earn no interest. Interest is worked out every month on the lowest balance between the close of the 5th day and the end of the month, and credited once a year on 31 March. So money deposited on or before the 5th earns interest for that month, while money deposited later does not.",
            "The rate is set by the Ministry of Finance every quarter and applies to the whole balance, so it can change during the life of the account. For the October–December 2026 quarter it is 7.1% a year, unchanged from the previous quarter under the Finance Ministry's order of 30 September 2026. Interest is compounded once a year. Because the rate is not fixed, any long-term projection is only an estimate.",
            "PPF money is not fully locked away for 15 years. A loan of up to 25% of the balance at the end of the second year before the year you apply is available from the 3rd to the 6th financial year, at 1% above the PPF rate. From the 7th financial year you can make one partial withdrawal a year, up to 50% of the balance at the end of the fourth year before, or at the end of the previous year, whichever is lower. Early closure is allowed after five years only for specified reasons such as a life-threatening illness, higher education or becoming a non-resident, and the interest is then cut by 1%.",
            "The account matures after 15 years counted from the end of the financial year in which it was opened. You can then close it, or extend it in blocks of 5 years. If you want to keep depositing, you must submit the extension form within one year of maturity; otherwise the account continues without fresh deposits and keeps earning interest. During an extension with deposits, withdrawals in each 5-year block are limited to 60% of the balance at the start of the block.",
            "Deposits count towards the ₹1.5 lakh limit of Section 80C, which became Section 123 of the Income-tax Act, 2025 from 1 April 2026, and only under the old tax regime. Interest and the maturity amount are exempt under both regimes. A person can hold only one PPF account in their own name, and non-residents cannot open a new one. This is general information, not investment advice."
        ],
        "formula": "Maturity value (fixed rate, deposit made at the start of each year) = D × [((1 + r)^n − 1) ÷ r] × (1 + r), where D is the yearly deposit, r is the annual rate as a decimal and n is the number of years.",
        "example": "Assume ₹1,50,000 is deposited on or before 5 April every year for 15 years and the rate stays at 7.1% throughout (it will not in practice). Year 1: ₹1,50,000 × 1.071 = ₹1,60,650. Year 2: (₹1,60,650 + ₹1,50,000) × 1.071 = ₹3,32,706. Using the formula: (1.071)^15 = 2.79796; (2.79796 − 1) ÷ 0.071 = 25.32343; × 1.071 = 27.12139; × ₹1,50,000 = about ₹40,68,209. Total deposited: ₹1,50,000 × 15 = ₹22,50,000. Interest earned: ₹40,68,209 − ₹22,50,000 = about ₹18,18,209, all of it tax-free. Under the old regime, each year's ₹1,50,000 deposit also uses up the full Section 123 limit.",
        "mistakes": [
            "Depositing after the 5th of the month and losing that month's interest, especially for a lump sum made in April.",
            "Depositing more than ₹1,50,000 in a year across your own and your child's PPF accounts; the excess earns nothing.",
            "Letting the account mature without submitting the extension form, and then finding you cannot add fresh deposits.",
            "Treating today's 7.1% as guaranteed for 15 years; the rate is reset every quarter."
        ],
        "faq": [
            {
                "question": "What is the PPF interest rate for October–December 2026?",
                "answer": "It is 7.1% a year, compounded annually. The Finance Ministry kept it unchanged for the quarter from 1 October to 31 December 2026. The rate is reviewed every quarter."
            },
            {
                "question": "Can I withdraw money from PPF before 15 years?",
                "answer": "Yes, partly. From the 7th financial year you can make one partial withdrawal a year, up to 50% of an eligible balance. Full early closure is allowed only after five years for specified reasons, with 1% less interest."
            },
            {
                "question": "Is PPF interest taxable under the new tax regime?",
                "answer": "No. PPF interest and the maturity amount are tax-free under both regimes. Only the deduction for deposits is limited to the old regime."
            },
            {
                "question": "What happens to my PPF account after 15 years?",
                "answer": "You can close it and take the full balance, or extend it in blocks of 5 years. To keep depositing you must apply for the extension within one year of maturity; if you do nothing, it continues without deposits and still earns interest."
            }
        ],
        "updated": "2026-10-24"
    },
    "ssy": {
        "shortDefinition": "Sukanya Samriddhi Yojana (SSY) is a government savings scheme for a girl child, opened by a parent or legal guardian before she turns 10. Deposits are made for 15 years, the account matures 21 years after opening, and the interest and maturity amount are tax-free.",
        "details": [
            "An account can be opened at a post office or authorised bank for a girl below 10 years of age. A family can open accounts for at most two girls, with an exception for twins or triplets backed by an affidavit and birth certificates. Each girl can have only one account. The guardian operates it until she turns 18, after which she operates it herself.",
            "You must deposit at least ₹250 and not more than ₹1,50,000 in each financial year. Deposits can be made until 15 years from the date of opening; after that the balance keeps earning interest until maturity at 21 years. If the minimum is missed in a year, the account goes into default and can be revived during the deposit period by paying the missed amounts plus a penalty of ₹50 for each year of default.",
            "The rate is set every quarter and applies to the whole balance. It is 8.2% a year for October–December 2026, unchanged under the Finance Ministry's order of 30 September 2026. Interest is calculated monthly on the lowest balance between the 5th and the end of the month, and credited at the end of each financial year, so deposits made by the 5th earn interest for that month.",
            "Money can come out early only in set cases. Once the girl turns 18 or passes Class 10, whichever is earlier, up to 50% of the balance at the end of the previous financial year can be withdrawn for her education. The account can be closed early for her marriage after she turns 18, but not earlier than one month before or later than three months after the marriage. Closure is also allowed on her death, or on extreme compassionate grounds such as a life-threatening illness, but not on compassionate grounds within the first five years.",
            "Deposits count towards the ₹1.5 lakh limit of Section 80C, now Section 123 of the Income-tax Act, 2025, only under the old tax regime. Interest and the maturity amount are exempt under both regimes. Because deposits run for 15 years but the money stays invested for 21, the last six years of growth come purely from compounding."
        ],
        "formula": "Balance after 15 years of deposits (fixed rate, deposit at the start of each year) = D × [((1 + r)^15 − 1) ÷ r] × (1 + r). Maturity value at 21 years = that balance × (1 + r)^6.",
        "example": "Assume ₹1,50,000 is deposited at the start of each financial year for 15 years and the rate stays at 8.2% for all 21 years (it will change in practice). Year 1: ₹1,50,000 × 1.082 = ₹1,62,300. Year 2: (₹1,62,300 + ₹1,50,000) × 1.082 = ₹3,37,909. After 15 years: (1.082)^15 = 3.26144; (3.26144 − 1) ÷ 0.082 = 27.57849; × 1.082 = 29.83993; × ₹1,50,000 = about ₹44,75,989. Years 16 to 21, no deposits: (1.082)^6 = 1.60459; ₹44,75,989 × 1.60459 = about ₹71,82,119. Total deposited: ₹1,50,000 × 15 = ₹22,50,000. Tax-free interest: about ₹71,82,119 − ₹22,50,000 = ₹49,32,119.",
        "mistakes": [
            "Waiting too long: the account must be opened before the girl turns 10.",
            "Missing the ₹250 minimum in a year and leaving the account in default.",
            "Assuming money can be withdrawn freely; only 50% for education after 18 or Class 10, or closure for marriage, is allowed.",
            "Assuming deposits must continue for 21 years; they stop after 15."
        ],
        "faq": [
            {
                "question": "What is the Sukanya Samriddhi Yojana interest rate now?",
                "answer": "It is 8.2% a year for the quarter from 1 October to 31 December 2026, compounded annually. The government reviews it every quarter, and a change applies to the whole balance."
            },
            {
                "question": "For how many years do I have to deposit in SSY?",
                "answer": "Deposits can be made for 15 years from the date of opening. The account matures after 21 years, and the balance keeps earning interest in the last six years without fresh deposits."
            },
            {
                "question": "Can an SSY account be closed before 21 years?",
                "answer": "Yes, for the girl's marriage after she turns 18, within one month before to three months after the marriage. It can also be closed on her death or, after five years, on extreme compassionate grounds such as a life-threatening illness."
            },
            {
                "question": "Is SSY tax-free?",
                "answer": "The interest and maturity amount are tax-free under both regimes. The deposit is deductible up to ₹1.5 lakh a year under Section 123 (earlier Section 80C) only if you choose the old regime."
            }
        ],
        "updated": "2026-10-24"
    },
    "nsc": {
        "shortDefinition": "NSC (National Savings Certificate) is a 5-year government savings certificate sold at post offices, with interest compounded annually and paid only at maturity along with the principal. The rate is fixed for the full 5 years on the day you buy, and the deposit qualifies for the Section 123 (earlier 80C) deduction under the old tax regime.",
        "details": [
            "The current series is NSC VIII Issue. You can invest a minimum of ₹1,000 and any higher amount in multiples of ₹100, with no upper limit. The certificate matures 5 years from the date of purchase. Unlike PPF or SSY, there are no yearly deposits; each purchase is a separate lump sum.",
            "The rate for certificates bought from 1 October to 31 December 2026 is 7.7% a year, compounded annually, unchanged under the Finance Ministry's order of 30 September 2026. Once you buy, that rate is locked for the full 5 years, whatever happens to later quarterly rates. At 7.7%, ₹1,000 grows to about ₹1,449 at maturity.",
            "NSC cannot be cashed early except on the death of the holder (or all joint holders), on a court order, or on forfeiture by a pledgee who is a gazetted government officer. The certificate can, however, be pledged as security for a loan from a bank or co-operative society. So treat the money as locked in for the full 5 years.",
            "Tax works in two steps. The amount invested qualifies for the ₹1.5 lakh deduction under Section 123 (Section 80C before 1 April 2026) under the old regime. Interest is taxable at your slab rate, but the interest for the first four years is treated as reinvested, so it can be shown as income and also claimed as a fresh deduction within the same ₹1.5 lakh limit. The fifth year's interest is not reinvested, so it is simply taxable.",
            "No TDS is deducted on NSC interest, but that does not make it tax-free; you must report the interest in your return. Under the new regime there is no deduction for either the deposit or the reinvested interest, so the full interest is taxable. NSC suits people who want a fixed, government-backed return and can leave the money untouched for 5 years."
        ],
        "formula": "Maturity value = P × (1 + r)^5, where P is the amount invested and r is the annual rate as a decimal. Interest in year k = P × (1 + r)^(k − 1) × r.",
        "example": "₹1,00,000 invested in NSC in October 2026 at 7.7%. Year 1 interest: ₹1,00,000 × 7.7% = ₹7,700; balance ₹1,07,700. Year 2: ₹1,07,700 × 7.7% = ₹8,292.90; balance ₹1,15,992.90. Year 3: ₹1,15,992.90 × 7.7% = ₹8,931.45; balance ₹1,24,924.35. Year 4: ₹1,24,924.35 × 7.7% = ₹9,619.18; balance ₹1,34,543.53. Year 5: ₹1,34,543.53 × 7.7% = ₹10,359.85; maturity value about ₹1,44,903 (check: (1.077)^5 = 1.44903). Total interest about ₹44,903, all taxable. Under the old regime, the year 1–4 interest (₹7,700, ₹8,293, ₹8,931 and ₹9,619) can each be claimed under Section 123 in its year, if the ₹1.5 lakh limit has room; the year 5 interest of about ₹10,360 is taxed with no matching deduction.",
        "mistakes": [
            "Assuming NSC interest is tax-free because no TDS is deducted.",
            "Forgetting to claim the reinvested interest of years 1 to 4 under Section 123 in the old regime.",
            "Buying NSC with money you may need early; it cannot be cashed before 5 years except in rare cases.",
            "Expecting your certificate's rate to change when the quarterly rate changes; it stays fixed."
        ],
        "faq": [
            {
                "question": "What is the NSC interest rate for October–December 2026?",
                "answer": "It is 7.7% a year, compounded annually and paid at maturity. A certificate bought in this quarter keeps 7.7% for its full 5 years."
            },
            {
                "question": "Is NSC interest taxable?",
                "answer": "Yes, it is taxable at your slab rate. Under the old regime, the first four years' interest is treated as reinvested and can be claimed as a deduction within the ₹1.5 lakh limit, so in practice mainly the fifth year's interest is taxed."
            },
            {
                "question": "Can I withdraw NSC before maturity?",
                "answer": "Generally no. Early encashment is allowed only on the holder's death, on a court order, or when a pledgee who is a gazetted government officer forfeits it."
            },
            {
                "question": "Is there a maximum limit for investing in NSC?",
                "answer": "No. The minimum is ₹1,000 in multiples of ₹100, with no upper limit. Only ₹1.5 lakh a year, combined with other eligible items, gets the tax deduction."
            }
        ],
        "updated": "2026-10-24"
    },
    "scss": {
        "shortDefinition": "SCSS (Senior Citizens Savings Scheme) is a government savings scheme for people aged 60 and above, and for some early retirees, that pays interest every quarter for 5 years. Up to ₹30 lakh can be invested per person, and the account can be extended in blocks of 3 years.",
        "details": [
            "Anyone aged 60 or above can open an account. People aged 55 to under 60 who have retired on superannuation or voluntary retirement can also invest, and since a November 2023 amendment they have three months from receiving retirement benefits to do so. Retired defence personnel (excluding civilian defence employees) can open one from age 50. Accounts can be single or joint with a spouse; in a joint account the whole deposit is counted against the first holder. NRIs and HUFs cannot open one.",
            "The minimum deposit is ₹1,000, in multiples of ₹1,000, and the maximum is ₹30 lakh per person across all SCSS accounts, a limit in force since 1 April 2023. The rate for accounts opened from 1 October to 31 December 2026 is 8.2% a year, unchanged under the Finance Ministry's order of 30 September 2026. The rate on the day of deposit applies for the full 5-year term. Interest is simple, not compounded: it is paid out every quarter, and quarterly interest you do not withdraw earns nothing extra.",
            "The account matures after 5 years. Since the Senior Citizens' Savings (Fourth Amendment) Scheme, 2023, notified on 7 November 2023, it can be extended any number of times in blocks of 3 years, if you apply within one year of each maturity. Earlier, only one 3-year extension was allowed. The extension earns the rate that applies on the date the account matures.",
            "Early closure is allowed but costs money. If you close within one year, no interest is due and any interest already paid is recovered from the deposit. After one year but before two, 1.5% of the deposit is deducted; after two years but before five, 1% is deducted. Plan the amount so you are unlikely to need it before maturity.",
            "Deposits qualify for the ₹1.5 lakh deduction under Section 123 (Section 80C before 1 April 2026) under the old regime only. The interest is fully taxable at your slab rate in both regimes. For senior citizens, tax is deducted at source once interest from the post office or bank crosses ₹1,00,000 in a financial year; if your total tax will be nil, you can submit a declaration (Form 121 from tax year 2026-27, which replaced Forms 15G and 15H) to avoid TDS."
        ],
        "formula": "Quarterly interest = Deposit × annual rate ÷ 4. Annual interest = Deposit × annual rate. Total interest over 5 years = Deposit × annual rate × 5 (simple interest, paid out).",
        "example": "A retired person aged 62 invests the maximum ₹30,00,000 in SCSS in October 2026 at 8.2%. Quarterly interest: ₹30,00,000 × 8.2% ÷ 4 = ₹61,500. Yearly interest: ₹61,500 × 4 = ₹2,46,000. Over 5 years: ₹2,46,000 × 5 = ₹12,30,000, and the ₹30,00,000 is returned at maturity. Because ₹2,46,000 is above the ₹1,00,000 TDS threshold for senior citizens, the post office or bank will deduct 10% TDS if PAN is given: ₹2,46,000 × 10% = ₹24,600 a year, unless a valid nil-tax declaration is filed. If the account were closed after 18 months, 1.5% of the deposit, ₹30,00,000 × 1.5% = ₹45,000, would be deducted.",
        "mistakes": [
            "Assuming SCSS interest compounds; it is paid out every quarter and unclaimed interest earns nothing.",
            "Thinking the interest is tax-free because the deposit qualifies for Section 123; the interest is taxable.",
            "Missing the three-month window to invest retirement benefits when retiring between 55 and 60.",
            "Believing the account can be extended only once; extensions in 3-year blocks are now unlimited."
        ],
        "faq": [
            {
                "question": "What is the SCSS interest rate for October–December 2026?",
                "answer": "It is 8.2% a year, paid quarterly. An account opened in this quarter keeps 8.2% for its full 5-year term."
            },
            {
                "question": "What is the maximum investment in SCSS?",
                "answer": "₹30 lakh per person, counting all SCSS accounts together. A couple who both qualify can each invest up to ₹30 lakh in their own accounts."
            },
            {
                "question": "Can I open SCSS before 60?",
                "answer": "Yes, if you are 55 to under 60 and have retired on superannuation or voluntary retirement, and you invest within three months of receiving retirement benefits. Retired defence personnel can open an account from 50."
            },
            {
                "question": "How many times can an SCSS account be extended?",
                "answer": "Any number of times, in blocks of 3 years, under rules notified in November 2023. You must apply within one year of maturity or of the end of each extended block."
            }
        ],
        "updated": "2026-10-24"
    },
    "fixed-deposit": {
        "shortDefinition": "A fixed deposit (FD) is a lump sum placed with a bank, small finance bank, post office or company for a fixed period at an interest rate agreed on the day you invest. The rate does not change during the term even if market rates move.",
        "details": [
            "Banks set their own FD rates for each tenure, usually from 7 days to 10 years, and often pay senior citizens a little more. Interest can be paid out monthly or quarterly, or added to the deposit and paid at maturity in a cumulative FD. Many banks compound cumulative FD interest every quarter, which makes the effective yearly return slightly higher than the quoted rate. Bank FD rates are not linked to a formula, but they tend to move in the same direction as the RBI repo rate over time.",
            "Bank deposits are insured by the Deposit Insurance and Credit Guarantee Corporation (DICGC) up to ₹5 lakh per depositor per bank, covering principal and interest together. All accounts you hold at one bank in the same right and capacity, including savings accounts and FDs across branches, are added up for this limit. Accounts held in a different capacity, such as a joint account or as guardian of a minor, are covered separately. Company and NBFC deposits are not covered by DICGC.",
            "You can usually break an FD early, but the bank pays interest at the rate for the period actually completed, minus a penalty that is often 0.5% to 1%, depending on its policy. Check the bank's premature withdrawal terms before you invest, because they differ between banks and between deposit sizes. A 5-year tax-saver FD is different: it cannot be withdrawn before 5 years, and the amount invested, up to ₹1.5 lakh, qualifies for the deduction under Section 123 of the Income-tax Act, 2025 (Section 80C until 31 March 2026), only under the old regime.",
            "FD interest is fully taxable at your slab rate, and it is taxable each year as it accrues, even in a cumulative FD that pays only at maturity. Banks deduct TDS at 10% (if your PAN is on record) once interest from that bank exceeds ₹50,000 in a financial year, or ₹1,00,000 for senior citizens. These limits were raised in Budget 2025 from ₹40,000 and ₹50,000 with effect from 1 April 2025, and continue under Section 393 of the 2025 Act. TDS is not the final tax: you still pay the difference, or claim a refund, when you file your return.",
            "If your total income is below the taxable limit, you can give the bank a declaration so that it does not deduct TDS. From tax year 2026-27 this is Form 121 under the Income-tax Act, 2025, which replaced Forms 15G and 15H; it must be submitted afresh. Comparing FDs on the after-tax return matters: at the 30% slab, a 7% FD earns about 4.8% after tax and cess."
        ],
        "formula": "Maturity value of a cumulative FD = P × (1 + r/n)^(n × t), where P is the deposit, r is the annual rate as a decimal, n is the number of compounding periods a year (4 for quarterly) and t is the term in years.",
        "example": "₹5,00,000 in a 3-year cumulative FD at an assumed 7% a year, compounded quarterly. Quarterly rate: 7% ÷ 4 = 1.75%. Number of quarters: 3 × 4 = 12. (1.0175)^12 = 1.23144. Maturity value: ₹5,00,000 × 1.23144 = about ₹6,15,720. Total interest: about ₹1,15,720. Effective yearly yield: (1.0175)^4 − 1 = 7.19%. Interest accrued each year: year 1 ₹5,00,000 × (1.07186 − 1) = about ₹35,930; year 2 about ₹38,511; year 3 about ₹41,279. Each year's figure is taxable in that year. For a depositor below 60 with no other deposits at that bank, no year crosses ₹50,000, so no TDS is deducted, but the interest must still be shown in the return.",
        "mistakes": [
            "Keeping more than ₹5 lakh in one bank and assuming all of it is insured.",
            "Not reporting interest on a cumulative FD until maturity; it is taxable every year as it accrues.",
            "Assuming no tax is due because no TDS was deducted.",
            "Choosing a tax-saver FD without noticing the 5-year lock-in and the taxable interest."
        ],
        "faq": [
            {
                "question": "How much of my FD is safe if a bank fails?",
                "answer": "DICGC insures up to ₹5 lakh per depositor per bank, including interest. Deposits in the same right and capacity across all branches of that bank are added together for this limit."
            },
            {
                "question": "When does a bank deduct TDS on FD interest?",
                "answer": "When interest from that bank exceeds ₹50,000 in a financial year, or ₹1,00,000 for senior citizens. These limits apply from 1 April 2025. The rate is 10% with PAN."
            },
            {
                "question": "How can I stop TDS on FD interest?",
                "answer": "If your tax for the year will be nil, you can submit a declaration to the bank. From tax year 2026-27 this is Form 121, which replaced Forms 15G and 15H."
            },
            {
                "question": "Can I withdraw a tax-saving FD early?",
                "answer": "No. A 5-year tax-saver FD cannot be withdrawn before 5 years. Regular FDs can usually be broken early with a penalty on the interest rate."
            }
        ],
        "updated": "2026-10-24"
    },
    "home-loan": {
        "shortDefinition": "A home loan is a secured loan from a bank or housing finance company to buy, build, extend or repair a residential property, with the property pledged to the lender until the loan is repaid. It is repaid through EMIs over a long tenure, often 15 to 30 years.",
        "details": [
            "Lenders finance only part of the property's value; you pay the rest as a down payment, along with stamp duty and registration. Most bank home loans carry a floating rate linked to an external benchmark, usually the RBI repo rate, plus a spread set by the lender. RBI made external benchmarks mandatory for new floating-rate retail loans from 1 October 2019, and the rate must be reset at least once every three months. With the repo rate raised to 5.50% on 7 October 2026, repo-linked home loan rates are rising at their next reset.",
            "When the rate is reset, RBI's August 2023 circular requires lenders to give borrowers of EMI-based floating-rate loans a choice: a higher EMI, a longer tenure, or a mix, along with the option to switch to a fixed rate and to prepay. Under the RBI (Pre-payment Charges on Loans) Directions, 2025, lenders cannot charge any prepayment or foreclosure fee on floating-rate loans to individuals for non-business purposes sanctioned or renewed on or after 1 January 2026. Fixed-rate loans may still carry charges.",
            "From 1 April 2026, the deduction for interest on a home loan is in Section 22 of the Income-tax Act, 2025, which replaced Section 24(b) of the 1961 Act. For a self-occupied house, interest is deductible up to ₹2 lakh a year, but only under the old regime. The ₹2 lakh limit applies only if the house is bought or built with the loan and the construction is completed within five years from the end of the year in which the loan was taken; otherwise a much lower limit applies. Interest paid before construction is completed is claimed in five equal yearly instalments from the year construction is completed, within the same overall limit.",
            "For a let-out house, interest is deductible without the ₹2 lakh cap in both regimes. But under the new regime, a loss from house property cannot be set off against salary or other income; under the old regime, such a set-off is capped at ₹2 lakh a year. Principal repayment, and stamp duty and registration in the year paid, count towards the ₹1.5 lakh limit under Section 123 (earlier Section 80C), again only in the old regime.",
            "Compare loans on total cost, not just the rate. Processing fees, insurance bundled with the loan and other charges are shown in the Key Fact Statement. A small difference in rate or a longer tenure can add lakhs of rupees in interest over the life of the loan, so check the amortisation schedule before signing."
        ],
        "formula": "EMI = [P × R × (1 + R)^N] ÷ [(1 + R)^N − 1], where P is the loan amount, R is the monthly interest rate (annual rate ÷ 12 ÷ 100) and N is the number of monthly instalments.",
        "example": "A ₹50,00,000 home loan at an assumed 8.5% a year for 20 years. R = 8.5 ÷ 12 ÷ 100 = 0.0070833; N = 240. (1.0070833)^240 = 5.44124. P × R = ₹35,416.67. 5.44124 ÷ 4.44124 = 1.22516. EMI = ₹35,416.67 × 1.22516 = about ₹43,391. In the first 12 months you pay ₹43,391 × 12 = about ₹5,20,694, of which about ₹4,21,182 is interest and only about ₹99,511 is principal. Under the old regime, for a self-occupied house the interest deduction is capped at ₹2,00,000, so about ₹2,21,182 of the first year's interest gets no deduction. The ₹99,511 principal can be claimed under Section 123 if the ₹1.5 lakh limit has room. If the ₹2,00,000 falls fully in the 30% slab, the tax saved is ₹2,00,000 × 30% = ₹60,000, plus 4% cess = ₹62,400. Under the new regime, there is no deduction for either.",
        "mistakes": [
            "Claiming the ₹2 lakh interest deduction on a self-occupied house after choosing the new regime.",
            "Not checking whether a rate rise has been absorbed by extending the tenure instead of the EMI.",
            "Comparing only interest rates and ignoring processing fees and bundled insurance.",
            "Assuming every home loan can be prepaid free; the RBI waiver covers floating-rate loans to individuals for non-business purposes sanctioned or renewed from 1 January 2026."
        ],
        "faq": [
            {
                "question": "Is home loan interest deductible under the new tax regime?",
                "answer": "Not for a self-occupied house. Interest on a let-out house is deductible in both regimes, but under the new regime a resulting loss cannot be set off against salary or other income."
            },
            {
                "question": "What replaced Section 24(b) in the Income-tax Act, 2025?",
                "answer": "Section 22 of the Income-tax Act, 2025, which applies from 1 April 2026. The ₹2 lakh limit for a self-occupied house continues under the old regime."
            },
            {
                "question": "Will my home loan EMI go up after the October 2026 repo rate hike?",
                "answer": "If your loan is linked to the repo rate, your rate will rise by the same 0.25% at the next reset, which must happen at least once every three months. The lender may raise the EMI, extend the tenure or both, and must tell you."
            },
            {
                "question": "Can both joint owners claim home loan tax benefits?",
                "answer": "Generally yes, if each is a co-owner and co-borrower and pays a share of the EMI. Under the old regime, each can claim interest up to ₹2 lakh and principal within their own ₹1.5 lakh limit."
            }
        ],
        "updated": "2026-10-24"
    },
    "repo-rate": {
        "shortDefinition": "The repo rate is the interest rate at which the Reserve Bank of India (RBI) lends short-term money to banks against government securities. It is the RBI's main policy rate, and changes in it feed into loan and deposit rates across the economy.",
        "details": [
            "The repo rate is set by the Monetary Policy Committee (MPC), which has six members: three from RBI, including the Governor who chairs it, and three external members appointed by the government. Decisions are by majority, with the Governor having a casting vote in a tie. The MPC's job is to keep consumer price inflation at 4%, within a band of 2% to 6%. The government has retained this target for 1 April 2026 to 31 March 2031.",
            "On 7 October 2026 the MPC unanimously raised the repo rate by 0.25 percentage point, from 5.25% to 5.50%, and changed its stance from neutral to 'calibrated tightening'. It was the first increase since February 2023. The repo rate had been cut through 2025 to 5.25% in December 2025 and held there until October 2026. The next MPC meeting is scheduled for 2 to 4 December 2026.",
            "The repo rate sits inside a corridor. Banks can park surplus money with RBI at the Standing Deposit Facility rate, now 5.25%, and borrow overnight in an emergency at the Marginal Standing Facility rate, now 5.75%, which is also the Bank Rate. In short, the corridor is 0.25 percentage point either side of the repo rate. RBI also uses liquidity operations to keep short-term market rates close to the repo rate.",
            "For borrowers, the link is direct for most floating-rate retail loans. Since 1 October 2019 banks have had to link new floating-rate retail loans to an external benchmark, usually the repo rate, and reset the rate at least every three months. Older loans linked to MCLR or base rate move more slowly. Lenders often keep the EMI unchanged and extend the tenure, so a rate rise can show up as more remaining instalments rather than a bigger EMI.",
            "For savers, the effect is indirect. Banks change FD rates on their own, but those rates usually follow the repo rate over time. Government small savings rates, such as PPF and SSY, are set separately every quarter by the Finance Ministry and are not tied to the repo rate on the day it changes."
        ],
        "example": "Assume a ₹40,00,000 home loan for 20 years priced at the repo rate plus a 2.75% spread (spread chosen only for illustration). Before the hike: 5.25% + 2.75% = 8.00%. Monthly rate 0.0066667; (1.0066667)^240 = 4.92680; EMI = ₹40,00,000 × 0.0066667 × 4.92680 ÷ 3.92680 = ₹26,666.67 × 1.25466 = about ₹33,458. After the hike: 5.50% + 2.75% = 8.25%. Monthly rate 0.006875; (1.006875)^240 = 5.17766; EMI = ₹27,500 × 5.17766 ÷ 4.17766 = ₹27,500 × 1.23937 = about ₹34,083, which is about ₹625 more a month. If the lender keeps the EMI at ₹33,458 instead, the number of months becomes −ln(1 − ₹27,500 ÷ ₹33,458) ÷ ln(1.006875) = −ln(0.17806) ÷ 0.0068515 = about 252 months, about one more year. Total interest rises from about ₹40.30 lakh (₹33,457.60 × 240 − ₹40,00,000) to about ₹44.27 lakh (₹33,457.60 × 251.86 − ₹40,00,000), about ₹3.97 lakh more.",
        "mistakes": [
            "Assuming your EMI did not change after a rate hike, when the lender has extended the tenure instead.",
            "Expecting PPF, SSY and other small savings rates to move on the day RBI changes the repo rate.",
            "Confusing the repo rate with the rate you pay; your loan rate is the benchmark plus the lender's spread.",
            "Waiting for an older MCLR- or base-rate-linked loan to fall as fast as a repo-linked loan, instead of checking whether switching makes sense."
        ],
        "faq": [
            {
                "question": "What is the current RBI repo rate?",
                "answer": "It is 5.50%, after the MPC raised it by 0.25 percentage point on 7 October 2026. The next policy meeting is scheduled for 2 to 4 December 2026."
            },
            {
                "question": "What is the difference between repo rate and reverse repo rate?",
                "answer": "The repo rate is what banks pay to borrow from RBI. The fixed reverse repo rate still exists, but since 2022 the Standing Deposit Facility, now 5.25%, has been the floor at which banks park surplus funds with RBI."
            },
            {
                "question": "How does the repo rate affect my home loan?",
                "answer": "If your loan is linked to the repo rate, your rate moves by the same amount at the next reset, which must happen at least once every three months. Your EMI or remaining tenure changes accordingly."
            },
            {
                "question": "Do FD rates go up when the repo rate rises?",
                "answer": "Often, but not automatically. Banks set FD rates themselves based on their need for funds, so changes come with a lag and vary from bank to bank."
            }
        ],
        "updated": "2026-10-24"
    },
    "compound-interest": {
        "shortDefinition": "Compound interest is interest earned on both the original amount and the interest already added to it, so your money earns 'interest on interest'. Over long periods it makes savings grow much faster than simple interest, and it is also why long loans cost so much.",
        "details": [
            "With simple interest, you earn the same amount every year on the original deposit. With compound interest, each period's interest is added to the balance, and the next period's interest is worked out on that larger balance. The effect is small at first and grows over time, which is why the length of time you stay invested matters as much as the rate.",
            "How often interest is compounded also matters. For the same quoted rate, quarterly or monthly compounding gives slightly more than yearly compounding, because interest starts earning interest sooner. The effective annual yield shows this: 8% compounded quarterly works out to about 8.24% a year. When comparing products, compare effective yields, not just the quoted rates.",
            "Indian savings products compound in different ways. PPF, SSY and NSC compound once a year. Many banks compound cumulative FDs quarterly. SCSS and the payout options of FDs pay interest out instead of adding it to the balance, so the money you receive does not compound unless you reinvest it yourself. On loans, interest is charged on the reducing balance every month, which is compounding working against you if you pay late or stretch the tenure.",
            "Tax reduces compounding. FD interest is taxed every year as it accrues, so only the post-tax amount effectively keeps growing. Interest on PPF and SSY is tax-free, so the full amount compounds. Inflation works the same way in reverse: at 6% inflation, prices roughly double in 12 years, so a return below inflation loses buying power even as the rupee amount grows.",
            "A quick shortcut is the Rule of 72: divide 72 by the annual rate to estimate how many years it takes for money to double. At 8%, that is about 9 years; the exact answer is 9.01 years. The rule is an approximation that works best for rates between about 6% and 10%."
        ],
        "formula": "A = P × (1 + r/n)^(n × t), where A is the final amount, P is the principal, r is the annual rate as a decimal, n is the number of compounding periods a year and t is the number of years. Effective annual yield = (1 + r/n)^n − 1.",
        "example": "₹1,00,000 invested for 10 years at 8% a year. Simple interest: ₹1,00,000 × 8% × 10 = ₹80,000, so the total is ₹1,80,000. Compounded yearly: (1.08)^10 = 2.15892, so ₹1,00,000 × 2.15892 = about ₹2,15,892. Compounded quarterly: 8% ÷ 4 = 2% a quarter for 40 quarters; (1.02)^40 = 2.20804, so about ₹2,20,804. Compounded monthly: (1 + 0.08 ÷ 12)^120 = 2.21964, so about ₹2,21,964. Yearly compounding earns ₹35,892 more than simple interest; quarterly compounding adds another ₹4,911. Effective yield with quarterly compounding: (1.02)^4 − 1 = 8.24%. Rule of 72 check: 72 ÷ 8 = 9 years to double; (1.08)^9 = 1.999, which is almost exactly ₹2,00,000.",
        "mistakes": [
            "Comparing products on quoted rates without checking how often interest compounds.",
            "Withdrawing interest every year and expecting the balance to compound.",
            "Ignoring tax and inflation, which reduce the real growth of compounding.",
            "Starting late; a few extra years of compounding can matter more than a slightly higher rate."
        ],
        "faq": [
            {
                "question": "What is the difference between simple and compound interest?",
                "answer": "Simple interest is calculated only on the original amount. Compound interest is calculated on the original amount plus the interest already added, so it grows faster over time."
            },
            {
                "question": "Is FD interest simple or compound?",
                "answer": "In a cumulative FD, interest is usually compounded, often quarterly, and paid at maturity. In a payout FD, interest is paid to you monthly or quarterly, so it does not compound unless you reinvest it."
            },
            {
                "question": "How long does it take for money to double?",
                "answer": "Divide 72 by the annual rate for a rough answer. At 8% that is about 9 years, and at 6% about 12 years."
            },
            {
                "question": "Does PPF use compound interest?",
                "answer": "Yes. PPF interest is calculated monthly on the lowest balance between the 5th and month-end, but it is credited and compounded once a year on 31 March."
            }
        ],
        "updated": "2026-10-24"
    }
};
