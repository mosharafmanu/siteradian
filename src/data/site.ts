export const siteConfig = {
  name: 'SiteRadian',
  descriptor: 'The AI Command Center for WordPress',
  proposition: 'Give AI a safer way to work on your site.',
  explanation: 'Connect AI assistants to WordPress with scoped access, approvals, audit trails, and rollback.',
  version: '1.0.0',
  base: '/siteradian',
  origin: 'https://mosharafmanu.github.io',
  repository: 'https://github.com/mosharafmanu/siteradian',
  wordpressOrg: {
    status: 'pending' as 'pending' | 'approved',
    url: 'https://wordpress.org/plugins/siteradian/',
    pendingLabel: 'WordPress.org approval pending',
    approvedLabel: 'Download SiteRadian',
  },
};

export const withBase = (path = '/') => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.base}${clean}`.replace(/\/{2,}/g, '/');
};

export const wordpressCta = siteConfig.wordpressOrg.status === 'approved'
  ? { label: siteConfig.wordpressOrg.approvedLabel, href: siteConfig.wordpressOrg.url, external: true, disabled: false }
  : { label: siteConfig.wordpressOrg.pendingLabel, href: withBase('/#availability'), external: false, disabled: true };

export const primaryNav = [
  { label: 'Product', href: withBase('/#capabilities') },
  { label: 'How it works', href: withBase('/how-it-works/') },
  { label: 'Integrations', href: withBase('/integrations/') },
  { label: 'Docs', href: withBase('/docs/') },
  { label: 'Security', href: withBase('/security/') },
];
