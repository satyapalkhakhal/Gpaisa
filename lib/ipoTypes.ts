// Shared IPO domain types. Mirrors the shape of supabase/migrations/0002_ipo_schema.sql.

export type IpoType = 'mainboard' | 'sme';

export type IpoLifecycleStatus =
    | 'drhp'
    | 'rhp'
    | 'announced'
    | 'upcoming'
    | 'open'
    | 'closed'
    | 'allotment'
    | 'listed';

export type PublishStatus = 'draft' | 'published';

export interface Company {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    sector: string | null;
    industry: string | null;
    about: string | null;
    website: string | null;
    incorporated_year: number | null;
    registered_office: string | null;
    created_at: string;
    updated_at: string;
}

export interface Registrar {
    id: string;
    name: string;
    slug: string;
    website: string | null;
    allotment_status_check_url: string | null;
    logo_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Ipo {
    id: string;
    company_id: string | null;
    slug: string;
    ipo_type: IpoType;
    status: IpoLifecycleStatus;
    open_date: string | null;
    close_date: string | null;
    allotment_date: string | null;
    refund_date: string | null;
    demat_date: string | null;
    listing_date: string | null;
    price_band_min: number | null;
    price_band_max: number | null;
    face_value: number | null;
    lot_size: number | null;
    fresh_issue_amount: number | null;
    ofs_amount: number | null;
    total_issue_size: number | null;
    exchange: string | null;
    registrar_id: string | null;
    lead_managers: string[];
    objects_of_issue: string | null;
    drhp_url: string | null;
    rhp_url: string | null;
    is_featured: boolean;
    meta_title: string | null;
    meta_description: string | null;
    publish_status: PublishStatus;
    // Actual outcomes — populated once the IPO lists, distinct from pre-listing GMP estimates.
    listing_price: number | null;
    listing_day_close_price: number | null;
    current_market_price: number | null;
    current_price_updated_at: string | null;
    created_at: string;
    updated_at: string;
    // Joined/expanded fields, present only when explicitly fetched with them.
    company?: Company | null;
    registrar?: Registrar | null;
}

export type GmpDirection = 'up' | 'down' | 'flat';

export interface IpoGmpUpdate {
    id: string;
    ipo_id: string;
    gmp_value: number;
    gmp_percentage: number | null;
    estimated_listing_price: number | null;
    kostak_rate: number | null;
    subject_to_sauda: number | null;
    source: string;
    direction: GmpDirection | null;
    notes: string | null;
    recorded_at: string;
    created_at: string;
}

export type SubscriptionCategory = 'retail' | 'nii' | 'qib' | 'employee' | 'shareholder' | 'overall';
export type DataGranularity = 'day_end' | 'intraday';

export interface IpoSubscriptionUpdate {
    id: string;
    ipo_id: string;
    day_number: number;
    category: SubscriptionCategory;
    subscription_times: number;
    shares_offered: number | null;
    shares_bid: number | null;
    data_granularity: DataGranularity;
    as_of: string;
    created_at: string;
}

export interface IpoAllotmentInfo {
    id: string;
    ipo_id: string;
    registrar_id: string | null;
    basis_of_allotment_url: string | null;
    allotment_date: string | null;
    refund_date: string | null;
    demat_credit_date: string | null;
    listing_date: string | null;
    status: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    registrar?: Registrar | null;
}

export type IpoRecommendation = 'subscribe' | 'subscribe_long_term' | 'neutral' | 'avoid';

export interface IpoReview {
    id: string;
    ipo_id: string;
    business_quality_score: number | null;
    financial_performance_score: number | null;
    growth_score: number | null;
    valuation_score: number | null;
    industry_outlook: string | null;
    management_notes: string | null;
    strengths: string[];
    risks: string[];
    competitive_position: string | null;
    overall_view: string | null;
    overall_score: number | null;
    recommendation: IpoRecommendation | null;
    detailed_analysis_html: string | null;
    author: string | null;
    publish_status: PublishStatus;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export type IpoDocumentType = 'drhp' | 'rhp' | 'anchor_investors' | 'other';

export interface IpoDocument {
    id: string;
    ipo_id: string;
    doc_type: IpoDocumentType;
    title: string;
    url: string;
    published_at: string | null;
    created_at: string;
}

// Aggregate shape returned by fetchIpoBySlug — everything an IPO detail page needs in one call.
export interface IpoDetail extends Ipo {
    gmp_history: IpoGmpUpdate[];
    subscription_history: IpoSubscriptionUpdate[];
    allotment: IpoAllotmentInfo | null;
    review: IpoReview | null;
    documents: IpoDocument[];
}

export const LIFECYCLE_ORDER: IpoLifecycleStatus[] = [
    'drhp', 'rhp', 'announced', 'upcoming', 'open', 'closed', 'allotment', 'listed',
];

export const LIFECYCLE_LABELS: Record<IpoLifecycleStatus, string> = {
    drhp: 'DRHP Filed',
    rhp: 'RHP Filed',
    announced: 'Announced',
    upcoming: 'Upcoming',
    open: 'Open',
    closed: 'Closed',
    allotment: 'Allotment',
    listed: 'Listed',
};

export const RECOMMENDATION_LABELS: Record<IpoRecommendation, string> = {
    subscribe: 'Subscribe',
    subscribe_long_term: 'Subscribe for Long Term',
    neutral: 'Neutral',
    avoid: 'Avoid',
};
