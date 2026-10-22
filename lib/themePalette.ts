// Light and dark palettes for the whole site. Every Tailwind colour class resolves to a CSS
// variable (an "R G B" triplet), so existing classes switch theme without per-component
// dark: variants. Backgrounds (--c-*) and text (--t-*) get separate dark values: in dark
// mode `bg-gray-50` becomes the page background while `text-gray-900` becomes near-white,
// and white text on brand buttons stays white. Used by tailwind.config.ts.
import twColors from 'tailwindcss/colors';

type Scale = Record<string, string>;
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

// Brand: magenta → violet (inspired by the reference palette, not copied branding).
export const BRAND = { from: '#D43FE0', via: '#9B2BD6', to: '#6A1FB8' };

const primary: Scale = {
    50: '#FBF6FF', 100: '#F4E4FD', 200: '#EACCFB', 300: '#DAA8F8', 400: '#C47FF4', 500: '#A94FEA',
    600: '#8A1FAE', 700: '#721A97', 800: '#5A157A', 900: '#42105B', 950: '#2A0A3B',
};
const gold: Scale = { ...twColors.yellow, 600: '#D4AF37' };

const FAMILIES: Record<string, Scale> = {
    slate: twColors.slate, gray: twColors.gray, zinc: twColors.zinc, neutral: twColors.neutral, stone: twColors.stone,
    red: twColors.red, orange: twColors.orange, amber: twColors.amber, yellow: twColors.yellow, lime: twColors.lime,
    green: twColors.green, emerald: twColors.emerald, teal: twColors.teal, cyan: twColors.cyan, sky: twColors.sky,
    blue: twColors.blue, indigo: twColors.indigo, violet: twColors.violet, purple: twColors.purple,
    fuchsia: twColors.fuchsia, pink: twColors.pink, rose: twColors.rose,
    primary, success: twColors.green, danger: twColors.red, gold,
};
const NEUTRALS = new Set(['slate', 'gray', 'zinc', 'neutral', 'stone']);

// Dark theme neutrals, violet-tinted. Backgrounds: light shades become dark surfaces, dark
// shades stay dark fills. Text: the scale is inverted so dark text becomes light.
const DARK_BASE = '#0B0612';
const NEUTRAL_BG_DARK: Scale = {
    50: '#0B0612', 100: '#1A1026', 200: '#2A1C38', 300: '#3B2B4C', 400: '#574768', 500: '#75668A',
    600: '#3D2E50', 700: '#30223F', 800: '#241834', 900: '#1A1026', 950: '#0E0816',
};
const NEUTRAL_TEXT_DARK: Scale = {
    50: '#2A2235', 100: '#3A3048', 200: '#4E4360', 300: '#6E6280', 400: '#8E819F', 500: '#A79BB5',
    600: '#C4B8D3', 700: '#DED5EA', 800: '#EEE8F5', 900: '#F6F3FA', 950: '#FFFFFF',
};

const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const triplet = (hex: string) => hexToRgb(hex).join(' ');
/** `t` of the way from colour a to colour b. */
const mix = (a: string, b: string, t: number) => {
    const [r1, g1, b1] = hexToRgb(a);
    const [r2, g2, b2] = hexToRgb(b);
    return [r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t].map(v => Math.round(v)).join(' ');
};

function darkBg(name: string, s: Scale, shade: string): string {
    if (NEUTRALS.has(name)) return triplet(NEUTRAL_BG_DARK[shade]);
    // Tinted fills (badges, callouts) become dark tints; 500+ (buttons) keep their colour.
    switch (shade) {
        case '50': return mix(s['900'], DARK_BASE, 0.8);
        case '100': return mix(s['900'], DARK_BASE, 0.68);
        case '200': return mix(s['800'], DARK_BASE, 0.55);
        case '300': return mix(s['700'], DARK_BASE, 0.4);
        case '400': return mix(s['600'], DARK_BASE, 0.2);
        default: return triplet(s[shade]);
    }
}

function darkText(name: string, s: Scale, shade: string): string {
    if (NEUTRALS.has(name)) return triplet(NEUTRAL_TEXT_DARK[shade]);
    const lighter: Record<string, string> = { 500: '400', 600: '400', 700: '300', 800: '200', 900: '100', 950: '50' };
    return triplet(s[lighter[shade] ?? shade]);
}

// Site tokens (components/home, components/rates, components/news): name → [light, dark bg, dark text].
const TOKENS: Record<string, [string, string, string]> = {
    'gw-green': [primary[600], '#A94FEA', '#D29BF9'],       // brand accent: links, active pills, kickers
    'gw-greenDark': [primary[700], '#9B2BD6', '#E2BCFB'],
    'gw-greenBg': [primary[50], '#24123A', '#24123A'],
    'gw-up': ['#0E9F6E', '#0E9F6E', '#3DD68C'],              // price gains
    'gw-upBg': ['#E7F8F1', '#0F2A22', '#0F2A22'],
    'gw-down': ['#E5484D', '#E5484D', '#FF7A7F'],            // price losses
    'gw-downBg': ['#FDEDEE', '#3A1218', '#3A1218'],
    'gw-red': ['#E5484D', '#E5484D', '#FF7A7F'],
    'gw-redBg': ['#FDEDEE', '#3A1218', '#3A1218'],
    'gw-text': ['#2D2440', '#3B2B4C', '#F1ECF7'],
    'gw-sub': ['#6E6680', '#4E4360', '#A79BB5'],
    'gw-border': ['#ECE8F1', '#2A1C38', '#2A1C38'],
    'gw-bg': ['#F8F6FB', '#0B0612', '#0B0612'],
    'textPrimary': ['#1F2937', '#1A1026', '#F6F3FA'],
    'textSecondary': ['#6B7280', '#3B2B4C', '#A79BB5'],
    'bgMain': ['#F9FAFB', '#0B0612', '#F6F3FA'],
    'bgCard': ['#FFFFFF', '#140B1F', '#F6F3FA'],
};

const v = (prefix: 'c' | 't', key: string) => `rgb(var(--${prefix}-${key}) / <alpha-value>)`;

/** Tailwind `colors` (backgrounds, borders, gradients…) and `textColor`, all variable-based. */
export function tailwindColors() {
    type ColorTree = { [key: string]: string | ColorTree };
    const colors: ColorTree = { transparent: 'transparent', current: 'currentColor', inherit: 'inherit' };
    const text: ColorTree = { transparent: 'transparent', current: 'currentColor', inherit: 'inherit' };
    for (const name of ['white', 'black']) {
        colors[name] = v('c', name);
        text[name] = v('t', name);
    }
    for (const name of Object.keys(FAMILIES)) {
        colors[name] = Object.fromEntries(SHADES.map(sh => [sh, v('c', `${name}-${sh}`)]));
        text[name] = Object.fromEntries(SHADES.map(sh => [sh, v('t', `${name}-${sh}`)]));
    }
    const gw: Record<string, string> = {};
    const gwText: Record<string, string> = {};
    for (const key of Object.keys(TOKENS)) {
        if (key.startsWith('gw-')) {
            gw[key.slice(3)] = v('c', key);
            gwText[key.slice(3)] = v('t', key);
        } else {
            colors[key] = v('c', key);
            text[key] = v('t', key);
        }
    }
    colors.gw = gw;
    text.gw = gwText;
    return { colors, textColor: text };
}

/** CSS custom properties for :root (light) and .dark. */
export function themeVariables() {
    const light: Record<string, string> = {};
    const dark: Record<string, string> = {};
    light['--c-white'] = light['--t-white'] = '255 255 255';
    light['--c-black'] = light['--t-black'] = '0 0 0';
    dark['--c-white'] = triplet('#140B1F');   // cards and panels
    dark['--t-white'] = '255 255 255';        // white text stays white
    dark['--c-black'] = '0 0 0';
    dark['--t-black'] = triplet('#F6F3FA');
    for (const [name, scale] of Object.entries(FAMILIES)) {
        for (const sh of SHADES) {
            const hex = scale[sh] ?? scale['900'];
            light[`--c-${name}-${sh}`] = light[`--t-${name}-${sh}`] = triplet(hex);
            dark[`--c-${name}-${sh}`] = darkBg(name, { ...scale, 950: scale['950'] ?? scale['900'] }, sh);
            dark[`--t-${name}-${sh}`] = darkText(name, { ...scale, 950: scale['950'] ?? scale['900'] }, sh);
        }
    }
    for (const [key, [l, dBg, dText]] of Object.entries(TOKENS)) {
        light[`--c-${key}`] = light[`--t-${key}`] = triplet(l);
        dark[`--c-${key}`] = triplet(dBg);
        dark[`--t-${key}`] = triplet(dText);
    }
    // Sections that are dark in both themes (the footer) keep light-theme text colours.
    const onDark: Record<string, string> = {};
    for (const name of NEUTRALS) for (const sh of SHADES) onDark[`--t-${name}-${sh}`] = light[`--t-${name}-${sh}`];
    return { light, dark, onDark };
}
