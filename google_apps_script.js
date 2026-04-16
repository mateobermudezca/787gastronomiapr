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
    description: description,
    guests: data.email, // Añade al cliente como invitado (opcional)
    sendInvites: true   // Envía invitación por email al cliente
  });
}

function createResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
