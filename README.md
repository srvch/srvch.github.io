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

The small icons are inlined as an SVG sprite at the top of `index.html` (no external requests). They come from open-source sets:

- **Technology logos** (Java, Spring Boot, Redis, Kafka, Docker, ...): [SVG Logos](https://github.com/gilbarbara/logos) by Gil Barbara (CC0 1.0).
- **Modern icons** (skill card headers, SQL, REST APIs, CI/CD, agents, tool calling, search, data structures, low/high-level design, the trophy and award ribbon): [Fluent UI System Color Icons](https://github.com/microsoft/fluentui-system-icons) by Microsoft (MIT License).
- **Illustrated icons** (graduation cap, package, brain): [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) by Microsoft, flat style (MIT License).

Logos are trademarks of their respective owners and are shown only to indicate technologies used.
