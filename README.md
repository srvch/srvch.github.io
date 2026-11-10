# Saurav Chaudhary: Portfolio

A static, no-build personal portfolio (plain HTML, CSS and JS).

## Run locally

```bash
cd portfolio
python3 -m http.server 8000   # then open http://localhost:8000
```

## Edit content

- All text lives in `index.html`. Each section has an `id` (`about`, `experience`, `impact`, `skills`, ...).
- Colors, spacing and fonts are CSS variables at the top of `css/style.css`.
- The resume PDF is `assets/Saurav_Chaudhary_Resume.pdf`; replace it when you update your resume.

## Deploy (free)

Push the folder to GitHub and enable **Pages** (Settings → Pages → deploy from `main`), or drag the folder into Netlify.

## Live site

Published with GitHub Pages at https://srvch.github.io/ (repo `srvch/srvch.github.io`, branch `main`). Push to `main` to update it; changes appear within a minute or two.

## Icon credits

The small icons on the skill chips are inlined as an SVG sprite at the top of `index.html` (no external requests). They come from open-source sets:

- **Technology logos:** [Simple Icons](https://simpleicons.org) v16.37.0 (CC0 1.0), plus the Java and AWS marks from [Devicon](https://devicon.dev) (MIT).
- **General icons** (SQL, REST APIs, microservices, CI/CD, data structures, low-level and high-level design, LLMs, agents, tools, search): [Lucide](https://lucide.dev) v1.71.0 (ISC License).

Logos are trademarks of their respective owners and are shown only to indicate technologies used.
