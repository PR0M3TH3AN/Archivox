# DocForge: Final Specification

**Version:** 1.0  
**Date:** July 10, 2025  
**Overview:** DocForge is a modular, lightweight static site generator (SSG) for building "Read the Docs"-style documentation sites. It prioritizes user simplicity: content is driven entirely by Markdown files in a `content` folder, which automatically determines page structure, titles, and sidebar links. No manual HTML, link creation, or complex setups are needed. The site is mobile-friendly, SEO-optimized, and deployable to Netlify or similar hosts.

Built with Node.js (using libraries like Eleventy for templating, `marked` or `remark` for Markdown parsing, and Vanilla JS for client-side features), DocForge generates static HTML/CSS/JS files. It's extensible via plugins and config, but defaults to a minimal, fast workflow.

This final spec incorporates core features, enhancements for usability and performance, and explicit user instructions. It's designed to be implemented as an open-source GitHub repo with a CLI starter kit (e.g., `npx create-docforge my-site`).

## Key Features

- **Markdown-Driven Content and Navigation**:
  - Pages from `.md` files; folder structure builds the sidebar tree automatically.
  - Supports nested sections (YAML frontmatter for overrides like titles or order).
  - Index files (e.g., `index.md`) as section landings; alphabetical sorting with numeric prefixes for custom order.

- **UI and Responsiveness**:
  - Collapsible sidebar with expandable sections, breadcrumbs, and mobile hamburger menu.
  - Header: Customizable logo, site title, version switcher.
  - Footer: Links, copyright, social icons.
  - Search: Client-side fuzzy search (Lunr.js) with highlighting; optional no-results suggestions.
  - Page Layout: Auto-TOC from headings, right sidebar for wide screens.

- **Customization**:
  - `config.yaml` for site title, logo, themes, footer, dark mode, analytics.
  - Shortcodes in Markdown for embeds (e.g., images, tabs, notes).
  - Themes: CSS variables; pre-built options like "minimal".
  - Multi-Versioning: Folder-based (e.g., `content/v1/`), with UI switcher.

- **Performance and Accessibility**:
  - Minified assets, lazy images, service workers for offline.
  - WCAG-compliant: ARIA labels, keyboard nav, contrast checks.
  - Incremental builds for fast dev.

- **Extensibility**:
  - Plugins for analytics, comments, API docs.
  - Hooks for custom processing.
  - i18n support via subfolders.

- **Search and Analytics**:
  - Advanced search with stemming.
  - Optional metrics (e.g., Plausible integration).

## Architecture

1. **Generator Flow**:
   - Scan `content/` recursively.
   - Parse Markdown with frontmatter (`gray-matter`).
   - Build nav JSON tree.
   - Render pages with templates (Nunjucks).
   - Optimize/copy assets.
   - Output to `_site/`.

2. **Tech Stack**:
   - Node.js 18+.
   - Dependencies: Eleventy (core), marked/remark, Lunr.js, gray-matter.
   - Dev: Live reload with Vite or Eleventy server.
   - No runtime deps; pure static output.

3. **Modularity**:
   - Core: Content parsing/nav generation.
   - Plugins: Load from `plugins/` (e.g., JS modules with hooks like `onParseMarkdown`).

## Folder Structure

```
my-docforge-site/
├── content/                  # Markdown-driven content
│   ├── introduction.md       # Top-level: "Introduction"
│   ├── getting-started/      # Section: "Getting Started"
│   │   ├── index.md          # Section overview
│   │   ├── 01-install.md     # Sub-page: "Install" (numeric order)
│   │   └── image.png         # Asset (referenced in MD)
│   └── advanced/             # Section: "Advanced"
│       └── api/              # Nested: "API"
│           └── endpoints.md  # Sub-page: "Endpoints"
├── config.yaml               # Site settings
├── assets/                   # Custom static files
│   └── logo.svg              # Logo
├── plugins/                  # Optional extensions
│   └── analytics.js          # Example plugin
├── netlify.toml              # Deployment config
└── _site/                    # Built output (git-ignored)
```

- **Content Rules**:
  - Max nesting: 4 levels.
  - File names: Hyphens/underscores to spaces for titles (e.g., `quick-start.md` -> "Quick Start").
  - Assets: Place in content subfolders; reference relatively in MD.

## Configuration File (config.yaml)

Example:

```yaml
site:
  title: "DocForge Docs"
  description: "Simple static docs."
  logo: "/assets/logo.svg"
  favicon: "/assets/favicon.ico"

navigation:
  search: true
  versions:                     # Optional
    - label: "v1.0"
      path: "/v1"

footer:
  links:
    - text: "GitHub"
      url: "https://github.com"
  social:
    - icon: "twitter"
      url: "https://x.com"
  copyright: "© 2025 DocForge"

theme:
  name: "minimal"
  primaryColor: "#007bff"
  darkMode: true                # Auto/system toggle

features:
  i18n: false                   # Enable for multi-lang
  analytics:
    provider: "plausible"
    id: "my-site.io"

plugins:
  - "analytics"                 # Load from plugins/
```

- **Defaults**: Sensible fallbacks if absent.
- **Validation**: Build-time checks.

## Navigation and UI Details

- **Sidebar**: Tree view, highlight active, filterable on search.
- **Header**: Logo + Title + Search + Version Switcher + Dark Toggle.
- **Page**: Markdown-rendered body + Auto-TOC + Edit Link (GitHub).
- **Markdown Extensions**: GFM + Shortcodes (e.g., `{% image src="image.png" %}`, `{% note "Title" %}Content{% endnote %}` for admonitions, `{% tabs %}...{% endtabs %}`).
- **Accessibility**: Alt text prompts, print styles.

## User Instructions: Formatting and Placing Markdown

To make DocForge truly user-friendly, include these instructions in the starter repo's `README.md` (which can render as a self-hosted "Getting Started" page). Emphasize simplicity: "Just write Markdown—no code required."

### Placing Files and Folders
- **Create Sections**: Use folders for top-level sections (e.g., `content/guides/`). Subfolders nest subsections (e.g., `content/guides/basics/`).
- **Add Pages**: Place `.md` files inside folders. File name becomes the page title (e.g., `setup.md` -> "Setup"). Avoid special chars; use hyphens for spaces.
- **Section Overviews**: Add `index.md` in a folder for its landing page (e.g., `content/guides/index.md` as "Guides" intro).
- **Custom Ordering**: Prefix files/folders with numbers (e.g., `01-intro.md`, `02-setup.md`) for sorting; alphabetical otherwise.
- **Assets**: Put images/PDFs in the same folder as the referencing MD file. Reference relatively: `![Alt text](my-image.jpg)`.
- **Nesting Limits**: Keep to 3-4 levels max for usability; deeper may collapse in UI.
- **Multi-Version**: Prefix folders like `content/v1/`, `content/v2/`; config enables switcher.
- **Multi-Language (Optional)**: Use `content/en/`, `content/fr/` if `features.i18n: true`; add lang switcher.

### Formatting Markdown Content
- **Basics**: Use standard Markdown:
  - `# Heading 1` for main titles (auto-generates page TOC).
  - `## Subheading` for sections.
  - `- Bullet lists` or `1. Numbered`.
  - `**Bold**`, `_italic_`, `~~strikethrough~~`.
  - Code: Inline `` `code` `` or blocks:
    ```
    ```python
    print("Hello")
    ```
    ```
  - Links: `[Text](url)` (internal: `[Link](/path)`, auto-resolved).
  - Tables: 
    | Col1 | Col2 |
    |------|------|
    | Val  | Val  |
- **Enhancements**:
  - **Frontmatter**: Optional YAML at top for overrides:
    ```
    ---
    title: Custom Title
    order: 3              # Override sorting
    description: SEO meta
    ---
    # Your content...
    ```
  - **Shortcodes**: For richer elements (no extra setup needed):
    - Images: `{% image src="path.jpg" alt="Desc" caption="Fig 1" %}` (auto-optimizes).
    - Notes/Warnings: `{% note "Info" %}Text{% endnote %}`, `{% warning %}Caution{% endwarning %}`.
    - Tabs: `{% tabs %}<br>{% tab "Tab1" %}Content1{% endtab %}<br>{% tab "Tab2" %}Content2{% endtab %}<br>{% endtabs %}`.
    - Accordions: `{% accordion "Section" %}Hidden content{% endaccordion %}`.
  - **Embeds**: YouTube: `[Video](https://youtube.com/watch?v=ID)` (renders iframe).
  - **Best Practices**:
    - Use H1 (#) once per page for main title.
    - Add alt text to images for accessibility.
    - Keep paragraphs short for mobile readability.
    - Test embeds/assets locally.
    - For code snippets, add copy buttons via shortcode: `{% code lang="js" %}code{% endcode %}`.

### Tips for Success
- **Preview Changes**: Run `npm run dev` for live site at localhost:8080.
- **Common Issues**: If a page doesn't show, check file extension (.md) and no duplicate names.
- **Advanced**: For custom shortcodes, add plugins; else, stick to basics.

## Build and Deployment

- **Commands** (via package.json):
  - `npm install`: Setup.
  - `npm run dev`: Local server.
  - `npm run build`: Generate `_site/`.
- **Netlify**:
  - `netlify.toml`:
    ```toml
    [build]
      command = "npm run build"
      publish = "_site"
    ```
  - Git push triggers deploys; previews for PRs.
- **Other Hosts**: Upload `_site/` to GitHub Pages, Vercel, etc.

## Extensibility Roadmap

- **Plugins**: JS files in `plugins/` with hooks (e.g., add shortcodes, post-build tasks).
- **Themes**: Customize variables in `assets/theme.css` or override styles in `assets/custom.css`. A built-in dark-mode toggle stores preference in local storage.
- **Future**: PDF export plugin, AI-assisted search suggestions.
- **Community**: MIT license; GitHub for issues.

This spec is complete and ready for implementation. Prototype core parsing first, then add features iteratively. Total est. dev time: 2-4 weeks for MVP.
