# Contributing

Thanks for helping improve SiteRadian’s public website and documentation. Keep changes focused, factual, and consistent with documented SiteRadian 1.0.0 behavior.

## Start with the right route

- Use the documentation form for an unclear, incorrect, or outdated page.
- Open a feature request to explain a user problem before proposing a large implementation.
- Open a bug report for reproducible website behavior.
- Report security vulnerabilities privately under [SECURITY.md](SECURITY.md), never through an issue or pull request.

For substantial work, open or reference an issue first so scope and product behavior are clear.

## Website development

1. Create a focused branch and run `npm ci`.
2. Make the smallest coherent content or UI change.
3. Run `npm run build` and `npm run verify`.
4. For layout or interaction changes, preview the site and run `npm run qa:browser`.
5. Submit a pull request that explains the problem, the change, and how it was verified.

Do not commit real access tokens, private site URLs, internal validation evidence, credentials, customer information, or generated dependency directories. Documentation examples must use `example.com` and the explicit placeholder `siteradian_REPLACE_WITH_YOUR_TOKEN`.

Keep third-party product claims restrained and provide attribution for any new brand assets. Pull requests should not modify or imply changes to the separate WordPress plugin runtime unless a published product change already supports the documentation.
