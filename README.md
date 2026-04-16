# 787 Gastronomía Puertorriqueña — Landing Page Premium

> Landing page profesional de alto rendimiento en modo oscuro para el restaurante **787 Gastronomía Puertorriqueña**, el único especializado en sazón boricua en Medellín, Colombia.

---

## 🎨 Paleta de Colores (Luxury Dark)

| Variable CSS | Valor | Uso |
|---|---|---|
| `--primary-500` | `#D4A017` | Dorado principal |
| `--primary-400` | `#E8C030` | Hover states |
| `--bg-primary` | `#000000` | Fondo negro puro |
| `--bg-secondary` | `#09090B` | Secciones alternas |
| `--bg-tertiary` | `#18181B` | Cards & Glassmorphism |

---

## 📁 Estructura del Proyecto

```
787 Gastronomia Puertoriquerña/
├── index.html               ← Página principal (Optimizado SEO, WebP, Turnstile)
├── styles.css               ← Estilos Premium, Glassmorphism & Animaciones GPU
├── script.js                ← Lógica de UI, Slider 3D, Validación Frontend
├── google_apps_script.js    ← Puente Backend para Google Calendar & Seguridad
├── README.md                ← Documentación del proyecto
└── images/                  ← Assets optimizados en formato WebP
```

---

## ✅ Características Implementadas

### 🚀 Rendimiento & SEO
- **Imágenes WebP:** Compresión agresiva de imágenes en formato WebP para tiempos de carga ultrarrápidos.
- **Precarga y Optimización:** Precarga de fuentes e imágenes críticas (`preload`).
- **Lazy Loading:** Imágenes con carga diferida (`loading="lazy"`) y decodificación asíncrona (`decoding="async"`).
- **Animaciones GPU:** Uso optimizado de `requestAnimationFrame` y animaciones CSS aceleradas por hardware para el Slider 3D.

### 🎨 Diseño & UX
- **Estilo "Dark Luxury":** Diseño premium con temática oscura, toques dorados y efectos de *glassmorphism*.
- **Slider 3D (Hero):** Carrusel de platillos interactivo en 3D con inercia basada en el movimiento del ratón/táctil.
- **Flip Cards 3D:** Tarjetas interactivas en la sección de platillos que revelan detalles adicionales al hacer hover o tap.
- **Badge Dinámico de Horario:** Etiqueta de "Abierto ahora" que se actualiza en tiempo real según la hora y los días festivos de Colombia (Ley Emiliani).
- **Menú en PDF:** Redirección directa del botón de menú a un PDF alojado en Google Drive.
- **Integración de Mapas:** Dirección física en el footer enlazada directamente a Google Maps.

### 🛡️ Seguridad & Anti-Spam
- **Cloudflare Turnstile:** Integrado en el frontend para prevenir envíos automatizados de bots en el formulario de reserva.
- **Rate Limiting:** Límite de solicitudes (max 3 intentos por cada 10 minutos por email) manejado por Google Apps Script para evitar abusos.
- **Validación Estricta:** Validaciones de expresiones regulares (Regex) tanto en el cliente como en el servidor para emails y teléfonos.
- **Protección XSS:** Sanitización exhaustiva de las entradas de texto en el backend antes de ser procesadas o guardadas.

### 📅 Sistema de Reservas Integrado (Google Calendar)
- **Puente Directo:** Reemplazo de webhooks genéricos por un script nativo de Google Apps Script (`google_apps_script.js`).
- **Verificación en Tiempo Real:** El sistema verifica la disponibilidad del bloque de tiempo exacto antes de permitir el envío del formulario.
- **Aviso Previo:** Lógica para exigir al menos 1 hora de antelación en cualquier reserva solicitada el mismo día.

---

## 🛠️ Configuración & Despliegue Backend

### Google Apps Script (Reservas)
1. Entra a [Google Apps Script](https://script.google.com).
2. Crea un nuevo proyecto y pega el contenido de `google_apps_script.js`.
3. Ajusta la constante `CALENDAR_ID` si usas un calendario específico, o déjalo en `'primary'`.
4. Haz clic en **Implementar > Nueva implementación** como "Aplicación web".
5. Ejecutar como: **"Yo"** y Quién tiene acceso: **"Cualquiera"**.
6. Copia la URL generada y pégala en la variable `GAS_URL` dentro de `script.js`.

### Ubicación & Contacto
- **Dirección:** Cra. 36 #8a-12, El Poblado, Medellín, Antioquia.
- **Horario:** Mar – Dom: 8:00 AM – 10:00 PM.
- **Instagram:** [@787gastronomiapr](https://www.instagram.com/787gastronomiapr/)
- **WhatsApp:** [+57 315 3597524](https://api.whatsapp.com/message/746MFPD3TP6MO1)

---

## 🚀 Despliegue en GitHub

Para subir este proyecto a GitHub:
1. `git init`
2. `git add .`
3. `git commit -m "feat: actualización del sistema de reservas, seguridad y optimización visual"`
4. `git remote add origin https://github.com/mateobermudezca/787gastronomiapr.git`
5. `git push -u origin main`

---

*Creado y optimizado con ❤️ por Antigravity AI · 2026*
*787 Gastronomía Puertorriqueña © 2026. Todos los derechos reservados. 🇵🇷*
