import fs from 'fs';
import path from 'path';

// This script generates a sitemap.xml with the current date as lastmod
// It is intended to be run during the build process

const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');
const BASE_URL = 'https://pocket-flow-kay.vercel.app';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

try {
  // Ensure public directory exists
  const publicDir = path.dirname(SITEMAP_PATH);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(SITEMAP_PATH, sitemapContent);
  console.log(`✅ Sitemap generated at ${SITEMAP_PATH} with lastmod: ${TODAY}`);
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}
