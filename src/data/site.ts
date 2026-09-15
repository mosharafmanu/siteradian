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

export const supportLinks = {
  center: withBase('/support/'),
  documentation: withBase('/docs/'),
  troubleshooting: withBase('/docs/troubleshooting/'),
  bug: `${siteConfig.repository}/issues/new?template=bug_report.yml`,
  feature: `${siteConfig.repository}/issues/new?template=feature_request.yml`,
  docsIssue: `${siteConfig.repository}/issues/new?template=docs_issue.yml`,
  privateSecurityReport: `${siteConfig.repository}/security/advisories/new`,
};

export const wordpressSupportCta = siteConfig.wordpressOrg.status === 'approved'
  ? {
      label: 'Visit WordPress.org support',
      href: 'https://wordpress.org/support/plugin/siteradian/',
      external: true,
      disabled: false,
      note: 'Ask a usage question in the SiteRadian community support forum.',
    }
  : {
      label: 'WordPress.org approval pending',
      href: withBase('/support/#community-support'),
      external: false,
      disabled: true,
      note: 'WordPress.org support will be available after directory approval.',
    };

export const primaryNav = [
  { label: 'Product', href: withBase('/#capabilities') },
  { label: 'How it works', href: withBase('/how-it-works/') },
  { label: 'Integrations', href: withBase('/integrations/') },
  { label: 'Docs', href: withBase('/docs/') },
  { label: 'Security', href: withBase('/security/') },
  { label: 'Support', href: withBase('/support/') },
];
