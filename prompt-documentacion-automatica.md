# Prompt para crear documentación automática de formaciones

Usa este formato siempre que quieras crear una formación compatible con el importador automático del software Doctor Tébar.

El documento debe escribirse en **Markdown** y debe respetar exactamente la siguiente estructura.

---

## Estructura general

Toda formación debe empezar con un bloque YAML entre tres guiones:

```markdown
---
type: formation
version: 1
title: "Título de la formación"
description: "Descripción general de la formación"
status: "draft"
---
```

Después deben añadirse los bloques y sus temas.

---

## Campos YAML

### Campos obligatorios

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `type` | Siempre debe ser `formation` | `type: formation` |
| `version` | Siempre debe ser `1` | `version: 1` |
| `title` | Título completo de la formación | `title: "Modelos predictivos clínicos"` |
| `description` | Descripción general del curso | `description: "Curso introductorio sobre..."` |

### Campos opcionales

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `status` | Estado inicial (`draft`, `published`, `archived`) | `status: "draft"` |
| `author` | Nombre del autor | `author: "Eduardo Tebar"` |
| `category` | Categoría temática | `category: "Bioestadística médica"` |
| `tags` | Etiquetas (solo referencia, no se importan) | `tags: ["modelos", "clínica"]` |
| `estimated_duration` | Duración estimada | `estimated_duration: "20 horas"` |
| `language` | Idioma | `language: "es"` |

---

## Bloques

Cada bloque debe comenzar con un encabezado de nivel 1 con el prefijo exacto `Bloque:`:

```markdown
# Bloque: Nombre del bloque
```

Inmediatamente después, el bloque debe incluir su descripción con este encabezado exacto:

```markdown
## Descripción del bloque

Texto descriptivo del bloque. Puede ocupar varios párrafos.
```

### Reglas para bloques

- El prefijo `# Bloque:` es obligatorio y exacto (respeta mayúsculas/minúsculas)
- Debe existir `## Descripción del bloque` después de cada bloque
- El bloque debe contener al menos un tema
- El orden en el documento es el orden final en la formación

---

## Temas

Cada tema debe comenzar con un encabezado de nivel 2 con el prefijo exacto `Tema:`:

```markdown
## Tema: Nombre del tema
```

Cada tema debe incluir obligatoriamente:

```markdown
### Descripción del tema

Texto breve que resume el tema. Una o dos frases.

### Contenido

Contenido completo del tema. Puede ocupar varios párrafos y ser tan extenso como necesites.
```

### Reglas para temas

- El prefijo `## Tema:` es obligatorio y exacto
- Cada tema necesita `### Descripción del tema` y `### Contenido`
- Los temas siempre van dentro de un bloque (nunca antes del primer bloque)
- El contenido puede ser tan largo como necesites (párrafos, listas, ejemplos, etc.)
- No uses `# Bloque:`, `## Tema:`, `## Descripción del bloque`, `### Descripción del tema` ni `### Contenido` dentro del contenido de un tema, ya que el parser los interpretaría como nuevas secciones

---

## Errores habituales a evitar

| Error | Descripción |
|-------|-------------|
| Tema sin bloque previo | Escribir `## Tema:` antes del primer `# Bloque:` |
| Bloque sin descripción | Omitir `## Descripción del bloque` |
| Bloque sin temas | Un `# Bloque:` sin ningún `## Tema:` después |
| Tema sin descripción | Omitir `### Descripción del tema` |
| Tema sin contenido | Omitir `### Contenido` |
| YAML malformado | No cerrar las comillas, olvidar los `---` al inicio o al final |
| Marcadores en el contenido | Usar `# Bloque:` o `## Tema:` dentro del contenido de un tema |

---

## Ejemplo mínimo válido

```markdown
---
type: formation
version: 1
title: "Introducción a la bioestadística"
description: "Conceptos básicos de bioestadística aplicada a la investigación clínica."
status: "draft"
---

# Bloque: Fundamentos estadísticos

## Descripción del bloque

Este bloque introduce los conceptos estadísticos esenciales para la investigación clínica.

## Tema: Qué es la estadística descriptiva

### Descripción del tema

Resumen de qué es la estadística descriptiva y para qué sirve.

### Contenido

La estadística descriptiva resume y describe los datos de una muestra usando medidas de tendencia central y de dispersión.

Las principales medidas son la media, la mediana, la moda, la desviación típica y el rango intercuartílico.
```

---

## Ejemplo completo válido

```markdown
---
type: formation
version: 1
title: "Modelos predictivos en investigación clínica"
description: "Curso completo sobre construcción, validación e interpretación de modelos predictivos en medicina."
status: "draft"
author: "Eduardo Tebar"
category: "Bioestadística médica"
estimated_duration: "20 horas"
language: "es"
---

# Bloque: Introducción a los modelos predictivos

## Descripción del bloque

Este bloque presenta los conceptos fundamentales de los modelos predictivos clínicos y su diferencia respecto a los modelos explicativos.

## Tema: Qué es un modelo predictivo clínico

### Descripción del tema

En este tema se explica qué es un modelo predictivo y para qué se utiliza en medicina.

### Contenido

Un modelo predictivo clínico es una herramienta que permite estimar la probabilidad de que ocurra un evento futuro en un paciente concreto.

Puede utilizar variables clínicas, analíticas, demográficas o quirúrgicas para generar una predicción individualizada.

Su utilidad práctica está en la toma de decisiones: permite identificar a pacientes de alto riesgo antes de que el evento ocurra.

## Tema: Diferencia entre predicción y causalidad

### Descripción del tema

En este tema se explica por qué un predictor no debe interpretarse automáticamente como una causa.

### Contenido

Un modelo predictivo busca anticipar un resultado, no necesariamente explicar sus causas.

Una variable puede mejorar la predicción sin ser causal: puede ser un marcador, un proxy o un factor de confusión residual.

La distinción entre predicción y causalidad es crucial para evitar errores de interpretación y de intervención.

# Bloque: Construcción del modelo

## Descripción del bloque

Este bloque explica los pasos prácticos para construir un modelo predictivo desde la selección de variables hasta la estimación.

## Tema: Selección de variables predictoras

### Descripción del tema

Criterios para decidir qué variables incluir en un modelo predictivo.

### Contenido

La selección de variables debe basarse en criterios clínicos y estadísticos.

Los criterios clínicos priorizan variables con plausibilidad biológica y disponibilidad en la práctica.

Los criterios estadísticos consideran la asociación univariante, la colinealidad y el número de eventos por variable.

Una buena práctica es usar una hipótesis a priori y complementarla con criterios empíricos.

## Tema: Regresión logística como modelo base

### Descripción del tema

Fundamentos de la regresión logística para la predicción de eventos binarios.

### Contenido

La regresión logística es el modelo de referencia para predecir eventos dicotómicos en medicina.

Estima la probabilidad de un evento en función de un conjunto de covariables. El resultado es una probabilidad entre 0 y 1.

La interpretación de los coeficientes en términos de odds ratios puede confundirse con efectos causales; es importante no caer en esta trampa.

# Bloque: Validación del modelo

## Descripción del bloque

Este bloque cubre los métodos para evaluar si un modelo predictivo funciona correctamente en datos internos y externos.

## Tema: Discriminación y calibración

### Descripción del tema

Las dos dimensiones clave para evaluar un modelo predictivo: si separa bien los casos y si predice bien las probabilidades.

### Contenido

La discriminación mide la capacidad del modelo para distinguir entre pacientes que tendrán el evento y los que no.

La métrica más habitual es el estadístico C (equivalente al área bajo la curva ROC). Valores superiores a 0.75 se consideran aceptables.

La calibración mide si las probabilidades predichas se acercan a las observadas. Se evalúa visualmente con el gráfico de calibración y numéricamente con el test de Hosmer-Lemeshow.

Un modelo puede discriminar bien pero calibrar mal, y viceversa.
```

---

## Plantilla reutilizable

Copia y adapta esta plantilla para cualquier formación:

```markdown
---
type: formation
version: 1
title: "Escribe aquí el título de la formación"
description: "Escribe aquí la descripción general de la formación"
status: "draft"
---

# Bloque: Nombre del bloque 1

## Descripción del bloque

Descripción del bloque 1.

## Tema: Nombre del tema 1.1

### Descripción del tema

Descripción breve del tema 1.1.

### Contenido

Contenido completo del tema 1.1.

## Tema: Nombre del tema 1.2

### Descripción del tema

Descripción breve del tema 1.2.

### Contenido

Contenido completo del tema 1.2.

# Bloque: Nombre del bloque 2

## Descripción del bloque

Descripción del bloque 2.

## Tema: Nombre del tema 2.1

### Descripción del tema

Descripción breve del tema 2.1.

### Contenido

Contenido completo del tema 2.1.

## Tema: Nombre del tema 2.2

### Descripción del tema

Descripción breve del tema 2.2.

### Contenido

Contenido completo del tema 2.2.
```

---

## Flujo de importación

1. Crea tu documento siguiendo este formato y guárdalo con extensión `.md`
2. En el panel de administración, ve a **Formación → Importar formación**
3. Selecciona o arrastra el archivo `.md`
4. Revisa la previsualización detectada
5. Si todo es correcto, pulsa **Importar formación**
6. La formación quedará guardada como borrador y podrás editarla manualmente

También puedes importar bloques adicionales dentro del editor de una formación ya creada usando **Añadir bloques desde documento**.
