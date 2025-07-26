const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.schematheoryllc.com'; // or 'https://www.schematheory.com' if preferred
const ROOT_DIR = __dirname;
const OUTPUT_FILE = path.join(ROOT_DIR, 'sitemap.xml');

// Folders to skip (non-public)
const IGNORED_DIRS = new Set(['node_modules', '.husky', '.git', '.vscode', '__MACOSX']);

function getHtmlFiles(dir, subpath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let urls = [];

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(subpath, entry.name);

    if (entry.isDirectory()) {
      urls = urls.concat(getHtmlFiles(fullPath, relativePath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const urlPath = '/' + relativePath.replace(/\\/g, '/');
      urls.push(`${BASE_URL}${urlPath}`);
    }
  }

  return urls;
}

function generateSitemapXml(urls) {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
}

// Run generator
const urls = getHtmlFiles(ROOT_DIR);
const sitemap = generateSitemapXml(urls);
fs.writeFileSync(OUTPUT_FILE, sitemap, 'utf-8');

console.log(`✅ Sitemap generated with ${urls.length} URLs at ${OUTPUT_FILE}`);
