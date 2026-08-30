export interface IpoFormInput {
    slug?: string;
    company_id?: string;
    ipo_type?: string;
    status?: string;
    open_date?: string | null;
    close_date?: string | null;
    allotment_date?: string | null;
    refund_date?: string | null;
    demat_date?: string | null;
    listing_date?: string | null;
    price_band_min?: number | null;
    price_band_max?: number | null;
    lot_size?: number | null;
    publish_status?: string;
}

const LIFECYCLE_STATUSES = ['drhp', 'rhp', 'announced', 'upcoming', 'open', 'closed', 'allotment', 'listed'];
const IPO_TYPES = ['mainboard', 'sme'];

function dateOnOrBefore(a: string | null | undefined, b: string | null | undefined): boolean {
    if (!a || !b) return true; // absent dates aren't compared — not every IPO has every milestone yet
    return new Date(a).getTime() <= new Date(b).getTime();
}

export function validateIpoInput(input: IpoFormInput): string[] {
    const errors: string[] = [];

    if (!input.company_id?.trim()) errors.push('Company is required.');

    if (!input.ipo_type || !IPO_TYPES.includes(input.ipo_type)) {
        errors.push('IPO type must be mainboard or sme.');
    }

    if (!input.status || !LIFECYCLE_STATUSES.includes(input.status)) {
        errors.push(`Status must be one of: ${LIFECYCLE_STATUSES.join(', ')}.`);
    }

    if (
        input.price_band_min != null &&
        input.price_band_max != null &&
        input.price_band_min > input.price_band_max
    ) {
        errors.push('Price band minimum must not exceed the maximum.');
    }

    if (input.lot_size != null && input.lot_size <= 0) {
        errors.push('Lot size must be greater than zero.');
    }

    const dateChecks: [string, string | null | undefined, string | null | undefined][] = [
        ['Open date must be before or on the close date.', input.open_date, input.close_date],
        ['Close date must be before or on the allotment date.', input.close_date, input.allotment_date],
        ['Allotment date must be before or on the refund date.', input.allotment_date, input.refund_date],
        ['Refund date must be before or on the demat credit date.', input.refund_date, input.demat_date],
        ['Demat credit date must be before or on the listing date.', input.demat_date, input.listing_date],
    ];
    for (const [message, a, b] of dateChecks) {
        if (!dateOnOrBefore(a, b)) errors.push(message);
    }

    if (input.publish_status && !['draft', 'published'].includes(input.publish_status)) {
        errors.push('Publish status must be draft or published.');
    }

    return errors;
}

export interface GmpUpdateInput {
    gmp_value?: number;
    source?: string;
    direction?: string;
}

export function validateGmpUpdateInput(input: GmpUpdateInput): string[] {
    const errors: string[] = [];
    if (input.gmp_value == null || Number.isNaN(input.gmp_value)) errors.push('GMP value is required.');
    if (!input.source?.trim()) errors.push('Source is required for every GMP update.');
    if (input.direction && !['up', 'down', 'flat'].includes(input.direction)) {
        errors.push('Direction must be up, down, or flat.');
    }
    return errors;
}

export interface SubscriptionUpdateInput {
    day_number?: number;
    category?: string;
    subscription_times?: number;
}

const SUBSCRIPTION_CATEGORIES = ['retail', 'nii', 'qib', 'employee', 'shareholder', 'overall'];

export function validateSubscriptionUpdateInput(input: SubscriptionUpdateInput): string[] {
    const errors: string[] = [];
    if (input.day_number == null || input.day_number < 1) errors.push('Day number must be 1 or greater.');
    if (!input.category || !SUBSCRIPTION_CATEGORIES.includes(input.category)) {
        errors.push(`Category must be one of: ${SUBSCRIPTION_CATEGORIES.join(', ')}.`);
    }
    if (input.subscription_times == null || input.subscription_times < 0) {
        errors.push('Subscription times must be zero or greater.');
    }
    return errors;
}
