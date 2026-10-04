## Full-Stack Context Orchestrator Frontend

A collaboration-ready frontend workspace built with `Next.js + React + TypeScript + Tailwind CSS 4 + shadcn/ui + pnpm`.

## Current Capabilities

- Product overview homepage
- Project listing and project creation
- Project workspace and project navigation
- Requirement input and requirement history
- Project Blueprint generation through the backend API
- Viewing and copying formatted Blueprint JSON
- API contract draft generation, viewing, and copying
- Database model draft generation, viewing, and copying
- Context Pack / Codex Prompt generation
- Copying `prompt_text` and exporting Markdown
- Viewing consistency check results
- English and Simplified Chinese interface locales, with English as the default

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

Optional application settings:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Full-Stack Context Orchestrator
```

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Frontend/Backend Workflow

1. Start the backend service and make sure the API prefix is `http://localhost:8000/api/v1`.
2. Start the frontend with `pnpm dev`.
3. Open the homepage and go to the project list.
4. Create or open a project.
5. Save a natural-language requirement.
6. Select **Generate Blueprint Draft**.
7. Select **Generate API Contract Draft**, then review the endpoint table and JSON on the API Contract page.
8. Select **Generate Database Model Draft**, then review entities, fields, relationships, and JSON on the Database Model page.
9. Select **Generate Context Packs**, then review and copy `prompt_text` or export Markdown on the Prompts page.
10. Open the Consistency Check page to review validation results.

## Common Commands

```bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm start
```
