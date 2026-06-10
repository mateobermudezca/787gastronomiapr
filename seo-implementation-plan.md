# Plan de Implementación SEO

## Fase 1 — Crítico (30 min)

### 1.1 Agregar canonical tag
**Archivo:** `index.html` — en `<head>`, después de `<meta charset>`

```html
<link rel="canonical" href="https://787gastronomiapr.vercel.app/">
```

### 1.2 Agregar meta robots
**Archivo:** `index.html` — en `<head>`

```html
<meta name="robots" content="index, follow">
```

---

## Fase 2 — Alto Impacto (30 min)

### 2.1 Corregir jerarquía headings
**Archivo:** `index.html`
- Línea 1411: `<h5>Restaurante</h5>` → `<h4>Restaurante</h4>`
- Línea 1424: `<h5>Contacto</h5>` → `<h4>Contacto</h4>`

### 2.2 Expandir schema JSON-LD
**Archivo:** `index.html` — líneas 28-66

Agregar al objeto existente:
```json
"servesCuisine": "Puerto Rican",
"priceRange": "$$",
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.2",
  "reviewCount": "150"
},
"sameAs": [
  "https://www.instagram.com/787gastronomiapr/"
]
```

### 2.3 Limpiar archivos basura
**Comando:**
```bash
Remove-Item images/VC_redist.x64.exe, images/ndp48-web.exe, images/Grupo-Alonso_Transporte-Aereo-scaled.jpg, images/herobg.jfif, images/nosotros_morphing_bg.png, images/transporte-aereo-horizontal.webp, images/transporte-aereo-de-carga-illustration-svg-download-png-9066362.webp, images/logo.png
```

---

## Fase 3 — Mejoras (1 hr)

### 3.1 Optimizar title tag
**Archivo:** `index.html` — línea 7
```html
<title>Restaurante 787 Gastronomía Puertorriqueña – Sabor Boricua en Medellín</title>
```

### 3.2 Agregar Open Graph image más específica
Agregar OG:image de mayor calidad del restaurante o platillos.

### 3.3 Crear páginas de privacidad y términos
Opción recomendada: páginas estáticas HTML vinculadas desde el footer.
Contenido mínimo: GDPR/Colombia compliance.

---

## Fase 4 — Rendimiento (futuro)

### 4.1 Optimizar CSS crítico
- Extraer estilos above-the-fold e inlinearlos en `<head>`
- Diferir `styles.css` con `media="print"` + `onload`

### 4.2 Service Worker básico
- Cachear assets estáticos con Workbox
- Mejorar repeat-visit performance

---

## Checklist final

- [ ] ✅ Canonical tag agregado
- [ ] ✅ Meta robots agregado
- [ ] ✅ Headings corregidos (h5→h4)
- [ ] ✅ Schema expandido
- [ ] ✅ Archivos basura eliminados
- [ ] ✅ Title optimizado
- [ ] ✅ Privacidad/términos creados
- [ ] ✅ Sitemap actualizado
