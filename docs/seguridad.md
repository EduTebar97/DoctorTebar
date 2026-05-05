# Seguridad

- JWT firmado en cookie httpOnly.
- `secure: true` en produccion.
- Passwords con bcrypt.
- CORS restringido por `CLIENT_ORIGIN`.
- Helmet activo.
- Rate limit en login y consultas.
- Validacion Zod en endpoints.
- Sanitizacion de HTML enriquecido antes de guardar.
- Uploads limitados por tamano y MIME.
- Audit log para acciones privadas.
