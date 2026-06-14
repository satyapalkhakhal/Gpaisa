import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Green (Growth & Money) - #1E7F43
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#2DBE60', // Light Green for CTAs
                    600: '#1E7F43', // Main Brand Green
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                // Success/Profit Green - #16A34A
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16A34A', // Profit/Positive indicator
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                // Danger/Loss Red - #DC2626
                danger: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#DC2626', // Loss/Negative indicator
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },
                // Gold Accent - #D4AF37
                gold: {
                    50: '#fefce8',
                    100: '#fef9c3',
                    200: '#fef08a',
                    300: '#fde047',
                    400: '#facc15',
                    500: '#eab308',
                    600: '#D4AF37', // Gold accent for wealth
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                },
                // Text Colors
                textPrimary: '#1F2937',
                textSecondary: '#6B7280',
                // Background Colors
                bgMain: '#F9FAFB',
                bgCard: '#FFFFFF',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
