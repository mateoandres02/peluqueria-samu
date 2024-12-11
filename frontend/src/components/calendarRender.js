import esLocale from "@fullcalendar/core/locales/es";
import { modalPostTurn } from "./modalPostTurn.js";
import { modalGetTurn, modalTurnContent } from "./modalGetTurn.js"
// import checkAuthentication from "./auth.js";
import { getRecurrentTurnsByUserActive, getTurnsByUserActive, renderTurns } from "./turns.js";
import rrulePlugin from '@fullcalendar/rrule'
import "../styles/vistaCalendario.css";

const d = document;
let body = document.body;

export default async function calendarRender (modalElement, data) {
  
  /**
   * Renderiza el calendario.
   * param: modalElement -> element html
   * param: data -> user active
   */

  const turns = await getTurnsByUserActive(data);
  const recurrentTurns = await getRecurrentTurnsByUserActive(data);

  let arrayTurns = await renderTurns(turns, recurrentTurns);

  let calendarEl = d.getElementById("calendar");

  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    timeZone: 'America/Argentina/Cordoba',

    eventMaxStack: true,

    plugins: [rrulePlugin],

    // Establece el rango horario cada media hora
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
    },
    slotLabelInterval: '00:30:00',
    slotDuration: '00:30:00',
    slotMinTime: '08:00:00', // Establece rango horario desde las 8 hasta las 23
    
    // Evitamos el manejo manual de horarios de los turnos.
    editable: false,

    dayMaxEventRows: true,

    views: {
      timeGrid: {
        dayMaxEventRows: 6
      },
      dayGrid: {
        dayMaxEventRows: 3
      }
    },

    //desactiva la opcion todo el dia de la vista semanal en el top de la vista del calendario
    allDaySlot: false,

    headerToolbar: { 
      left: 'dayGridMonth,timeGridWeek,timeGridDay', // agregar myCustomButton si queremos uno personalizado.
      center: 'title',
      right: 'prev,next',
    },

    events: arrayTurns,

    eventClick: function(info) {
      document.querySelectorAll('.fc-popover').forEach(popover => popover.remove());

      body.insertAdjacentHTML('beforeend', modalTurnContent);
      modalGetTurn(info);
      const modales = document.querySelectorAll('.modal');
      modales.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function () {
          const focusableElement = document.querySelector('.fc-button-active') || document.body;
          focusableElement.focus();
          this.remove();
        });
      });
    },

    // customButtons: {
    //   myCustomButton: {
    //     text: `boton personalizado`,
    //     click: function() {
    //       alert("funcionalidad del boton personalizado");
    //     }
    //   }
    // },

    dateClick: function(info) {
      // Preguntamos si el usuario está autenticado.
      // checkAuthentication();
      body.insertAdjacentHTML('beforeend', modalElement);
      modalPostTurn(info, data);
      document.querySelector('.modal').addEventListener('hidden.bs.modal', function () {
        this.remove();
      });

    },

    selectable: false,
    
    // Bloquea selección en dias no trabajables (lunes y domingos).
    // selectAllow: function(selectInfo) {
    //   let day = selectInfo.start.getUTCDay();
    //   return day !== 0 && day !== 1;
    // },

    locale: esLocale,
    eventOverlap: false,

    datesSet: function() {
      const fcColDayToday = document.querySelectorAll('.fc-timegrid-col');
      fcColDayToday.forEach(el => {
        if (el.classList.contains('fc-day-today')) {
          el.style.backgroundColor = "#fffcdc";
          el.style.height = "800px";
        }
      });
    }
      
  });

  calendar.render();

  const fcColDayToday = d.querySelectorAll('.fc-timegrid-col');
  fcColDayToday.forEach(el => {
    if (el.classList.contains('fc-day-today')) {
      el.style.backgroundColor = "#fffcdc";
      el.style.height = "800px";
    }
  }) 
  
};