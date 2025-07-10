# Deployment

Archivox sites output to the `_site/` folder. Host the contents on any static server. For Netlify, include a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = "_site"
```
