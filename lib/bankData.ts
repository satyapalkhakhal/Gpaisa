// Bank data for SIP calculators
export const banks = [
    {
        slug: 'hdfc',
        name: 'HDFC Bank',
        fullName: 'HDFC Bank SIP Calculator',
        description: 'Calculate your HDFC Bank mutual fund SIP returns with our free online calculator. Plan your investments with HDFC SIP and achieve your financial goals.',
    },
    {
        slug: 'icici',
        name: 'ICICI Bank',
        fullName: 'ICICI Bank SIP Calculator',
        description: 'Use ICICI Bank SIP Calculator to estimate returns on your systematic investment plan. Start your SIP journey with ICICI Prudential mutual funds.',
    },
    {
        slug: 'sbi',
        name: 'SBI',
        fullName: 'SBI SIP Calculator',
        description: 'Calculate SBI mutual fund SIP returns online. Plan your investments with State Bank of India SIP calculator and grow your wealth systematically.',
    },
    {
        slug: 'axis',
        name: 'Axis Bank',
        fullName: 'Axis Bank SIP Calculator',
        description: 'Axis Bank SIP Calculator helps you calculate mutual fund returns. Start your SIP with Axis Mutual Fund and plan your financial future.',
    },
    {
        slug: 'kotak',
        name: 'Kotak Mahindra',
        fullName: 'Kotak Mahindra SIP Calculator',
        description: 'Calculate Kotak Mahindra mutual fund SIP returns. Use our free SIP calculator to plan your investments with Kotak Mutual Fund.',
    },
    {
        slug: 'lic',
        name: 'LIC',
        fullName: 'LIC SIP Calculator',
        description: 'LIC Mutual Fund SIP Calculator - Calculate your SIP returns with Life Insurance Corporation. Plan systematic investments with LIC MF.',
    },
    {
        slug: 'nippon',
        name: 'Nippon India',
        fullName: 'Nippon India SIP Calculator',
        description: 'Calculate Nippon India Mutual Fund SIP returns online. Plan your investments with Nippon India (formerly Reliance) SIP calculator.',
    },
    {
        slug: 'aditya-birla',
        name: 'Aditya Birla',
        fullName: 'Aditya Birla SIP Calculator',
        description: 'Aditya Birla Sun Life Mutual Fund SIP Calculator. Calculate your SIP returns and start investing with ABSL mutual funds.',
    },
    {
        slug: 'idfc',
        name: 'IDFC',
        fullName: 'IDFC SIP Calculator',
        description: 'IDFC Mutual Fund SIP Calculator - Calculate returns on your systematic investment plan with IDFC First Bank mutual funds.',
    },
    {
        slug: 'dsp',
        name: 'DSP',
        fullName: 'DSP SIP Calculator',
        description: 'Calculate DSP Mutual Fund SIP returns online. Plan your investments with DSP BlackRock SIP calculator and achieve financial goals.',
    },
    {
        slug: 'franklin-templeton',
        name: 'Franklin Templeton',
        fullName: 'Franklin Templeton SIP Calculator',
        description: 'Franklin Templeton Mutual Fund SIP Calculator. Calculate your SIP returns and start investing with Franklin Templeton India.',
    },
    {
        slug: 'tata',
        name: 'Tata',
        fullName: 'Tata SIP Calculator',
        description: 'Tata Mutual Fund SIP Calculator - Calculate returns on your systematic investment plan with Tata Asset Management.',
    },
    {
        slug: 'utm',
        name: 'UTI',
        fullName: 'UTI SIP Calculator',
        description: 'UTI Mutual Fund SIP Calculator. Calculate your SIP returns with Unit Trust of India and plan your financial future.',
    },
    {
        slug: 'motilal-oswal',
        name: 'Motilal Oswal',
        fullName: 'Motilal Oswal SIP Calculator',
        description: 'Calculate Motilal Oswal Mutual Fund SIP returns. Plan your investments with Motilal Oswal Asset Management SIP calculator.',
    },
    {
        slug: 'mirae-asset',
        name: 'Mirae Asset',
        fullName: 'Mirae Asset SIP Calculator',
        description: 'Mirae Asset Mutual Fund SIP Calculator - Calculate your SIP returns and invest in top-performing Mirae Asset funds.',
    },
];

export type Bank = typeof banks[0];

export function getBankBySlug(slug: string): Bank | undefined {
    return banks.find(bank => bank.slug === slug);
}

export function getAllBankSlugs(): string[] {
    return banks.map(bank => bank.slug);
}
