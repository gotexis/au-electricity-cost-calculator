import { getAllRegions, getAllZones, slugify } from '@/lib/energy-data';
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://energy.rollersoft.com.au';

export default function sitemap(): MetadataRoute.Sitemap {
  const regions = getAllRegions();
  const zones = getAllZones();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/retailers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/tips`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/tools/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/tools/solar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  const statePages: MetadataRoute.Sitemap = regions.map(r => ({
    url: `${BASE_URL}/states/${r.state.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const zonePages: MetadataRoute.Sitemap = zones.map(z => ({
    url: `${BASE_URL}/zones/${slugify(z.zone)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...statePages, ...zonePages];
}
