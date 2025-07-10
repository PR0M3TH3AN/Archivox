# 4. Build and Publish

Use the provided `package.json` scripts to generate the site:

```bash
npm run build
```

The static files appear in the `_site/` directory. Configure your CI/CD pipeline to run this command and upload `_site/` as your documentation site.
