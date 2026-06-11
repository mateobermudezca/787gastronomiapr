# 787 Gastronomía Puertorriqueña — Architecture & Stack

> Documento generado el 2026-06-11. Describe la arquitectura completa, tecnologías, stack y estructura del proyecto.

---

## 1. Descripción General

Landing page promocional + sistema de reservas para **787 Gastronomía Puertorriqueña**, único restaurante de comida boricua en Medellín, Colombia.

- **Dominio:** `https://787gastronomiapr.vercel.app`
- **Propósito:** Carta digital, galería de platillos, sistema de reserva de mesas con verificación de disponibilidad en Google Calendar.
- **Stack:** 100% frontend estático (HTML + CSS + Vanilla JS) desplegado en Vercel, con backend serverless vía Google Apps Script.

---

## 2. Estructura de Archivos

```
/
├── index.html              # Landing page principal (estática, ~2200 líneas)
├── privacidad.html          # Política de privacidad (página legal)
├── terminos.html            # Términos de uso (página legal)
├── styles.css               # CSS global (~3580 líneas, 81 KB)
├── script.js                # JavaScript principal (~880 líneas)
├── sw.js                    # Service Worker (offline + caching)
├── google_apps_script.js    # Backend GAS (código desplegado en Google Apps Script)
├── vercel.json              # Configuración de despliegue (headers, redirects)
├── package.json             # Dependencias (sharp para imágenes)
├── package-lock.json
├── .gitignore
├── robots.txt               # SEO: permite todo, apunta a sitemap
├── sitemap.xml              # SEO: URL única (landing)
├── ARCHITECTURE.md          # ← Este archivo
│
├── images/
│   ├── hero_bg_sanjuan.webp       # Hero background alternativa
│   ├── herobg.webp                # Hero background principal
│   ├── logo.webp                  # Logo del restaurante (favicon)
│   ├── bandeja_boricua.webp       # Platillo 1 (flip card)
│   ├── chuleta_kankan.webp        # Platillo 2 (flip card)
│   ├── mar_de_mi_tierra.webp      # Platillo 3 (flip card)
│   ├── mofongo_relleno.webp       # Platillo 4 (flip card)
│   ├── pechuga_rellena.webp       # Platillo 5 (flip card)
│   ├── pescado_frito.webp         # Platillo 6 (flip card)
│   ├── aguacate_relleno.webp      # Novedad (slider 3D)
│   ├── surtido_boricua.webp       # Recomendado (slider 3D)
│   ├── calidad.webp               # Selección Premium (slider 3D)
│   ├── coctel_1.webp              # Slider 3D
│   ├── coctel_2.webp              # Slider 3D
│   ├── coctel_3.webp              # Slider 3D
│   ├── service_1.webp             # Slider 3D
│   ├── service_2.webp             # Slider 3D
│   ├── service_3.webp             # Slider 3D
│   ├── service_4.webp             # Slider 3D
│   ├── desayuno.webp              # Brunch gallery
│   ├── desayuno_amanecer_dulce.webp
│   ├── desayuno_el_pollo.webp
│   ├── desayuno_fit_bowl.webp
│   ├── desayuno_general_hero.webp
│   ├── desayuno_las_mananas.webp
│   ├── desayuno_waffle_sandwich_tuna.webp
│   ├── nosotros_visual.webp       # Sección Nosotros
│   ├── reviews_bg.webp            # Background testimonios
│   ├── platillo_1.webp            # Background slider
│   ├── platillo_2.webp            # Background slider
│   ├── IMG_0639.webp              # Background slider
│   └── ...
│
├── node_modules/           # (ignorado por git) Dependencia sharp
└── .vercel/                # (ignorado por git) Cache de Vercel
```

---

## 3. Stack Tecnológico

### 3.1 Frontend

| Capa | Tecnología | Versión / Detalle |
|---|---|---|
| Lenguaje | HTML5 + CSS3 + JavaScript (ES2020+) | Sin transpilación |
| Framework CSS | **Ninguno** (hand-rolled) | Sistema de diseño propio con custom properties |
| Framework JS | **Ninguno** (vanilla) | Sin React, Vue, Svelte, etc. |
| Tipografía | **Plus Jakarta Sans** (headings) + **Inter** (body) | Google Fonts, `display=swap` |
| Íconos | **Inline SVGs** (~25 iconos) | `fill="currentColor"`, sin librerías externas |
| CAPTCHA | **Cloudflare Turnstile** | Implícito (data-sitekey), solo validación cliente |
| Animaciones | **CSS puro** (20 keyframes) + **IntersectionObserver** + rAF | Sin GSAP ni librerías de animación |
| PWA | **Service Worker** (`sw.js`) | Cache-first para assets, network-first para navegación |
| Despliegue | **Vercel** (static) | Edge network, HTTPS automático |

### 3.2 Backend (Serverless)

| Componente | Tecnología | Rol |
|---|---|---|
| API de reservas | **Google Apps Script** (GAS) | Web App desplegada como "Ejecutar como: Yo, Acceso: Cualquiera" |
| Calendario | **Google Calendar API** | Creación de eventos de reserva (2h por slot) |
| Base de datos | **Google Sheets** | Log de clientes (nombre, teléfono, email) |
| Rate limiting | **CacheService** (GAS) | 3 intentos por email cada 10 minutos |

### 3.3 Infraestructura

| Componente | Proveedor | Detalle |
|---|---|---|
| Hosting | **Vercel** | Plan gratuito, despliegue desde git push a `main` |
| DNS | **Vercel** (por defecto) | `787gastronomiapr.vercel.app` |
| CDN | **Vercel Edge Network** | Cache automático, headers configurados en `vercel.json` |
| SSL/TLS | **Automático** (Vercel) | Let's Encrypt |
| Service Worker | **Nativo** (navegador) | Cache API + `skipWaiting` + limpieza de caches viejos |

---

## 4. Arquitectura General

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Navegador (Cliente)                           │
│                                                                        │
│  index.html ──► styles.css (deferred)                                  │
│             ──► script.js (defer) ──► DOMContentLoaded ──► 13 init*()  │
│             ──► sw.js (service worker)                                 │
│             ──► Turnstile API (async defer)                            │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │  Reserva Form                                               │      │
│  │  ┌──────────┐   ┌────────────────┐   ┌──────────────────┐  │      │
│  │  │ validate │──►│ Turnstile      │──►│ POST / exec (GAS) │  │      │
│  │  │ client   │   │ check (client) │   │ mode: no-cors    │  │      │
│  │  └──────────┘   └────────────────┘   └────────┬─────────┘  │      │
│  │                                               │             │      │
│  │  Disponibilidad: GET / exec?fecha=&hora= ◄────┘             │      │
│  └─────────────────────────────────────────────────────────────┘      │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │ HTTPS
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Google Apps Script (Backend)                       │
│                                                                        │
│  doGet(e) ──► checkAvailability() ──► CalendarApp.getEvents()         │
│                                                                        │
│  doPost(e) ──►                                                        │
│    1. Rate limit (CacheService, 3 intentos / 10 min)                    │
│    2. Validación regex (email, teléfono)                                │
│    3. Sanitización XSS (escapeHTML en nombre, mensaje, ocasion)         │
│    4. checkAvailability() (doble verificación)                          │
│    5. createCalendarEvent() ──► Google Calendar                         │
│    6. saveToSheet() ──► Google Sheets                                   │
│    7. Response JSON { success, eventId }                                │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Flujo de Reserva (detallado)

1. Usuario llena formulario (validación por campo en `blur` + `input`)
2. Selecciona fecha → se filtra hora disponible (≥ 60 min en el futuro si es hoy)
3. Selecciona hora → `checkSlotAvailability()` vía GET a GAS
4. Submit:
   a. `validateForm()` sobre todos los campos requeridos
   b. Verifica token Turnstile (`cf-turnstile-response` en FormData)
   c. POST a GAS con `mode: 'no-cors'`
   d. Muestra modal de confirmación con resumen
   e. Resetea form

### 4.2 Service Worker (estrategia de cache)

| Recurso | Estrategia |
|---|---|
| `/`, `/index.html`, `styles.css`, `script.js`, `logo.webp`, `herobg.webp` | **Precache** al instalar |
| `*.webp`, `*.css`, `*.js`, `*.woff2` | **Cache-first** (actualiza en background) |
| Navegación (HTML) | **Network-first** (fallback a index.html) |
| Turnstile API | **Network-only** (excluido explícitamente) |

---

## 5. Frontend en Detalle

### 5.1 HTML (`index.html`)

**Secciones (en orden):**

| # | Sección | ID / Clase | Contenido clave |
|---|---|---|---|
| 1 | **Hero** | `section.hero` | Título animado (word reveal), slider 3D de platillos, stats, badges |
| 2 | **Platillos** | `#platillos` | 6 flip cards 3D (imagen frontal → info trasera al hover/touch) |
| 3 | **Brunch** | `#brunch` | Galería bento-grid con 6 cards de desayuno |
| 4 | **Nosotros** | `#nosotros` | Historia + tarjeta morphing con perfil de equipo |
| 5 | **Reserva** | `#contacto` | Formulario de 8 campos + Turnstile |
| 6 | **Testimonios** | `#resenas` | Marquee infinito con 8 reseñas (clonadas por JS a 16) |
| 7 | **Footer** | `footer` | 3 columnas: marca, enlaces, contacto |

**Head:**
- Meta tags: charset, viewport, robots, description, keywords, author
- Open Graph (6 tags) + Twitter Cards (4 tags)
- JSON-LD Schema.org (Restaurant con aggregateRating, horarios, geo)
- Preconnect a Google Fonts (2 origins)
- Preload de logo.webp y herobg.webp (LCP optimization)
- CSS crítico inline (~620 líneas): reset, variables, navbar, hero, botones, keyframes
- styles.css cargado con patrón `rel=preload onload=rel=stylesheet` (no bloqueante)
- Turnstile script con `async defer`

**Rendimiento:**
- `content-visibility: auto` en `.section` (lazy rendering off-screen)
- `loading="lazy"` en imágenes secundarias
- `fetchpriority="high"` en logo
- Sin JS render-blocking (todo `defer` o `async`)
- Sin analytics, sin librerías externas pesadas

### 5.2 CSS (`styles.css` ~3580 líneas)

**Arquitectura:** Monolítico, 20 secciones temáticas.

**Sistema de diseño (CSS Custom Properties en `:root`):**

| Categoría | Propiedades |
|---|---|
| Backgrounds | `--bg-primary` (#000), `--bg-secondary` (#050507), `--bg-tertiary`, `--bg-card` |
| Gold scale | `--primary-50` → `--primary-900` (9 tonos, base #D4A017) |
| Texto | `--text-primary` (#FFF) → `--text-quaternary` (#71717A) |
| Semántica | `--success` (#10B981), `--info`, `--warning` |
| Spacing | `--section-padding` (140px), `--container-max` (1280px) |
| Radios | `--radius-sm` (8px) → `--radius-full` (9999px) |
| Easing | `--ease-out-expo` (0.16,1,0.3,1), `--ease-out-back`, `--ease-in-out-expo` |
| Transiciones | `--transition-fast`, `--transition-normal`, `--transition-slow`, `--transition-premium` |
| Emoji | `--apple-emoji` (stack para renderizado iOS) |

**Sistema de botones:**
- `.btn` (base): inline-flex, 16px radius, Plus Jakarta Sans 700
- `.btn-primary`: gradiente dorado animado (gradient-shift)
- `.btn-outline`: borde dorado, hover rellena gold
- `.btn-lg`: versión grande
- `.btn-icon-circle`: círculo de 30px dentro del botón

**Sistema de animaciones (20 keyframes):**

| Animación | Propósito |
|---|---|
| `reveal-word` | Slide-up de palabras del hero |
| `fade-in-up` | Entrada suave de secciones |
| `scale-in` | Hero actions (spring) |
| `fade-in-rotate` | Hero visual (rotateY) |
| `float` | Levitación suave (hero img, carrusel) |
| `pulse-glow` | Sombra pulsante (botones, imágenes) |
| `gradient-shift` | Degradado animado en botones |
| `marquee-scroll` | Scroll infinito de testimonios (40s) |
| `skeleton-shimmer` | Loader del slider 3D |
| `shine-sweep` | Barrido dorado en slider card |
| `modal-ring-pulse` | Pulso del anillo de confirmación |
| `modal-icon-pop` | Entrada spring del ícono modal |
| `blink` | Punto verde de "abierto" |
| `float-particle` | Trayectoria orgánica de partículas |
| `spin` | Spinner de carga |

**Media queries:** 7 breakpoints (576, 768, 992, 1023, 1440, hover, reduced-motion)

**Responsive:** Mobile-first breakpoints en `max-width: 767px` con reestructuración a 1 columna, navbar a hamburguesa, hero visual oculto, partículas limitadas.

### 5.3 JavaScript (`script.js` ~880 líneas)

**Arquitectura:** Monolítico, 13 funciones `init*()` + utilidades + constantes globales.

**Módulos funcionales (orden de inicialización):**

| Función | Responsabilidad | Líneas |
|---|---|---|
| `initParticles()` | Genera N divs flotantes (50 desktop, 20 mobile, 15 reduced-motion) | 42-75 |
| `initMarqueeClone()` | Duplica testimonios con cloneNode(true) para scroll infinito | 28-37 |
| `initReservationForm()` | Validación, disponibilidad, submit, Turnstile | 230-363 |
| `initConfirmModal()` | Apertura/cierre del modal post-reserva | 539-561 |
| `initNavbar()` | Clase `.scrolled` en scroll > 48px (debounced 10ms) | 80-93 |
| `initMobileMenu()` | Toggle hamburguesa, escape key, body scroll lock | 98-122 |
| `initFlipCards()` | Touch: toggle `.flipped` en service cards | 127-144 |
| `initScrollReveal()` | IntersectionObserver para fade-in de secciones | 149-166 |
| `initCounters()` | Animación de contadores numéricos (2000ms, ease-out cubic) | 171-210 |
| `initDishCarousel()` | Slider 3D con 9 cards, tilt por mouse, swipe táctil, auto-rotate 3.5s | 588-750 |
| `initStatusBadge()` | Texto "Abierto ahora" / "Cerrado" según hora Colombia | (en init)* |
| `initGlowOrbTracking()` | Mouse-follower glow en hero y formulario (passive mousemove) | 822-849 |
| `initScrollProgress()` | Barra de progreso de scroll superior | (en init)* |

\* Ubicación exacta dentro de script.js varía; todas se llaman desde el DOMContentLoaded.

**APIs del navegador utilizadas:**
- `IntersectionObserver` (scroll reveal, counters)
- `requestAnimationFrame` (counters, tilt, scroll progress)
- `fetch` (GET para disponibilidad, POST para reserva)
- `FormData` (lectura de Turnstile token)
- `Cache Storage` (desde sw.js, no desde script.js)
- `matchMedia('prefers-reduced-motion')`
- `passive: true` en listeners de scroll, touch, mouse

**Dependencias externas desde JS:**
- **Ninguna.** Todo el código es vanilla JS sin librerías.

**Patrones de rendimiento:**
- Debounce de 10ms en scroll de navbar
- rAF para tilt y scroll progress (evita layout thrashing)
- IntersectionObserver fire-once (unobserve tras activar)
- Passive listeners en scroll y touch
- `prefers-reduced-motion` check para partículas, carrusel, tilt, glow
- Image preloading con `Promise.all` para slider 3D

**Globales expuestas (todo el archivo):**
`GAS_URL`, `COLOMBIAN_HOLIDAYS`, `initParticles`, `initMarqueeClone`, `initReservationForm`, `initConfirmModal`, `initNavbar`, `initMobileMenu`, `initFlipCards`, `initScrollReveal`, `initCounters`, `initDishCarousel`, `initStatusBadge`, `initGlowOrbTracking`, `initScrollProgress`, `debounce`, `setText`, `formatDate`, `formatHora`, `setLoading`, `showToast`, `showConfirmModal`, `hideConfirmModal`, `animateCounter`, `checkSlotAvailability`, `validateField`

---

## 6. Backend (Google Apps Script)

### 6.1 Arquitectura

Archivo: `google_apps_script.js` (168 líneas)

Desplegado como **Web App** en `https://script.google.com/macros/s/AKfycbw6TVEppoun9c8CvbVoEdOSVyJe_Pz4OTssZggFeu_7rY3pdZ8nMP_BC8Krf5FYF7yP/exec`

Configuración:
- **Ejecutar como:** Dueño de la cuenta
- **Acceso:** Cualquiera (incluso anónimo)

### 6.2 Endpoints

| Endpoint | Método | Parámetros | Respuesta |
|---|---|---|---|
| `doGet` | GET | `fecha` (YYYY-MM-DD), `hora` (HH:MM) | `{ available: boolean }` |
| `doPost` | POST | JSON body con `{ nombre, telefono, email, fecha, hora, personas, ocasion, mensaje }` | `{ success: boolean, eventId?: string, error?: string }` |

### 6.3 Seguridad implementada (server-side)

| Medida | Detalle |
|---|---|
| Rate limiting | CacheService: 3 intentos por email en 10 min |
| Validación email | Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Validación teléfono | Regex `/^[\d\s\+\-\(\)]{10,15}$/` |
| Sanitización XSS | `escapeHTML()` en nombre, mensaje, ocasion (escapa `& < > " '`) |
| Doble verificación | `checkAvailability()` antes de crear el evento |

### 6.4 Limitaciones

- No hay verificación server-side del token de Turnstile (solo cliente)
- `mode: 'no-cors'` desde el frontend impide leer la respuesta del POST (el éxito se asume)
- Los IDs de Sheets (`SPREADSHEET_ID`) y Calendar (`CALENDAR_ID`) están hardcodeados
- No hay logging ni monitoreo de errores del servidor

---

## 7. Configuración de Vercel (`vercel.json`)

```json
{
  "headers": [
    { "source": "/images/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/fonts/(.*)",  "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/(.*\\.css)",  "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/(.*\\.js)",   "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/(.*)",        "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }] }
  ],
  "redirects": [
    { "source": "/index.html", "destination": "/", "permanent": true }
  ]
}
```

**Headers de cache:**
- Assets inmutables (images, fonts, css, js): 1 año (`max-age=31536000, immutable`)
- HTML/navegación: `max-age=0, must-revalidate` (siempre validar con servidor)

---

## 8. Service Worker (`sw.js`)

| Aspecto | Detalle |
|---|---|
| Versión de cache | `787gastronomia-v2` |
| Precarga (install) | `/`, `/index.html`, `/styles.css`, `/script.js`, `/images/logo.webp`, `/images/herobg.webp` |
| Estrategia assets | **Cache-first** con actualización en background |
| Estrategia HTML | **Network-first**, fallback a index.html |
| Excluidos | Turnstile API (challenges.cloudflare.com) |
| Activación | `skipWaiting()` + limpieza de caches antiguas |

---

## 9. SEO y Meta

| Aspecto | Implementación |
|---|---|
| Título | `Restaurante 787 Gastronomía Puertorriqueña – Sabor Boricua en Medellín` |
| Descripción | ~160 chars, incluye keywords principales |
| Open Graph | og:title, og:description, og:type, og:url, og:image |
| Twitter Cards | summary_large_image |
| JSON-LD | Schema.org Restaurant con aggregateRating (4.2★ / 120 reseñas), horario, geo, menú |
| Canonical | `https://787gastronomiapr.vercel.app/` |
| Sitemap | `sitemap.xml` (1 URL) |
| Robots | `robots.txt` (Allow: /, apunta a sitemap) |
| hreflang | No implementado |
| Analytics | No implementado |

---

## 10. Assets (Imágenes)

- **Formato:** 100% WebP
- **Cantidad:** 31 imágenes
- **Propósito:** Hero bg (2), logo (1), platillos (6), slider 3D (9), brunch (7), nosotros (1), backgrounds (3), misc (2)
- **Estrategia de carga:**
  - Hero bg + logo: `preload` (LCP)
  - Slider cards: preload via JS (`Promise.all` + `new Image()`)
  - Resto: `loading="lazy" decoding="async"`

---

## 11. Rendimiento (Lighthouse — último reporte)

| Métrica | Valor |
|---|---|
| Performance Score | **78** |
| LCP | 4.5s |
| TBT | 0ms |
| CLS | 0.002 |
| TTI | 5.2s |
| FCP | 3.3s |
| Speed Index | 3.4s |
| Peso total | 1,536 KiB |

**Mejoras aplicadas previamente:**
- Particles: 80→50 desktop, 40→20 mobile
- Marquee testimonios: HTML duplicado → JS clone
- Font Awesome (37 iconos) → SVGs inline
- Emojis → caracteres reales con font stack iOS
- CSS crítico inline (elimina render-blocking de styles.css)
- Service worker con cache-first

---

## 12. Seguridad (postura actual)

| Aspecto | Estado |
|---|---|
| HTTPS | ✅ Forzado por Vercel |
| Content-Security-Policy | ❌ No implementado |
| X-Frame-Options / frame-ancestors | ❌ No implementado |
| SRI (Subresource Integrity) | ❌ No implementado en CDN scripts |
| Turnstile server-side validation | ❌ Solo cliente |
| GAS URL + Sheets ID hardcodeados | ⚠️ Expuestos en código fuente |
| XSS sanitization server-side | ✅ escapeHTML en campos críticos |
| Rate limiting server-side | ✅ 3 intentos / 10 min |
| Form validation client-side | ✅ Por campo (blur + input) |
| console.error en producción | ⚠️ 2 llamadas (filtran stack traces) |
| innerHTML en producción | ⚠️ 1 instancia (literal seguro, pero code smell) |

---

## 13. Dependencias

### Producción
| Paquete | Versión | Uso |
|---|---|---|
| `sharp` | ^0.35.0 | Optimización de imágenes (local, no se usa en Vercel) |

### Terceros (CDN)
| Recurso | URL |
|---|---|
| Google Fonts | `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap` |
| Cloudflare Turnstile | `https://challenges.cloudflare.com/turnstile/v0/api.js` |

**Sin dependencias JS runtime.** No jQuery, React, Vue, Lodash, GSAP, etc.

---

## 14. Integraciones Externas

| Integración | Tipo | Propósito |
|---|---|---|
| Google Apps Script | API backend | Procesar reservas, verificar disponibilidad |
| Google Calendar | Google API | Crear eventos de reserva (duración 2h) |
| Google Sheets | Google API | Almacenar datos de clientes (nombre, teléfono, email) |
| Cloudflare Turnstile | Widget + API | Anti-spam / verificación humana |
| Vercel | Hosting + CDN | Despliegue, SSL, headers de cache |
| WhatsApp (enlace) | Enlace `https://wa.me/...` | Contacto directo |
| Instagram (enlace) | Enlace perfil | Red social |
| Google Maps (enlace) | Enlace `https://maps.google.com/maps?...` | Dirección y reseñas |

---

## 15. Próximos Pasos / Deuda Técnica

- [ ] **CSP**: Agregar Content-Security-Policy header (mitigación XSS)
- [ ] **SRI**: Agregar integrity hashes a scripts/fonts CDN
- [ ] **Frame protection**: X-Frame-Options o frame-ancestors 'none'
- [ ] **Secrets rotation**: Mover GAS_URL y SPREADSHEET_ID a env vars de Vercel
- [ ] **Turnstile server-side**: Validar token en GAS
- [ ] **innerHTML → textContent**: Line 380 de script.js
- [ ] **console.error cleanup**: Eliminar o condicionar a debug mode
- [ ] **Focus trap**: Agregar focus trap en modal de confirmación
- [ ] **Print styles**: Agregar `@media print` para legibilidad
