import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/me/',
          '/_next/',
          '/admin/',
        ],
      },
    ],
    sitemap: 'https://thedramaturgy.com/sitemap.xml',
  };
}
