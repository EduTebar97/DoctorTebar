# Despliegue

## Backend En Render

- Blueprint disponible en `render.yaml`.
- Root directory: `apps/api`
- Build: `npm install --include=dev && npm run build`
- Start: `npm run start`
- Healthcheck: `/api/health`

Variables obligatorias:

- `NODE_ENV=production`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- `COOKIE_NAME`

## Frontend En Vercel

- Configuracion disponible en `vercel.json`.
- Build: `npm --workspace @doctor-tebar/web run build`
- Output: `apps/web/dist`

Variables:

- `VITE_API_URL=https://api.eduardotebarbotic.com/api`
- `VITE_APP_NAME=Eduardo Tebarbotic | Metodologia Clinica`
