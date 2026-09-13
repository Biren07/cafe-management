import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://artisancafe.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/billing/', '/settings/', '/inventory/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
