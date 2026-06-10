# Plan de Optimización de Rendimiento

> Basado en auditoría del sitio 787gastronomiapr.vercel.app

---

## Diagnóstico Rápido

| Métrica | Estado | Target |
|---------|--------|--------|
| herobg.webp | ❌ **2.9 MB** | < 200 KB |
| Imágenes cocina (promedio) | ❌ ~600 KB | < 150 KB |
| CSS render-blocking | ❌ 81 KB | < 15 KB crítico |
| Google Fonts | ⚠️ Render-blocking | Diferir |
| Total peso imágenes | ⚠️ ~17 MB | < 2 MB |
| Service Worker | ❌ No existe | Agregar |

---

## Fase 1 — Imágenes (Alto Impacto, 1 hr)

### 1.1 Comprimir imágenes masivas

| Archivo | Actual | Target | Acción |
|---------|--------|--------|--------|
| `herobg.webp` | 2.9 MB | < 200 KB | Redimensionar a 1920×1080 + comprimir al 80% (Squoosh/Imagify) |
| `chuleta_kankan.webp` | 1.16 MB | < 150 KB | Comprimir con calidad 70-75% |
| `IMG_0639.webp` | 1 MB | < 150 KB | Comprimir con calidad 70-75% |
| `pescado_frito.webp` | 910 KB | < 130 KB | Ídem |
| Resto de imágenes | 300-700 KB | < 120 KB | Comprimir al 70-80% calidad |

**Herramientas recomendadas (gratis):**
- [Squoosh](https://squoosh.app/) — WebP, ajuste fino
- `npx imagemin` — CLI batch
- `npx sharp-cli` — redimensionar + comprimir por lote

### 1.2 Agregar srcset y sizes

Para tener responsive images en desktop vs mobile:

```html
<img src="images/platillo_1.webp"
     srcset="images/platillo_1-480.webp 480w,
             images/platillo_1-768.webp 768w,
             images/platillo_1.webp 1200w"
     sizes="(max-width: 768px) 100vw, 520px"
     alt="...">
```

**Prioridad:** Hero slideshow images + flip cards.

### 1.3 lazy-load hero slideshow images

Todas las imágenes del slider de platillos tienen `decoding="async"` pero no tienen `loading="lazy"`. Ya están debajo del fold, pueden cargarse lazy.

---

## Fase 2 — CSS (Alto Impacto, 1 hr)

### 2.1 Inline CSS crítico

Extraer estilos above-the-fold (hero, navbar, tipografía base) e inlinearlos en `<head>`.

Aproximadamente **10-15 KB** de CSS crítico:
- `.hero`, `.hero-title`, `.hero-subtitle`, `.hero-actions`
- `.navbar`, `.nav-links`
- Variables CSS
- Tipografía base

El resto de `styles.css` cargarlo con:

```html
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

### 2.2 Eliminar CSS no usado

`styles.css` (81 KB) probablemente contiene reglas no utilizadas. Herramientas:
- Chrome DevTools → Coverage tab
- PurgeCSS (post-build)

---

## Fase 3 — JavaScript (Medio Impacto, 30 min)

### 3.1 Cargar script.js con defer

```html
<script src="script.js" defer></script>
```

Esto evita que el JS bloquee el renderizado.

### 3.2 google_apps_script.js

Si se usa en páginas específicas, cargarlo condicionalmente en vez de incluir siempre.

---

## Fase 4 — Fuentes (Medio Impacto, 15 min)

### 4.1 Google Fonts con display=swap

Ya debería tenerlo, pero verificar que la URL incluya `&display=swap`:

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### 4.2 Preload fuentes críticas

```html
<link rel="preload" href="/fonts/PlusJakartaSans-Bold.woff2" as="font" crossorigin>
```

---

## Fase 5 — Service Worker & Caching (Bajo-Medio, 1 hr)

### 5.1 Workbox Service Worker

```js
// sw.js con Workbox
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

// Cachear imágenes
registerRoute(/\.webp$/, new CacheFirst({ cacheName: 'images' }));
// Cachear CSS/JS
registerRoute(/\.(css|js)$/, new StaleWhileRevalidate({ cacheName: 'assets' }));
```

### 5.2 Cache headers en Vercel

`vercel.json`:
```json
{
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/(.*)\\.(css|js)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

---

## Prioridades Resumidas

| # | Acción | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 1 | Comprimir `herobg.webp` de 2.9MB → 200KB | 🔴 Alto | 10 min |
| 2 | Comprimir todas las imágenes | 🔴 Alto | 30 min |
| 3 | Inline CSS crítico + diferir styles.css | 🟠 Alto | 45 min |
| 4 | Agregar `defer` a script.js | 🟡 Medio | 2 min |
| 5 | Agregar `display=swap` a Google Fonts | 🟡 Medio | 2 min |
| 6 | Service Worker + Cache headers | 🟡 Medio | 60 min |
| 7 | srcset responsive images | 🟢 Bajo | 30 min |

---

## Herramientas Recomendadas

| Herramienta | Uso |
|-------------|-----|
| [PageSpeed Insights](https://pagespeed.web.dev/) | Medir Core Web Vitals actuales |
| [Squoosh](https://squoosh.app/) | Comprimir imágenes individuales |
| `npx sharp-cli` | Batch compresión de imágenes |
| Chrome Coverage | Detectar CSS/JS no usado |
| Lighthouse | Auditoría completa |
| [WebPageTest](https://www.webpagetest.org/) | Waterfall detallado |
