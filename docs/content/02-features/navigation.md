# Controlling Sidebar Order

Archivox builds the sidebar by scanning the `content/` directory. Folders and files are sorted alphabetically by default. To set a custom order, prefix the names with numbers like `01-` or `02-`.

```
content/
  01-getting-started/
    01-install.md
    02-build.md
  02-features/
  03-customization/
```

Numbers are stripped from the displayed titles, but they determine the ordering in the navigation. Nested folders work the same way, letting you create subsections within a section.
