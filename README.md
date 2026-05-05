# Doctor Tebar

Aplicacion web profesional de metodologia clinica aplicada para Eduardo Tebarbotic.

## Estructura

- `apps/web`: frontend React, Vite y TypeScript.
- `apps/api`: API Node, Express, TypeScript y MongoDB.
- `packages/shared`: tipos y constantes compartidas.
- `e2e`: pruebas Playwright.
- `docs`: documentacion operativa.

## Desarrollo local

1. Instala dependencias:

```bash
npm install
```

2. Copia variables:

```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
```

3. Levanta MongoDB local:

```bash
docker compose up -d
```

4. Crea el admin inicial:

```bash
npm --workspace @doctor-tebar/api run seed:admin
```

5. Ejecuta backend y frontend:

```bash
npm run dev:api
npm run dev:web
```

## Scripts principales

```bash
npm run build
npm run test
npm run test:e2e
```

Credenciales de desarrollo del seed:

- Email: `admin@example.com`
- Password: `AdminPassword123!`
