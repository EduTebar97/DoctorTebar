# API Endpoints

## Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/change-password`

## Publico

- `GET /api/posts`
- `GET /api/posts/:slug`
- `GET /api/news`
- `GET /api/news/:slug`
- `GET /api/resources`
- `GET /api/services`
- `POST /api/inquiries`
- `GET /api/settings/public`
- `GET /api/health`

## Admin

- `GET|POST /api/admin/posts`
- `GET|PUT|DELETE /api/admin/posts/:id`
- `PATCH /api/admin/posts/:id/publish`
- `PATCH /api/admin/posts/:id/archive`
- Mismos patrones para `news`, `resources`, `services`.
- `GET /api/admin/inquiries`
- `PATCH /api/admin/inquiries/:id/status`
- `PATCH /api/admin/inquiries/:id/notes`
- `GET|PUT /api/admin/settings`
- `GET|POST /api/admin/users`
- `POST /api/admin/media/upload`
