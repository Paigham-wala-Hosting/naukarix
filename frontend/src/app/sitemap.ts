import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://naukarix.in';

  // Base core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resume-builder`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Try fetching published job listings for dynamic job URLs in sitemap
  let jobRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch('http://127.0.0.1:8000/api/jobs?per_page=100', { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data.jobs && Array.isArray(data.jobs)) {
        jobRoutes = data.jobs.map((job: any) => ({
          url: `${baseUrl}/jobs/${job.slug}`,
          lastModified: job.updated_at ? new Date(job.updated_at) : new Date(),
          changeFrequency: 'daily' as const,
          priority: job.is_featured ? 0.95 : 0.85,
        }));
      }
    }
  } catch (err) {
    // If backend isn't reachable at build time, continue with static routes
  }

  return [...staticRoutes, ...jobRoutes];
}
