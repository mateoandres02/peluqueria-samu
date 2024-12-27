import esLocale from "@fullcalendar/core/locales/es";
import { modalPostTurn } from "./modalPostTurn.js";
import { modalGetTurn, modalTurnContent } from "./modalGetTurn.js";
// import checkAuthentication from "./auth.js";
import { renderTurns } from "./turns.js";
import { getTurnsByUserActive, getRecurrentTurnsByUserActive } from  "./requests.js";
import rrulePlugin from '@fullcalendar/rrule';

import "../styles/calendar.css";

const d = document;
const body = document.body;

// Determina la vista inicial y los días visibles según el ancho de la pantalla.
const getWidthDisplay = () => {
  const innerWidth = window.innerWidth;
  return {
    days: innerWidth <= 640 ? 3 : 7,
    isMobile: innerWidth <= 640,
  };
};

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
const eventInfo = (info, data) => {
  
  /**
   * Permite ver la información del evento almacenado en la base de datos. Hace un get del evento generado.
   * Quita todos los popovers para mostrar de manera correcta la modal.
   * param: info -> información provista por fullcalendar de la celda seleccionada.
   * data -> información del usuario logueado.
   */

  document.querySelectorAll('.fc-popover').forEach(popover => popover.remove());

  body.insertAdjacentHTML('beforeend', modalTurnContent);
  modalGetTurn(info, data);

  document.querySelectorAll('.modal').forEach(modal => removeAllModals(modal));
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

// Obtiene el lunes o el día actual como fecha inicial.
const getInitialDate = (isMobile) => {
  const today = new Date();
  if (!isMobile) {
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    today.setDate(today.getDate() + diff);
  }
  return today.toISOString().split('T')[0];
};

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

  const { days, isMobile } = getWidthDisplay();
  const initialDate = getInitialDate(isMobile);

  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    initialDate: initialDate,
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
    nowIndicator: true,
    views: {
      timeGridWeek: {
        type: 'timeGrid',
        duration: { days },
        buttonText: 'Semana',
        dayMaxEventRows: 6,
        visibleRange: (currentDate) => {
          const start = new Date(currentDate);
          const end = new Date(currentDate);
          start.setDate(start.getDate() - (isMobile ? 0 : start.getDay() - 1));
          end.setDate(start.getDate() + days - 1);
          return { start, end };
        },
      },
      // timeGridDay: {
      //   type: 'timeGrid',
      //   duration: { days: 1 },
      //   buttonText: 'Día',
      //   // visibleRange: () => {
      //   //   const today = new Date(); // Siempre usa el día actual.
      //   //   const start = new Date(today);
      //   //   const end = new Date(today);
      //   //   return { start, end };
      //   // },
      // },
    },
    allDaySlot: false,
    headerToolbar: { 
      left: 'dayGridMonth,timeGridWeek',
      center: 'title',
      right: 'prev,next',
    },
    events: arrayTurns,
    eventClick: function(info) {
      eventInfo(info, data)
    },
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
    datesSet: function(info) {
      dateSetStyles();
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
