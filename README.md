# ACCP Web

Public website for ACCP Conference.

## Quick Start

```bash
npm install --legacy-peer-deps
npm run dev
```

## Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start development server (port 3000) |
| `npm run build` | Build for production                 |
| `npm run start` | Start production server              |
| `npm run lint`  | Run ESLint                           |
| `npm run sass`  | Watch SCSS changes                   |

## Environment Variables

Copy `.env.example` or create `.env`:

```
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

## Deploy to Netlify

1. Create a new Netlify site from this repository.
2. Set **Base directory** to `accp-web`.
3. Use the project `netlify.toml` in this folder:
   - Build command: `npm run build`
   - Node version: `20`
   - NPM flags: `--legacy-peer-deps`
4. Add production environment variables in Netlify:
   - `NEXT_PUBLIC_API_URL=https://<your-api-domain>`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY=...`
5. Trigger deploy and verify key flows:
   - login / register / forgot password
   - abstract submission
   - checkout and payment result page

### Required API-side updates

Before go-live, update backend (`accp-api`) environment values:

- `CORS_ORIGIN=https://<web-domain>,https://<backoffice-domain>`
- `BASE_URL=https://<web-domain>`
- `API_BASE_URL=https://<api-domain>`

## Project Structure

```
accp-web/
├── app/            # Next.js pages
├── components/     # React components
├── public/         # Static assets
├── styles/         # CSS/SCSS styles
└── types/          # TypeScript types
```
