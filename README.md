# Artikel Trainer

Practice German articles (`der`, `die`, `das`) with 10 random nouns per round.

**Live app:** [https://jmgomes.github.io/artikels/](https://jmgomes.github.io/artikels/)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/artikels/](http://localhost:5173/artikels/) (Vite uses the same `/artikels/` base path as GitHub Pages).

## Deploy to GitHub Pages

1. Create a repo named `artikels` on GitHub ([JMGomes](https://github.com/JMGomes)).
2. Push this project to the `main` branch.
3. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Push to `main` (or run the workflow manually). The workflow in `.github/workflows/deploy.yml` builds and publishes the site.

Vocabulary lives in `public/words.json` and is loaded at runtime.

## Stack

- React + TypeScript
- Vite (static build, easy GitHub Pages setup)
