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

const getWidthDisplay = () => {

  /**
   * Obtiene los pixeles de anchura de la pantalla para saber si es un celular o una computadora.
   * Retorna un valor exacto de las columnas que se mostrarían en el calendario en caso de ser un celular o una computadora.
   */

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

// function getMondayDate() {

//   /**
//    * Obtiene el lunes como dia inicial
//    */

//   let today = new Date();
//   let day = today.getDay(); 
//   let diff = day === 0 ? -6 : 1 - day;
//   today.setDate(today.getDate() + diff);
//   today.setHours(today.getHours() - 3);
//   return today.toISOString().split('T')[0];
// }

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
    // initialView: "Semana",
    initialView: "timeGridWeek",
    // initialDate: getMondayDate(),
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
      // Semana: {
      //   type: 'timeGrid',
      //   duration: { days: columnsCalendarViewTimeGrid },
      //   buttonText: 'Semana',
      //   dayMaxEventRows: 6,
      // },
      timeGrid: {
        dayMaxEventRows: 6,
      },
      dayGrid: {
        dayMaxEventRows: 3,
      }
    },
    allDaySlot: false,
    headerToolbar: { 
      // left: 'dayGridMonth,Semana,timeGridDay',
      left: 'dayGridMonth,timeGridWeek,timeGridDay',
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
