# Produccion

## Requisitos Externos

- MongoDB Atlas con una base para produccion.
- Render conectado al repositorio para `apps/api`.
- Vercel conectado al repositorio para `apps/web`.
- Dominio `eduardotebarbotic.com` apuntando a Vercel.
- Subdominio `api.eduardotebarbotic.com` apuntando a Render.

## Variables Render

- `NODE_ENV=production`
- `PORT=10000`
- `MONGODB_URI=mongodb+srv://...`
- `JWT_SECRET=<secreto largo>`
- `JWT_EXPIRES_IN=7d`
- `COOKIE_NAME=etb_session`
- `CLIENT_ORIGIN=https://eduardotebarbotic.com,https://www.eduardotebarbotic.com`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Variables Vercel

- `VITE_API_URL=https://api.eduardotebarbotic.com/api`
- `VITE_APP_NAME=Eduardo Tebarbotic | Metodologia Clinica`

## Verificacion Post-Deploy

```bash
curl https://api.eduardotebarbotic.com/api/health
npm run test:e2e -- --config e2e/playwright.config.ts
./scripts/check-production.sh
```

Despues:

1. Crear admin con el seed en el entorno de produccion.
2. Ejecutar seed demo solo si se quieren datos iniciales.
3. Verificar login en `/login`.
4. Crear un post publicado.
5. Verificar que aparece en `/blog`.
6. Enviar una consulta desde `/contacto`.
