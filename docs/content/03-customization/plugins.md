# Writing Plugins

Place JavaScript files in the `plugins/` directory. Export hook functions such as `onParseMarkdown` or `onPageRendered` to modify the build process. Hooks receive data objects that you can transform before Archivox writes the final files.

Example:

```js
module.exports = {
  onPageRendered: async ({ html }) => {
    return { html: html + '\n<!-- custom -->' };
  }
};
```
