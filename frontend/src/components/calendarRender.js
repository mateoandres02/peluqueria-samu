import esLocale from "@fullcalendar/core/locales/es";
import { modalPostTurn } from "./modalPostTurn.js";
import { modalGetTurn, modalTurnContent } from "./modalGetTurn.js"
// import checkAuthentication from "./auth.js";
import { getRecurrentTurnsByUserActive, getTurnsByUserActive, renderTurns } from "./turns.js";
import rrulePlugin from '@fullcalendar/rrule'
import "../styles/vistaCalendario.css";

const d = document;
let body = document.body;

const getWidthDisplay = () => {
  let columnsCalendarViewTimeGrid;
  const innerWidth = window.innerWidth;

  if (innerWidth <= 640) {
    columnsCalendarViewTimeGrid = 3;
  } else {
    columnsCalendarViewTimeGrid = 7; 
  }

  return columnsCalendarViewTimeGrid;
}

const removeAllModals = (modal) => {
  /**
   * Remueve todas las modales activas y devuelve el puntero a un objeto del dom para la accesibilidad.
   * param: modal -> modal activa.
   */
  modal.addEventListener('hidden.bs.modal', function () {
    const focusableElement = document.querySelector('.fc-button-active') || document.body;
    focusableElement.focus();
    this.remove();
  });
}

const eventInfo = (info) => {
  
  /**
   * Permite ver la información del evento almacenado en la base de datos. Hace un get del evento generado.
   * Quita todos los popovers para mostrar de manera correcta la modal.
   * param: info -> información provista por fullcalendar de la celda seleccionada.
   */

  document.querySelectorAll('.fc-popover').forEach(popover => popover.remove());

  body.insertAdjacentHTML('beforeend', modalTurnContent);
  modalGetTurn(info);

  const modales = document.querySelectorAll('.modal');
  modales.forEach(modal => removeAllModals(modal));
}

const dateInfo = (info, data, modalElement) => {

  /**
   * Obtiene la info de la celda clickeada para hacer un post.
   * param: info -> información provista por fullcalendar de la celda seleccionada.
   * param: data -> información del usuario logueado
   * param: modalElement -> elemento html de la modal para poder hacer el post.
   */

  // Preguntamos si el usuario está autenticado.
  // checkAuthentication();
  body.insertAdjacentHTML('beforeend', modalElement);
  modalPostTurn(info, data);
  document.querySelector('.modal').addEventListener('hidden.bs.modal', function () {
    this.remove();
  });
};

const dateSetStyles = () => {

  /**
   * Setea estilos en la columna del dia actual.
   */

  const fcColDayToday = document.querySelectorAll('.fc-timegrid-col');
  fcColDayToday.forEach(el => {
    if (el.classList.contains('fc-day-today')) {
      el.style.backgroundColor = "#fffcdc";
      el.style.height = "800px";
    }
  });
}

async function calendarRender (modalElement, data, columnsCalendarViewTimeGrid) {

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
    initialView: "Semana",
    timeZone: 'America/Argentina/Cordoba',
    eventMaxStack: true,
    plugins: [rrulePlugin],
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
    },
    slotLabelInterval: '00:30:00',
    slotDuration: '00:30:00',
    slotMinTime: '08:00:00',
    editable: false,
    dayMaxEventRows: true,
    views: {
      Semana: { // Vista personalizada
        type: 'timeGrid',
        duration: { days: columnsCalendarViewTimeGrid }, // Duración dinámica
        buttonText: 'Semana', // Texto del botón (puedes cambiarlo)
        dayMaxEventRows: 6
      },
      timeGrid: {
        dayMaxEventRows: 6,
      },
      dayGrid: {
        dayMaxEventRows: 3
      }
    },
    allDaySlot: false,
    headerToolbar: { 
      left: 'dayGridMonth,Semana,timeGridDay', // agregar myCustomButton si queremos uno personalizado.
      center: 'title',
      right: 'prev,next',
    },
    events: arrayTurns,
    eventClick: function(info) {
      eventInfo(info)
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
      dateInfo(info, data, modalElement)
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
      dateSetStyles()
    }
      
  });

  calendar.render();

  dateSetStyles();

};

export {
  getWidthDisplay,
  removeAllModals,
  calendarRender
}