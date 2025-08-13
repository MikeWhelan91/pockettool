import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://utilixy.com';
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/base64`, lastModified: new Date() },
    { url: `${base}/case-converter`, lastModified: new Date() },
    { url: `${base}/cookies`, lastModified: new Date() },
    { url: `${base}/diff`, lastModified: new Date() },
    { url: `${base}/regex`, lastModified: new Date() },
    { url: `${base}/format`, lastModified: new Date() },
    { url: `${base}/image-converter`, lastModified: new Date() },
    { url: `${base}/pdf`, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
    { url: `${base}/qr`, lastModified: new Date() },
    { url: `${base}/random`, lastModified: new Date() },
    { url: `${base}/terms`, lastModified: new Date() },
  ];
}
