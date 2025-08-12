import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '', // Explicitly allow everything
      },
    ],
    sitemap: 'https://utilixy.com/sitemap.xml',
    host: 'https://utilixy.com',
  };
}
