# Nueva funcionalidad — Guía interactiva privada de uso del proyecto

**Proyecto:** Doctor Tebar / Plataforma de metodología clínica aplicada
**Fecha:** 11 de mayo de 2026
**Funcionalidad propuesta:** Módulo privado de guías interactivas, tours paso a paso y aprendizaje de flujos internos.
**Zona:** Backoffice privado.
**Objetivo:** permitir que el administrador o futuros editores aprendan a utilizar cada funcionalidad del proyecto mediante recorridos guiados que resaltan partes de la interfaz, explican acciones y simulan flujos reales.

---

## 0. Estado de implementación

**Fecha de implementación:** 11 de mayo de 2026

La primera versión de la guía interactiva privada queda implementada en el proyecto real.

### 0.1. Funcionalidades desarrolladas

- [x] Instalado `react-joyride` en `apps/web`.
- [x] Ruta privada `/admin/guides`.
- [x] Entrada en sidebar: `Guia interactiva`.
- [x] Centro de aprendizaje con buscador, filtro por área, tarjetas, duración, dificultad y estado.
- [x] Definiciones estáticas de guías en `apps/web/src/guides/guideDefinitions.ts`.
- [x] Tipos TypeScript en `apps/web/src/guides/guide.types.ts`.
- [x] `GuidedTourProvider` integrado dentro de `AdminLayout`.
- [x] Progreso por guía guardado en `localStorage`.
- [x] Botón contextual de ayuda en el área privada.
- [x] Atributos `data-tour` añadidos a sidebar, dashboard, editor de posts, recursos, servicios, consultas, medios, usuarios y ajustes.
- [x] Tour de primer recorrido por el panel privado.
- [x] Tour de creación de blog.
- [x] Tour de creación de noticia.
- [x] Tour de creación de recurso.
- [x] Tour de gestión de consultas CRM.
- [x] Tour de biblioteca de medios.
- [x] Tour de ajustes públicos.
- [x] Tour de usuarios y roles.
- [x] Estilos visuales del tour adaptados al diseño oscuro del proyecto.
- [x] E2E para abrir el centro de guías.
- [x] E2E para iniciar la guía de creación de blog.

### 0.2. Pruebas ejecutadas

```txt
npm run build
OK

npm run test
API: 4 files, 10 tests passed
Web: 1 file, 1 test passed
Total: 5 files, 11 tests passed

npm run test:e2e
19 passed
5 skipped intencionados

npm audit --omit=dev
found 0 vulnerabilities
```

Los skips son intencionados: los flujos admin que escriben o disparan tours se validan en Chromium desktop para evitar duplicar mutaciones. La cobertura móvil conserva login, dashboard y flujos públicos.

### 0.3. Pendientes futuros

- [ ] Progreso sincronizado en backend por usuario.
- [ ] Editor interno de guías desde el admin.
- [ ] Métricas de abandono/completitud por paso.
- [ ] Tours multi-ruta avanzados.
- [ ] Modo demo con creación y limpieza automática de datos temporales.
- [ ] Guías con vídeo/GIF.

## 1. Resumen funcional

La nueva funcionalidad consiste en crear dentro del panel privado una sección llamada:

```txt
/admin/guides
```

Nombre visible recomendado:

```txt
Guía interactiva
```

O:

```txt
Centro de aprendizaje
```

Desde esta sección, el usuario podrá elegir un caso de uso, por ejemplo:

- Cómo crear un blog.
- Cómo publicar una noticia.
- Cómo subir un recurso.
- Cómo gestionar una consulta.
- Cómo crear un servicio.
- Cómo modificar la página pública.
- Cómo usar la biblioteca de medios.
- Cómo crear una publicación para LinkedIn.
- Cómo preparar un artículo con checklist editorial.
- Cómo revisar el SEO antes de publicar.
- Cómo usar el calendario editorial.
- Cómo revisar el dashboard.
- Cómo crear una propuesta a partir de una consulta.

Al pulsar en “Aprender flujo”, el sistema iniciará un **tour guiado** dentro del propio backoffice. La pantalla se oscurece, se resalta un botón, sección o campo concreto, aparece una tarjeta explicativa y el usuario puede avanzar con:

```txt
Siguiente
Anterior
Saltar
Finalizar
```

Este patrón se conoce habitualmente como:

```txt
Product tour
Interactive walkthrough
Guided onboarding
Coach marks
Feature tour
```

Para React se recomienda usar **React Joyride**, que permite crear tours guiados para aplicaciones React mediante pasos configurables. Driver.js también es una buena alternativa ligera para tours, highlights y ayuda contextual, y Shepherd.js permite guiar usuarios a través de recorridos personalizados en aplicaciones web.
Referencias: React Joyride permite crear guided tours en apps React; Driver.js se presenta como una librería ligera para product tours, highlights y contextual help; Shepherd.js permite guiar usuarios por recorridos en apps usando React, Vue, Angular o JavaScript plano.
Fuentes:

- https://react-joyride.com/
- https://driverjs.com/
- https://shepherdjs.dev/

---

## 2. Objetivo de producto

La finalidad no es solo crear una ayuda visual, sino convertir el backoffice en una herramienta más profesional, fácil de aprender y escalable.

### 2.1. Problemas que resuelve

Actualmente, aunque el proyecto tenga muchas funcionalidades, un usuario nuevo puede no saber:

- Dónde crear un post.
- Qué campos son obligatorios.
- Cómo guardar un borrador.
- Cómo publicar.
- Cómo comprobar que aparece en la parte pública.
- Cómo añadir etiquetas.
- Cómo subir imagen.
- Cómo revisar SEO.
- Cómo vincular un artículo a un servicio.
- Cómo gestionar una consulta.
- Cómo crear una noticia.
- Cómo usar recursos.
- Cómo actualizar ajustes públicos.
- Cómo comprobar si algo está publicado u oculto.

La guía interactiva reduce esa fricción.

### 2.2. Valor para tu proyecto

Esta funcionalidad hace que la parte privada sea más valiosa porque:

1. Convierte el backoffice en un sistema autoexplicativo.
2. Permite enseñar el proyecto a colaboradores.
3. Reduce errores de uso.
4. Permite documentar flujos reales dentro de la propia interfaz.
5. Aumenta la percepción de software profesional.
6. Facilita demos comerciales o presentaciones.
7. Sirve como onboarding si en el futuro hay editores o revisores.
8. Permite crear tutoriales por caso de uso.
9. Hace que el proyecto no dependa de documentación externa.
10. Aporta una experiencia similar a SaaS profesionales.

---

## 3. Ubicación dentro del panel privado

### 3.1. Nueva ruta

```txt
/admin/guides
```

### 3.2. Elemento en el sidebar

Añadir al menú privado:

```txt
Guía interactiva
```

Icono recomendado:

```txt
Compass
Map
Route
GraduationCap
Sparkles
```

Si se usa Lucide React:

```tsx
import { Map, Compass, GraduationCap } from "lucide-react";
```

### 3.3. Jerarquía en el menú

Ubicación recomendada:

```txt
Dashboard
Centro editorial
Posts
Noticias
Recursos
Servicios
Consultas
Guía interactiva
Ajustes
Usuarios
Sistema
```

La guía debe estar visible, porque debe funcionar como punto de ayuda permanente.

---

## 4. Librería recomendada

## 4.1. Opción principal: React Joyride

### Por qué elegirla

React Joyride es adecuada porque:

- Está pensada para React.
- Permite definir tours como arrays de pasos.
- Puede resaltar elementos mediante selectores CSS.
- Permite controlar el estado del tour.
- Permite avanzar, retroceder, saltar y finalizar.
- Permite customizar estilos.
- Permite guardar progreso en backend o localStorage.
- Se integra bien con React Router.

### Instalación

```bash
cd apps/web
npm install react-joyride
```

O con pnpm:

```bash
pnpm add react-joyride
```

### Alternativas

#### Driver.js

Ventajas:

- Ligera.
- Muy visual.
- Vanilla JS.
- Buena para highlights.

Desventaja:

- Menos integrada con React que React Joyride.

#### Shepherd.js

Ventajas:

- Muy personalizable.
- Adecuada para tours complejos.
- Compatible con varias tecnologías.

Desventaja:

- Más configuración.

### Recomendación final

Para este proyecto:

```txt
React Joyride como librería principal.
Driver.js como alternativa si se quiere algo más ligero.
```

---

## 5. Concepto funcional de la guía

La guía debe tener dos niveles:

1. **Centro de guías**
2. **Tour interactivo dentro de la interfaz**

---

# 6. Centro de guías

## 6.1. Página `/admin/guides`

Esta página debe mostrar tarjetas de aprendizaje.

### Diseño recomendado

La pantalla debe tener:

- Título: “Centro de aprendizaje”.
- Subtítulo: “Aprende a gestionar tu plataforma paso a paso”.
- Buscador de guías.
- Filtros por área.
- Tarjetas de guías.
- Indicador de progreso.
- Botón “Empezar”.
- Botón “Repetir”.
- Botón “Marcar como completada”.

### Categorías de guías

```txt
Primeros pasos
Contenido
Blog
Noticias
Recursos
Servicios
Consultas
SEO y difusión
LinkedIn
Configuración
Seguridad
Analítica
```

### Ejemplo visual de tarjeta

```txt
┌────────────────────────────────────────────┐
│ Crear y publicar un artículo               │
│ Aprende a crear un post, añadir etiquetas, │
│ revisar SEO y publicarlo en el blog.       │
│                                            │
│ Duración: 5 min                            │
│ Dificultad: básica                         │
│ Progreso: 0/12 pasos                       │
│                                            │
│ [Empezar guía] [Ver pasos]                 │
└────────────────────────────────────────────┘
```

---

## 6.2. Estados de una guía

Cada guía puede tener:

```txt
No iniciada
En progreso
Completada
Repetir recomendada
Actualizada
```

### Modelo conceptual

```ts
type GuideStatus = "not_started" | "in_progress" | "completed" | "updated";
```

---

## 6.3. Datos que debe mostrar cada guía

```ts
interface GuideDefinition {
  id: string;
  title: string;
  description: string;
  category: GuideCategory;
  difficulty: "basic" | "intermediate" | "advanced";
  estimatedMinutes: number;
  routeToStart: string;
  steps: GuideStep[];
}
```

---

# 7. Modelo de datos recomendado

Hay dos posibilidades.

---

## 7.1. Primera versión: guías estáticas en frontend

Para empezar, lo más simple es definir las guías en un archivo TypeScript.

Archivo:

```txt
apps/web/src/guides/guideDefinitions.ts
```

Ventajas:

- Rápido.
- No requiere backend.
- Suficiente para empezar.
- Menos propenso a errores.

Desventajas:

- Para cambiar una guía hay que desplegar frontend.

### Recomendación inicial

Empezar así.

---

## 7.2. Versión avanzada: guías dinámicas desde backend

Más adelante se puede crear un módulo admin para editar las guías.

Modelos:

```ts
interface Guide {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced";
  estimatedMinutes: number;
  routeToStart: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

```ts
interface GuideStep {
  _id: string;
  guideId: string;
  order: number;
  targetSelector: string;
  title: string;
  content: string;
  placement: "top" | "bottom" | "left" | "right" | "center";
  route?: string;
  requiredAction?: "click" | "type" | "navigate" | "none";
  waitForSelector?: string;
}
```

```ts
interface UserGuideProgress {
  _id: string;
  userId: string;
  guideId: string;
  status: "not_started" | "in_progress" | "completed";
  currentStepIndex: number;
  completedAt?: Date;
  updatedAt: Date;
}
```

### Recomendación

Primero estático en frontend. Después, si la funcionalidad crece, pasar a backend.

---

# 8. Arquitectura frontend recomendada

## 8.1. Nuevas carpetas

```txt
apps/web/src/
  guides/
    guideDefinitions.ts
    guide.types.ts
    guideRegistry.ts
  components/
    guides/
      GuideCenterPage.tsx
      GuideCard.tsx
      GuideLauncher.tsx
      GuideProgressBadge.tsx
      GuidedTourProvider.tsx
      TourOverlay.tsx
      TourHelpButton.tsx
  hooks/
    useGuidedTour.ts
    useGuideProgress.ts
  services/
    guideProgressService.ts
  pages/
    admin/
      AdminGuidesPage.tsx
```

---

## 8.2. Tipos TypeScript

Archivo:

```txt
apps/web/src/guides/guide.types.ts
```

```ts
import type { Placement } from "react-joyride";

export type GuideCategory =
  | "getting-started"
  | "content"
  | "blog"
  | "news"
  | "resources"
  | "services"
  | "inquiries"
  | "seo"
  | "linkedin"
  | "settings"
  | "security"
  | "analytics";

export type GuideDifficulty = "basic" | "intermediate" | "advanced";

export interface GuideStep {
  target: string;
  title: string;
  content: string;
  placement?: Placement;
  disableBeacon?: boolean;
  route?: string;
}

export interface GuideDefinition {
  id: string;
  title: string;
  description: string;
  category: GuideCategory;
  difficulty: GuideDifficulty;
  estimatedMinutes: number;
  routeToStart: string;
  steps: GuideStep[];
}
```

---

## 8.3. Definición de guías

Archivo:

```txt
apps/web/src/guides/guideDefinitions.ts
```

Ejemplo:

```ts
import type { GuideDefinition } from "./guide.types";

export const guideDefinitions: GuideDefinition[] = [
  {
    id: "create-blog-post",
    title: "Crear y publicar un artículo de blog",
    description:
      "Aprende a crear un artículo, añadir contenido, clasificarlo, revisar SEO y publicarlo en la web pública.",
    category: "blog",
    difficulty: "basic",
    estimatedMinutes: 6,
    routeToStart: "/admin/posts/new",
    steps: [
      {
        target: '[data-tour="admin-sidebar-posts"]',
        title: "Acceso al módulo de blog",
        content:
          "Desde aquí accedes a la gestión de todos los artículos del blog. Puedes crear, editar, publicar o archivar entradas.",
        placement: "right",
      },
      {
        target: '[data-tour="post-title"]',
        title: "Título del artículo",
        content:
          "Introduce un título claro, específico y útil para médicos investigadores. El título debe anticipar el problema metodológico que resuelve.",
        placement: "bottom",
      },
      {
        target: '[data-tour="post-excerpt"]',
        title: "Extracto",
        content:
          "El extracto resume el valor del artículo. Debe explicar qué aprenderá el lector y por qué le importa.",
        placement: "bottom",
      },
      {
        target: '[data-tour="post-category"]',
        title: "Categoría metodológica",
        content:
          "Clasifica el artículo según su familia principal: causalidad, predicción, reporte, STATA, errores frecuentes o general.",
        placement: "bottom",
      },
      {
        target: '[data-tour="post-tags"]',
        title: "Etiquetas",
        content:
          "Añade etiquetas específicas como DAG, IPTW, calibración, STROBE, TRIPOD+AI o regresión logística. Las etiquetas ayudan a organizar el contenido.",
        placement: "bottom",
      },
      {
        target: '[data-tour="rich-editor"]',
        title: "Editor de contenido",
        content:
          "Aquí escribes el contenido principal. Usa una estructura clara: problema clínico, error habitual, fundamento, ejemplo, interpretación y cómo reportarlo.",
        placement: "top",
      },
      {
        target: '[data-tour="post-seo"]',
        title: "SEO y presentación",
        content:
          "Revisa el título SEO, la descripción, el slug y la imagen destacada para mejorar cómo se verá el artículo al compartirse.",
        placement: "left",
      },
      {
        target: '[data-tour="post-save-draft"]',
        title: "Guardar borrador",
        content:
          "Guarda el artículo como borrador si aún no está listo. Los borradores no aparecen en la web pública.",
        placement: "top",
      },
      {
        target: '[data-tour="post-publish"]',
        title: "Publicar",
        content:
          "Cuando el artículo esté revisado, pulsa publicar. A partir de ese momento aparecerá en la parte pública del blog.",
        placement: "top",
      },
    ],
  },
];
```

---

# 9. Atributos `data-tour`

Para que el tour pueda resaltar elementos, cada componente importante debe tener atributos específicos.

Ejemplo en `PostEditorForm.tsx`:

```tsx
<input
  data-tour="post-title"
  name="title"
  placeholder="Título del artículo"
/>

<textarea
  data-tour="post-excerpt"
  name="excerpt"
  placeholder="Extracto"
/>

<select data-tour="post-category" name="category">
  ...
</select>

<div data-tour="rich-editor">
  <RichTextEditor />
</div>

<button data-tour="post-save-draft">
  Guardar borrador
</button>

<button data-tour="post-publish">
  Publicar
</button>
```

En el sidebar:

```tsx
<NavLink data-tour="admin-sidebar-posts" to="/admin/posts">
  Blog
</NavLink>
```

En dashboard:

```tsx
<div data-tour="dashboard-metrics">...</div>
```

Esto es esencial. Sin `data-tour`, el tour no sabrá qué resaltar.

---

# 10. Proveedor global del tour

## 10.1. Crear `GuidedTourProvider`

Archivo:

```txt
apps/web/src/components/guides/GuidedTourProvider.tsx
```

```tsx
import { createContext, useContext, useMemo, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useNavigate } from "react-router-dom";
import { guideDefinitions } from "../../guides/guideDefinitions";
import type { GuideDefinition } from "../../guides/guide.types";

interface GuidedTourContextValue {
  activeGuide: GuideDefinition | null;
  startGuide: (guideId: string) => void;
  stopGuide: () => void;
}

const GuidedTourContext = createContext<GuidedTourContextValue | null>(null);

export function GuidedTourProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeGuide, setActiveGuide] = useState<GuideDefinition | null>(null);
  const [run, setRun] = useState(false);
  const navigate = useNavigate();

  const steps: Step[] = useMemo(() => {
    if (!activeGuide) return [];

    return activeGuide.steps.map((step) => ({
      target: step.target,
      content: (
        <div>
          <strong>{step.title}</strong>
          <p>{step.content}</p>
        </div>
      ),
      placement: step.placement ?? "bottom",
      disableBeacon: true,
    }));
  }, [activeGuide]);

  function startGuide(guideId: string) {
    const guide = guideDefinitions.find((item) => item.id === guideId);
    if (!guide) return;

    setActiveGuide(guide);
    navigate(guide.routeToStart);
    window.setTimeout(() => {
      setRun(true);
    }, 500);
  }

  function stopGuide() {
    setRun(false);
    setActiveGuide(null);
  }

  function handleJoyrideCallback(data: CallBackProps) {
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(data.status)) {
      stopGuide();

      if (activeGuide) {
        localStorage.setItem(`guide:${activeGuide.id}:completed`, "true");
      }
    }
  }

  return (
    <GuidedTourContext.Provider value={{ activeGuide, startGuide, stopGuide }}>
      {children}

      <Joyride
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "#38bdf8",
            backgroundColor: "#0f172a",
            textColor: "#e5e7eb",
            arrowColor: "#0f172a",
          },
          buttonNext: {
            backgroundColor: "#38bdf8",
            color: "#020617",
          },
          buttonBack: {
            color: "#e5e7eb",
          },
        }}
        locale={{
          back: "Anterior",
          close: "Cerrar",
          last: "Finalizar",
          next: "Siguiente",
          skip: "Saltar",
        }}
      />
    </GuidedTourContext.Provider>
  );
}

export function useGuidedTour() {
  const context = useContext(GuidedTourContext);

  if (!context) {
    throw new Error("useGuidedTour must be used inside GuidedTourProvider");
  }

  return context;
}
```

---

## 10.2. Envolver la aplicación

En `App.tsx` o donde esté el router:

```tsx
import { GuidedTourProvider } from "./components/guides/GuidedTourProvider";

export function App() {
  return (
    <GuidedTourProvider>
      <AppRouter />
    </GuidedTourProvider>
  );
}
```

Si `GuidedTourProvider` necesita `useNavigate`, debe estar dentro del Router. En ese caso:

```tsx
<RouterProvider router={router} />
```

puede requerir mover el provider dentro del layout admin.

Recomendación práctica:

- Colocar `GuidedTourProvider` dentro de `AdminLayout`.
- Así el tour solo existe en la zona privada.

---

# 11. Página de centro de guías

## 11.1. `AdminGuidesPage.tsx`

Archivo:

```txt
apps/web/src/pages/admin/AdminGuidesPage.tsx
```

```tsx
import { guideDefinitions } from "../../guides/guideDefinitions";
import { useGuidedTour } from "../../components/guides/GuidedTourProvider";

export function AdminGuidesPage() {
  const { startGuide } = useGuidedTour();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Centro de aprendizaje
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          Aprende a gestionar la plataforma paso a paso
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Selecciona una guía y el sistema te acompañará por la interfaz,
          resaltando botones, campos y secciones para que aprendas cada flujo
          real de trabajo.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {guideDefinitions.map((guide) => {
          const completed =
            localStorage.getItem(`guide:${guide.id}:completed`) === "true";

          return (
            <article
              key={guide.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {guide.category}
                </span>
                <span className="text-xs text-slate-400">
                  {guide.estimatedMinutes} min
                </span>
              </div>

              <h2 className="text-xl font-bold text-white">{guide.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {guide.description}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {completed ? "Completada" : "No iniciada"}
                </span>

                <button
                  onClick={() => startGuide(guide.id)}
                  className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300"
                >
                  {completed ? "Repetir guía" : "Empezar guía"}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
```

---

# 12. Ruta privada

En `AdminRoutes` o router principal:

```tsx
{
  path: "guides",
  element: <AdminGuidesPage />
}
```

En sidebar:

```tsx
<NavLink to="/admin/guides" data-tour="admin-sidebar-guides">
  Guía interactiva
</NavLink>
```

---

# 13. Casos de uso que deben tener guía

A continuación se describen las guías recomendadas para cubrir cada flujo importante del proyecto.

---

## 13.1. Guía 1 — Primer recorrido por el panel privado

### Objetivo

Que el usuario entienda la estructura general del backoffice.

### Ruta inicial

```txt
/admin
```

### Pasos

1. **Dashboard**
   - Selector: `[data-tour="dashboard-home"]`
   - Explica que es la vista general del sistema.

2. **Métricas**
   - Selector: `[data-tour="dashboard-metrics"]`
   - Explica posts, noticias, recursos, consultas.

3. **Últimas consultas**
   - Selector: `[data-tour="dashboard-latest-inquiries"]`
   - Explica cómo detectar nuevos contactos.

4. **Acciones rápidas**
   - Selector: `[data-tour="dashboard-quick-actions"]`
   - Explica accesos para crear contenido.

5. **Sidebar**
   - Selector: `[data-tour="admin-sidebar"]`
   - Explica navegación privada.

6. **Topbar**
   - Selector: `[data-tour="admin-topbar"]`
   - Explica usuario, salir, búsqueda y notificaciones.

7. **Guía interactiva**
   - Selector: `[data-tour="admin-sidebar-guides"]`
   - Explica que puede volver aquí para aprender cualquier flujo.

### Prioridad

Muy alta.

---

## 13.2. Guía 2 — Crear y publicar un blog

### Objetivo

Aprender el flujo completo de creación de artículo.

### Ruta inicial

```txt
/admin/posts/new
```

### Pasos

1. Ir al módulo blog.
2. Pulsar nuevo post.
3. Escribir título.
4. Escribir extracto.
5. Seleccionar categoría.
6. Añadir tags.
7. Redactar contenido.
8. Añadir imagen destacada.
9. Revisar SEO.
10. Asociar CTA.
11. Guardar borrador.
12. Publicar.
13. Ver en público.

### Selectores sugeridos

```txt
[data-tour="admin-sidebar-posts"]
[data-tour="posts-new-button"]
[data-tour="post-title"]
[data-tour="post-excerpt"]
[data-tour="post-category"]
[data-tour="post-tags"]
[data-tour="rich-editor"]
[data-tour="post-cover-image"]
[data-tour="post-seo"]
[data-tour="post-cta"]
[data-tour="post-save-draft"]
[data-tour="post-publish"]
[data-tour="post-view-public"]
```

### Texto de guía

Esta guía debe insistir en:

- El título debe ser clínicamente claro.
- El extracto debe explicar el valor.
- La categoría debe separar causalidad, predicción, reporte, STATA o errores.
- Las etiquetas ayudan a construir clusters.
- El contenido debe tener ejemplo clínico.
- El SEO mejora la difusión.
- El CTA conecta contenido con servicio.

### Prioridad

Muy alta.

---

## 13.3. Guía 3 — Crear una noticia

### Objetivo

Aprender a publicar noticias o actualizaciones.

### Ruta inicial

```txt
/admin/news/new
```

### Pasos

1. Entrar en noticias.
2. Crear noticia.
3. Añadir título.
4. Añadir extracto.
5. Escribir contenido.
6. Añadir fuente.
7. Añadir enlace externo.
8. Marcar destacada si procede.
9. Publicar.
10. Ver noticia pública.

### Selectores

```txt
[data-tour="admin-sidebar-news"]
[data-tour="news-new-button"]
[data-tour="news-title"]
[data-tour="news-excerpt"]
[data-tour="news-content"]
[data-tour="news-source-name"]
[data-tour="news-source-url"]
[data-tour="news-featured"]
[data-tour="news-publish"]
[data-tour="news-view-public"]
```

### Prioridad

Alta.

---

## 13.4. Guía 4 — Subir un recurso descargable

### Objetivo

Aprender a crear recursos como checklists, guías, plantillas o bibliografía.

### Ruta inicial

```txt
/admin/resources/new
```

### Pasos

1. Entrar en recursos.
2. Crear recurso.
3. Seleccionar tipo.
4. Escribir título.
5. Añadir descripción.
6. Subir archivo o pegar URL.
7. Definir si es público o borrador.
8. Publicar.
9. Ver recurso en la web pública.

### Selectores

```txt
[data-tour="admin-sidebar-resources"]
[data-tour="resources-new-button"]
[data-tour="resource-type"]
[data-tour="resource-title"]
[data-tour="resource-description"]
[data-tour="resource-file"]
[data-tour="resource-status"]
[data-tour="resource-publish"]
[data-tour="resource-view-public"]
```

### Prioridad

Alta.

---

## 13.5. Guía 5 — Crear un servicio profesional

### Objetivo

Aprender a publicar o editar servicios ofrecidos.

### Ruta inicial

```txt
/admin/services/new
```

### Pasos

1. Entrar en servicios.
2. Crear servicio.
3. Añadir título.
4. Añadir descripción corta.
5. Añadir descripción completa.
6. Añadir entregables.
7. Definir público objetivo.
8. Publicar.
9. Ver servicio en web pública.

### Selectores

```txt
[data-tour="admin-sidebar-services"]
[data-tour="services-new-button"]
[data-tour="service-title"]
[data-tour="service-short-description"]
[data-tour="service-full-description"]
[data-tour="service-deliverables"]
[data-tour="service-target-audience"]
[data-tour="service-publish"]
[data-tour="service-view-public"]
```

### Prioridad

Alta.

---

## 13.6. Guía 6 — Gestionar consultas recibidas

### Objetivo

Aprender a revisar contactos y convertirlos en oportunidades.

### Ruta inicial

```txt
/admin/inquiries
```

### Pasos

1. Entrar en consultas.
2. Ver listado.
3. Filtrar por estado.
4. Abrir consulta.
5. Leer datos del proyecto.
6. Añadir nota interna.
7. Cambiar estado.
8. Definir próxima acción.
9. Archivar si no procede.

### Selectores

```txt
[data-tour="admin-sidebar-inquiries"]
[data-tour="inquiries-table"]
[data-tour="inquiries-filter-status"]
[data-tour="inquiry-open-button"]
[data-tour="inquiry-detail"]
[data-tour="inquiry-internal-notes"]
[data-tour="inquiry-status"]
[data-tour="inquiry-next-action"]
[data-tour="inquiry-save"]
```

### Prioridad

Muy alta.

---

## 13.7. Guía 7 — Modificar la página pública desde ajustes

### Objetivo

Aprender a modificar textos públicos como hero, sobre mí, email y enlaces.

### Ruta inicial

```txt
/admin/settings
```

### Pasos

1. Entrar en ajustes.
2. Editar título principal.
3. Editar subtítulo.
4. Editar texto sobre mí.
5. Cambiar email de contacto.
6. Añadir LinkedIn.
7. Guardar.
8. Ver cambios en público.

### Selectores

```txt
[data-tour="admin-sidebar-settings"]
[data-tour="settings-hero-title"]
[data-tour="settings-hero-subtitle"]
[data-tour="settings-about-text"]
[data-tour="settings-contact-email"]
[data-tour="settings-linkedin-url"]
[data-tour="settings-save"]
[data-tour="settings-view-public"]
```

### Prioridad

Alta.

---

## 13.8. Guía 8 — Usar la biblioteca de medios

### Objetivo

Aprender a subir, localizar y reutilizar imágenes y documentos.

### Ruta inicial

```txt
/admin/media
```

### Pasos

1. Entrar en biblioteca de medios.
2. Subir archivo.
3. Ver vista grid/lista.
4. Filtrar por tipo.
5. Añadir alt text.
6. Copiar URL.
7. Insertar en post.
8. Eliminar archivo si no se usa.

### Selectores

```txt
[data-tour="admin-sidebar-media"]
[data-tour="media-upload-button"]
[data-tour="media-grid"]
[data-tour="media-filter-type"]
[data-tour="media-alt-text"]
[data-tour="media-copy-url"]
[data-tour="media-insert-button"]
[data-tour="media-delete-button"]
```

### Prioridad

Muy alta si se implementa la pantalla de medios.

---

## 13.9. Guía 9 — Revisar SEO antes de publicar

### Objetivo

Aprender a preparar el contenido para buscadores y redes.

### Ruta inicial

```txt
/admin/posts/:id/edit
```

### Pasos

1. Abrir pestaña SEO.
2. Revisar slug.
3. Escribir SEO title.
4. Escribir meta description.
5. Añadir imagen Open Graph.
6. Revisar preview.
7. Comprobar indicadores.
8. Guardar.

### Selectores

```txt
[data-tour="post-seo-tab"]
[data-tour="post-slug"]
[data-tour="post-seo-title"]
[data-tour="post-seo-description"]
[data-tour="post-og-image"]
[data-tour="post-seo-preview"]
[data-tour="post-seo-score"]
[data-tour="post-save"]
```

### Prioridad

Alta.

---

## 13.10. Guía 10 — Crear contenido para LinkedIn desde un artículo

### Objetivo

Aprender a convertir un post del blog en una publicación de LinkedIn.

### Ruta inicial

```txt
/admin/posts/:id/edit
```

### Pasos

1. Abrir pestaña distribución.
2. Revisar resumen para LinkedIn.
3. Editar texto.
4. Añadir hashtags.
5. Generar enlace UTM.
6. Copiar publicación.
7. Abrir LinkedIn.
8. Marcar como distribuido.

### Selectores

```txt
[data-tour="post-distribution-tab"]
[data-tour="linkedin-draft"]
[data-tour="linkedin-hashtags"]
[data-tour="linkedin-utm"]
[data-tour="linkedin-copy"]
[data-tour="linkedin-open"]
[data-tour="linkedin-mark-published"]
```

### Prioridad

Muy alta para difusión.

---

## 13.11. Guía 11 — Usar el checklist editorial

### Objetivo

Aprender a revisar la calidad del artículo antes de publicar.

### Ruta inicial

```txt
/admin/posts/:id/edit
```

### Pasos

1. Abrir checklist editorial.
2. Revisar título.
3. Revisar extracto.
4. Revisar categoría/tags.
5. Revisar referencias.
6. Revisar CTA.
7. Revisar ejemplo clínico.
8. Revisar SEO.
9. Ver porcentaje de completitud.
10. Publicar.

### Selectores

```txt
[data-tour="post-editorial-checklist-tab"]
[data-tour="checklist-title"]
[data-tour="checklist-excerpt"]
[data-tour="checklist-taxonomy"]
[data-tour="checklist-references"]
[data-tour="checklist-cta"]
[data-tour="checklist-clinical-example"]
[data-tour="checklist-seo"]
[data-tour="checklist-completion-score"]
[data-tour="post-publish"]
```

### Prioridad

Muy alta.

---

## 13.12. Guía 12 — Usar el calendario editorial

### Objetivo

Aprender a planificar publicaciones.

### Ruta inicial

```txt
/admin/calendar
```

### Pasos

1. Ver calendario mensual.
2. Filtrar por tipo de contenido.
3. Crear contenido desde fecha.
4. Arrastrar publicación.
5. Programar.
6. Ver publicaciones pendientes.

### Selectores

```txt
[data-tour="calendar-view"]
[data-tour="calendar-filter-type"]
[data-tour="calendar-create-item"]
[data-tour="calendar-draggable-item"]
[data-tour="calendar-schedule-button"]
[data-tour="calendar-upcoming-list"]
```

### Prioridad

Alta si se implementa calendario.

---

## 13.13. Guía 13 — Crear una propuesta desde una consulta

### Objetivo

Aprender a transformar una consulta en una propuesta profesional.

### Ruta inicial

```txt
/admin/inquiries
```

### Pasos

1. Abrir consulta.
2. Revisar necesidad.
3. Pulsar crear propuesta.
4. Elegir plantilla.
5. Definir alcance.
6. Añadir entregables.
7. Añadir plazo.
8. Guardar propuesta.
9. Exportar o enviar.

### Selectores

```txt
[data-tour="inquiry-detail"]
[data-tour="inquiry-create-proposal"]
[data-tour="proposal-template"]
[data-tour="proposal-scope"]
[data-tour="proposal-deliverables"]
[data-tour="proposal-timeline"]
[data-tour="proposal-save"]
[data-tour="proposal-export"]
```

### Prioridad

Media-alta.

---

## 13.14. Guía 14 — Crear una serie de artículos

### Objetivo

Aprender a organizar contenido como currícula.

### Ruta inicial

```txt
/admin/series/new
```

### Pasos

1. Crear serie.
2. Añadir título.
3. Añadir descripción.
4. Seleccionar posts.
5. Ordenar posts.
6. Publicar serie.
7. Ver serie pública.

### Selectores

```txt
[data-tour="admin-sidebar-series"]
[data-tour="series-new-button"]
[data-tour="series-title"]
[data-tour="series-description"]
[data-tour="series-post-selector"]
[data-tour="series-order-list"]
[data-tour="series-publish"]
[data-tour="series-view-public"]
```

### Prioridad

Media-alta.

---

## 13.15. Guía 15 — Crear una revisión metodológica de artículo

### Objetivo

Aprender a crear una entrada de revista metodológica comentada.

### Ruta inicial

```txt
/admin/journal-club/new
```

### Pasos

1. Añadir título del artículo.
2. Añadir revista/año.
3. Añadir DOI o URL.
4. Escribir pregunta clínica.
5. Describir diseño.
6. Resumir análisis.
7. Añadir fortalezas.
8. Añadir limitaciones.
9. Añadir lección metodológica.
10. Publicar.

### Selectores

```txt
[data-tour="journal-title"]
[data-tour="journal-meta"]
[data-tour="journal-doi"]
[data-tour="journal-question"]
[data-tour="journal-design"]
[data-tour="journal-analysis"]
[data-tour="journal-strengths"]
[data-tour="journal-limitations"]
[data-tour="journal-lesson"]
[data-tour="journal-publish"]
```

### Prioridad

Media-alta.

---

## 13.16. Guía 16 — Gestionar usuarios y roles

### Objetivo

Aprender a crear usuarios internos y limitar permisos.

### Ruta inicial

```txt
/admin/users
```

### Pasos

1. Entrar en usuarios.
2. Ver listado.
3. Crear usuario.
4. Elegir rol.
5. Guardar.
6. Desactivar usuario.
7. Revisar último acceso.

### Selectores

```txt
[data-tour="admin-sidebar-users"]
[data-tour="users-table"]
[data-tour="users-new-button"]
[data-tour="user-name"]
[data-tour="user-email"]
[data-tour="user-role"]
[data-tour="user-save"]
[data-tour="user-disable"]
[data-tour="user-last-login"]
```

### Prioridad

Alta.

---

## 13.17. Guía 17 — Interpretar el dashboard

### Objetivo

Aprender a usar métricas internas.

### Ruta inicial

```txt
/admin
```

### Pasos

1. Ver posts publicados.
2. Ver consultas nuevas.
3. Ver recursos publicados.
4. Ver actividad reciente.
5. Ver gráficos.
6. Ir a acción recomendada.

### Selectores

```txt
[data-tour="dashboard-posts-stat"]
[data-tour="dashboard-inquiries-stat"]
[data-tour="dashboard-resources-stat"]
[data-tour="dashboard-activity"]
[data-tour="dashboard-chart"]
[data-tour="dashboard-next-action"]
```

### Prioridad

Media.

---

# 14. Soporte para tours entre rutas

Algunos flujos necesitan pasar de una ruta a otra.

Ejemplo:

```txt
Crear post → publicar → ver en público
```

React Joyride no siempre gestiona navegación compleja de forma automática si el elemento del siguiente paso aún no existe.

## 14.1. Estrategia sencilla

Dividir los tours largos en fases:

```txt
Guía crear blog — fase privada
Guía comprobar blog público — fase pública
```

## 14.2. Estrategia avanzada

Añadir al `GuideStep` una propiedad:

```ts
route?: string;
```

En el callback de Joyride:

- Antes de avanzar a un paso, comprobar si tiene route.
- Si la route es diferente, navegar.
- Esperar a que exista el selector.
- Continuar.

### Pseudocódigo

```ts
if (nextStep.route && location.pathname !== nextStep.route) {
  navigate(nextStep.route);
  waitForElement(nextStep.target);
}
```

Función:

```ts
function waitForElement(selector: string, timeout = 3000) {
  return new Promise<void>((resolve, reject) => {
    const start = Date.now();

    const interval = window.setInterval(() => {
      if (document.querySelector(selector)) {
        window.clearInterval(interval);
        resolve();
      }

      if (Date.now() - start > timeout) {
        window.clearInterval(interval);
        reject(new Error(`Element not found: ${selector}`));
      }
    }, 100);
  });
}
```

## 14.3. Recomendación

Primera versión:

- Tours dentro de una sola zona/página.
- Evitar flujos multi-ruta complejos.

Segunda versión:

- Soporte multi-ruta.

---

# 15. Botón de ayuda contextual

Además del centro de guías, cada página privada debería tener un botón:

```txt
¿Necesitas ayuda?
```

O un icono flotante:

```txt
?
```

Al pulsar, muestra las guías disponibles para esa página.

Ejemplo en `/admin/posts`:

```txt
Guías disponibles:
- Crear y publicar un artículo.
- Revisar SEO de un artículo.
- Usar checklist editorial.
- Crear post para LinkedIn.
```

## 15.1. Componente

```txt
TourHelpButton.tsx
```

Props:

```ts
interface TourHelpButtonProps {
  guideIds: string[];
}
```

Uso:

```tsx
<TourHelpButton
  guideIds={["create-blog-post", "post-seo", "linkedin-from-post"]}
/>
```

---

# 16. Persistencia del progreso

## 16.1. Versión simple: localStorage

Guardar:

```txt
guide:create-blog-post:completed = true
guide:create-blog-post:lastCompletedAt = 2026-05-11
```

Ventajas:

- Rápido.
- Sin backend.
- Suficiente para usuario único.

Desventajas:

- Solo por navegador.
- No compartido entre dispositivos.

## 16.2. Versión profesional: backend

Endpoint:

```txt
GET    /api/admin/guides/progress
PATCH  /api/admin/guides/:guideId/progress
```

Modelo:

```ts
interface UserGuideProgress {
  userId: string;
  guideId: string;
  status: "not_started" | "in_progress" | "completed";
  currentStepIndex: number;
  completedAt?: Date;
}
```

Recomendación:

- Empezar con localStorage.
- Pasar a backend cuando haya varios usuarios.

---

# 17. Modo demo y modo real

La guía debe poder funcionar en dos modos.

## 17.1. Modo aprendizaje real

El usuario interactúa con datos reales.

Ejemplo:

- Crea un post real.
- Guarda un borrador real.
- Publica si quiere.

## 17.2. Modo demo seguro

El sistema crea datos temporales o de prueba.

Ejemplo:

```txt
Post demo: "Artículo de prueba — Guía interactiva"
```

Al finalizar, pregunta:

```txt
¿Quieres conservar este contenido de prueba o eliminarlo?
```

### Recomendación

Para evitar errores, añadir modo demo a los flujos críticos:

- Crear post.
- Crear noticia.
- Crear recurso.
- Crear servicio.

---

# 18. Seguridad y prevención de errores

## 18.1. No ejecutar acciones peligrosas automáticamente

La guía no debe publicar, eliminar ni enviar formularios automáticamente.

Debe explicar y resaltar, pero la acción final debe hacerla el usuario.

## 18.2. Confirmaciones

Si el tour enseña una acción sensible:

- Eliminar post.
- Publicar.
- Cambiar ajustes.
- Crear usuario.
- Desactivar usuario.

Debe aparecer una advertencia:

```txt
Esta acción modifica datos reales. Hazla solo si estás seguro.
```

## 18.3. Rutas protegidas

Las guías solo deben estar disponibles para usuarios autenticados.

## 18.4. Roles

Algunas guías solo deben mostrarse a `admin`.

Ejemplo:

- Usuarios.
- Ajustes.
- Auditoría.
- Sistema.

---

# 19. Diseño visual del tour

## 19.1. Estilo

Debe mantener la estética tecnológica del proyecto:

- Fondo oscuro.
- Borde cyan.
- Botones con gradiente.
- Texto claro.
- Tarjetas redondeadas.
- Numeración visible.

## 19.2. Tooltip recomendado

Contenido:

```txt
Paso 3 de 12
Título claro
Explicación breve
[Anterior] [Siguiente]
[Saltar guía]
```

## 19.3. Reglas de contenido

Cada paso debe ser:

- Corto.
- Claro.
- Accionable.
- Relacionado con un único elemento.
- Sin explicar demasiadas cosas a la vez.

Mal ejemplo:

```txt
Aquí puedes gestionar todos los contenidos, publicar, archivar, revisar SEO, cambiar tags, subir imágenes y modificar el estado editorial.
```

Buen ejemplo:

```txt
Este botón crea un nuevo artículo. Úsalo cuando quieras iniciar una entrada del blog desde cero.
```

---

# 20. Métricas de uso de guías

Más adelante se puede medir:

- Guías iniciadas.
- Guías completadas.
- Guías abandonadas.
- Paso donde se abandona.
- Funcionalidades más consultadas.
- Usuarios que completaron onboarding.

Modelo:

```ts
interface GuideAnalyticsEvent {
  _id: string;
  userId: string;
  guideId: string;
  event: "started" | "step_completed" | "skipped" | "completed";
  stepIndex?: number;
  createdAt: Date;
}
```

Esto ayuda a saber qué partes del backoffice son más difíciles.

---

# 21. Tests recomendados

## 21.1. Unit tests

Probar:

- Render de `AdminGuidesPage`.
- Que aparecen las guías.
- Que el botón llama a `startGuide`.
- Que se guarda completado en localStorage.
- Que no se rompe si una guía no existe.

## 21.2. Integration tests

Probar:

- La ruta `/admin/guides` está protegida.
- Usuario autenticado ve guías.
- Usuario no autenticado redirige a login.

## 21.3. E2E Playwright

### Test 1: abrir centro de guías

```ts
test("admin can open guide center", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/guides");

  await expect(page.getByText("Centro de aprendizaje")).toBeVisible();
  await expect(page.getByText("Crear y publicar un artículo")).toBeVisible();
});
```

### Test 2: iniciar guía de blog

```ts
test("admin can start blog creation guide", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/guides");

  await page.click("text=Crear y publicar un artículo");
  await page.click("text=Empezar guía");

  await expect(page).toHaveURL(/\/admin\/posts\/new/);
  await expect(page.getByText("Título del artículo")).toBeVisible();
});
```

### Test 3: completar guía

```ts
test("admin can complete guide", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/guides");

  await page.click('[data-testid="start-guide-create-blog-post"]');

  for (let i = 0; i < 12; i++) {
    const next = page.getByRole("button", { name: /siguiente|finalizar/i });
    if (await next.isVisible()) {
      await next.click();
    }
  }

  await expect(page.getByText("Completada")).toBeVisible();
});
```

---

# 22. Criterios de aceptación

La funcionalidad estará correcta cuando:

## 22.1. Centro de guías

- Existe ruta `/admin/guides`.
- Solo usuarios autenticados pueden acceder.
- Se muestran tarjetas de guías.
- Se puede buscar o filtrar por categoría.
- Cada guía muestra duración, dificultad y estado.
- Se puede iniciar una guía.

## 22.2. Tour interactivo

- Al iniciar la guía navega a la ruta correcta.
- Se oscurece la pantalla.
- Se resalta el elemento correcto.
- Aparece tooltip con explicación.
- Existen botones Anterior/Siguiente/Saltar/Finalizar.
- Al finalizar, se marca como completada.
- El usuario puede repetir la guía.

## 22.3. Integración visual

- El tour respeta el diseño oscuro del proyecto.
- Funciona en desktop.
- Funciona en mobile al menos para flujos básicos.
- No tapa elementos críticos sin permitir avanzar.
- No rompe formularios.

## 22.4. Seguridad

- No ejecuta acciones destructivas automáticamente.
- No muestra guías admin a usuarios sin permisos.
- No permite acceder a rutas privadas sin login.

---

# 23. Roadmap de implementación

## Fase 1 — Guías básicas estáticas

Objetivo:

- Instalar React Joyride.
- Crear `GuidedTourProvider`.
- Crear `/admin/guides`.
- Añadir 5 guías iniciales.
- Añadir `data-tour` a elementos clave.
- Guardar progreso en localStorage.

Guías iniciales:

1. Primer recorrido por admin.
2. Crear blog.
3. Crear noticia.
4. Crear recurso.
5. Gestionar consultas.

Duración estimada de desarrollo:

```txt
1-2 días
```

Prioridad:

```txt
Muy alta
```

---

## Fase 2 — Guías completas del backoffice

Añadir guías:

6. Crear servicio.
7. Ajustes públicos.
8. SEO.
9. LinkedIn.
10. Checklist editorial.
11. Dashboard.
12. Usuarios.
13. Medios.

Duración estimada:

```txt
2-4 días
```

---

## Fase 3 — Ayuda contextual por página

Añadir:

- Botón flotante de ayuda.
- Guías sugeridas según ruta.
- Reiniciar guía desde cualquier módulo.

Duración estimada:

```txt
1-2 días
```

---

## Fase 4 — Progreso en backend

Añadir:

- Modelo `UserGuideProgress`.
- Endpoints de progreso.
- Historial por usuario.
- Métricas de guías.

Duración estimada:

```txt
2-3 días
```

---

## Fase 5 — Editor interno de guías

Añadir:

- CRUD de guías.
- CRUD de pasos.
- Activar/desactivar guía.
- Reordenar pasos.
- Vista previa.

Duración estimada:

```txt
4-7 días
```

---

# 24. Guías mínimas que yo implementaría primero

Si hay que priorizar, implementaría estas 8:

1. Primer recorrido por el panel privado.
2. Crear y publicar un blog.
3. Crear una noticia.
4. Subir un recurso.
5. Gestionar una consulta.
6. Editar ajustes públicos.
7. Revisar SEO de un post.
8. Usar checklist editorial.

Estas cubren la mayoría del valor inicial.

---

# 25. Ajustes necesarios en componentes existentes

## 25.1. AdminLayout

Añadir:

```tsx
data-tour="admin-layout"
```

## 25.2. Sidebar

Añadir:

```tsx
data-tour="admin-sidebar"
data-tour="admin-sidebar-posts"
data-tour="admin-sidebar-news"
data-tour="admin-sidebar-resources"
data-tour="admin-sidebar-services"
data-tour="admin-sidebar-inquiries"
data-tour="admin-sidebar-settings"
data-tour="admin-sidebar-users"
data-tour="admin-sidebar-guides"
```

## 25.3. Topbar

Añadir:

```tsx
data-tour="admin-topbar"
data-tour="admin-user-menu"
data-tour="admin-logout"
```

## 25.4. Dashboard

Añadir:

```tsx
data-tour="dashboard-home"
data-tour="dashboard-metrics"
data-tour="dashboard-latest-inquiries"
data-tour="dashboard-quick-actions"
data-tour="dashboard-chart"
```

## 25.5. PostEditorForm

Añadir:

```tsx
data-tour="post-title"
data-tour="post-excerpt"
data-tour="post-category"
data-tour="post-tags"
data-tour="rich-editor"
data-tour="post-cover-image"
data-tour="post-seo"
data-tour="post-save-draft"
data-tour="post-publish"
```

## 25.6. ContentTable

Añadir:

```tsx
data-tour="content-table"
data-tour="content-search"
data-tour="content-status-filter"
data-tour="content-edit-button"
data-tour="content-delete-button"
```

---

# 26. Ejemplo completo de guía de creación de blog

```ts
export const createBlogPostGuide = {
  id: "create-blog-post",
  title: "Crear y publicar un artículo de blog",
  description:
    "Aprende a crear un artículo, añadir contenido, clasificarlo, revisar SEO y publicarlo en la web pública.",
  category: "blog",
  difficulty: "basic",
  estimatedMinutes: 6,
  routeToStart: "/admin/posts/new",
  steps: [
    {
      target: '[data-tour="post-title"]',
      title: "Título del artículo",
      content:
        "Escribe un título claro y específico. Debe explicar el problema metodológico o clínico que resolverá el artículo.",
      placement: "bottom",
    },
    {
      target: '[data-tour="post-excerpt"]',
      title: "Extracto",
      content:
        "Resume el valor del artículo en pocas líneas. Este texto aparecerá en el listado público del blog.",
      placement: "bottom",
    },
    {
      target: '[data-tour="post-category"]',
      title: "Categoría",
      content:
        "Selecciona la familia metodológica principal: causalidad, predicción, reporte, STATA o errores frecuentes.",
      placement: "bottom",
    },
    {
      target: '[data-tour="post-tags"]',
      title: "Etiquetas",
      content:
        "Añade conceptos concretos. Por ejemplo: DAG, IPTW, calibración, TRIPOD+AI, STROBE o splines.",
      placement: "bottom",
    },
    {
      target: '[data-tour="rich-editor"]',
      title: "Contenido principal",
      content:
        "Redacta el artículo. Se recomienda usar una estructura estable: problema, error habitual, explicación, ejemplo clínico, interpretación y cómo reportarlo.",
      placement: "top",
    },
    {
      target: '[data-tour="post-seo"]',
      title: "SEO",
      content:
        "Revisa cómo se verá el artículo en buscadores y redes. Un buen SEO ayuda a que el contenido llegue a más médicos investigadores.",
      placement: "left",
    },
    {
      target: '[data-tour="post-save-draft"]',
      title: "Guardar borrador",
      content:
        "Guarda el contenido sin hacerlo público. Es útil cuando todavía falta revisión, referencias o SEO.",
      placement: "top",
    },
    {
      target: '[data-tour="post-publish"]',
      title: "Publicar",
      content:
        "Cuando todo esté revisado, publica el artículo. Desde ese momento aparecerá en la web pública.",
      placement: "top",
    },
  ],
};
```

---

# 27. Buenas prácticas para escribir las guías

## 27.1. Cada paso debe responder a tres preguntas

1. ¿Qué es esto?
2. ¿Para qué sirve?
3. ¿Qué debo hacer aquí?

Ejemplo:

```txt
Este campo define la categoría principal del artículo.
Sirve para organizar el blog y ayudar al lector a encontrar contenidos similares.
Selecciona la categoría que mejor represente el objetivo metodológico del post.
```

## 27.2. No saturar

Cada tooltip debe tener entre 1 y 4 frases.

## 27.3. Usar lenguaje de acción

Preferir:

```txt
Pulsa aquí para guardar el borrador.
```

Evitar:

```txt
Este elemento puede ser utilizado para producir una acción de persistencia temporal del contenido.
```

## 27.4. Adaptar el tono a ti

El tono debe ser:

- profesional,
- claro,
- didáctico,
- clínico,
- tecnológico,
- directo.

---

# 28. Posibles ampliaciones futuras

## 28.1. Guías con vídeo

Cada guía podría tener:

- vídeo corto,
- GIF,
- captura,
- texto.

## 28.2. Guías con checklist final

Al terminar:

```txt
Has aprendido a crear un post.
Checklist:
- Crear título.
- Añadir extracto.
- Seleccionar categoría.
- Escribir contenido.
- Revisar SEO.
- Publicar.
```

## 28.3. Certificado interno de onboarding

Para nuevos colaboradores:

```txt
Onboarding completado: editor de contenidos
```

## 28.4. Guías condicionales

Mostrar guías según rol:

- Admin.
- Editor.
- Revisor.

## 28.5. Guías activadas automáticamente

Ejemplo:

- Primer login: mostrar recorrido general.
- Primera vez en posts: mostrar guía de blog.
- Primera vez en consultas: mostrar guía de CRM.

---

# 29. Conclusión

Esta funcionalidad encaja perfectamente con el estado actual del proyecto.

Tu aplicación ya tiene muchas áreas: blog, noticias, recursos, servicios, consultas, usuarios, medios y ajustes. Cuanto más crezca el backoffice, más importante será que el propio sistema enseñe cómo se usa.

La recomendación es implementar un **Centro de aprendizaje privado** con tours interactivos usando React Joyride.

La primera versión debe ser sencilla:

- guías definidas en frontend,
- pasos con `data-tour`,
- progreso en localStorage,
- 5-8 guías prioritarias,
- botón para iniciar la guía desde `/admin/guides`.

Después se puede evolucionar hacia:

- progreso por usuario en backend,
- guías editables desde admin,
- métricas de uso,
- guías por rol,
- onboarding automático,
- ayuda contextual por página.

Esta funcionalidad hará que la zona privada del proyecto parezca mucho más profesional, útil y madura, además de facilitar que tú o cualquier colaborador podáis aprender cada flujo sin depender de documentación externa.
