import esLocale from "@fullcalendar/core/locales/es";

const d = document;

export default function calendarRender () {
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
      return day !== 0 && day !== 1;
    },
    // titleFormat: { year: "numeric", month: "short", day: "numeric"},
    locale: esLocale
  });

  calendar.render();

};