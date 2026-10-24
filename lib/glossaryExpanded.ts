// Expanded glossary entries (24 Oct 2026): fuller explanations with current Indian rules,
// worked examples, common mistakes and FAQs, merged over the base entries in glossaryData.ts.
// Rules and figures were checked against SEBI, Income Tax Department, AMFI and RBI sources;
// see seo-audit/runs/content-2026-10-22/trend/glossary-sources.md.
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
    }
};
