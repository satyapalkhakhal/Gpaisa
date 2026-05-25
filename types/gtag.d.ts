// Google gtag type declarations
interface GtagConsentParams {
    ad_storage?: 'granted' | 'denied';
    ad_user_data?: 'granted' | 'denied';
    ad_personalization?: 'granted' | 'denied';
    analytics_storage?: 'granted' | 'denied';
    wait_for_update?: number;
}

interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: [string, ...unknown[]]) => void;
}
