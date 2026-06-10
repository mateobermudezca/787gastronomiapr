# Auditoría SEO — 787 Gastronomía Puertorriqueña

> **Fecha:** 10/06/2026
> **URL:** https://787gastronomiapr.vercel.app
> **Tipo:** Single Page Application (SPA) — Restaurante

---

## Resumen Ejecutivo

El sitio tiene una **base SEO sólida**: HTTPS, schema JSON-LD, Open Graph, WebP, lazy loading, responsive design. Sin embargo, hay **3 issues críticos**, **4 de alta prioridad** y varios **aspectos por pulir** para maximizar visibilidad orgánica.

### Top Issues Prioritarios
1. ❌ **Sin canonical tag** — riesgo de contenido duplicado
2. ❌ **Sin meta robots** — Google puede interpretar mal
3. ❌ **Heading jerarquía rota** — `<h5>` en footer para secciones principales
4. ⚠️ **Schema incompleto** — falta `servesCuisine`, `priceRange`, `aggregateRating`

---

## 1. Técnico — Crawlability & Indexación

### ✅ Aciertos
| Ítem | Estado |
|------|--------|
| robots.txt | ✅ Permite todo, sitemap referenciado |
| Sitemap XML | ✅ Existe, accesible |
| HTTPS | ✅ Válido (Vercel) |
| Viewport | ✅ Configurado |
| Mobile-friendly | ✅ Responsive design |
| Preconnect fonts | ✅ Implementado |

### ❌ Issues

#### CRITICAL: Falta canonical tag
- **Issue:** No hay `<link rel="canonical">` en el `<head>`
- **Impacto:** Alto — Google puede indexar URLs duplicadas (con parámetros, trailing slash variants)
- **Fix:** Agregar `<link rel="canonical" href="https://787gastronomiapr.vercel.app/">`

#### CRITICAL: Falta meta robots
- **Issue:** No hay `<meta name="robots" content="index, follow">`
- **Impacto:** Alto — sin指示 explícita, pero no crítico si está en Search Console
- **Fix:** Agregar `<meta name="robots" content="index, follow">`

#### HIGH: Sitemap fecha estática
- **Issue:** `<lastmod>2026-04-27</lastmod>` hardcodeado
- **Impacto:** Bajo — Google eventualmente recrawl
- **Fix:** Automatizar o actualizar con cada deploy

---

## 2. On-Page SEO

### ✅ Aciertos
| Ítem | Estado |
|------|--------|
| Title tag | ✅ "787 Gastronomía Puertorriqueña – Sabor Boricua en Medellín" (56 chars, keyword-rich) |
| Meta description | ✅ Única, 160 chars con keywords |
| H1 | ✅ "El Alma de Puerto Rico en tu Mesa" (único, descriptivo) |
| Open Graph | ✅ title, description, image, type, url |
| Twitter Card | ✅ summary_large_image |
| Alt text | ✅ 24 imágenes con alt descriptivo |
| Imágenes WebP | ✅ Formato moderno en todas |
| Lazy loading | ✅ 14 imágenes con loading="lazy" |

### ❌ Issues

#### HIGH: Heading jerarquía incorrecta en footer
- **Issue:** Footer usa `<h5>Restaurante</h5>` y `<h5>Contacto</h5>` — estos son títulos de sección importantes, deberían ser `<h2>` o `<h3>`
- **Impacto:** Medio — Google usa headings para entender estructura
- **Fix:** Cambiar `<h5>` → `<h4>` (siguiendo jerarquía: H1→H2→H3→H4)

#### HIGH: Schema JSON-LD incompleto
- **Issue:** Falta `servesCuisine`, `priceRange`, `aggregateRating`, `review`, `sameAs`, `servesCuisine`
- **Impacto:** Medio — reduce rich snippets potenciales
- **Fix:** Expandir schema con:
  - `"servesCuisine": ["Puerto Rican", "Caribbean"]`
  - `"priceRange": "$$"`
  - `"aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.2", "reviewCount": "XX"}`
  - `"sameAs": ["https://instagram.com/787gastronomiapr", "..."]`
  - `"servesCuisine": "Puerto Rican"`

#### MEDIUM: Title no incluye "restaurante" explícitamente
- **Issue:** El title "787 Gastronomía Puertorriqueña – Sabor Boricua en Medellín" podría incluir "restaurante" para búsquedas como "restaurante puertorriqueño Medellín"
- **Impacto:** Bajo-Medio
- **Fix:** "Restaurante 787 Gastronomía Puertorriqueña – Sabor Boricua en Medellín"

#### MEDIUM: H1 no incluye keyword principal
- **Issue:** "El Alma de Puerto Rico en tu Mesa" es creativo pero no contiene "restaurante", "comida" o "mofongo"
- **Impacto:** Bajo — es un SPA y el contenido de la página refuerza las keywords
- **Fix:** Considerar balance entre branding y SEO en el H1

---

## 3. Performance

### ✅ Aciertos
| Ítem | Estado |
|------|--------|
| WebP images | ✅ Todas en formato moderno |
| Lazy loading | ✅ Implementado |
| Preload hero images | ✅ logo.webp y herobg.webp |
| Font Awesome diferido | ✅ `media="print"` + `onload="this.media='all'"` |
| Preconnect fonts | ✅ |
| Archivos CSS/JS únicos | ✅ Single CSS + single JS |

### ❌ Issues

#### HIGH: Archivos basura en /images/
- **Issue:** Hay `.exe` (instaladores), `.jpg` y `.jfif` no utilizados que aumentan el tamaño del proyecto
- **Fix:** Limpiar: `VC_redist.x64.exe`, `ndp48-web.exe`, `Grupo-Alonso_Transporte-Aereo-scaled.jpg`, `herobg.jfif`, `nosotros_morphing_bg.png`, `transporte-aereo-horizontal.webp`, `transporte-aereo-de-carga-illustration-svg-download-png-9066362.webp`, `logo.png`

#### MEDIUM: CSS grande (81KB)
- **Issue:** `styles.css` pesa 81KB para un SPA
- **Impacto:** Medio — afecta LCP y tiempo de renderizado
- **Fix:** Dividir CSS crítico inline y diferir el resto

#### MEDIUM: Sin Service Worker
- **Issue:** No hay SW para caching offline
- **Impacto:** Bajo para SEO directo, pero mejora UX/performance
- **Fix:** Implementar Workbox o similar

---

## 4. Contenido & Experiencia

### ✅ Aciertos
| Ítem | Estado |
|------|--------|
| E-E-A-T | ✅ Información de contacto completa (teléfono, WhatsApp, dirección, Instagram) |
| NAP consistente | ✅ Nombre, dirección, teléfono iguales en schema y footer |
| Google Business Profile | ✅ Referenciado con link a reseñas |
| Privacy / Terms | ✅ Links presentes (aunque son placeholder "#") |
| Menú disponible | ✅ Enlace a PDF del menú |

### ❌ Issues

#### HIGH: Páginas de Política y Términos son placeholder
- **Issue:** `<a href="#">Política de Privacidad</a>` y `<a href="#">Términos de Uso</a>` — no existen
- **Impacto:** Medio-bajo para SEO, pero importante para trust/señales E-E-A-T
- **Fix:** Crear páginas de privacidad y términos

---

## Resumen de Prioridades

| # | Issue | Prioridad | Esfuerzo |
|---|-------|-----------|----------|
| 1 | Agregar canonical tag | 🔴 Crítico | 5 min |
| 2 | Agregar meta robots | 🔴 Crítico | 2 min |
| 3 | Corregir jerarquía headings (h5→h4) | 🟠 Alto | 5 min |
| 4 | Expandir schema JSON-LD | 🟠 Alto | 15 min |
| 5 | Limpiar archivos basura /images/ | 🟠 Alto | 5 min |
| 6 | Optimizar title tag | 🟡 Medio | 2 min |
| 7 | Crear páginas de privacidad/términos | 🟡 Medio | 30 min |
| 8 | Actualizar sitemap dinámicamente | 🟡 Medio | 10 min |
| 9 | Optimizar CSS (crítico inline) | 🟢 Bajo | 20 min |
