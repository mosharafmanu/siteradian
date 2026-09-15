<p align="center">
  <img src="public/brand/siteradian-logo.svg" alt="SiteRadian" width="260">
</p>

<p align="center"><strong>The AI Command Center for WordPress</strong></p>

SiteRadian gives AI a safer way to work on WordPress. This repository contains the official static product website, documentation, and 12 client-specific integration tutorials.

**Live site:** https://mosharafmanu.github.io/siteradian/

The WordPress.org submission for SiteRadian 1.0.0 is currently awaiting review. This repository does not contain the plugin release package or internal certification evidence.

## Technology

- Astro static generation
- Pagefind browser-local documentation search
- GitHub Pages and GitHub Actions
- System fonts, local brand assets, and no analytics

## Development

Requires Node.js 24 or newer.

~~~bash
npm ci
npm run dev
~~~

Production verification:

~~~bash
npm run build
npm run verify
npm run qa:browser
~~~

The build creates static output in dist, then Pagefind creates a local search index. The verifier checks internal links, assets, metadata, route counts, WordPress.org status wording, private-path markers, and high-confidence secret patterns. Browser QA expects a local preview on port 4321 and uses an installed Chromium browser to test the required responsive widths.

## Deployment

Pushes to main run .github/workflows/deploy.yml. The workflow installs the lockfile, builds and verifies the site, uploads the static artifact, and deploys it to GitHub Pages without repository secrets or paid services.

## Updating WordPress.org status

src/data/site.ts is the single source of truth. After the directory page is confirmed live, change wordpressOrg.status from pending to approved, verify the CTA text and link, build, and deploy.

## Custom domain

See [docs/CUSTOM-DOMAIN.md](docs/CUSTOM-DOMAIN.md). Do not add a CNAME file until DNS and ownership are ready.

## Contributions and security

See [CONTRIBUTING.md](CONTRIBUTING.md) for content and code changes. Report vulnerabilities according to [SECURITY.md](SECURITY.md); do not publish credentials or exploit details in issues.

## Licence and attribution

Website code and original written content are MIT licensed. SiteRadian brand assets and third-party product marks are excluded from that grant; see [ASSET-LICENSES.md](ASSET-LICENSES.md).
