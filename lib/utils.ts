/**
 * Utility functions for the application
 */

/**
 * Format a date for display
 * Uses a fixed date to avoid hydration mismatches
 */
export function getLastUpdatedTime(): string {
    // Use a fixed date for SSR consistency
    // In production, this would come from your API
    const date = new Date('2026-01-02T00:00:00+05:30');
    return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

/**
 * Get current year for footer
 * Uses a fixed year to avoid hydration mismatches
 */
export function getCurrentYear(): number {
    // Use fixed year for SSR consistency
    return 2026;
}

/**
 * Format currency in Indian format
 */
export function formatCurrency(value: number, decimals: number = 2): string {
    return value.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Format date for article display
 */
export function formatArticleDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format short date for tables
 */
export function formatShortDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
    });
}
