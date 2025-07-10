# Deployment

Running `npm run build` generates the `_site/` folder. Upload its contents to any static host. For Netlify, include a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = "_site"
```

Other hosts work similarly—just make sure your CI system outputs the `_site/` directory.
