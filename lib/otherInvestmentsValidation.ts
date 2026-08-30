const NCD_STATUSES = ['announced', 'upcoming', 'open', 'closed', 'allotment', 'listed'];
const RIGHTS_STATUSES = ['announced', 'record_date', 're_trading', 'open', 'closed', 'allotment', 'listed'];
const BUYBACK_STATUSES = ['announced', 'record_date', 'open', 'closed', 'completed'];
const BUYBACK_METHODS = ['tender', 'open_market'];

function requirePublishStatus(errors: string[], publish_status?: string) {
    if (publish_status && !['draft', 'published'].includes(publish_status)) {
        errors.push('Publish status must be draft or published.');
    }
}

export interface NcdIssueFormInput {
    company_id?: string;
    status?: string;
    publish_status?: string;
    open_date?: string | null;
    close_date?: string | null;
}

export function validateNcdIssueInput(input: NcdIssueFormInput): string[] {
    const errors: string[] = [];
    if (!input.company_id?.trim()) errors.push('Company (issuer) is required.');
    if (!input.status || !NCD_STATUSES.includes(input.status)) errors.push(`Status must be one of: ${NCD_STATUSES.join(', ')}.`);
    if (input.open_date && input.close_date && new Date(input.open_date) > new Date(input.close_date)) {
        errors.push('Open date must be before or on the close date.');
    }
    requirePublishStatus(errors, input.publish_status);
    return errors;
}

export interface RightsIssueFormInput {
    company_id?: string;
    status?: string;
    publish_status?: string;
    rights_ratio?: string;
    issue_price?: number | null;
}

export function validateRightsIssueInput(input: RightsIssueFormInput): string[] {
    const errors: string[] = [];
    if (!input.company_id?.trim()) errors.push('Company is required.');
    if (!input.status || !RIGHTS_STATUSES.includes(input.status)) errors.push(`Status must be one of: ${RIGHTS_STATUSES.join(', ')}.`);
    if (!input.rights_ratio?.trim()) errors.push('Rights ratio (e.g. "1:5") is required.');
    requirePublishStatus(errors, input.publish_status);
    return errors;
}

export interface BuybackFormInput {
    company_id?: string;
    status?: string;
    method?: string;
    publish_status?: string;
    buyback_price?: number | null;
    buyback_price_max?: number | null;
}

export function validateBuybackInput(input: BuybackFormInput): string[] {
    const errors: string[] = [];
    if (!input.company_id?.trim()) errors.push('Company is required.');
    if (!input.status || !BUYBACK_STATUSES.includes(input.status)) errors.push(`Status must be one of: ${BUYBACK_STATUSES.join(', ')}.`);
    if (!input.method || !BUYBACK_METHODS.includes(input.method)) errors.push('Method must be tender or open_market.');
    if (
        input.buyback_price != null &&
        input.buyback_price_max != null &&
        input.buyback_price > input.buyback_price_max
    ) {
        errors.push('Buyback price must not exceed the buyback price max (for open-market range).');
    }
    requirePublishStatus(errors, input.publish_status);
    return errors;
}
