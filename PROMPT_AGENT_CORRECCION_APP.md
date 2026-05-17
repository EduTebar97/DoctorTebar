# PROMPT COMPLETO PARA AGENTE DE DESARROLLO

## CONTEXTO GENERAL

Estoy trabajando sobre una aplicación web que tiene una parte pública y una parte privada.

La aplicación debe quedar simplificada y centrada solo en tres grandes bloques:

1. Blog.
2. Formación.
3. Chat asociado a formación.

Todo lo que no sea necesario ahora mismo debe eliminarse, ocultarse o desactivarse temporalmente para no complicar el flujo.

Quiero quitar u ocultar módulos como:

- Noticias.
- Actualizaciones.
- Revistas.
- Recursos no necesarios.
- Cualquier otro módulo que no sea Blog, Formación o Chat.

No quiero que se borre código de forma peligrosa si eso puede romper la aplicación. Puede ocultarse de menús, rutas y navegación, pero debe quedar documentado qué se ha ocultado o desactivado.

---

# OBJETIVO PRINCIPAL

Quiero que revises, corrijas, simplifiques, añadas logs y pruebes toda la aplicación siguiendo un sistema de trabajo por sprints independientes, modulares, testeables y bloqueantes.

El orden general es:

1. Diagnosticar el proyecto y añadir logs base.
2. Corregir errores actuales de consola, especialmente los relacionados con autenticación y creación de blogs.
3. Añadir logs suficientes para poder depurar frontend, backend, autenticación, subida de imágenes, creación de blogs, formación y chat.
4. Simplificar el sistema de creación de blogs.
5. Permitir subir blogs con solo título y texto.
6. Permitir adjuntar imágenes a blogs.
7. Confirmar que los blogs se visualizan correctamente en la parte pública.
8. Limpiar módulos no necesarios.
9. Crear el módulo privado de formación.
10. Crear la página pública de formación.
11. Crear sistema de login para que solo usuarios autenticados puedan ver el contenido completo de las formaciones.
12. Permitir que usuarios no autenticados vean solo el listado de formaciones y sus índices.
13. Crear chat asociado a cada formación.
14. Crear panel privado para gestionar chats.
15. Añadir filtros, métricas y seguimiento por usuario/formación.
16. Testear todo en local.
17. Hacer build y despliegue si el proyecto lo permite.
18. Testear todo en producción/despliegue.
19. Crear datos de prueba.
20. Validar que todo funciona.
21. Borrar todos los datos de prueba.
22. Confirmar que no quedan errores críticos.
23. Entregar informe final.

---

# METODOLOGÍA OBLIGATORIA POR SPRINTS

El trabajo debe organizarse obligatoriamente por sprints.

Cada sprint debe ser:

- Independiente.
- Modular.
- Testeable.
- Validable.
- Cerrado antes de pasar al siguiente.

No debes avanzar al siguiente sprint si el sprint actual no funciona correctamente.

No quiero una implementación en bloque donde se cambien muchas cosas a la vez y luego sea imposible saber qué ha fallado.

Cada sprint debe tener:

1. Objetivo concreto.
2. Requisitos funcionales.
3. Archivos afectados.
4. Cambios realizados.
5. Logs añadidos.
6. Pruebas realizadas.
7. Resultado de las pruebas.
8. Errores detectados.
9. Correcciones aplicadas.
10. Confirmación de cierre del sprint.

Un sprint solo puede considerarse cerrado si:

- Compila correctamente.
- No genera errores críticos.
- No deja errores no controlados en consola.
- El flujo funcional principal queda probado.
- Los logs permiten depurar el flujo.
- Se documenta qué se ha hecho.
- Se confirma que no se ha roto lo anterior.

---

# REGLA BLOQUEANTE GENERAL

No pases al siguiente sprint hasta que el sprint actual esté completamente probado.

Si un sprint falla:

1. Detén el avance.
2. Analiza el fallo.
3. Añade logs si faltan.
4. Corrige el problema.
5. Repite las pruebas.
6. Documenta el resultado.
7. Solo entonces continúa.

No se debe avanzar dejando cosas pendientes salvo que se documente expresamente como bloqueo técnico real y se explique por qué.

---

# CHECKLIST GLOBAL PREVIO

Antes de tocar código, crea un checklist global con todos los sprints.

Cada sprint debe tener estado:

- Pendiente.
- En progreso.
- Bloqueado.
- Corregido.
- Testeado.
- Cerrado.

Checklist mínimo:

| Sprint | Nombre | Estado |
|---|---|---|
| Sprint 0 | Diagnóstico inicial, estructura del proyecto y logs base | Pendiente |
| Sprint 1 | Corrección de errores 401 y autenticación | Pendiente |
| Sprint 2 | Corrección y simplificación del blog | Pendiente |
| Sprint 3 | Subida y visualización de imágenes en blog | Pendiente |
| Sprint 4 | Limpieza de módulos no necesarios | Pendiente |
| Sprint 5 | Módulo privado de formación | Pendiente |
| Sprint 6 | Página pública de formación | Pendiente |
| Sprint 7 | Login y permisos de acceso a formación | Pendiente |
| Sprint 8 | Chat público asociado a formación | Pendiente |
| Sprint 9 | Panel privado de chat | Pendiente |
| Sprint 10 | Filtros, métricas y seguimiento de chats | Pendiente |
| Sprint 11 | Testeo integral en local | Pendiente |
| Sprint 12 | Build y despliegue | Pendiente |
| Sprint 13 | Testeo completo en producción | Pendiente |
| Sprint 14 | Limpieza de datos de prueba | Pendiente |
| Sprint 15 | Informe final y checklist de aceptación | Pendiente |

---

# ERRORES ACTUALES DE CONSOLA QUE DEBES TENER EN CUENTA

Estos son los errores exactos que aparecen ahora mismo en la consola del navegador:

```text
index-BFQmU3SB.js:303 
 GET https://doctor-tebar-api.onrender.com/api/auth/me 401 (Unauthorized)

index-BFQmU3SB.js:303 
 GET https://doctor-tebar-api.onrender.com/api/auth/me 401 (Unauthorized)

index-BFQmU3SB.js:303 
 GET https://doctor-tebar-api.onrender.com/api/admin/inquiries 401 (Unauthorized)

index-BFQmU3SB.js:303 
 GET https://doctor-tebar-api.onrender.com/api/admin/resources 401 (Unauthorized)

index-BFQmU3SB.js:303 
 GET https://doctor-tebar-api.onrender.com/api/auth/me 401 (Unauthorized)

index-BFQmU3SB.js:303 
 GET https://doctor-tebar-api.onrender.com/api/admin/posts 401 (Unauthorized)

index-BFQmU3SB.js:303 
 GET https://doctor-tebar-api.onrender.com/api/admin/news 401 (Unauthorized)

index-BFQmU3SB.js:303 
 GET https://doctor-tebar-api.onrender.com/api/admin/inquiries 401 (Unauthorized)

index-BFQmU3SB.js:303 
 GET https://doctor-tebar-api.onrender.com/api/admin/posts 401 (Unauthorized)

index-BFQmU3SB.js:303 
 GET https://doctor-tebar-api.onrender.com/api/admin/resources 401 (Unauthorized)

index-BFQmU3SB.js:303 
 GET https://doctor-tebar-api.onrender.com/api/admin/news 401 (Unauthorized)

index-BFQmU3SB.js:303 
 POST https://doctor-tebar-api.onrender.com/api/admin/posts 401 (Unauthorized)

(anonymous)	@	index-BFQmU3SB.js:303
xhr	@	index-BFQmU3SB.js:303
eO	@	index-BFQmU3SB.js:305
_request	@	index-BFQmU3SB.js:309
request	@	index-BFQmU3SB.js:305
(anonymous)	@	index-BFQmU3SB.js:309
(anonymous)	@	index-BFQmU3SB.js:301
fx	@	index-BFQmU3SB.js:347
v	@	index-BFQmU3SB.js:496
(anonymous)	@	index-BFQmU3SB.js:348
await in (anonymous)		
onClick	@	index-BFQmU3SB.js:497
lT	@	index-BFQmU3SB.js:48
(anonymous)	@	index-BFQmU3SB.js:48
pS	@	index-BFQmU3SB.js:48
O0	@	index-BFQmU3SB.js:48
U0	@	index-BFQmU3SB.js:49
uL	@	index-BFQmU3SB.js:49

index-BFQmU3SB.js:303 Uncaught (in promise) AxiosError: Request failed with status code 401
    at SM (index-BFQmU3SB.js:303:10051)
    at XMLHttpRequest.T (index-BFQmU3SB.js:303:15525)
    at vl.request (index-BFQmU3SB.js:305:2228)
    at async fx (index-BFQmU3SB.js:347:25403)
    at async v (index-BFQmU3SB.js:496:31830)
    at async index-BFQmU3SB.js:348:37771

SM	@	index-BFQmU3SB.js:303
T	@	index-BFQmU3SB.js:303
XMLHttpRequest.send		
(anonymous)	@	index-BFQmU3SB.js:303
xhr	@	index-BFQmU3SB.js:303
eO	@	index-BFQmU3SB.js:305
_request	@	index-BFQmU3SB.js:309
request	@	index-BFQmU3SB.js:305
(anonymous)	@	index-BFQmU3SB.js:309
(anonymous)	@	index-BFQmU3SB.js:301
fx	@	index-BFQmU3SB.js:347
v	@	index-BFQmU3SB.js:496
(anonymous)	@	index-BFQmU3SB.js:348
await in (anonymous)		
onClick	@	index-BFQmU3SB.js:497
lT	@	index-BFQmU3SB.js:48
(anonymous)	@	index-BFQmU3SB.js:48
pS	@	index-BFQmU3SB.js:48
O0	@	index-BFQmU3SB.js:48
U0	@	index-BFQmU3SB.js:49
uL	@	index-BFQmU3SB.js:49
```

---

# DESCRIPCIÓN DE LOS ERRORES PARA CONTEXTO

Estos errores indican que el frontend está intentando acceder a rutas privadas del backend, pero el backend responde con:

```text
401 Unauthorized
```

Esto significa que el servidor no reconoce al usuario como autenticado o autorizado.

Las rutas afectadas son:

```text
GET /api/auth/me
GET /api/admin/inquiries
GET /api/admin/resources
GET /api/admin/posts
GET /api/admin/news
POST /api/admin/posts
```

La ruta más importante para el problema del blog es:

```text
POST /api/admin/posts
```

Esa petición falla con 401, por lo que el blog no se puede crear.

También aparece:

```text
Uncaught (in promise) AxiosError: Request failed with status code 401
```

Esto significa que el error de Axios no está siendo capturado correctamente. No debe quedar ningún error no controlado de tipo `Uncaught in promise`.

La aplicación parece estar haciendo varias llamadas privadas en cascada incluso cuando no hay sesión válida. Esto debe corregirse.

La lógica correcta debería ser:

1. Comprobar primero `/api/auth/me`.
2. Si el usuario está autenticado y tiene permisos, cargar rutas privadas.
3. Si `/api/auth/me` devuelve 401, no seguir llamando rutas admin.
4. Mostrar login o mensaje claro.
5. No lanzar errores no controlados.

---

# LOGS OBLIGATORIOS

Debes añadir logs suficientes para poder monitorizar todo el flujo.

Los logs deben ser útiles, pero no deben mostrar información sensible.

No imprimir:

- Contraseñas.
- Tokens completos.
- Secretos.
- Cookies completas.
- Datos personales sensibles innecesarios.

Si necesitas comprobar token, mostrar solo:

```text
Token presente: sí/no
Token preview: primeros 6-8 caracteres, nunca completo
```

## Logs de frontend

Añadir logs en el cliente para:

```text
[AUTH] Comprobando sesión con /api/auth/me
[AUTH] /api/auth/me OK
[AUTH] /api/auth/me devolvió 401
[AUTH] Usuario no autenticado
[AUTH] Usuario autenticado
[AUTH] Rol del usuario
[AUTH] Sesión caducada o no válida
[AUTH] Token presente: sí/no
[API] Request enviada
[API] Método
[API] Endpoint
[API] Status recibido
[API] Error recibido
[API] Error 401 controlado
[BLOG] Intentando crear blog
[BLOG] Payload preparado para crear blog
[BLOG] Título presente: sí/no
[BLOG] Contenido presente: sí/no
[BLOG] Número de imágenes adjuntas
[BLOG] Enviando POST /api/admin/posts
[BLOG] Blog creado correctamente
[BLOG] Error creando blog
[BLOG] Error 401 al crear blog
[BLOG] Imagen seleccionada
[BLOG] Subiendo imagen
[BLOG] Imagen subida correctamente
[BLOG] Error subiendo imagen
[FORMACION] Cargando formaciones públicas
[FORMACION] Cargando índice de formación
[FORMACION] Usuario no autenticado intenta acceder a contenido completo
[FORMACION] Usuario autenticado accede a contenido completo
[FORMACION] Creando curso
[FORMACION] Creando tema
[FORMACION] Guardando contenido de tema
[CHAT] Abriendo chat de formación
[CHAT] Enviando mensaje
[CHAT] Mensaje enviado correctamente
[CHAT] Error enviando mensaje
[CHAT ADMIN] Cargando conversaciones
[CHAT ADMIN] Aplicando filtro por formación
[CHAT ADMIN] Aplicando filtro por usuario
```

## Logs de backend

Añadir logs en el servidor para:

```text
[SERVER] Petición recibida
[SERVER] Método
[SERVER] Endpoint
[SERVER] Origin
[AUTH] Ruta protegida solicitada
[AUTH] Header Authorization presente: sí/no
[AUTH] Cookie presente: sí/no
[AUTH] Token presente: sí/no
[AUTH] Token válido: sí/no
[AUTH] Usuario encontrado: sí/no
[AUTH] Rol de usuario
[AUTH] Acceso permitido
[AUTH] Acceso denegado
[AUTH] Motivo de denegación
[CORS] Origin recibido
[CORS] Origin permitido: sí/no
[CORS] Credentials habilitado: sí/no
[ADMIN BLOG] Intento de crear blog
[ADMIN BLOG] Usuario autenticado
[ADMIN BLOG] Payload recibido
[ADMIN BLOG] Título presente: sí/no
[ADMIN BLOG] Contenido presente: sí/no
[ADMIN BLOG] Imágenes recibidas
[ADMIN BLOG] Blog guardado correctamente
[ADMIN BLOG] Error guardando blog
[ADMIN BLOG] Blog eliminado correctamente
[UPLOAD] Archivo recibido
[UPLOAD] Tipo de archivo
[UPLOAD] Tamaño de archivo
[UPLOAD] Subida correcta
[UPLOAD] Error de subida
[FORMACION] Creando curso
[FORMACION] Curso guardado
[FORMACION] Creando tema
[FORMACION] Tema guardado
[FORMACION] Consultando cursos públicos
[FORMACION] Consultando contenido protegido
[CHAT] Mensaje recibido
[CHAT] Mensaje guardado
[CHAT ADMIN] Consultando conversaciones
[CHAT ADMIN] Filtro por formación
[CHAT ADMIN] Filtro por usuario
[DB] Operación iniciada
[DB] Operación completada
[DB] Error de base de datos
```

---

# VISUALIZACIÓN DE LOGS

Debes explicar al final cómo ver los logs reales según el proyecto.

Primero revisa la estructura del proyecto.

No inventes comandos si no existen.

Revisa:

- `package.json`
- `Dockerfile`
- `docker-compose.yml`
- configuración de Netlify
- configuración de Render
- variables de entorno
- scripts disponibles

Después documenta cómo ver:

1. Logs del navegador.
2. Logs del servidor local.
3. Logs de Docker.
4. Logs de Render.
5. Logs de Netlify.
6. Logs de build/deploy.
7. Logs de funciones serverless si existen.

Comandos posibles solo si aplican:

```bash
npm run dev
npm run build
npm run test
npm run lint
docker ps
docker logs <container_id>
docker logs -f <container_id>
docker compose logs
docker compose logs -f
```

---

# SPRINT 0: DIAGNÓSTICO INICIAL Y LOGS BASE

## Objetivo

Entender el proyecto antes de modificarlo y preparar logs de depuración.

## Tareas

1. Revisar estructura del proyecto.
2. Identificar frontend.
3. Identificar backend.
4. Identificar sistema de autenticación.
5. Identificar rutas privadas.
6. Identificar rutas públicas.
7. Identificar sistema de base de datos.
8. Identificar sistema de subida de imágenes.
9. Revisar `package.json`.
10. Revisar scripts disponibles.
11. Revisar configuración de Docker.
12. Revisar configuración de Netlify.
13. Revisar configuración de Render.
14. Revisar variables de entorno necesarias.
15. Añadir logs base de frontend.
16. Añadir logs base de backend.
17. Confirmar cómo arrancar localmente.
18. Confirmar cómo ver logs localmente.
19. Confirmar cómo ver logs en producción si aplica.

## Tests obligatorios

1. Ejecutar instalación si procede.
2. Arrancar frontend local.
3. Arrancar backend local.
4. Confirmar que la app carga.
5. Confirmar que los logs base aparecen.
6. Confirmar que no se han roto rutas públicas existentes.
7. Confirmar comandos reales disponibles.

## Criterio de cierre

Este sprint solo se cierra si queda claro:

- Cómo arranca el proyecto.
- Qué comandos existen.
- Dónde está el frontend.
- Dónde está el backend.
- Cómo se autentica el usuario.
- Cómo se hacen las llamadas API.
- Cómo se ven logs en local.
- Cómo se ven logs en Docker si aplica.
- Cómo se ven logs en producción si aplica.

No pasar al Sprint 1 hasta que este diagnóstico esté completado y documentado.

---

# SPRINT 1: ERRORES 401 Y AUTENTICACIÓN

## Objetivo

Corregir los errores actuales de autenticación que bloquean la creación de blogs.

## Requisitos

1. `/api/auth/me` debe ser la primera comprobación.
2. Si `/api/auth/me` devuelve 401, no deben lanzarse llamadas admin en cascada.
3. Si el usuario no está autenticado, debe mostrarse login.
4. Si el usuario está autenticado, deben cargarse rutas privadas.
5. No debe quedar ningún `Uncaught in promise AxiosError`.
6. Deben añadirse logs de autenticación.
7. Debe quedar claro si se usa cookie, JWT o ambos.
8. Debe funcionar en local.
9. Debe quedar preparado para funcionar en producción.
10. Deben revisarse CORS, cookies, headers, roles y variables de entorno.

## Tests obligatorios

1. Abrir zona privada sin sesión.
2. Confirmar que no se cargan rutas admin.
3. Confirmar que no hay errores no controlados.
4. Iniciar sesión.
5. Confirmar que `/api/auth/me` responde correctamente.
6. Confirmar que el usuario tiene permisos.
7. Confirmar que se cargan rutas privadas.
8. Forzar sesión inválida.
9. Confirmar mensaje claro.
10. Confirmar que no hay errores no controlados.
11. Confirmar que los logs muestran el motivo de autorización o denegación.
12. Confirmar que las rutas privadas no se consultan sin sesión.

## Criterio de cierre

No cerrar este sprint hasta que:

- Los 401 estén controlados.
- No haya errores Axios sin capturar.
- Las rutas privadas no se llamen sin sesión.
- Login funcione.
- Los logs permitan entender qué ocurre.
- No se haya roto ninguna funcionalidad pública.

---

# SPRINT 2: BLOG SIMPLE Y FUNCIONAL

## Objetivo

Hacer que el blog se pueda crear de forma sencilla.

## Requisitos

Para crear un blog solo deben ser obligatorios:

- Título.
- Texto/contenido principal.

No deben ser obligatorios:

- SEO.
- Slug.
- Etiquetas.
- Categorías.
- Imagen destacada.
- Extracto.
- Autor.
- Metadatos.
- Tiempo de lectura.

Si el sistema necesita alguno de estos campos internamente:

- Generar slug automáticamente desde el título.
- Usar fecha actual.
- Usar estado por defecto.
- Dejar campos opcionales vacíos.
- Usar valores por defecto razonables.

## Tests obligatorios

1. Entrar como admin.
2. Ir a Blog.
3. Crear blog solo con título y texto.
4. Guardar.
5. Confirmar respuesta correcta del backend.
6. Confirmar que aparece en listado privado.
7. Confirmar que aparece en parte pública.
8. Abrir blog público.
9. Confirmar que se visualiza bien.
10. Confirmar que no exige SEO, etiquetas, categoría ni campos innecesarios.
11. Borrar blog de prueba.
12. Confirmar que desaparece de privado y público.
13. Confirmar que no hay errores en consola.
14. Confirmar que no hay errores críticos en backend.

## Criterio de cierre

No cerrar este sprint hasta que se pueda crear, visualizar y borrar un blog solo con título y texto.

---

# SPRINT 3: IMÁGENES EN BLOG

## Objetivo

Permitir imágenes en blogs.

## Requisitos

El blog debe permitir:

- Imagen destacada.
- Imágenes dentro del contenido.
- Varias imágenes.
- Persistencia real.
- Visualización pública correcta.
- Borrado correcto o desvinculación correcta al borrar blog, según el sistema de almacenamiento usado.

Las imágenes deben guardarse correctamente según el sistema del proyecto:

- Base de datos.
- Storage.
- Carpeta pública.
- Servicio externo.
- Lo que ya use el proyecto.

## Tests obligatorios

1. Crear blog con imagen destacada.
2. Crear blog con varias imágenes internas.
3. Guardar.
4. Confirmar subida correcta.
5. Confirmar persistencia.
6. Confirmar visualización pública.
7. Recargar página.
8. Confirmar que las imágenes siguen visibles.
9. Borrar blog de prueba.
10. Confirmar que desaparece.
11. Confirmar que no quedan errores de subida.
12. Confirmar logs de subida y visualización.
13. Confirmar que los errores de imagen se capturan correctamente.

## Criterio de cierre

No cerrar este sprint hasta que las imágenes se puedan subir, guardar, recuperar, visualizar y borrar correctamente.

---

# SPRINT 4: LIMPIEZA DE MÓDULOS NO NECESARIOS

## Objetivo

Simplificar la aplicación.

## Requisitos

Solo deben quedar visibles:

- Blog.
- Formación.
- Chat.

Ocultar o desactivar:

- Noticias.
- Actualizaciones.
- Revistas.
- Recursos no necesarios.
- Otros módulos no prioritarios.

No quiero que el frontend siga intentando cargar rutas de módulos que se han ocultado.

Por ejemplo, si se oculta Noticias, no debe seguir haciendo llamadas innecesarias a:

```text
/api/admin/news
```

Si se ocultan recursos, no debe seguir llamando innecesariamente a:

```text
/api/admin/resources
```

## Tests obligatorios

1. Abrir parte privada.
2. Confirmar que solo aparecen Blog, Formación y Chat.
3. Confirmar que no se hacen llamadas innecesarias a módulos ocultos.
4. Confirmar que no se llama `/api/admin/news` si Noticias está oculto.
5. Confirmar que no se llama `/api/admin/resources` si Recursos está oculto.
6. Confirmar que el blog sigue funcionando.
7. Confirmar que la parte pública sigue cargando.
8. Confirmar que no hay errores 404/401 por módulos ocultos.

## Criterio de cierre

No cerrar este sprint hasta que la interfaz esté simplificada y no haya llamadas innecesarias a módulos ocultos.

---

# SPRINT 5: FORMACIÓN PRIVADA

## Objetivo

Crear el módulo privado de Formación.

## Requisitos

Debe permitir:

- Crear cursos.
- Editar cursos.
- Borrar cursos.
- Crear índice.
- Crear temas.
- Editar temas.
- Borrar temas.
- Reordenar temas si es posible.
- Añadir texto.
- Añadir imágenes.
- Añadir vídeos si procede.
- Guardar en base de datos.
- Persistir al recargar.

Cada curso debe tener:

- Título.
- Descripción.
- Imagen principal opcional.
- Índice.
- Temas/apartados.
- Contenido de cada tema.

Cada tema debe permitir:

- Título.
- Descripción breve.
- Texto largo.
- Imágenes.
- Vídeos si procede.
- Orden dentro del curso.

## Tests obligatorios

1. Entrar como admin.
2. Crear curso de prueba.
3. Crear varios temas.
4. Añadir texto.
5. Añadir imagen.
6. Añadir vídeo si procede.
7. Guardar.
8. Recargar.
9. Confirmar persistencia.
10. Editar tema.
11. Confirmar edición.
12. Borrar tema.
13. Confirmar borrado.
14. Borrar curso de prueba.
15. Confirmar que no quedan datos visibles de prueba.
16. Confirmar logs de creación, edición y borrado.

## Criterio de cierre

No cerrar este sprint hasta que se puedan crear, editar, visualizar y borrar cursos y temas desde la parte privada.

---

# SPRINT 6: FORMACIÓN PÚBLICA

## Objetivo

Crear la página pública de formación.

## Requisitos

Debe mostrar:

- Cursos disponibles.
- Tarjetas visuales.
- Imagen principal.
- Título.
- Descripción.
- Qué se va a aprender.
- Índice.
- Secuencia lógica de aprendizaje.

Diseño deseado:

- Página de cursos con tarjetas o carrusel.
- Página interna del curso con cabecera visual.
- Imagen grande.
- Título.
- Descripción.
- Índice lateral o en bloques.
- Flujo secuencial de temas.
- Botones para avanzar o volver.
- Visualización limpia del contenido.

Puede inspirarse en plataformas tipo Teams/Classroom, con cursos organizados por temas y una secuencia clara de aprendizaje.

## Tests obligatorios

1. Abrir web pública.
2. Entrar en Formación.
3. Confirmar que aparecen cursos.
4. Confirmar que se ve título.
5. Confirmar que se ve descripción.
6. Confirmar que se ve índice.
7. Confirmar que el diseño es claro.
8. Confirmar que no se rompe al recargar.
9. Confirmar que funciona en móvil/responsive si el proyecto lo permite.
10. Confirmar logs de carga de formación pública.

## Criterio de cierre

No cerrar este sprint hasta que la formación pública se visualice correctamente.

---

# SPRINT 7: LOGIN Y PERMISOS EN FORMACIÓN

## Objetivo

Diferenciar acceso entre usuarios no autenticados y autenticados.

## Usuario no autenticado

Puede ver:

- Cursos.
- Títulos.
- Descripciones.
- Índices.

No puede ver:

- Contenido completo.
- Texto interno.
- Imágenes internas.
- Vídeos.
- Chat.

Si intenta acceder al contenido completo, mostrar:

```text
Para acceder al contenido completo de esta formación debes iniciar sesión.
```

## Usuario autenticado

Puede ver:

- Contenido completo.
- Textos.
- Imágenes.
- Vídeos.
- Chat.

## Requisitos técnicos

Debe protegerse también el backend, no solo la interfaz.

No debe bastar con ocultar botones. Las rutas protegidas deben validar autenticación.

## Tests obligatorios

1. Entrar sin login.
2. Ver cursos e índices.
3. Intentar abrir contenido completo.
4. Confirmar bloqueo.
5. Confirmar que el backend no entrega contenido protegido.
6. Iniciar sesión.
7. Abrir contenido completo.
8. Confirmar que se ven textos e imágenes.
9. Confirmar que backend protege rutas, no solo frontend.
10. Cerrar sesión.
11. Confirmar que se vuelve a bloquear el contenido.
12. Confirmar que no hay errores no controlados.

## Criterio de cierre

No cerrar este sprint hasta que los permisos funcionen correctamente en frontend y backend.

---

# SPRINT 8: CHAT PÚBLICO ASOCIADO A FORMACIÓN

## Objetivo

Crear chat dentro de formación.

## Requisitos

El chat debe estar asociado a:

- Usuario autenticado.
- Formación concreta.
- Tema concreto si procede.
- Fecha de creación.
- Fecha del último mensaje.
- Historial de mensajes.
- Estado si se implementa.

El chat no debe ser genérico. Debe quedar ligado al contexto desde el que se abre.

Ejemplo:

```text
Usuario: Ana García
Formación: Introducción a la investigación clínica
Tema: Estudios de cohortes
Mensaje: No entiendo bien la diferencia entre cohorte prospectiva y retrospectiva.
```

## Tests obligatorios

1. Iniciar sesión como usuario.
2. Entrar en formación.
3. Entrar en tema.
4. Abrir chat.
5. Enviar mensaje.
6. Confirmar guardado.
7. Recargar.
8. Confirmar persistencia.
9. Confirmar asociación con usuario.
10. Confirmar asociación con formación.
11. Confirmar asociación con tema si existe.
12. Confirmar que usuario sin login no puede usar chat.
13. Confirmar logs de envío y guardado.

## Criterio de cierre

No cerrar este sprint hasta que el chat funcione desde la formación y persista correctamente.

---

# SPRINT 9: PANEL PRIVADO DE CHAT

## Objetivo

Crear panel privado para gestionar chats.

Debe existir una sección separada llamada Chat junto a:

- Blog.
- Formación.
- Chat.

## Requisitos

Debe permitir:

- Ver conversaciones.
- Ver mensajes.
- Filtrar por formación.
- Filtrar por usuario.
- Filtrar por tema.
- Ordenar por última actividad.
- Ver conversaciones recientes primero.
- Ver historial completo.
- Ver desde qué formación se escribió.
- Ver desde qué tema se escribió.
- Responder si se implementa.
- Marcar pendiente/revisado si se implementa.

## Tests obligatorios

1. Entrar como admin.
2. Ir a Chat.
3. Ver conversación creada desde formación.
4. Confirmar usuario.
5. Confirmar formación.
6. Confirmar tema.
7. Abrir historial.
8. Filtrar por formación.
9. Filtrar por usuario.
10. Confirmar orden por fecha.
11. Confirmar que una conversación nueva aparece sin recargar si el sistema lo permite, o tras recargar si no hay tiempo real.
12. Confirmar logs de consulta y filtrado.

## Criterio de cierre

No cerrar este sprint hasta que el panel privado permita visualizar y filtrar chats correctamente.

---

# SPRINT 10: MÉTRICAS Y SEGUIMIENTO DE CHATS

## Objetivo

Añadir seguimiento por usuario y formación.

## Requisitos

Debe permitir ver:

- Total de conversaciones.
- Conversaciones abiertas.
- Conversaciones por formación.
- Conversaciones por usuario.
- Usuarios con chats en más de una formación.
- Cuántas formaciones distintas tiene cada usuario.
- Última actividad.

Debe existir una vista o resumen tipo:

```text
Usuario: Ana García
Conversaciones abiertas: 4
Formaciones distintas: 3

Formaciones:
- Investigación clínica: 2 conversaciones
- Bioestadística médica: 1 conversación
- Ensayos clínicos: 1 conversación
```

También debe poder filtrar primero por formación y luego por persona.

## Tests obligatorios

Crear datos de prueba:

```text
Usuario prueba 1:
- Chat en Formación 1
- Chat en Formación 2
- Otro chat en Formación 2

Usuario prueba 2:
- Chat en Formación 1
- Chat en Formación 3
```

Comprobar:

1. Filtro por Formación 1.
2. Filtro por Formación 2.
3. Filtro por Formación 3.
4. Filtro por Usuario 1.
5. Filtro por Usuario 2.
6. Conteo de conversaciones.
7. Conteo de formaciones distintas.
8. Última actividad.
9. Usuarios con más de una formación activa.
10. Correspondencia exacta entre datos de prueba y métricas.

## Criterio de cierre

No cerrar este sprint hasta que los contadores y filtros coincidan con los datos de prueba.

---

# SPRINT 11: TESTEO INTEGRAL EN LOCAL

## Objetivo

Probar todo el sistema junto en local.

## Tests obligatorios

1. Login admin.
2. Crear blog.
3. Crear blog con imagen.
4. Ver blog público.
5. Borrar blog.
6. Crear curso.
7. Crear temas.
8. Ver curso público sin login.
9. Confirmar acceso restringido.
10. Login usuario.
11. Ver contenido completo.
12. Enviar chat.
13. Ver chat en privado.
14. Filtrar chat.
15. Revisar métricas de chat.
16. Borrar datos de prueba.
17. Confirmar que no hay errores críticos en consola.
18. Confirmar que no hay errores críticos en backend.
19. Confirmar que los logs son suficientes para depuración.

## Criterio de cierre

No cerrar este sprint hasta que todos los flujos funcionen juntos en local.

---

# SPRINT 12: BUILD Y DESPLIEGUE

## Objetivo

Preparar y ejecutar build/deploy si el proyecto lo permite.

## Tareas

1. Ejecutar lint si existe.
2. Ejecutar tests si existen.
3. Ejecutar build.
4. Corregir errores de build.
5. Revisar variables de entorno.
6. Revisar configuración de producción.
7. Desplegar si está configurado.
8. Revisar logs de despliegue.
9. Confirmar que frontend apunta al backend correcto.
10. Confirmar CORS/cookies/tokens en producción.

## Criterio de cierre

No cerrar este sprint hasta que:

- El build sea correcto.
- El despliegue no tenga errores críticos.
- Las variables de entorno estén revisadas.
- Los logs de despliegue estén revisados.
- La app abra correctamente en producción.

---

# SPRINT 13: TESTEO EN PRODUCCIÓN

## Objetivo

Confirmar que en producción funciona igual que en local.

## Tests obligatorios en producción

1. Abrir producción.
2. Confirmar que no hay errores críticos en consola.
3. Iniciar sesión.
4. Crear blog de prueba.
5. Ver blog en público.
6. Crear blog con imagen.
7. Confirmar imagen visible.
8. Crear curso de prueba.
9. Crear temas de prueba.
10. Ver curso en público sin login.
11. Confirmar que solo se ve índice.
12. Login usuario.
13. Confirmar contenido completo.
14. Enviar chat.
15. Ver chat en panel privado.
16. Filtrar por formación.
17. Filtrar por usuario.
18. Revisar métricas de chat.
19. Revisar logs de servidor.
20. Confirmar ausencia de errores críticos.
21. Confirmar que no hay `Uncaught in promise`.
22. Confirmar que no hay 401 inesperados con sesión válida.

## Criterio de cierre

No cerrar este sprint hasta que producción funcione correctamente.

---

# SPRINT 14: LIMPIEZA DE DATOS DE PRUEBA

## Objetivo

Eliminar todos los datos creados durante las pruebas.

## Borrar

- Blogs de prueba.
- Imágenes de prueba si procede.
- Cursos de prueba.
- Temas de prueba.
- Chats de prueba.
- Mensajes de prueba.
- Usuarios de prueba si se crearon solo para test.

## Tests obligatorios

1. Confirmar que no aparecen blogs de prueba.
2. Confirmar que no aparecen cursos de prueba.
3. Confirmar que no aparecen chats de prueba.
4. Confirmar que no aparecen mensajes de prueba.
5. Confirmar que la base de datos no conserva datos visibles de prueba.
6. Confirmar que la app sigue funcionando tras borrar.
7. Confirmar que no se han borrado datos reales por error.
8. Confirmar logs de borrado.

## Criterio de cierre

No cerrar este sprint hasta que la limpieza esté confirmada.

---

# SPRINT 15: INFORME FINAL

## Objetivo

Entregar un informe claro de todo lo realizado.

## El informe debe incluir

1. Checklist global.
2. Estado de cada sprint.
3. Archivos modificados.
4. Cambios realizados.
5. Logs añadidos.
6. Errores corregidos.
7. Explicación de los errores 401.
8. Tests realizados.
9. Tests superados.
10. Datos de prueba creados.
11. Datos de prueba eliminados.
12. Confirmación de funcionamiento local.
13. Confirmación de funcionamiento en producción.
14. Problemas pendientes si existe alguno.
15. Instrucciones para ver logs del navegador.
16. Instrucciones para ver logs del backend.
17. Instrucciones para ver logs de Docker.
18. Instrucciones para ver logs de Render.
19. Instrucciones para ver logs de Netlify.
20. Instrucciones para repetir pruebas.
21. Confirmación de que no quedan errores críticos.
22. Confirmación de que no se ha roto funcionalidad previa importante.

## Criterio de cierre

No cerrar este sprint hasta entregar el informe final.

---

# CRITERIOS DE ACEPTACIÓN FINAL

La tarea solo estará terminada si se cumple todo esto:

1. Los errores 401 están controlados.
2. No hay `Uncaught in promise AxiosError`.
3. La app no llama rutas admin si no hay sesión válida.
4. El login funciona.
5. La sesión se comprueba correctamente.
6. El blog se puede crear con solo título y texto.
7. El blog no exige SEO, etiquetas ni campos innecesarios.
8. El blog permite imágenes.
9. Las imágenes se guardan y se visualizan.
10. El blog se visualiza en público.
11. El blog se puede borrar.
12. Se han ocultado módulos no necesarios.
13. Solo quedan Blog, Formación y Chat como bloques principales.
14. Existe módulo privado de Formación.
15. Se pueden crear cursos.
16. Se pueden crear temas/índices.
17. Se puede añadir texto, imágenes y vídeos.
18. Todo persiste.
19. Existe página pública de Formación.
20. Usuario no autenticado ve cursos e índices, pero no contenido completo.
21. Usuario autenticado ve contenido completo.
22. Existe chat dentro de formación.
23. El chat queda ligado a usuario, formación y tema si procede.
24. Existe panel privado de Chat.
25. Se puede filtrar por formación.
26. Se puede filtrar por usuario.
27. Se puede ver cuántas conversaciones tiene cada persona.
28. Se puede ver en cuántas formaciones distintas tiene chats una persona.
29. Hay logs útiles en frontend.
30. Hay logs útiles en backend.
31. Se explica cómo ver logs.
32. Se han realizado tests locales.
33. Se han realizado tests de producción/despliegue si aplica.
34. Se han creado datos de prueba.
35. Se han borrado datos de prueba.
36. No quedan errores críticos en consola.
37. No quedan errores críticos en servidor.
38. Todos los sprints están cerrados.
39. El informe final está entregado.

---

# INSTRUCCIÓN FINAL

No hagas una implementación superficial.

Quiero que todo quede funcional, simplificado, depurable y probado.

El orden obligatorio es:

1. Sprint 0: Diagnóstico inicial y logs base.
2. Sprint 1: Errores 401 y autenticación.
3. Sprint 2: Blog simple y funcional.
4. Sprint 3: Imágenes en blog.
5. Sprint 4: Limpieza de módulos no necesarios.
6. Sprint 5: Formación privada.
7. Sprint 6: Formación pública.
8. Sprint 7: Login y permisos de formación.
9. Sprint 8: Chat público asociado a formación.
10. Sprint 9: Panel privado de chat.
11. Sprint 10: Métricas y seguimiento de chats.
12. Sprint 11: Testeo integral en local.
13. Sprint 12: Build y despliegue.
14. Sprint 13: Testeo en producción.
15. Sprint 14: Limpieza de datos de prueba.
16. Sprint 15: Informe final.

No pases de sprint si el anterior no está probado y cerrado.