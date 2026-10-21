// Reads intrinsic image dimensions from the first bytes of a file.
// Supports PNG, JPEG, GIF, WebP (VP8/VP8L/VP8X) and AVIF/HEIF (ispe box).
export function imageDimensions(b) {
    if (!b || b.length < 30) return null;
    if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
        return { format: 'png', width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    }
    if (b.subarray(0, 3).toString('latin1') === 'GIF') {
        return { format: 'gif', width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
    }
    if (b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') {
        const kind = b.subarray(12, 16).toString('latin1');
        if (kind === 'VP8X') return { format: 'webp', width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
        if (kind === 'VP8 ') return { format: 'webp', width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
        if (kind === 'VP8L') {
            const bits = b.readUInt32LE(21);
            return { format: 'webp', width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
        }
    }
    if (b[0] === 0xff && b[1] === 0xd8) {
        let i = 2;
        while (i < b.length - 9) {
            if (b[i] !== 0xff) { i++; continue; }
            const marker = b[i + 1];
            if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
                return { format: 'jpeg', width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
            }
            i += 2 + b.readUInt16BE(i + 2);
        }
        return null;
    }
    const ispe = b.indexOf('ispe', 0, 'latin1');
    if (ispe > 0 && /avif|heic|mif1/.test(b.subarray(4, 32).toString('latin1'))) {
        return { format: 'avif', width: b.readUInt32BE(ispe + 8), height: b.readUInt32BE(ispe + 12) };
    }
    return null;
}
