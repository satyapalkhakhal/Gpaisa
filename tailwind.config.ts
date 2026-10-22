import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { BRAND, tailwindColors, themeVariables } from "./lib/themePalette";

const palette = tailwindColors();

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    // Theme follows the `dark` class on <html> (set before paint by the script in app/layout.tsx).
    darkMode: 'class',
    theme: {
        // Every colour is a CSS variable with light and dark values (lib/themePalette.ts),
        // so existing classes switch theme without dark: variants.
        colors: palette.colors,
        textColor: palette.textColor,
        extend: {
            fontFamily: {
                // Noto Sans Devanagari renders Hindi text (Inter/Outfit have no Devanagari glyphs).
                sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'Noto Sans Devanagari', 'sans-serif'],
            },
            backgroundImage: {
                brand: `linear-gradient(135deg, ${BRAND.from} 0%, ${BRAND.via} 55%, ${BRAND.to} 100%)`,
            },
        },
    },
    plugins: [
        plugin(({ addBase }) => {
            const { light, dark, onDark } = themeVariables();
            addBase({ ':root': light, '.dark': { ...dark, colorScheme: 'dark' }, '.dark .on-dark': onDark });
        }),
    ],
};

export default config;
