# RaaviStyle

فروشگاه راوی‌استایل: **Next.js** فروشگاه و **پنل مدیریت** در `apps/backend`.

```text
apps/
  backend/   API + Admin  (http://localhost:9000)
  web/       فروشگاه      (http://localhost:3000)
```

## Prerequisites

- Node.js 20.19+ or 22.12+
- pnpm 11+
- PostgreSQL 15+

## Setup

```bash
pnpm install
cp apps/backend/.env.template apps/backend/.env
cp apps/web/.env.example apps/web/.env.local
```

Create a PostgreSQL database named `raavistyle`, then set `DATABASE_URL` in `apps/backend/.env`.

```bash
pnpm --filter @raavistyle/backend exec medusa db:migrate
```

## Develop

```bash
pnpm dev
```

Or run apps separately:

```bash
pnpm dev:backend
pnpm dev:web
```

- Store API / Admin: http://localhost:9000
- Storefront: http://localhost:3000
