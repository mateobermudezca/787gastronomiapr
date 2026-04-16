/**
 * Google Apps Script - Puente para Reservas Google Calendar
 * 
 * Instrucciones:
 * 1. Ve a https://script.google.com
 * 2. Crea un nuevo proyecto.
 * 3. Pega este código.
 * 4. Cambia 'CALENDAR_ID' por tu email o el ID del calendario de reservas.
 * 5. Haz clic en "Implementar" > "Nueva implementación".
 * 6. Tipo: "Aplicación web".
 * 7. Ejecutar como: "Yo" (Tu cuenta).
 * 8. Quién tiene acceso: "Cualquiera" (para que tu web pueda llamarlo).
 * 9. Autoriza los permisos y copia la URL resultante.
 */

const CALENDAR_ID = 'primary'; // Cambia esto si usas un calendario específico
const RESERVATION_DURATION_HOURS = 2; // Duración predeterminada de cada reserva
const MAX_SIMULTANEOUS_RESERVATIONS = 3; // Máximo de reservas permitidas por franja horaria

function doGet(e) {
  const date = e.parameter.fecha; // YYYY-MM-DD
  const time = e.parameter.hora;  // HH:MM
  
  if (!date || !time) {
    return createResponse({ error: 'Faltan parámetros de fecha u hora' });
  }

  const isAvailable = checkAvailability(date, time);
  return createResponse({ available: isAvailable });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const originEmail = data.email ? data.email.toLowerCase().trim() : 'desconocido';

    // 1. SISTEMA DE RATE LIMITING (Anti-abuso de solicitudes por Email)
    const cache = CacheService.getScriptCache();
    const cacheKey = 'RATE_LIMIT_' + originEmail;
    let attempts = cache.get(cacheKey);
    
    attempts = attempts ? parseInt(attempts) + 1 : 1;
    // Si intenta más de 3 veces (limite) ...
    if (attempts > 3) {
      return createResponse({ success: false, error: 'Has excedido el límite de reservas. Por favor, intenta dentro de 10 minutos.' });
    }
    // Guardamos que hubo un intento; 600 segundos = 10 minutos
    cache.put(cacheKey, attempts.toString(), 600);

    // 2. VALIDACIONES DE FLUJO ESTRICTAS (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(originEmail)) {
      return createResponse({ success: false, error: 'Por favor proporciona una dirección de email válida.' });
    }

    const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/; // Permite números, espacios, el signo más y paréntesis
    if (!data.telefono || !phoneRegex.test(data.telefono)) {
      return createResponse({ success: false, error: 'El número de teléfono proporcionado contiene caracteres no permitidos.' });
    }

    // 3. SANITIZACIÓN PARA EVITAR ATAQUES XSS
    // Función simple de escape de HTML
    const escapeHTML = (str) => {
      if (!str) return '';
      return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Sobreescribimos la variable para desarmar etiquetas <script> e imágenes maliciosas
    data.nombre = escapeHTML(data.nombre);
    data.mensaje = escapeHTML(data.mensaje);
    data.ocasion = escapeHTML(data.ocasion);

    // 4. FLUJO ORIGINAL DE RESERVA
    // Verificar disponibilidad por última vez antes de insertar
    if (!checkAvailability(data.fecha, data.hora)) {
      return createResponse({ success: false, error: 'Lo sentimos, el horario ya se ha ocupado.' });
    }

    const event = createCalendarEvent(data);
    return createResponse({ success: true, eventId: event.getId() });
    
  } catch (error) {
    return createResponse({ success: false, error: error.message });
  }
}

function checkAvailability(dateStr, timeStr) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  const start = new Date(dateStr + 'T' + timeStr + ':00');
  const end = new Date(start.getTime() + (RESERVATION_DURATION_HOURS * 60 * 60 * 1000));

  // Buscamos eventos que coincidan en este rango
  const events = calendar.getEvents(start, end);
  
  // Disponible si hay menos del máximo permitido
  return events.length < MAX_SIMULTANEOUS_RESERVATIONS;
}

function createCalendarEvent(data) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  const start = new Date(data.fecha + 'T' + data.hora + ':00');
  const end = new Date(start.getTime() + (RESERVATION_DURATION_HOURS * 60 * 60 * 1000));
  
  const title = `Reserva: ${data.nombre} (${data.personas} pers.)`;
  const description = `
Teléfono: ${data.telefono}
Email: ${data.email}
Ocasión: ${data.ocasion || 'Ninguna'}
Mensaje: ${data.mensaje || 'Sin mensaje adicional'}
---
Reservado desde la Web.
  `.trim();

  return calendar.createEvent(title, start, end, {
    description: description
  });
}

function createResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
