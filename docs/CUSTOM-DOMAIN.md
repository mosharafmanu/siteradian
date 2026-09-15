# Future custom-domain migration

The current site is intentionally deployed at:

https://mosharafmanu.github.io/siteradian/

When siteradian.com is owned and ready:

1. Verify the domain with the GitHub owner account.
2. Configure the required GitHub Pages DNS records with the domain provider.
3. Add public/CNAME containing only siteradian.com.
4. Change site in astro.config.mjs to https://siteradian.com.
5. Remove the /siteradian base setting.
6. Change origin and base in src/data/site.ts.
7. Build and run npm run verify.
8. Configure the custom domain in the repository’s Pages settings.
9. Wait for DNS validation, then enable HTTPS enforcement.
10. Check canonical URLs, sitemap, robots, social previews, 404 behavior, and every navigation path.

Do not configure a placeholder CNAME. Domain verification before DNS changes reduces the risk of another repository claiming the Pages domain.
