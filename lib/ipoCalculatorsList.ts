export interface IpoCalculatorDef {
    slug: string;
    name: string;
    description: string;
}

export const IPO_CALCULATORS: IpoCalculatorDef[] = [
    {
        slug: 'lot-size-calculator',
        name: 'IPO Lot Size Calculator',
        description: 'Work out how many lots you can apply for within your budget, and the investment required per lot.',
    },
    {
        slug: 'allotment-probability-calculator',
        name: 'IPO Allotment Probability Calculator',
        description: 'A simplified statistical estimate of your allotment chances based on the subscription (oversubscription) figure — not a guarantee.',
    },
];

export function getIpoCalculatorBySlug(slug: string): IpoCalculatorDef | undefined {
    return IPO_CALCULATORS.find(c => c.slug === slug);
}
