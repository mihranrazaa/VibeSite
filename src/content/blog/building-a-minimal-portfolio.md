---
title: "Building a Minimal Portfolio Website"
description: "How I built this very portfolio/blog site using Astro, shadcn/ui, and deployed it on Cloudflare Pages."
date: 2026-02-25
tags: ["web-dev", "portfolio", "astro"]
draft: true
---

## The Stack

When I decided to rebuild my personal site, I had a few goals in mind:

1. **Minimal design** — 2-3 colors max, clean typography
2. **Fast** — static HTML, minimal JavaScript
3. **Easy to maintain** — write posts in markdown, push to deploy
4. **Free hosting** — because why not?

### The Tech

- **Astro** — for static site generation with island architecture
- **React** — for interactive components (search, mobile menu)
- **shadcn/ui** — beautiful, accessible components without the bloat
- **Tailwind CSS** — utility-first styling
- **Fuse.js** — client-side fuzzy search
- **Cloudflare Pages** — free, fast, global CDN

### Design Philosophy

I kept the color palette intentionally limited:

- **Off-white** background (`#fafafa`)
- **Near-black** text (`#0a0a0a`)
- **Indigo** accent (`#4f46e5`) for links and highlights

The typography uses **Inter** — clean, modern, and highly readable at any size.

### Key Features

- **Search** — fuzzy search across all blog posts
- **Tags** — organize and discover related content
- **Responsive** — works great on mobile and desktop
- **Fast** — perfect Lighthouse scores

### Deployment

Deploying on Cloudflare Pages is dead simple:

1. Push your code to GitHub
2. Connect the repo to Cloudflare Pages
3. Set the build command to `npm run build`
4. Set the output directory to `dist`

That's it. Every push triggers a new deployment.

---

If you're interested in building something similar, feel free to check out the source code or reach out!
