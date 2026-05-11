# Auditoría funcional y recomendaciones avanzadas — Doctor Tebar

**Fecha:** 11 de mayo de 2026
**Proyecto:** Plataforma web pública + backoffice privado para Eduardo Tebar Boti
**Objetivo del documento:** analizar el estado actual del proyecto y proponer funcionalidades nuevas, especialmente para la zona privada de gestión de contenidos, con el fin de convertir la plataforma en un sistema profesional de publicación, difusión y posicionamiento.

---

## 0. Checklist de implementación ejecutada

**Fecha de implementación:** 11 de mayo de 2026

Esta auditoría ya no es solo un documento de recomendaciones. En esta revisión se ha implementado una primera fase funcional sobre el producto real, priorizando las funcionalidades de máximo impacto y las áreas que estaban incompletas.

### 0.1. Funcionalidades implementadas y verificadas

- [x] Rediseño visual responsive inspirado en `diseñobase.html` aplicado a web pública y backoffice.
- [x] Centro editorial en `/admin/editorial`.
- [x] Calendario editorial en `/admin/calendar`.
- [x] Biblioteca de medios en `/admin/media`.
- [x] Pantalla real de usuarios y roles en `/admin/users`.
- [x] Roles ampliados: `admin`, `editor`, `reviewer`, `viewer`.
- [x] API para actualizar usuario, cambiar estado y resetear contraseña.
- [x] Protección para impedir que un admin se desactive a sí mismo.
- [x] CRM ampliado de consultas en `/admin/inquiries`.
- [x] Estados CRM ampliados: nueva, revisada, pendiente, respondida, reunión propuesta, propuesta enviada, aceptada, descartada y archivada.
- [x] Campos CRM añadidos: prioridad, valor estimado, próxima acción, fuente y servicio de interés.
- [x] API de actualización CRM para consultas.
- [x] Auditoría visible en `/admin/audit`.
- [x] API `GET /api/admin/audit` con filtros básicos.
- [x] Metadatos de medios: alt text, caption, crédito y uso previsto en modelo.
- [x] API para actualizar metadatos de medios.
- [x] Checklist de completitud en tablas admin.
- [x] Checklist editorial dentro del editor de posts/noticias.
- [x] Plantillas científicas dentro del editor: artículo docente, nota crítica, caso metodológico y entrada STATA.
- [x] Control metodológico básico dentro del editor.
- [x] Generador manual de texto LinkedIn/SEO dentro del editor.
- [x] Generador manual de texto LinkedIn con UTM desde el centro editorial.
- [x] Tests unitarios ampliados para CRM/esquemas.
- [x] E2E ampliado para módulos operativos admin.
- [x] E2E ampliado para editor científico/checklist.
- [x] E2E completo reejecutado tras los cambios.

### 0.2. Pruebas ejecutadas

```txt
npm run build
OK

npm run test
API: 4 files, 10 tests passed
Web: 1 file, 1 test passed
Total: 5 files, 11 tests passed

npm run test:e2e
17 passed
3 skipped intencionados
```

Los skips son intencionados: los flujos admin que escriben en base de datos se ejecutan una vez en Chromium desktop para evitar duplicar escrituras y disparar rate limits; mobile mantiene cobertura de login, dashboard y páginas públicas.

### 0.3. Funcionalidades que quedan como roadmap

Estas funcionalidades siguen recomendadas, pero no se han implementado como integración completa porque requieren una fase específica, servicios externos, jobs de fondo o modelos completos adicionales:

- [ ] Newsletter real con doble opt-in y proveedor de envío.
- [ ] Publicación directa en LinkedIn mediante API/OAuth.
- [ ] Versionado completo con restauración de revisiones.
- [ ] Programación automática con cron/cola.
- [ ] Referencias bibliográficas con CRUD completo.
- [ ] CTAs persistentes como entidad propia.
- [ ] Series/cursos públicos completos.
- [ ] Revista metodológica comentada como entidad pública completa.
- [ ] Propuestas con exportación PDF.
- [ ] Analítica propia de lectura y conversión.
- [ ] Sistema de notificaciones persistente.
- [ ] Backups/exportación de contenidos.
- [ ] Lint real con ESLint/Prettier.
- [ ] Code splitting para reducir bundle.

### 0.4. Veredicto de esta fase

La fase 1 de profesionalización del backoffice queda implementada: usuarios, medios, CRM, auditoría, centro editorial, calendario, checklist editorial y distribución manual. La plataforma ya funciona como una base editorial profesional, aunque las integraciones externas y automatizaciones avanzadas quedan como roadmap.

---

## 1. Diagnóstico ejecutivo

El proyecto ya tiene una base técnica sólida. No estás en una fase de “hacer una web”, sino en una fase superior: **convertir la web en una plataforma editorial y profesional de marca personal médica**.

Actualmente ya existen:

- Web pública.
- Inicio.
- Sobre mí.
- Servicios.
- Blog.
- Noticias.
- Recursos.
- Contacto.
- Login.
- Panel admin.
- CRUD de posts.
- CRUD de noticias.
- CRUD de recursos.
- CRUD de servicios.
- Gestión básica de consultas.
- Ajustes públicos.
- Usuarios parcialmente implementados.
- Medios parcialmente implementados.
- API.
- MongoDB.
- Auth.
- Tests E2E principales.
- Seguridad básica.
- Documentación técnica.

Por tanto, el proyecto ya cubre la estructura nuclear.

El siguiente salto no debería ser añadir páginas públicas sin criterio, sino mejorar la parte privada para que funcione como un **centro de operaciones editorial, científico y comercial**.

La idea es que tu backoffice no sea solo una zona para “crear posts”, sino una herramienta que te permita:

1. Planificar contenidos.
2. Crear contenidos científicos de forma más rápida.
3. Revisar calidad metodológica.
4. Reutilizar contenidos en varios formatos.
5. Publicar y programar.
6. Conectar con LinkedIn y newsletters.
7. Medir qué contenidos funcionan.
8. Convertir lectores en consultas.
9. Gestionar tu autoridad profesional.
10. Mantener trazabilidad, versiones y control editorial.

---

## 2. Comparación conceptual con herramientas similares

Tu aplicación se parece a una mezcla entre:

- Un CMS tipo WordPress.
- Un headless CMS tipo Strapi.
- Una plataforma editorial tipo Ghost.
- Un estudio de contenido tipo Sanity.
- Un CRM ligero para consultas profesionales.
- Una herramienta de marca personal para LinkedIn y difusión científica.

### 2.1. Qué hacen bien esas herramientas

**Strapi** destaca por su enfoque headless CMS, gestión de contenidos mediante API, media library y roles/permisos para administrar quién puede hacer qué dentro del panel. También permite gestionar activos como imágenes, documentos, vídeos y otros ficheros desde una biblioteca de medios.
Fuentes de referencia:

- https://strapi.io/features/media-library
- https://strapi.io/
- https://strapi.io/features/custom-roles-and-permissions

**Sanity** destaca por su estudio de contenido colaborativo, modelos de contenido configurables, roles granulares, tareas, workflows y releases de contenido. Las Content Releases permiten organizar y programar cambios que afectan a múltiples documentos.
Fuentes de referencia:

- https://www.sanity.io/docs/studio
- https://www.sanity.io/docs/user-guides/roles
- https://www.sanity.io/docs/studio/content-releases-configuration
- https://www.sanity.io/docs/studio/configuring-tasks

**Ghost** destaca por combinar blog profesional, newsletter, miembros, publicación y crecimiento de audiencia. Es una referencia para convertir el contenido en un canal profesional recurrente, no solo en artículos sueltos.
Fuentes de referencia:

- https://ghost.org/
- https://ghost.org/help/setup-email-newsletters/

**WordPress** y su ecosistema destacan en gestión editorial, calendario, revisiones, roles, permisos y plugins de flujo editorial. Existen soluciones de calendario editorial, revisión de documentos, permisos y programación de cambios.
Fuentes de referencia:

- https://wordpress.org/plugins/editorial-calendar/
- https://wordpress.org/plugins/wp-document-revisions/
- https://publishpress.com/knowledge-base/a-wordpress-workflow-with-content-editors-and-reviewers/
- https://wordpress.com/plugins/revisionary

### 2.2. Qué significa esto para tu proyecto

Tu proyecto no tiene que copiar estas herramientas, pero sí puede inspirarse en sus mejores ideas:

- Biblioteca de medios avanzada.
- Roles y permisos reales.
- Estados editoriales.
- Calendario editorial.
- Revisión y aprobación.
- Versionado.
- Programación de publicaciones.
- Tareas internas.
- Releases de contenido.
- Newsletter.
- Distribución multicanal.
- Analítica editorial.
- SEO.
- Reutilización de contenidos.
- Plantillas de artículos.
- Gestión de leads y consultas.
- Integración con LinkedIn.

---

## 3. Prioridad estratégica

La parte pública ya está suficientemente encaminada. La parte privada es donde más valor puedes crear.

La prioridad debería ser esta:

1. **Backoffice editorial avanzado.**
2. **Gestión de medios y documentos.**
3. **Workflow de publicación.**
4. **SEO y difusión.**
5. **LinkedIn/newsletter.**
6. **Analítica y conversión.**
7. **Herramientas científicas internas.**
8. **Automatización y reutilización de contenido.**
9. **Gestión avanzada de consultas y oportunidades.**
10. **Calidad, seguridad y escalabilidad.**

---

# 4. Funcionalidades nuevas recomendadas

---

## 4.1. Centro editorial avanzado

### Problema actual

Ahora puedes crear posts, noticias, recursos y servicios. Eso está bien, pero falta una capa superior: **gestionar el ciclo de vida editorial completo**.

### Funcionalidad recomendada

Crear una sección privada llamada:

```txt
/admin/editorial
```

O dentro del sidebar:

```txt
Centro editorial
```

Debe actuar como el “centro de mando” de todo el contenido.

### Elementos del centro editorial

#### Vista Kanban por estado

Estados sugeridos:

```txt
Idea
En investigación
Borrador
En revisión
Listo para publicar
Programado
Publicado
Actualizar
Archivado
```

Cada tarjeta representa:

- Post.
- Noticia.
- Recurso.
- Newsletter.
- Publicación LinkedIn.
- Caso metodológico.
- Guía descargable.

Campos de la tarjeta:

- Título.
- Tipo de contenido.
- Categoría.
- Estado.
- Fecha objetivo.
- Prioridad.
- Autor.
- Última modificación.
- CTA asociado.
- Nivel de avance.

Acciones:

- Mover entre columnas.
- Editar rápido.
- Abrir editor.
- Programar.
- Duplicar.
- Archivar.

### Por qué es útil

Te permite dejar de trabajar artículo por artículo y empezar a trabajar con una **pipeline editorial**.

Ejemplo:

Un tema como “AUC no es suficiente” podría tener varias piezas:

- Artículo largo.
- Nota breve.
- Post LinkedIn.
- Newsletter.
- Checklist descargable.
- Carrusel visual.
- Caso clínico aplicado.

Todo eso debería verse como una familia de contenido conectada.

### Prioridad

**Muy alta.**

---

## 4.2. Calendario editorial

### Problema actual

No hay una visión temporal de qué se publica y cuándo.

### Funcionalidad recomendada

Crear:

```txt
/admin/calendar
```

Vista mensual/semanal/lista con:

- Posts programados.
- Noticias programadas.
- Newsletters.
- Publicaciones LinkedIn.
- Actualizaciones de recursos.
- Revisiones pendientes.

### Acciones

- Arrastrar una publicación a otra fecha.
- Programar post.
- Programar noticia.
- Programar newsletter.
- Programar LinkedIn.
- Ver huecos editoriales.
- Filtrar por tipo de contenido.

### Campos necesarios

Añadir a Post/News/Resource:

```ts
scheduledAt?: Date;
editorialStatus:
  | "idea"
  | "researching"
  | "draft"
  | "review"
  | "ready"
  | "scheduled"
  | "published"
  | "needs_update"
  | "archived";
```

### Por qué es útil

Una web profesional no crece solo por crear contenido cuando hay tiempo. Necesita constancia.

Ejemplo de calendario:

```txt
Lunes: nota crítica breve.
Miércoles: artículo docente.
Viernes: post LinkedIn resumen.
Domingo: newsletter mensual/quincenal.
```

### Prioridad

**Muy alta.**

---

## 4.3. Sistema de versiones y revisiones

### Problema actual

Si editas un post publicado, puedes perder la versión anterior o no saber qué cambiaste.

### Funcionalidad recomendada

Crear versionado de contenidos.

Modelo nuevo:

```ts
interface ContentRevision {
  _id: string;
  entityType: "post" | "news" | "resource" | "service";
  entityId: string;
  versionNumber: number;
  title: string;
  excerpt?: string;
  content?: string;
  changedBy: string;
  changeSummary?: string;
  createdAt: Date;
}
```

### Acciones en UI

En cada editor:

- Ver historial de versiones.
- Comparar versión actual con anterior.
- Restaurar versión.
- Añadir nota de cambio.
- Guardar como “revisión pendiente”.
- Programar una revisión futura.

### Casos de uso

- Actualizar un artículo cuando cambia una guía.
- Corregir una entrada tras feedback.
- Mantener transparencia de cambios.
- Preparar nueva versión sin alterar la publicada hasta que esté lista.

### Prioridad

**Alta.**

---

## 4.4. Programación de publicaciones

### Problema actual

Puedes publicar, pero no queda claro si puedes programar automáticamente.

### Funcionalidad recomendada

Permitir:

```txt
Publicar ahora
Guardar borrador
Programar publicación
Programar actualización
Despublicar en fecha concreta
```

### Campos

```ts
publishedAt?: Date;
scheduledAt?: Date;
unpublishAt?: Date;
```

### Backend

Crear un job periódico con:

```txt
node-cron
```

O usar:

```txt
BullMQ + Redis
```

Para versión sencilla:

```txt
node-cron cada 5 minutos
```

Busca posts con:

```ts
status: "scheduled",
scheduledAt: { $lte: new Date() }
```

Y los cambia a:

```ts
status: "published";
publishedAt: new Date();
```

### Prioridad

**Alta.**

---

## 4.5. Editor enriquecido científico

### Problema actual

Un editor genérico sirve para blogs normales, pero tú necesitas escribir contenido metodológico/científico.

### Funcionalidad recomendada

Mejorar `RichTextEditor` para convertirlo en un **editor científico**.

### Elementos que debería incluir

#### Bloques especiales

1. **Caja de concepto clave**
2. **Caja de advertencia metodológica**
3. **Caja de error frecuente**
4. **Caja de ejemplo clínico**
5. **Caja de interpretación**
6. **Caja de cómo reportarlo**
7. **Caja de código STATA**
8. **Caja de checklist**
9. **Caja de bibliografía**
10. **Caja de conclusión práctica**

### Ejemplo visual interno

```txt
[Concepto clave]
La calibración evalúa si las probabilidades predichas se corresponden con los riesgos observados.
```

```txt
[Error frecuente]
Un modelo con AUC alta puede estar mal calibrado.
```

```txt
[Ejemplo clínico]
En una cohorte de cirugía cardiaca, un modelo puede ordenar bien a los pacientes por riesgo, pero sobreestimar el riesgo absoluto en un hospital concreto.
```

### Campos estructurados

Además del contenido HTML general, permitir campos específicos:

```ts
keyTakeaways: string[];
commonMistakes: string[];
clinicalExample?: string;
stataCode?: string;
reportingText?: string;
references: Reference[];
```

### Por qué es útil

Te permite crear artículos con una estructura diferencial, no posts genéricos.

### Prioridad

**Muy alta.**

---

## 4.6. Plantillas de contenido

### Problema actual

Cada vez que escribes un artículo tienes que empezar desde cero.

### Funcionalidad recomendada

Crear plantillas reutilizables.

Ruta:

```txt
/admin/templates
```

### Plantillas recomendadas

#### Artículo docente largo

```txt
Problema clínico
Error habitual
Fundamento metodológico
Ejemplo clínico
Cómo analizarlo
Cómo interpretarlo
Cómo reportarlo
Bibliografía
```

#### Nota crítica breve

```txt
Frase habitual
Por qué parece razonable
Qué error contiene
Ejemplo clínico
Forma correcta de decirlo
Conclusión práctica
```

#### Caso metodológico

```txt
Escenario clínico
Pregunta de investigación
Diseño correcto
Modelo incorrecto habitual
Modelo recomendado
Interpretación
Limitaciones
```

#### Guía práctica

```txt
Objetivo
Cuándo usarla
Pasos
Errores frecuentes
Checklist final
Recursos relacionados
```

#### Revisión de artículo científico

```txt
Referencia del artículo
Pregunta
Diseño
Análisis
Fortalezas
Limitaciones
Riesgo de sesgo
Conclusión metodológica
Cómo se podría mejorar
```

#### Entrada STATA 17

```txt
Objetivo clínico
Contexto metodológico
Supuestos
Base de datos simulada
Sintaxis STATA
Salida esperada
Interpretación
Texto para manuscrito
Errores frecuentes
```

### Acción en UI

Al crear un post:

```txt
Nuevo post → elegir plantilla → se precargan bloques.
```

### Prioridad

**Muy alta.**

---

## 4.7. Biblioteca de referencias bibliográficas

### Problema actual

El contenido metodológico necesita referencias. Si gestionas bibliografía manualmente en cada post, perderás tiempo y consistencia.

### Funcionalidad recomendada

Crear módulo:

```txt
/admin/references
```

### Modelo

```ts
interface Reference {
  _id: string;
  title: string;
  authors: string[];
  journal?: string;
  year?: number;
  doi?: string;
  url?: string;
  pmid?: string;
  type: "guideline" | "paper" | "book" | "report" | "web";
  topicTags: string[];
  citationVancouver?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Acciones

- Añadir referencia.
- Buscar por título/autor/año.
- Etiquetar.
- Vincular referencia a post.
- Generar bibliografía al final de la entrada.
- Exportar en formato Vancouver.
- Marcar como “referencia esencial”.

### Temas recomendados

- Causalidad.
- Target trial emulation.
- DAGs.
- Propensity score.
- TRIPOD+AI.
- PROBAST.
- STROBE.
- CONSORT.
- Calibración.
- Decision curve analysis.
- Missing data.
- Splines.
- Survival analysis.

### Prioridad

**Alta.**

---

## 4.8. Generador de snippets para LinkedIn

### Problema actual

Quieres potenciar que se conozca el blog y tus servicios. Para eso, cada artículo debería poder convertirse rápidamente en contenido para LinkedIn.

### Funcionalidad recomendada

En cada post añadir pestaña:

```txt
Distribución
```

Dentro:

```txt
Generar publicación LinkedIn
Generar hilo corto
Generar carrusel textual
Generar extracto para newsletter
Generar resumen SEO
Generar frase destacada
```

### Campos en base de datos

```ts
interface DistributionAssets {
  linkedinPost?: string;
  linkedinShortPost?: string;
  newsletterIntro?: string;
  socialQuote?: string;
  suggestedHashtags?: string[];
  callToAction?: string;
}
```

### Ejemplo de output

```txt
Muchos modelos clínicos se presentan como "buenos" porque tienen una AUC elevada.

Pero en predicción clínica eso no basta.

Un modelo puede discriminar bien y, aun así, sobrestimar gravemente el riesgo absoluto.

Por eso, en modelos pronósticos, la calibración no es un detalle técnico: es una condición para que el modelo pueda informar decisiones clínicas.

Nuevo artículo en el blog: AUC no es suficiente: calibración y utilidad clínica.
```

### Hashtags sugeridos

```txt
#InvestigacionClinica
#Bioestadistica
#MedicinaBasadaEnEvidencia
#ModelosPredictivos
#Causalidad
#Metodologia
```

### Importante

Esto puede empezar como generación manual con plantillas, sin IA. Después se puede conectar a un asistente.

### Prioridad

**Muy alta.**

---

## 4.9. Integración con LinkedIn

### Problema actual

Si quieres difundir tus contenidos, necesitas reducir fricción entre publicar en blog y compartir en LinkedIn.

### Funcionalidad recomendada

Tres niveles posibles.

### Nivel 1: enlace manual asistido

Más fácil y seguro.

En el admin, cada post tiene:

```txt
Copiar texto LinkedIn
Copiar URL pública
Abrir LinkedIn
```

No requiere API.

### Nivel 2: UTM tracking

Generar enlaces con parámetros:

```txt
?utm_source=linkedin&utm_medium=social&utm_campaign=blog_metodologia
```

Así puedes saber qué visitas vienen de LinkedIn.

### Nivel 3: integración API LinkedIn

Más compleja.

Permitir publicar directamente en LinkedIn requiere app de LinkedIn, OAuth y permisos. Puede ser más frágil y depender de aprobación de LinkedIn.

### Recomendación

Empezar con **Nivel 1 + Nivel 2**.

### Prioridad

**Muy alta para Nivel 1 y 2. Media para API real.**

---

## 4.10. Newsletter propia

### Problema actual

El blog depende de que la gente vuelva. Necesitas capturar audiencia recurrente.

### Funcionalidad recomendada

Crear módulo:

```txt
/admin/newsletter
```

Y público:

```txt
/newsletter
```

### Funciones

- Capturar email.
- Doble opt-in.
- Gestionar suscriptores.
- Crear newsletter.
- Insertar artículos recientes.
- Programar envío.
- Ver métricas.

### Modelo

```ts
interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  status: "pending" | "active" | "unsubscribed";
  interests: string[];
  source?: string;
  createdAt: Date;
}
```

```ts
interface NewsletterIssue {
  _id: string;
  subject: string;
  intro: string;
  selectedPosts: string[];
  selectedResources: string[];
  status: "draft" | "scheduled" | "sent";
  scheduledAt?: Date;
  sentAt?: Date;
}
```

### Servicios posibles

- Brevo.
- MailerLite.
- Resend.
- Buttondown.
- Ghost-style newsletter propia.

### Recomendación

Para empezar:

```txt
Resend + base propia de suscriptores
```

O usar Brevo/MailerLite si quieres menos desarrollo.

### Prioridad

**Alta.**

---

## 4.11. Dashboard de rendimiento editorial

### Problema actual

Ahora el dashboard carga, pero no parece medir valor editorial ni conversión.

### Funcionalidad recomendada

Crear dashboard con métricas útiles.

### Métricas recomendadas

#### Contenido

- Posts publicados.
- Posts en borrador.
- Posts programados.
- Posts pendientes de actualización.
- Categorías más activas.
- Artículos más recientes.

#### Conversión

- Consultas recibidas.
- Consultas por tipo:
  - causal,
  - predictivo,
  - descriptivo,
  - diagnóstico,
  - pronóstico,
  - mixto.
- Consultas por fase:
  - idea,
  - protocolo,
  - análisis,
  - manuscrito,
  - revisión.
- Tasa de conversión post → contacto.

#### Difusión

- Clics desde LinkedIn.
- Clics desde newsletter.
- Recursos descargados.
- Artículos más compartidos.

#### Calidad editorial

- Posts sin SEO description.
- Posts sin CTA.
- Posts sin referencias.
- Posts sin categoría.
- Posts antiguos no actualizados.
- Posts publicados sin imagen.

### Prioridad

**Alta.**

---

## 4.12. Sistema de auditoría editorial

### Problema actual

Existe `AuditLog`, pero se puede explotar mucho más.

### Funcionalidad recomendada

Crear sección:

```txt
/admin/audit
```

### Acciones visibles

- Quién creó un post.
- Quién lo editó.
- Quién lo publicó.
- Quién cambió ajustes.
- Quién eliminó un recurso.
- Cuándo se subió un medio.
- Cuándo se cambió una contraseña.
- IP aproximada.
- User agent.

### Filtros

- Usuario.
- Acción.
- Entidad.
- Fecha.
- Riesgo.

### Prioridad

**Media-alta.**

Especialmente útil si en el futuro hay más colaboradores.

---

## 4.13. Gestión de usuarios avanzada

### Problema actual

Usuarios está parcialmente implementado: API lista/crea, pero UI incompleta.

### Funcionalidad recomendada

Completar `/admin/users`.

### Acciones

- Crear usuario.
- Editar usuario.
- Desactivar usuario.
- Cambiar rol.
- Resetear contraseña.
- Ver último login.
- Ver actividad.
- Impedir que un admin se borre a sí mismo.
- Invitar usuario por email.

### Roles propuestos

```txt
admin
editor
reviewer
viewer
```

### Permisos

| Acción               | Admin | Editor   | Reviewer | Viewer |
| -------------------- | ----- | -------- | -------- | ------ |
| Crear posts          | Sí    | Sí       | No       | No     |
| Editar posts propios | Sí    | Sí       | No       | No     |
| Publicar             | Sí    | Opcional | No       | No     |
| Revisar              | Sí    | Sí       | Sí       | No     |
| Gestionar usuarios   | Sí    | No       | No       | No     |
| Ver consultas        | Sí    | Opcional | No       | No     |
| Cambiar ajustes      | Sí    | No       | No       | No     |
| Ver dashboard        | Sí    | Sí       | Sí       | Sí     |

### Prioridad

**Alta.**

---

## 4.14. Biblioteca de medios real

### Problema actual

API de medios implementada, pero falta pantalla admin dedicada.

### Funcionalidad recomendada

Crear:

```txt
/admin/media
```

### Funciones

- Subir imagen.
- Subir PDF.
- Subir plantilla.
- Ver grid de medios.
- Buscar.
- Filtrar por tipo.
- Copiar URL.
- Insertar en post.
- Ver tamaño.
- Ver peso optimizado.
- Eliminar.
- Reemplazar archivo.
- Añadir alt text.
- Añadir descripción.
- Añadir créditos.
- Ver dónde se está usando.

### Modelo ampliado

```ts
interface MediaAsset {
  _id: string;
  url: string;
  publicId?: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  credit?: string;
  usedIn?: {
    entityType: string;
    entityId: string;
  }[];
  uploadedBy: string;
  createdAt: Date;
}
```

### Por qué es importante

Para una web profesional, los medios no pueden estar dispersos. Necesitas reutilizar imágenes, PDFs, checklists y recursos.

### Prioridad

**Muy alta.**

---

## 4.15. SEO avanzado para cada contenido

### Problema actual

Hay campos SEO básicos, pero puede ser más útil.

### Funcionalidad recomendada

En el editor de posts/noticias añadir pestaña:

```txt
SEO y distribución
```

### Campos

- SEO title.
- Meta description.
- Slug editable.
- Canonical URL.
- Open Graph title.
- Open Graph description.
- Open Graph image.
- Twitter/X card.
- Keywords internas.
- Estado indexable/no indexable.
- Schema.org type:
  - Article,
  - BlogPosting,
  - MedicalWebPage,
  - Person,
  - Service.

### Indicadores visuales

- Longitud título SEO.
- Longitud meta description.
- Slug demasiado largo.
- Falta imagen OG.
- Falta CTA.
- Falta extracto.
- Falta categoría.
- Falta referencia.
- Falta fecha de actualización.

### Prioridad

**Muy alta.**

---

## 4.16. Mapa de contenidos y clusters temáticos

### Problema actual

El blog puede crecer desordenado.

### Funcionalidad recomendada

Crear módulo:

```txt
/admin/content-map
```

### Concepto

Organizar el contenido por clusters:

```txt
Causalidad clínica
  - estimando
  - DAGs
  - target trial
  - IPTW
  - sesgo de tiempo inmortal

Predicción clínica
  - calibración
  - AUC
  - validación externa
  - PROBAST
  - TRIPOD

Reporte científico
  - STROBE
  - CONSORT
  - PRISMA
  - respuesta a revisores

STATA 17
  - logística
  - Cox
  - competing risks
  - imputación múltiple
  - splines
```

### Acciones

- Ver artículos por cluster.
- Detectar huecos de contenido.
- Definir artículo pilar.
- Vincular artículos relacionados.
- Crear enlaces internos.
- Sugerir próximo contenido.

### Prioridad

**Alta.**

---

## 4.17. Sistema de enlaces internos sugeridos

### Problema actual

Cuando escribes un artículo, puedes olvidar enlazar otros artículos relacionados.

### Funcionalidad recomendada

En el editor:

```txt
Sugerencias de enlaces internos
```

### Lógica sencilla

Buscar posts con:

- misma categoría,
- tags compartidos,
- palabras clave similares,
- contenido pilar.

### UI

Mostrar:

```txt
Este artículo podría enlazar a:
- Qué es un estimando causal
- Por qué AUC no es suficiente
- Cómo reportar según STROBE
```

Botón:

```txt
Insertar enlace
```

### Prioridad

**Media-alta.**

---

## 4.18. CTA manager

### Problema actual

Los artículos deberían conducir a una acción: consulta, descarga, newsletter o servicio.

### Funcionalidad recomendada

Crear:

```txt
/admin/ctas
```

### Tipos de CTA

- Solicitar asesoría pre-protocolo.
- Descargar checklist.
- Suscribirse a newsletter.
- Leer guía relacionada.
- Contactar para revisión metodológica.
- Ver servicios.

### Modelo

```ts
interface CTA {
  _id: string;
  title: string;
  description: string;
  buttonText: string;
  targetUrl: string;
  type: "contact" | "download" | "newsletter" | "service" | "related";
  status: "active" | "inactive";
}
```

### En el editor

Permitir seleccionar:

```txt
CTA principal del artículo
CTA secundario
```

### Prioridad

**Alta.**

---

## 4.19. Recursos descargables con captura de lead

### Problema actual

Los recursos pueden ser públicos, pero no queda claro si ayudan a captar contactos.

### Funcionalidad recomendada

Para cada recurso:

```txt
Libre
Requiere email
Requiere formulario completo
Solo privado
```

### Flujo

1. Usuario ve recurso.
2. Clica descargar.
3. Si requiere email, deja email.
4. Se crea un lead.
5. Se entrega enlace.
6. Admin ve descarga.

### Modelo

```ts
interface ResourceDownload {
  _id: string;
  resourceId: string;
  email?: string;
  name?: string;
  source?: string;
  createdAt: Date;
}
```

### Recursos ideales

- Checklist STROBE.
- Checklist TRIPOD+AI.
- Plantilla de plan estadístico.
- Plantilla de pregunta causal.
- Plantilla de DAG.
- Checklist de modelo predictivo.
- Checklist de respuesta a revisores.

### Prioridad

**Alta.**

---

## 4.20. CRM ligero de consultas

### Problema actual

La gestión de consultas existe, pero debería evolucionar hacia un mini-CRM.

### Funcionalidad recomendada

Ampliar `/admin/inquiries`.

### Estados propuestos

```txt
Nueva
Revisada
Pendiente de respuesta
Respondida
Reunión propuesta
Propuesta enviada
Aceptada
Descartada
Archivada
```

### Campos añadidos

```ts
priority: "low" | "medium" | "high";
estimatedValue?: number;
nextAction?: string;
nextActionAt?: Date;
assignedTo?: string;
source?: "contact_form" | "linkedin" | "email" | "referral" | "other";
serviceInterest?: string;
```

### Acciones

- Añadir nota.
- Programar próxima acción.
- Marcar como oportunidad.
- Vincular a servicio.
- Crear propuesta.
- Exportar CSV.
- Filtrar por estado.
- Filtrar por tipo de proyecto.
- Filtrar por fuente.

### Prioridad

**Muy alta.**

Porque conecta contenido con negocio real.

---

## 4.21. Módulo de propuestas de servicio

### Problema actual

Si alguien contacta, necesitas responder de forma profesional.

### Funcionalidad recomendada

Crear:

```txt
/admin/proposals
```

### Funciones

- Crear propuesta desde consulta.
- Elegir plantilla.
- Añadir alcance.
- Añadir entregables.
- Añadir plazo.
- Añadir precio si procede.
- Exportar PDF.
- Marcar enviada/aceptada/rechazada.

### Plantillas

1. Asesoría pre-protocolo.
2. Revisión metodológica de manuscrito.
3. Plan de análisis estadístico.
4. Revisión de modelo predictivo.
5. Respuesta a revisores.
6. Asesoría completa de proyecto.

### Prioridad

**Media-alta.**

---

## 4.22. Repositorio de prompts y asistentes internos

### Problema actual

Crear contenido metodológico requiere repetir instrucciones.

### Funcionalidad recomendada

Crear:

```txt
/admin/prompts
```

### Uso

Guardar prompts internos para:

- Generar borrador de artículo.
- Convertir artículo en LinkedIn.
- Crear checklist.
- Crear resumen para newsletter.
- Revisar tono académico.
- Detectar errores metodológicos.
- Reformular como texto para médicos.

### Campos

```ts
interface PromptTemplate {
  _id: string;
  title: string;
  purpose: string;
  prompt: string;
  variables: string[];
  category: "blog" | "linkedin" | "newsletter" | "seo" | "review" | "stata";
  createdAt: Date;
}
```

### Nota

No hace falta conectar IA al principio. Puede ser una biblioteca manual de plantillas.

### Prioridad

**Media.**

---

## 4.23. Checklist editorial antes de publicar

### Problema actual

Un artículo puede publicarse sin referencias, sin CTA, sin SEO, sin imagen o con estructura incompleta.

### Funcionalidad recomendada

Antes de publicar, mostrar checklist:

```txt
Calidad editorial
```

### Checklist para posts metodológicos

- [ ] Título claro.
- [ ] Extracto completo.
- [ ] Categoría asignada.
- [ ] Tags asignados.
- [ ] Imagen destacada.
- [ ] CTA asociado.
- [ ] Referencias añadidas.
- [ ] Ejemplo clínico incluido.
- [ ] Error frecuente incluido.
- [ ] Conclusión práctica incluida.
- [ ] SEO title.
- [ ] Meta description.
- [ ] Slug revisado.
- [ ] Enlaces internos.
- [ ] Revisión ortográfica.
- [ ] Fecha de actualización.

### Regla

Permitir publicar con advertencias, pero mostrar nivel:

```txt
Listo para publicar: 82%
```

### Prioridad

**Muy alta.**

---

## 4.24. Validación metodológica interna del artículo

### Problema actual

Tu marca se basa en rigor metodológico. El backoffice debería ayudarte a mantenerlo.

### Funcionalidad recomendada

En cada post añadir una pestaña:

```txt
Control metodológico
```

### Checklist según categoría

#### Si categoría = causalidad

- [ ] ¿Se diferencia asociación de causalidad?
- [ ] ¿Se define población?
- [ ] ¿Se define exposición/intervención?
- [ ] ¿Se define comparador?
- [ ] ¿Se define outcome?
- [ ] ¿Se define horizonte temporal?
- [ ] ¿Se evita lenguaje causal excesivo?
- [ ] ¿Se menciona tiempo cero si procede?
- [ ] ¿Se advierte sobre confusión?
- [ ] ¿Se evita ajustar por mediadores/colliders sin explicación?

#### Si categoría = predicción

- [ ] ¿Se define outcome?
- [ ] ¿Se define horizonte temporal?
- [ ] ¿Se diferencia discriminación de calibración?
- [ ] ¿Se evita presentar AUC como suficiente?
- [ ] ¿Se menciona validación?
- [ ] ¿Se discute utilidad clínica?
- [ ] ¿Se evita interpretar predictores como causas?

#### Si categoría = reporte

- [ ] ¿Se diferencia guía de reporte de método?
- [ ] ¿Se explica aplicabilidad?
- [ ] ¿Se añade enlace o referencia a guía?
- [ ] ¿Se incluye ejemplo de redacción?

### Prioridad

**Muy alta.**

Esto es diferencial frente a un CMS normal.

---

## 4.25. Sistema de actualización periódica de artículos

### Problema actual

En metodología clínica, algunas entradas deben actualizarse cuando cambian guías.

### Funcionalidad recomendada

Añadir:

```ts
lastReviewedAt?: Date;
nextReviewAt?: Date;
reviewStatus: "current" | "needs_review" | "outdated";
```

### UI

En dashboard:

```txt
Artículos que requieren revisión
```

Ejemplos:

- CONSORT 2025.
- TRIPOD+AI.
- PROBAST+AI.
- Guías EQUATOR.
- Cambios de software STATA.
- Nuevas recomendaciones metodológicas.

### Prioridad

**Alta.**

---

## 4.26. Sistema de series y cursos

### Problema actual

Los artículos aislados no siempre transmiten una currícula progresiva.

### Funcionalidad recomendada

Crear:

```txt
/admin/series
```

### Modelo

```ts
interface Series {
  _id: string;
  title: string;
  description: string;
  slug: string;
  posts: string[];
  status: "draft" | "published";
  order: number;
}
```

### Series sugeridas

1. Fundamentos de causalidad clínica.
2. Modelos predictivos para médicos.
3. Errores frecuentes en regresión.
4. Cómo preparar un manuscrito.
5. STATA 17 aplicado a investigación clínica.
6. Lectura crítica metodológica.

### Público

En la web pública:

```txt
/series/causalidad-clinica
```

Con progreso:

```txt
1/8 artículos publicados
```

### Prioridad

**Alta.**

---

## 4.27. Módulo de revista científica comentada

### Problema actual

Has mencionado revistas científicas y publicaciones. Esto puede ser un formato de alto valor.

### Funcionalidad recomendada

Crear una sección:

```txt
Revista metodológica comentada
```

Ruta admin:

```txt
/admin/journal-club
```

Ruta pública:

```txt
/revista-metodologica
```

### Qué sería

No una revista científica propia formal, sino una sección de **lectura crítica comentada de artículos relevantes**.

### Modelo

```ts
interface JournalReview {
  _id: string;
  articleTitle: string;
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  clinicalQuestion: string;
  design: string;
  methodsSummary: string;
  strengths: string;
  limitations: string;
  riskOfBias: string;
  methodologicalLesson: string;
  publicStatus: "draft" | "published";
}
```

### Estructura pública

- Artículo comentado.
- Pregunta clínica.
- Diseño.
- Método.
- Lo que está bien.
- Lo que hay que interpretar con cautela.
- Lección metodológica.
- Cómo lo habría mejorado.

### Prioridad

**Alta.**

Puede posicionarte muy bien como experto.

---

## 4.28. Sistema de colecciones de recursos

### Problema actual

Recursos sueltos pueden ser útiles, pero colecciones aumentan valor.

### Funcionalidad recomendada

Crear colecciones:

```txt
/admin/resource-collections
```

Ejemplos:

```txt
Kit para estudio observacional causal
Kit para modelo pronóstico
Kit para responder a revisores
Kit STROBE
Kit TRIPOD+AI
Kit STATA 17
```

Cada kit incluye:

- Guía.
- Checklist.
- Plantilla.
- Ejemplo.
- Post relacionado.
- CTA servicio.

### Prioridad

**Media-alta.**

---

## 4.29. Generador de páginas landing

### Problema actual

Los servicios están listados, pero para captar consultas puede ser útil tener landings específicas.

### Funcionalidad recomendada

Crear:

```txt
/admin/landing-pages
```

### Ejemplos de landings

- Asesoría para estudios observacionales.
- Revisión metodológica antes de enviar a revista.
- Modelos predictivos clínicos.
- Respuesta a revisores.
- Plan de análisis estadístico.
- STATA 17 para investigación clínica.

### Modelo

```ts
interface LandingPage {
  _id: string;
  title: string;
  slug: string;
  hero: string;
  problem: string;
  solution: string;
  deliverables: string[];
  targetAudience: string;
  faqs: FAQ[];
  ctaId: string;
  status: "draft" | "published";
}
```

### Prioridad

**Media-alta.**

---

## 4.30. FAQ manager

### Problema actual

Preguntas frecuentes ayudan a reducir fricción antes de contactar.

### Funcionalidad recomendada

Crear:

```txt
/admin/faqs
```

### Tipos

- FAQ general.
- FAQ por servicio.
- FAQ por recurso.
- FAQ por landing.

### Ejemplos

```txt
¿En qué fase conviene pedir asesoría?
¿Puedes ayudar si la base de datos ya está cerrada?
¿Trabajas con STATA 17?
¿Puedes revisar respuesta a revisores?
¿Puedes ayudar a formular la pregunta causal?
¿Haces análisis completo o solo asesoría metodológica?
```

### Prioridad

**Media.**

---

## 4.31. Búsqueda interna avanzada en admin

### Problema actual

Cuando crezcan contenidos, será difícil encontrar algo.

### Funcionalidad recomendada

Barra global de búsqueda en admin.

Busca en:

- Posts.
- Noticias.
- Recursos.
- Servicios.
- Consultas.
- Referencias.
- Medios.
- Propuestas.
- Usuarios.

### Atajo

```txt
Cmd + K
```

O:

```txt
Ctrl + K
```

### Prioridad

**Alta.**

---

## 4.32. Comandos rápidos tipo Command Palette

### Funcionalidad recomendada

Añadir paleta rápida:

```txt
Cmd/Ctrl + K
```

Acciones:

- Nuevo post.
- Nueva noticia.
- Nuevo recurso.
- Buscar artículo.
- Ir a consultas.
- Ver calendario.
- Crear LinkedIn post.
- Subir medio.
- Ver dashboard.

### Prioridad

**Media-alta.**

Da sensación de software profesional.

---

## 4.33. Previsualización pública antes de publicar

### Problema actual

Antes de publicar deberías ver exactamente cómo queda.

### Funcionalidad recomendada

Botón:

```txt
Previsualizar
```

Para posts en borrador.

### Implementación

Endpoint privado:

```txt
GET /api/admin/posts/:id/preview
```

Ruta frontend:

```txt
/admin/preview/post/:id
```

O token temporal:

```txt
/preview/post/:id?token=...
```

### Prioridad

**Alta.**

---

## 4.34. Duplicar contenido

### Problema actual

Muchas entradas tendrán estructuras parecidas.

### Funcionalidad recomendada

Botón:

```txt
Duplicar
```

En posts, noticias, recursos, servicios y landings.

### Uso

- Duplicar entrada STATA.
- Duplicar plantilla de artículo.
- Duplicar landing de servicio.
- Duplicar noticia para versión extendida.

### Prioridad

**Media-alta.**

---

## 4.35. Estado de completitud de contenido

### Funcionalidad recomendada

Mostrar en tablas admin una columna:

```txt
Completitud
```

Ejemplo:

```txt
92%
```

Calculado por:

- título,
- extracto,
- contenido,
- SEO,
- imagen,
- CTA,
- referencias,
- tags,
- categoría,
- enlaces internos,
- checklist editorial.

### Prioridad

**Alta.**

---

## 4.36. Sistema de etiquetas profesional

### Problema actual

Tags simples pueden crecer desordenados.

### Funcionalidad recomendada

Crear gestión de etiquetas:

```txt
/admin/tags
```

Campos:

```ts
interface Tag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  parentTagId?: string;
  type: "topic" | "method" | "software" | "guideline" | "service";
}
```

Ejemplos:

```txt
DAG
IPTW
Target trial
Calibración
TRIPOD+AI
STATA
Regresión logística
Cirugía cardíaca
Manuscritos
Respuesta a revisores
```

### Prioridad

**Media-alta.**

---

## 4.37. Taxonomía clínica/metodológica

### Funcionalidad recomendada

Crear taxonomías más ricas que categorías.

### Taxonomías

```txt
Tipo de pregunta
- causal
- predictiva
- diagnóstica
- pronóstica
- descriptiva

Tipo de diseño
- cohorte
- casos y controles
- transversal
- ensayo
- validación externa
- revisión sistemática

Método
- regresión
- propensity score
- IPTW
- Cox
- competing risks
- imputación múltiple

Guía de reporte
- STROBE
- CONSORT
- TRIPOD+AI
- PRISMA
- RECORD
```

### Prioridad

**Alta.**

Diferencia tu CMS de uno genérico.

---

## 4.38. Módulo de snippets de código

### Problema actual

Vas a publicar contenido STATA. Necesitas gestionar código reutilizable.

### Funcionalidad recomendada

Crear:

```txt
/admin/code-snippets
```

### Modelo

```ts
interface CodeSnippet {
  _id: string;
  title: string;
  language: "stata" | "r" | "python" | "sql";
  code: string;
  explanation: string;
  topicTags: string[];
  relatedPosts: string[];
  createdAt: Date;
}
```

### Funciones

- Insertar snippet en post.
- Copiar.
- Descargar `.do` si es STATA.
- Vincular a artículo.
- Crear biblioteca pública de código.

### Prioridad

**Alta** si STATA será una sección importante.

---

## 4.39. Generador de archivos descargables

### Funcionalidad recomendada

Desde un post o recurso, generar:

- PDF del artículo.
- Checklist PDF.
- Markdown.
- Plantilla `.docx` en futuro.
- Archivo `.do` para STATA.

### Primera fase

Usar generación PDF desde HTML o librería backend.

### Prioridad

**Media.**

---

## 4.40. Panel de calidad técnica y salud del sistema

### Funcionalidad recomendada

En `/admin/system`:

- Estado API.
- Estado base de datos.
- Último backup.
- Número de errores recientes.
- Versión app.
- Último deploy.
- Uso almacenamiento medios.
- Cola de publicaciones programadas.
- Jobs fallidos.

### Prioridad

**Media.**

Muy útil para confianza operativa.

---

## 4.41. Centro de notificaciones interno

### Problema actual

Las acciones importantes quedan dispersas.

### Funcionalidad recomendada

Campana de notificaciones en admin.

Eventos:

- Nueva consulta.
- Post programado publicado.
- Fallo al publicar.
- Recurso descargado muchas veces.
- Artículo necesita revisión.
- Usuario creado.
- Error en upload.
- Newsletter enviada.

### Modelo

```ts
interface AdminNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  readAt?: Date;
  targetUrl?: string;
  createdAt: Date;
}
```

### Prioridad

**Alta.**

---

## 4.42. Gestión avanzada de noticias

### Problema actual

Las noticias existen, pero podrían orientarse mejor.

### Funcionalidad recomendada

Tipos de noticia:

```txt
Actualidad metodológica
Nueva guía
Artículo comentado
Actualización de software
Evento/congreso
Publicación propia
Caso práctico
```

Campos añadidos:

```ts
sourceType: "journal" | "guideline" | "conference" | "software" | "own" | "other";
importance: "low" | "medium" | "high";
commentary?: string;
relatedServiceId?: string;
relatedPosts?: string[];
```

### Uso

Una noticia no debería ser solo “novedad”, sino oportunidad de posicionamiento.

Ejemplo:

```txt
CONSORT 2025 actualiza recomendaciones de reporte de ensayos clínicos.
Comentario metodológico: qué cambia para autores clínicos.
CTA: revisión pre-envío de ensayos.
```

### Prioridad

**Media-alta.**

---

## 4.43. Relación contenido-servicio

### Problema actual

Un lector lee un artículo, pero no siempre ve qué servicio se relaciona.

### Funcionalidad recomendada

En cada post/noticia/recurso, permitir vincular:

```txt
Servicio recomendado
```

Ejemplos:

- Post sobre STROBE → Servicio de revisión pre-envío.
- Post sobre modelos predictivos → Servicio de validación de score.
- Post sobre causalidad → Servicio pre-protocolo.
- Post sobre respuesta a revisores → Servicio de respuesta a revisores.

### Prioridad

**Muy alta.**

Porque convierte contenido en oportunidades.

---

## 4.44. Embudos de conversión

### Funcionalidad recomendada

Crear rutas de conversión por tema.

Ejemplo:

```txt
Artículo sobre estimando causal
→ Descarga plantilla de pregunta causal
→ Email capturado
→ Newsletter causalidad
→ CTA asesoría pre-protocolo
→ Consulta
```

En admin:

```txt
/admin/funnels
```

Modelo:

```ts
interface Funnel {
  _id: string;
  name: string;
  entryContentIds: string[];
  leadMagnetResourceId?: string;
  newsletterSequenceId?: string;
  targetServiceId: string;
}
```

### Prioridad

**Media-alta.**

---

## 4.45. Analítica de lectura

### Funcionalidad recomendada

Medir eventos propios básicos:

- Vista de post.
- Scroll 50%.
- Scroll 90%.
- Click CTA.
- Descarga recurso.
- Envío contacto.
- Click LinkedIn.
- Click newsletter.

### Modelo

```ts
interface AnalyticsEvent {
  _id: string;
  eventType: string;
  entityType?: string;
  entityId?: string;
  source?: string;
  sessionId?: string;
  createdAt: Date;
}
```

### Importante

Debe respetar privacidad y normativa. Puedes empezar con métricas agregadas sin identificar usuarios.

### Prioridad

**Media-alta.**

---

## 4.46. Integración con Google Analytics / Plausible

### Funcionalidad recomendada

Añadir opción en ajustes:

```txt
Tracking provider
Tracking ID
```

Recomendación:

- Plausible si quieres analítica simple y respetuosa.
- Google Analytics si necesitas integración estándar.
- Métricas propias para eventos de conversión.

### Prioridad

**Media.**

---

## 4.47. Sistema de newsletter digest automático

### Funcionalidad recomendada

Crear newsletter a partir de posts recientes.

Acción:

```txt
Generar newsletter de este mes
```

El sistema propone:

- Asunto.
- Introducción.
- Artículos recientes.
- Recurso destacado.
- CTA.
- Cierre.

### Prioridad

**Media-alta.**

---

## 4.48. Módulo de campañas

### Funcionalidad recomendada

Crear campañas temáticas.

Ejemplo:

```txt
Campaña: Modelos predictivos clínicos
Duración: 4 semanas
Contenidos:
- Artículo AUC
- Artículo calibración
- Checklist TRIPOD
- Post LinkedIn 1
- Newsletter
- Landing de servicio
```

Ruta:

```txt
/admin/campaigns
```

### Prioridad

**Media.**

---

## 4.49. Gestión de comentarios internos por contenido

### Funcionalidad recomendada

En cada post:

```txt
Comentarios internos
```

No públicos.

Uso:

- Anotar dudas.
- Revisar referencias.
- Dejar tareas.
- Marcar cambios.

Modelo:

```ts
interface InternalComment {
  _id: string;
  entityType: string;
  entityId: string;
  userId: string;
  comment: string;
  resolvedAt?: Date;
  createdAt: Date;
}
```

### Prioridad

**Media.**

---

## 4.50. Tareas internas

### Funcionalidad recomendada

Crear tareas vinculadas a contenidos.

Ejemplos:

- Revisar referencias de post.
- Añadir gráfico.
- Crear versión LinkedIn.
- Revisar SEO.
- Programar newsletter.
- Actualizar artículo por nueva guía.

Modelo:

```ts
interface Task {
  _id: string;
  title: string;
  description?: string;
  entityType?: string;
  entityId?: string;
  assignedTo?: string;
  dueDate?: Date;
  status: "todo" | "doing" | "done" | "cancelled";
  priority: "low" | "medium" | "high";
}
```

### Prioridad

**Alta.**

---

# 5. Mejoras técnicas necesarias

---

## 5.1. Lint real

### Estado actual

El script existe, pero no hay reglas reales en workspaces.

### Recomendación

Instalar ESLint en:

- `apps/api`
- `apps/web`

Configurar:

```txt
eslint
typescript-eslint
eslint-plugin-react
eslint-plugin-react-hooks
eslint-plugin-jsx-a11y
eslint-plugin-import
prettier
```

Scripts:

```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier . --write",
  "typecheck": "tsc --noEmit"
}
```

### Prioridad

**Muy alta.**

---

## 5.2. Ampliar tests

### Tests que faltan

#### Seguridad

- Usuario editor no puede crear usuarios.
- Usuario no autenticado no accede a admin endpoints.
- Borradores no aparecen en público.
- Rate limit login.
- HTML peligroso se sanitiza.
- Archivo no permitido se rechaza.

#### Admin

- Gestión de consultas.
- Gestión de usuarios.
- Gestión de medios.
- Ajustes públicos.
- Roles.
- Cambio de contraseña.

#### Frontend

- Formularios de posts.
- Formularios de noticias.
- Formularios de recursos.
- Formularios de servicios.
- Login con error.
- ProtectedRoute.
- Sidebar plegable.

### Prioridad

**Muy alta.**

---

## 5.3. Code splitting

### Estado actual

Bundle principal alrededor de 503 kB.

### Recomendación

Aplicar lazy loading:

```tsx
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage"),
);
const AdminPostsPage = lazy(() => import("./pages/admin/AdminPostsPage"));
const BlogDetailPage = lazy(() => import("./pages/public/BlogDetailPage"));
```

Separar:

- Admin.
- Public.
- Editor enriquecido.
- Gráficos.
- Recharts.
- Framer Motion.

### Prioridad

**Media.**

---

## 5.4. Accesibilidad

### Recomendación

Añadir revisión:

- Contraste.
- Navegación por teclado.
- Labels en formularios.
- Estados focus.
- ARIA en modales.
- Mensajes de error accesibles.

Instalar:

```txt
eslint-plugin-jsx-a11y
```

E2E:

```txt
axe-playwright
```

### Prioridad

**Media-alta.**

---

## 5.5. Observabilidad

### Recomendación

Añadir:

- Sentry para frontend/backend.
- Logs estructurados.
- Registro de errores por usuario.
- Alertas de fallo API.
- Página admin de errores recientes.

### Prioridad

**Media.**

---

## 5.6. Backups y exportación

### Recomendación

Crear botón admin:

```txt
Exportar contenidos
```

Formatos:

- JSON completo.
- CSV posts.
- CSV consultas.
- Markdown de posts.

Crear script:

```bash
npm run backup:content
```

### Prioridad

**Media-alta.**

---

# 6. Nuevas páginas privadas recomendadas

## 6.1. Menú admin recomendado final

```txt
Dashboard
Centro editorial
Calendario
Posts
Noticias
Revista metodológica
Recursos
Biblioteca de medios
Referencias
Series
Servicios
Landings
CTAs
Consultas / CRM
Propuestas
Newsletter
LinkedIn / Distribución
Campañas
Tareas
Usuarios
Ajustes
Auditoría
Sistema
```

## 6.2. Menú público recomendado final

```txt
Inicio
Sobre mí
Servicios
Blog
Noticias
Revista metodológica
Recursos
Series
Newsletter
Contacto
```

---

# 7. Nuevos modelos de datos recomendados

## 7.1. ContentRevision

```ts
interface ContentRevision {
  _id: string;
  entityType: "post" | "news" | "resource" | "service" | "landing";
  entityId: string;
  versionNumber: number;
  snapshot: Record<string, unknown>;
  changedBy: string;
  changeSummary?: string;
  createdAt: Date;
}
```

## 7.2. Reference

```ts
interface Reference {
  _id: string;
  title: string;
  authors: string[];
  journal?: string;
  year?: number;
  doi?: string;
  url?: string;
  pmid?: string;
  type: "guideline" | "paper" | "book" | "report" | "web";
  topicTags: string[];
  citationVancouver?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 7.3. EditorialTask

```ts
interface EditorialTask {
  _id: string;
  title: string;
  description?: string;
  entityType?: "post" | "news" | "resource" | "newsletter" | "linkedin";
  entityId?: string;
  assignedTo?: string;
  dueDate?: Date;
  status: "todo" | "doing" | "done" | "cancelled";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}
```

## 7.4. NewsletterSubscriber

```ts
interface NewsletterSubscriber {
  _id: string;
  email: string;
  name?: string;
  status: "pending" | "active" | "unsubscribed";
  interests: string[];
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 7.5. CTA

```ts
interface CTA {
  _id: string;
  title: string;
  description: string;
  buttonText: string;
  targetUrl: string;
  type: "contact" | "download" | "newsletter" | "service" | "related";
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
```

## 7.6. ContentSeries

```ts
interface ContentSeries {
  _id: string;
  title: string;
  slug: string;
  description: string;
  posts: string[];
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}
```

## 7.7. JournalReview

```ts
interface JournalReview {
  _id: string;
  articleTitle: string;
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  clinicalQuestion: string;
  design: string;
  methodsSummary: string;
  strengths: string;
  limitations: string;
  riskOfBias: string;
  methodologicalLesson: string;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}
```

## 7.8. LinkedInAsset

```ts
interface LinkedInAsset {
  _id: string;
  sourceType: "post" | "news" | "resource" | "manual";
  sourceId?: string;
  text: string;
  hashtags: string[];
  status: "draft" | "ready" | "published";
  scheduledAt?: Date;
  publishedAt?: Date;
  trackingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 7.9. Proposal

```ts
interface Proposal {
  _id: string;
  inquiryId?: string;
  title: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  scope: string;
  deliverables: string[];
  timeline?: string;
  price?: number;
  status: "draft" | "sent" | "accepted" | "rejected" | "archived";
  createdAt: Date;
  updatedAt: Date;
}
```

---

# 8. Nuevos endpoints recomendados

## 8.1. Editorial

```txt
GET    /api/admin/editorial
PATCH  /api/admin/editorial/:entityType/:id/status
PATCH  /api/admin/editorial/:entityType/:id/schedule
```

## 8.2. Revisiones

```txt
GET    /api/admin/revisions/:entityType/:id
POST   /api/admin/revisions/:entityType/:id
POST   /api/admin/revisions/:revisionId/restore
```

## 8.3. Referencias

```txt
GET    /api/admin/references
POST   /api/admin/references
PUT    /api/admin/references/:id
DELETE /api/admin/references/:id
```

## 8.4. Newsletter

```txt
POST   /api/newsletter/subscribe
GET    /api/admin/newsletter/subscribers
GET    /api/admin/newsletter/issues
POST   /api/admin/newsletter/issues
PATCH  /api/admin/newsletter/issues/:id/schedule
PATCH  /api/admin/newsletter/issues/:id/send
```

## 8.5. LinkedIn assets

```txt
GET    /api/admin/linkedin-assets
POST   /api/admin/linkedin-assets
PATCH  /api/admin/linkedin-assets/:id
DELETE /api/admin/linkedin-assets/:id
```

## 8.6. CTAs

```txt
GET    /api/admin/ctas
POST   /api/admin/ctas
PUT    /api/admin/ctas/:id
DELETE /api/admin/ctas/:id
```

## 8.7. Series

```txt
GET    /api/series
GET    /api/series/:slug
GET    /api/admin/series
POST   /api/admin/series
PUT    /api/admin/series/:id
DELETE /api/admin/series/:id
```

## 8.8. Propuestas

```txt
GET    /api/admin/proposals
POST   /api/admin/proposals
GET    /api/admin/proposals/:id
PUT    /api/admin/proposals/:id
PATCH  /api/admin/proposals/:id/status
```

---

# 9. Roadmap recomendado

## Fase 1 — Profesionalizar el backoffice actual

Prioridad máxima.

1. Lint real.
2. Tests de seguridad y roles.
3. Pantalla de medios.
4. UI completa de usuarios.
5. Gestión admin de consultas.
6. Ajustes con e2e.
7. Previsualización de posts.
8. Checklist antes de publicar.
9. SEO avanzado básico.
10. CTA por post.

Resultado: backoffice sólido y profesional.

---

## Fase 2 — Centro editorial

1. Estados editoriales.
2. Kanban editorial.
3. Calendario.
4. Programación de publicaciones.
5. Tareas internas.
6. Notificaciones.
7. Duplicar contenido.
8. Versionado.

Resultado: sistema real de producción editorial.

---

## Fase 3 — Potenciar marca personal y difusión

1. Generador de LinkedIn.
2. UTMs.
3. Newsletter.
4. Captura de leads por recursos.
5. Dashboard de conversión.
6. Landings de servicio.
7. Relación contenido-servicio.

Resultado: el blog empieza a generar oportunidades.

---

## Fase 4 — Diferenciación científica

1. Editor científico por bloques.
2. Plantillas metodológicas.
3. Biblioteca de referencias.
4. Revista metodológica comentada.
5. Series/cursos.
6. Snippets STATA.
7. Control metodológico por categoría.

Resultado: la web deja de ser un CMS y se convierte en una plataforma metodológica especializada.

---

## Fase 5 — Automatización avanzada

1. Campañas.
2. Funnels.
3. Newsletter digest.
4. Analítica propia.
5. Exportación PDF/Markdown.
6. Integraciones externas.
7. Asistente interno opcional.

Resultado: plataforma escalable y profesional.

---

# 10. Funcionalidades más importantes si tienes que elegir solo 10

Si quieres máximo impacto con mínimo desarrollo inicial, haría estas 10:

1. **Biblioteca de medios completa.**
2. **UI completa de usuarios y roles.**
3. **CRM avanzado de consultas.**
4. **Checklist editorial antes de publicar.**
5. **SEO avanzado por post.**
6. **CTA manager vinculado a posts/servicios.**
7. **Generador de LinkedIn manual con UTMs.**
8. **Calendario editorial.**
9. **Plantillas de contenido científico.**
10. **Centro editorial Kanban.**

Estas 10 funcionalidades convierten tu proyecto en una herramienta mucho más profesional.

---

# 11. Funcionalidades diferenciales para tu caso concreto

Tu web no es un ecommerce ni un blog lifestyle. Es una web de **médico experto en metodología clínica aplicada**.

Por eso, las funcionalidades más diferenciales no son genéricas. Son estas:

## 11.1. Control metodológico del contenido

Cada post debería validarse según su tipo:

- causal,
- predictivo,
- reporte,
- STATA,
- lectura crítica.

Esto no lo tiene un CMS normal.

## 11.2. Plantillas científicas

No solo plantillas visuales, sino plantillas de razonamiento:

- artículo docente,
- caso metodológico,
- crítica de artículo,
- guía STATA,
- checklist,
- respuesta a revisores.

## 11.3. Biblioteca bibliográfica

Tu autoridad depende de referencias bien gestionadas.

## 11.4. Revista metodológica comentada

Puede posicionarte mejor que un blog genérico.

## 11.5. Conversión contenido-servicio

Cada contenido debe apuntar a un servicio relacionado.

Ejemplo:

```txt
Artículo sobre target trial → Asesoría pre-protocolo
Artículo sobre TRIPOD → Revisión de modelo predictivo
Artículo sobre STROBE → Revisión pre-envío de manuscrito
Artículo sobre revisores → Servicio de respuesta a revisores
```

---

# 12. Conclusión final

Tu proyecto está mucho más avanzado que una maqueta. Ya tienes una aplicación full-stack funcional con web pública, backoffice, CRUDs, autenticación, API, base de datos, tests y despliegue preparado.

El mayor valor ahora no está en añadir más páginas públicas aisladas, sino en hacer que el área privada sea una herramienta editorial y profesional potente.

El objetivo debería ser que el backoffice te permita:

- pensar contenidos,
- planificarlos,
- escribirlos mejor,
- estructurarlos científicamente,
- revisarlos,
- publicarlos,
- distribuirlos,
- medirlos,
- reutilizarlos,
- convertir lectores en consultas,
- conectar cada contenido con tus servicios.

La evolución natural del proyecto es pasar de:

```txt
web + blog + admin
```

a:

```txt
plataforma editorial científica + CRM ligero + sistema de difusión profesional
```

Si implementas las fases recomendadas, el proyecto no solo será una página web, sino una herramienta real para construir autoridad, captar oportunidades profesionales y gestionar de forma eficiente una marca personal médica especializada en metodología clínica aplicada.
