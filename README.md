# ResumeMate frontend

Status: frontend prototype. Sample data is fictional. The following are NOT yet implemented and must not be presented as working:
- LaTeX compilation and PDF output
- Resume file extraction (PDF, DOCX, TXT). Uploads only check type and size.
- Gemini text improvement and Gemini Live voice
- The Chrome extension and the website-extension handshake
- Drafts are held in memory only and are lost on reload

## Requirements

- Node.js 22 LTS (tested target: 22.x). Next.js 14.2 also supports Node 18.18+.
- npm 10+ (ships with Node 22).

## Commands

    npm ci            # install exactly from package-lock.json
    npm run dev       # development server on http://localhost:3000
    npm run build     # production build
    npm run start     # serve the production build
    npm run lint      # next lint

Use `npm ci`, not `npm install`, so the lockfile is not rewritten.

## Environment

Copy `.env.example` to `.env.local`. No variable is read by the code yet. Never add secrets with the `NEXT_PUBLIC_` prefix.

## Deployment

The app is currently a static-compatible Next.js App Router site. Build output is `.next/` and it needs a Node runtime (`npm run start`) or a platform that supports Next.js 14. Planned server features (Gemini routes and the LaTeX compile service) will require a Node server or a separate isolated compile service, so static-only hosting will not support them.

## Verification status

Last verified in the development sandbox:
- Fictional sample data passes a strict TypeScript check and contains no personal identifiers.
- `package-lock.json` matches `package.json` exactly.

Not yet verified: `npm ci`, `npm run build`, and lint. The sandbox could not reach the npm registry, so run these locally before deploying.

## Integration status

See `docs/INTEGRATION-STATUS.md` for the verified status of the frontend, the Chrome extension, and their protocol. In short: the bridge client and payload serializer exist in `lib/extension-bridge.ts`, and they are tested against the extension's validator. The React UI is not yet connected to them. LaTeX compilation, file import, and deployment are not implemented or deployed.
