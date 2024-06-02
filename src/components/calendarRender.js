// TIPO DE EVENTOS
// dateClick: evento que me permite gestionar una accion al clickear un dia en cualquier vista.
// headerToolBar: habilita la interfaz de arriba que me permite moverme entre meses y semanas (vistas) y sus respectivos dias, ademas de un boton de volver al dia/mes actual .....headerToolbar: { center: 'dayGridMonth,timeGridWeek' },. 
//customButtons: permite poner botones customs en la interfaz de arriba, y tiene propiedades significativas como texto, click, hints (ver documentacion), icons (importados desde bootstrap 4) y bootstrapFontAwesome

import esLocale from "@fullcalendar/core/locales/es"

const d = document;

d.addEventListener('DOMContentLoaded', function() {
  let calendarEl = d.getElementById("calendar");
  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    customButtons: {
      myCustomButton: {
        text: `boton personalizado`,
        click: function() {
          alert("funcionalidad del boton personalizado");
        }
      }
    },

    // dateClick: function() {
    //   alert('un dia ha sido clickeado!')
    // },
    headerToolbar: { 
      left: 'dayGridMonth,timeGridWeek,timeGridDay myCustomButton',
      center: 'title',
      right: 'prev next'
     },
     selectable: true,
     selectAllow: function(selectInfo) {
      let day = selectInfo.start.getUTCDay();
      return day !== 0 && day !==1;
     },
    // titleFormat: { year: "numeric", month: "short", day: "numeric"},
    locale: esLocale
  });
  calendar.render();
});
