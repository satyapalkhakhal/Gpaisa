// Reads an image's intrinsic width/height from its header bytes, without decoding
// it. Supports PNG, JPEG, GIF, WebP (VP8 / VP8L / VP8X) and AVIF/HEIF (ispe box).
// Returns null for formats it can't read (e.g. SVG).

/** Google Discover shows large image cards only for lead images at least this wide. */
export const LEAD_IMAGE_MIN_WIDTH = 1200;

export interface ImageDimensions {
    width: number;
    height: number;
}

export function readImageDimensions(bytes: Uint8Array): ImageDimensions | null {
    if (bytes.length < 30) return null;
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));

    // PNG: IHDR chunk follows the 8-byte signature
    if (bytes[0] === 0x89 && ascii(1, 4) === 'PNG') {
        return { width: view.getUint32(16), height: view.getUint32(20) };
    }
    // GIF
    if (ascii(0, 3) === 'GIF') {
        return { width: view.getUint16(6, true), height: view.getUint16(8, true) };
    }
    // WebP
    if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
        const chunk = ascii(12, 16);
        if (chunk === 'VP8X') {
            const w = bytes[24] | (bytes[25] << 8) | (bytes[26] << 16);
            const h = bytes[27] | (bytes[28] << 8) | (bytes[29] << 16);
            return { width: w + 1, height: h + 1 };
        }
        if (chunk === 'VP8 ') {
            return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
        }
        if (chunk === 'VP8L') {
            const bits = view.getUint32(21, true);
            return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
        }
        return null;
    }
    // JPEG: walk segments to the first start-of-frame marker
    if (bytes[0] === 0xff && bytes[1] === 0xd8) {
        let i = 2;
        while (i < bytes.length - 9) {
            if (bytes[i] !== 0xff) { i++; continue; }
            const marker = bytes[i + 1];
            if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
                return { width: view.getUint16(i + 7), height: view.getUint16(i + 5) };
            }
            i += 2 + view.getUint16(i + 2);
        }
        return null;
    }
    // AVIF / HEIF: image spatial extents ('ispe') property
    if (/avif|avis|heic|mif1/.test(ascii(4, 32))) {
        for (let i = 0; i < bytes.length - 16; i++) {
            if (bytes[i] === 0x69 && ascii(i, i + 4) === 'ispe') {
                return { width: view.getUint32(i + 8), height: view.getUint32(i + 12) };
            }
        }
    }
    return null;
}
