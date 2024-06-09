import esLocale from "@fullcalendar/core/locales/es";
import { createModal } from "./modal.js";

const d = document;
createModal()

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
    dateClick: function(info) {
      const modal = d.getElementById("dateClickModal");
      const eventDate = d.getElementById("eventDate");

      // Set the date input value to the clicked date
      eventDate.value = info.dateStr;

      // Muestra el modal
      modal.style.display = "block";

      // Cerrar el modal por boton cerrar
      const closeModal = d.getElementById("closeModal");
      closeModal.onclick = function() {
        modal.style.display = "none";
      };

      // Cerrar la modal cuando se clickea fuera de ella
      window.onclick = function(e) {
        if (e.target == modal) {
          modal.style.display = "none";
        }
      };
    },
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