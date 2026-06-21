# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Portfolio website for Maria Clara Castioni (scenographer/artist), built as a **content-driven Nuxt 3 static site**. Deployed to `https://mariaclaracastioni.ch/`. Content is authored as Markdown in `content/`; pages are rendered from it via `@nuxt/content` in document-driven mode.

## Commands

```bash
npm run dev            # dev server on 0.0.0.0:3000
npm run build          # nuxt build (SSR/node output)
npm run generate       # updateImageDimensions.mjs + nuxt generate (full static prerender) — use this for prod
npm run preview        # preview a built output
npm run update-images  # run the image-dimension/thumbhash script only
```

There is no test suite, linter, or typecheck script configured. `npm run generate` is the canonical build (it regenerates image metadata first, then prerenders).

## Architecture

- **Content drives routing.** `@nuxt/content` runs with `documentDriven: true`. The three content collections live under `content/` with numeric-prefixed dirs that set ordering: `1.spaces` (scenographic projects), `2.words` (writing), `3.about`. The `pages/{spaces,words,about}/[...slug].vue` routes are thin wrappers that render `<ContentPage contentType="..." />`; the real rendering logic is in `components/ContentPage.vue` (image carousel, prev/next navigation, description/credits).

- **Project frontmatter schema.** Each project `.md` has frontmatter with `title`, `year`, `icon`, `navigation.order`, and an `images:` array. Each image entry carries `src`, `caption`, and machine-generated fields: `width`, `height`, `ratio`, `thumbhash`, `thumbhashRatio`. **Do not hand-edit the generated fields** — run `npm run update-images`.

- **Image pipeline.** `scripts/updateImageDimensions.mjs` scans the three content dirs, reads each image from `public/` (or `public/uploads/` for relative paths) with `sharp`, and writes back missing `width`/`height`/`ratio` plus a base64 `thumbhash` (via the `thumbhash` lib). It only fills in absent fields, so it's safe to re-run. This runs automatically as part of `npm run generate`.

- **Image rendering.** `components/ThumbhashImage.vue` wraps `<UnLazyImage>` (`@unlazy/nuxt`) — it shows the thumbhash placeholder, then lazy-loads responsive `webp`/`jpeg` `<source>` srcsets generated through `useImage()` (`@nuxt/image`). Pass an `image` object (the frontmatter shape) plus `sizes`/`quality`.

- **IPX caching.** `server/middleware/ipxCache.ts` intercepts `/_ipx/` requests and persists transformed images to `.ipx-cache/` on disk, serving from cache on subsequent hits. This is a custom layer on top of `@nuxt/image`'s IPX provider.

- **Global shell.** `app.vue` is the root: it renders the `Navbar` + project icons (built by querying all `spaces` and `words` content), wraps `<NuxtPage>` in `<NuxtLayout>`, and sets all SEO/head metadata. It also wires Umami analytics and a Netlify Identity hook that redirects logged-in users to `/admin/` (Netlify CMS).

- **SEO & sitemap.** `@nuxtjs/seo` + `@nuxtjs/sitemap`. The sitemap is sourced from `server/api/__sitemap__/urls.ts`, which queries content and emits per-page image entries. `nuxt.config.ts` holds `site` metadata and robots disallow rules.

## Conventions

- Content collection dirs use numeric prefixes (`1.`, `2.`, `3.`) — these control display order; keep them when adding files.
- Project images live in `public/uploads/`.
- After adding/changing any project images, always run `npm run update-images` (or `npm run generate`) so dimensions and thumbhashes are regenerated before deploy.
