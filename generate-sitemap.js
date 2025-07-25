const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.schematheoryllc.com';
const ROOT_DIR = __dirname;
const KPI_DIR = path.join(ROOT_DIR, 'kpi_patterns');
const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');

const today = new Date().toISOString().split('T')[0];
const urls = [];

// Root-level .html files
fs.readdirSync(ROOT_DIR).forEach(file => {
  if (file.endsWith('.html')) {
    urls.push({
      loc: `${BASE_URL}/${file}`,
      lastmod: today
    });
  }
});

// KPI pattern pages
fs.readdirSync(KPI_DIR).forEach(file => {
  if (file.endsWith('.html')) {
    urls.push({
      loc: `${BASE_URL}/kpi_patterns/${file}`,
      lastmod: today
    });
  }
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join('\n') +
  `\n</urlset>\n`;

fs.writeFileSync(sitemapPath, sitemapXml);
console.log('✅ sitemap.xml generated');
