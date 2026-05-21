const fs = require('fs');
const path = require('path');

// Read the generated image from the artifacts directory
const srcPath = path.join(
    process.env.HOME,
    '.gemini/antigravity/brain/4d4c5bd6-4a4c-4d47-b76f-6d2fb8ef78c9/og_homepage_banner_1779358499284.png'
);
const destPath = path.join(__dirname, '../public/og-homepage.jpg');

try {
    const data = fs.readFileSync(srcPath);
    fs.writeFileSync(destPath, data);
    console.log('OG image copied successfully to', destPath);
    console.log('File size:', data.length, 'bytes');
} catch (err) {
    console.error('Error:', err.message);
}
