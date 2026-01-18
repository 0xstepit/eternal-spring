# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Eternal Spring is a personal blog built with Astro v5, focused on software design,
decentralized finance, math, and martial arts.
It features LaTeX math rendering, syntax highlighting, and MDX support.

## Commands

```bash
yarn dev      # Start dev server at localhost:4321
yarn build    # Production build to dist/
yarn preview  # Preview production build
```

## Architecture

### Content System

- Blog posts live in `src/writings/` as Markdown/MDX files
- Content schema defined in `src/content.config.ts` with fields:
  title, summary, author, modified, tags, to-publish
- Posts with `to-publish: true` appear on the site
- Writing utilities in `src/scripts/writings.ts` handle sorting,
  grouping by year, and finding neighboring posts

### Routing

- `src/pages/writings/[slug].astro` - Dynamic blog post routes generated from content collection
- `src/pages/tags/[tag].astro` - Tag-based filtering
- `src/pages/writings.astro` - Blog listing grouped by year

### Layout Hierarchy

```
Base.astro (main wrapper)
├── Head.astro (metadata)
├── Header.astro → Navigation.astro → NavigationLinks.astro
├── main content (slot)
└── Footer.astro → SocialLinks.astro
```

### Configuration

- Site config (title, author, social links, nav) in `src/config.ts`
- Path alias `@/*` maps to `./src/*`
- Markdown extensions: remark-math + rehype-katex for LaTeX, rehype-pretty-code for syntax highlighting (GitHub Light theme)

### Styling

- CSS custom properties in `src/styles/variables.css`
- Global styles split across `src/styles/` modules (typography, header, footer, reset)

## Conventions

- Commit messages follow conventional commits: `fix:`, `chore:`, `feat:`, `refactor:`, `perf:`
- Blog posts include GitHub edit links pointing to the repo
