import type { APIRoute } from 'astro';
import { siteConfig, withBase } from '@/data/site';

export const GET: APIRoute = () => new Response(
  'User-agent: *\nAllow: /\n\nSitemap: ' + siteConfig.origin + withBase('/sitemap-index.xml') + '\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
