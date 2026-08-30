// NCD Issues, Rights Issues, Buybacks — "Other Investments" alongside the core IPO
// vertical. Mirrors supabase/migrations/0004_other_investments_schema.sql.
import { Company, PublishStatus, Registrar } from './ipoTypes';

// ── NCD Issues ─────────────────────────────────────────────────────────────

export type NcdLifecycleStatus = 'announced' | 'upcoming' | 'open' | 'closed' | 'allotment' | 'listed';

export interface NcdSeries {
    name: string;
    tenure_months: number;
    coupon_rate: number;
    frequency: 'monthly' | 'annual' | 'cumulative';
    min_investment: number | null;
}

export interface NcdIssue {
    id: string;
    company_id: string | null;
    slug: string;
    status: NcdLifecycleStatus;
    open_date: string | null;
    close_date: string | null;
    allotment_date: string | null;
    listing_date: string | null;
    issue_size: number | null;
    base_issue_size: number | null;
    shelf_limit: number | null;
    credit_rating: string | null;
    rating_agency: string | null;
    secured: boolean;
    series: NcdSeries[];
    registrar_id: string | null;
    lead_managers: string[];
    objects_of_issue: string | null;
    prospectus_url: string | null;
    subscription_times_overall: number | null;
    subscription_updated_at: string | null;
    is_featured: boolean;
    meta_title: string | null;
    meta_description: string | null;
    publish_status: PublishStatus;
    created_at: string;
    updated_at: string;
    company?: Company | null;
    registrar?: Registrar | null;
}

export const NCD_LIFECYCLE_ORDER: NcdLifecycleStatus[] = ['announced', 'upcoming', 'open', 'closed', 'allotment', 'listed'];
export const NCD_LIFECYCLE_LABELS: Record<NcdLifecycleStatus, string> = {
    announced: 'Announced', upcoming: 'Upcoming', open: 'Open', closed: 'Closed', allotment: 'Allotment', listed: 'Listed',
};

// ── Rights Issues ────────────────────────────────────────────────────────

export type RightsLifecycleStatus = 'announced' | 'record_date' | 're_trading' | 'open' | 'closed' | 'allotment' | 'listed';

export interface RightsIssue {
    id: string;
    company_id: string | null;
    slug: string;
    status: RightsLifecycleStatus;
    record_date: string | null;
    re_trading_start: string | null;
    re_trading_end: string | null;
    application_start: string | null;
    application_end: string | null;
    allotment_date: string | null;
    listing_date: string | null;
    rights_ratio: string | null;
    issue_price: number | null;
    face_value: number | null;
    issue_size: number | null;
    re_price: number | null;
    re_price_updated_at: string | null;
    registrar_id: string | null;
    objects_of_issue: string | null;
    letter_of_offer_url: string | null;
    is_featured: boolean;
    meta_title: string | null;
    meta_description: string | null;
    publish_status: PublishStatus;
    created_at: string;
    updated_at: string;
    company?: Company | null;
    registrar?: Registrar | null;
}

export const RIGHTS_LIFECYCLE_ORDER: RightsLifecycleStatus[] = ['announced', 'record_date', 're_trading', 'open', 'closed', 'allotment', 'listed'];
export const RIGHTS_LIFECYCLE_LABELS: Record<RightsLifecycleStatus, string> = {
    announced: 'Announced', record_date: 'Record Date', re_trading: 'RE Trading', open: 'Open', closed: 'Closed', allotment: 'Allotment', listed: 'Listed',
};

// ── Buybacks ─────────────────────────────────────────────────────────────

export type BuybackLifecycleStatus = 'announced' | 'record_date' | 'open' | 'closed' | 'completed';
export type BuybackMethod = 'tender' | 'open_market';

export interface Buyback {
    id: string;
    company_id: string | null;
    slug: string;
    status: BuybackLifecycleStatus;
    method: BuybackMethod;
    buyback_price: number | null;
    buyback_price_max: number | null;
    record_date: string | null;
    tender_open_date: string | null;
    tender_close_date: string | null;
    buyback_size: number | null;
    acceptance_ratio: string | null;
    registrar_id: string | null;
    notes: string | null;
    letter_of_offer_url: string | null;
    is_featured: boolean;
    meta_title: string | null;
    meta_description: string | null;
    publish_status: PublishStatus;
    created_at: string;
    updated_at: string;
    company?: Company | null;
    registrar?: Registrar | null;
}

export const BUYBACK_LIFECYCLE_ORDER: BuybackLifecycleStatus[] = ['announced', 'record_date', 'open', 'closed', 'completed'];
export const BUYBACK_LIFECYCLE_LABELS: Record<BuybackLifecycleStatus, string> = {
    announced: 'Announced', record_date: 'Record Date', open: 'Open', closed: 'Closed', completed: 'Completed',
};
