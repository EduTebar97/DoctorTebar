# Arquitectura

Monorepo full-stack con frontend React/Vite, API Express/TypeScript, MongoDB y tipos compartidos.

## Apps

- `apps/web`: zona publica y backoffice privado.
- `apps/api`: API REST, auth JWT en cookie httpOnly, modelos Mongoose y validacion Zod.
- `packages/shared`: tipos y constantes comunes.
- `e2e`: flujos criticos con Playwright.

## Entornos

- Local: `http://localhost:5173` y `http://localhost:4000`.
- Staging: frontend y API con variables separadas.
- Produccion: dominio publico, API dedicada, MongoDB Atlas y backups.
