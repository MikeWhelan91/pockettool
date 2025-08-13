import { NextResponse } from 'next/server';

export async function GET() {
  const base = 'https://utilixy.com';
  const urls = [
    '/', '/about', '/base64', '/case-converter', '/cookies', '/diff',
    '/regex', '/format', '/image-converter', '/pdf', '/privacy', '/qr', '/random', '/terms'
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${base}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
