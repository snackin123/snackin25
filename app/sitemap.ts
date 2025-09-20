import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = 'https://snackinofficial.com';
  const now = new Date();

  const routes = [
    { url: '', priority: 1.0 },          // Home
    { url: 'cart', priority: 0.8 },
    { url: 'order-success', priority: 0.8 },
    { url: 'order-tracking', priority: 0.8 },
    { url: 'products', priority: 0.9 },
    { url: 'contact-us', priority: 0.7 },
    { url: 'Our-Story', priority: 0.7 },
    { url: 'privacy-policy', priority: 0.5 },
    { url: 'terms-conditions', priority: 0.5 },
  ].map(({ url, priority }) => ({
    url: `${BASE_URL}${url ? `/${url}` : ''}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority,
  }));

  return routes;
}
