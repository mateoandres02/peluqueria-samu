import esLocale from "@fullcalendar/core/locales/es";
import { modal } from "./modal.js";

const d = document;

export default function calendarRender () {
  let calendarEl = d.getElementById("calendar");

  let calendar = new FullCalendar.Calendar(calendarEl, {
    // Vista inicial
    initialView: "timeGridWeek",

    // establece la zona horaria (no se si funciona correctamente)
    timeZone: 'America/Argentina/Cordoba',

    // establece el rango horario cada media hora
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
    },
    slotLabelInterval: '00:30:00',
    slotDuration: '00:30:00',

    // establece rango horario desde las 8 hasta las 11
    slotMinTime: '08:00:00',
    slotMaxTime: '23:30:00',

    //desactiva la opcion todo el dia de la vista semanal en el top de la vista del calendario
    allDaySlot: false,

    // Nav del header
    headerToolbar: { 
      left: 'dayGridMonth,timeGridWeek,timeGridDay,myCustomButton',
      center: 'title',
      right: 'prev,next'
    },

    // Botones customizables
    customButtons: {
      myCustomButton: {
        text: `boton personalizado`,
        click: function() {
          alert("funcionalidad del boton personalizado");
        }
      }
    },

    dayCellDidMount: function(info) {
      // Agregar data-atributes a las celdas para que hagan desplegar la modal
      info.el.setAttribute('data-bs-toggle', 'modal');
      info.el.setAttribute('data-bs-target', '#dateClickModal');
    },

    // Trabajamos la funcionalidad de modal
    dateClick: function(info) {
      //  Esa estructura es correcta. Se trata de pasar una función anónima como callback en lugar de pasar la referencia directa a la función.
      modal(info);
    },

    // Permite que se puedan seleccionar las casillas.
    selectable: true,

    // Bloquea selección en dias no trabajables (lunes y domingos).
    // selectAllow: function(selectInfo) {
    //   let day = selectInfo.start.getUTCDay();
    //   return day !== 0 && day !== 1;
    // },

    // titleFormat: { year: "numeric", month: "short", day: "numeric"},

    // No se que hace.
    locale: esLocale
  });

  calendar.render();
};