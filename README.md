# HumanCOIN-Doc

Source for the [HumanCOIN documentation site](https://flagopen.github.io/HumanCOIN-Doc/). It is built with [VitePress](https://vitepress.dev/) in a modern, GitBook-style layout.

## Local development

```bash
pnpm install
pnpm dev
```

Open <http://localhost:5173/HumanCOIN-Doc/>.

## Content layout

```text
docs/
├── .vitepress/       # config and custom theme
├── public/assets/    # shared images
├── index.md          # English home
├── *.md              # English guides
└── zh/               # Chinese home and guides
```

English is the root locale; Chinese is served from `/zh/`.

## Build

```bash
pnpm build
```

Output: `docs/.vitepress/dist/`.

## Deploy

The static build is published from the `gh-pages` branch. In repository settings, set **Pages → Build and deployment → Source** to **Deploy from a branch**, then `gh-pages` / `root`.

To update the site, rebuild and push `docs/.vitepress/dist/` to `gh-pages`.
