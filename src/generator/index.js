// Generator entry point for DocForge
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const Eleventy = require('@11ty/eleventy');
const lunr = require('lunr');
const { lexer } = require('marked');
const loadConfig = require('../config/loadConfig');

async function readDirRecursive(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await readDirRecursive(res));
    } else {
      files.push(res);
    }
  }
  return files;
}

function buildNav(pages) {
  const tree = {};
  for (const page of pages) {
    const rel = page.file.replace(/\\/g, '/');
    const parts = rel.split('/');
    let node = tree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!node.children) node.children = [];
      let child = node.children.find(c => c.name === part);
      if (!child) {
        child = { name: part, children: [] };
        node.children.push(child);
      }
      node = child;
      if (i === parts.length - 1) {
        node.page = page.data;
        node.path = `/${rel.replace(/\.md$/, '.html')}`;
      }
    }
    node.order = page.data.order || 0;
  }

  function sort(node) {
    if (!node.children) return;
    node.children.sort((a, b) => (a.order || 0) - (b.order || 0));
    node.children.forEach(sort);
  }
  sort(tree);
  return tree.children || [];
}

async function generate({ contentDir = 'content', outputDir = '_site', configPath } = {}) {
  const config = loadConfig(configPath);
  if (!fs.existsSync(contentDir)) {
    console.error(`Content directory not found: ${contentDir}`);
    return;
  }

  const files = await readDirRecursive(contentDir);
  const pages = [];
  const assets = [];
  const searchDocs = [];

  for (const file of files) {
    const rel = path.relative(contentDir, file);
    if (file.endsWith('.md')) {
      const srcStat = await fs.promises.stat(file);
      const outPath = path.join(outputDir, rel.replace(/\.md$/, '.html'));
      if (fs.existsSync(outPath)) {
        const outStat = await fs.promises.stat(outPath);
        if (srcStat.mtimeMs <= outStat.mtimeMs) {
          continue; // skip unchanged
        }
      }
      const raw = await fs.promises.readFile(file, 'utf8');
      const parsed = matter(raw);
      const title = parsed.data.title || path.basename(rel, '.md');
      const tokens = lexer(parsed.content || '');
      const headings = tokens.filter(t => t.type === 'heading').map(t => t.text).join(' ');
      pages.push({ file: rel, data: { ...parsed.data, title } });
      searchDocs.push({ id: rel.replace(/\.md$/, '.html'), url: '/' + rel.replace(/\.md$/, '.html'), title, headings });
    } else {
      assets.push(rel);
    }
  }

  const nav = buildNav(pages);
  await fs.promises.mkdir(outputDir, { recursive: true });
  await fs.promises.writeFile(path.join(outputDir, 'navigation.json'), JSON.stringify(nav, null, 2));
  await fs.promises.writeFile(path.join(outputDir, 'config.json'), JSON.stringify(config, null, 2));

  const searchIndex = lunr(function() {
    this.ref('id');
    this.field('title');
    this.field('headings');
    searchDocs.forEach(d => this.add(d));
  });
  await fs.promises.writeFile(
    path.join(outputDir, 'search-index.json'),
    JSON.stringify({ index: searchIndex.toJSON(), docs: searchDocs }, null, 2)
  );

  const elev = new Eleventy(contentDir, outputDir);
  elev.setConfig({
    dir: {
      input: contentDir,
      output: outputDir,
      includes: path.relative(contentDir, 'templates')
    },
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk'
  });
  elev.configFunction = function(eleventyConfig) {
    eleventyConfig.addGlobalData('navigation', nav);
    eleventyConfig.addGlobalData('config', config);
    eleventyConfig.addGlobalData('layout', 'layout.njk');
    eleventyConfig.addPassthroughCopy({ 'assets': 'assets' });
  };
  await elev.write();

  for (const asset of assets) {
    const srcPath = path.join(contentDir, asset);
    const destPath = path.join(outputDir, asset);
    await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
    try {
      const sharp = require('sharp');
      if (/(png|jpg|jpeg)/i.test(path.extname(asset))) {
        await sharp(srcPath).toFile(destPath);
        continue;
      }
    } catch (e) {
      // sharp not installed, fallback
    }
    await fs.promises.copyFile(srcPath, destPath);
  }
}

module.exports = { generate };
