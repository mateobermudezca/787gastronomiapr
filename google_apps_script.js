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

// Configuración de Email Profesional
const SENDER_NAME = '787 Gastronomía - Reservas';
const MENU_URL = 'https://drive.google.com/file/d/1VSGPszlCJiIkliUln1LGAMReY7vU1A-o/view';
const LOGO_URL = 'https://raw.githubusercontent.com/mateobermudezca/787gastronomiapr/main/images/logo.png';
const BRAND_COLOR = '#D4A017'; // Dorado de la web
const BG_COLOR = '#09090B';    // Fondo oscuro premium

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
    
    // Enviar correo profesional de confirmación
    sendProfessionalEmail(data);
    
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

  // REMOVEMOS el parámetro 'guests' para evitar que Google Calendar sea "demasiado atento"
  // y cree links de Meet o envíe correos de RSVP automáticos que no podemos controlar.
  return calendar.createEvent(title, start, end, {
    description: description,
    sendInvites: false // No se envían invitaciones automáticas
  });
}

/**
 * Formatea una fecha para el link de Google Calendar (YYYYMMDDTHHmmSSZ)
 */
function formatDateForCalendar(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Envía un correo electrónico con estética Dark Luxury
 */
function sendProfessionalEmail(data) {
  const start = new Date(data.fecha + 'T' + data.hora + ':00');
  const end = new Date(start.getTime() + (RESERVATION_DURATION_HOURS * 60 * 60 * 1000));
  
  const calendarTitle = encodeURIComponent('787 Gastronomía - Mi Reserva');
  const calendarDetails = encodeURIComponent(`Reserva para ${data.personas} personas.\nOcasión: ${data.ocasion || 'General'}\n¡Te esperamos!`);
  const calendarLocation = encodeURIComponent('Cra. 36 #8a-12, El Poblado, Medellín');
  const calendarDates = formatDateForCalendar(start) + '/' + formatDateForCalendar(end);
  
  const googleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${calendarDates}&details=${calendarDetails}&location=${calendarLocation}`;

  const htmlBody = `
    <div style="background-color: ${BG_COLOR}; color: #ffffff; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; max-width: 600px; margin: auto; border: 1px solid ${BRAND_COLOR}; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="${LOGO_URL}" alt="787 Gastronomía" style="width: 100px; height: auto; margin-bottom: 10px;">
        <h1 style="color: ${BRAND_COLOR}; font-size: 28px; margin: 0; letter-spacing: 2px;">787 GASTRONOMÍA</h1>
        <p style="color: #e4e4e7; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px;">Confirmación de Reserva</p>
      </div>
      
      <div style="background: rgba(212, 160, 23, 0.05); border: 1px solid rgba(212, 160, 23, 0.2); padding: 25px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: ${BRAND_COLOR}; font-size: 20px; margin-top: 0;">¡Hola, ${data.nombre}!</h2>
        <p style="color: #e4e4e7; line-height: 1.6;">Tu mesa ha sido reservada con éxito. Estamos ansiosos por brindarte la mejor experiencia de Puerto Rico en Medellín.</p>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="margin: 5px 0;"><strong>📅 Fecha:</strong> ${data.fecha}</p>
          <p style="margin: 5px 0;"><strong>⏰ Hora:</strong> ${data.hora}</p>
          <p style="margin: 5px 0;"><strong>👥 Personas:</strong> ${data.personas}</p>
          ${data.ocasion ? `<p style="margin: 5px 0;"><strong>✨ Ocasión:</strong> ${data.ocasion}</p>` : ''}
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 40px;">
        <a href="${googleCalendarLink}" target="_blank" style="color: ${BRAND_COLOR}; text-decoration: none; font-size: 14px; border: 1px solid ${BRAND_COLOR}; padding: 8px 16px; border-radius: 4px; display: inline-block;">📅 Añadir a mi Calendario</a>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 20px;">¿Quieres ir antojándote de nuestro sabor?</p>
        <a href="${MENU_URL}" style="background-color: ${BRAND_COLOR}; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; transition: background 0.3s;">VER MENÚ COMPLETO</a>
      </div>
      
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #71717a; font-size: 12px;">
        <p style="margin: 0;">Cra. 36 #8a-12, El Poblado, Medellín</p>
        <p style="margin: 5px 0;">Tel: +57 315 3597524</p>
        <p style="margin: 20px 0 0 0;">© ${new Date().getFullYear()} 787 Gastronomía Puertorriqueña</p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: data.email,
    subject: `Confirmación de Reserva - 787 Gastronomía`,
    name: SENDER_NAME,
    htmlBody: htmlBody
  });
}

function createResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
