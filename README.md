# HumanCOIN-Doc

Source for the HumanCOIN documentation site. The book is written in GitBook-compatible Markdown and built with [HonKit](https://honkit.netlify.app/).

## Local development

```bash
pnpm install
pnpm run serve      # http://localhost:4000
```

The book is bilingual:

- `en/` — English
- `zh/` — Chinese

Each language has its own `SUMMARY.md`; shared images live in `assets/`.

## Build

```bash
pnpm run build      # writes _book/
```

## Deploy

The static build is published from the `gh-pages` branch. In the repository settings, set **Pages → Build and deployment → Source** to **Deploy from a branch**, then choose `gh-pages` / `root`.

To update the site, rebuild and push the generated `_book/` to `gh-pages`.

The content is also GitBook-compatible for later Git Sync: `SUMMARY.md`, `README.md` and standard Markdown are used throughout.
