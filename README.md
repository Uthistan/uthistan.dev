# uthistan.com

Personal site and client onboarding for Uthistan, a full-stack engineer based in Bengaluru.

Live at [uthistan.com](https://uthistan.com). Built with Next.js and deployed on Vercel.

## Getting started

```bash
cp .env.example .env.local
npm install
npm run start:dev
```

Open [http://localhost:3000](http://localhost:3000). The variables in `.env.example` are needed for the project declaration email on `/start-project`.

## Scripts

- `npm run start:dev` starts the development server
- `npm run build` creates a production build
- `npm run start` serves the production build
- `npm run lint` runs ESLint

## SEO

The site URL, name and tagline live in `src/lib/site.ts`. Metadata is set in `src/app/layout.tsx` and `src/app/start-project/page.tsx`, alongside `robots.ts`, `sitemap.ts` and the generated `opengraph-image.tsx`.
