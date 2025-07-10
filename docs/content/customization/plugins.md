# Writing Plugins

Create JavaScript modules in the `plugins/` directory. Export hook functions such as `onParseMarkdown` or `onPageRendered` to modify the build.

Example:

```js
module.exports = {
  onPageRendered: async ({ html }) => {
    return { html: html + '\n<!-- custom -->' };
  }
};
```
