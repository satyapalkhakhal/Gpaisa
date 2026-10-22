import { useId } from 'react';

// gpaisa.in brand mark: a "g" whose descender leads into a growth arrow, on a magenta→violet
// tile. The same drawing is exported as favicons and app icons (public/*.png, favicon.ico).
export function LogoMark({ size = 36, className = '' }: { size?: number; className?: string }) {
    const id = `gp-${useId().replace(/:/g, '')}`;
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" className={className} role="img" aria-label="gpaisa.in">
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#D43FE0" />
                    <stop offset="0.55" stopColor="#9B2BD6" />
                    <stop offset="1" stopColor="#6A1FB8" />
                </linearGradient>
            </defs>
            <rect width="48" height="48" rx="13" fill={`url(#${id})`} />
            <circle cx="20" cy="21" r="7.5" fill="none" stroke="#fff" strokeWidth="4.2" />
            <path d="M27.5 13.5 V29 C27.5 35.5 22 38 16 36.5" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" />
            <path d="M31 22 L37 14 M32.5 13.5 H37.5 V18.5" fill="none" stroke="#F4DEFC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** Mark + "gpaisa.in" wordmark; the wordmark follows the text colour, ".in" uses the brand gradient. */
export default function Logo({ size = 34, className = '' }: { size?: number; className?: string }) {
    return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
            <LogoMark size={size} />
            <span className="font-display font-extrabold tracking-tight text-[22px] sm:text-2xl leading-none text-gw-text">
                gpaisa
                <span className="bg-brand bg-clip-text text-transparent dark:bg-[linear-gradient(135deg,#F0A6F7,#C084FC)]">.in</span>
            </span>
        </span>
    );
}
