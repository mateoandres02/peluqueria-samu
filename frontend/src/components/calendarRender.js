import esLocale from "@fullcalendar/core/locales/es";
import { renderTurns } from "./turns.js";
import { getTurnsByUserActive, getRecurrentTurnsByUserActive } from "./requests.js";
import rrulePlugin from '@fullcalendar/rrule';
import { getWidthDisplay } from "../utils/utils.js";
import { eventInfo, dateInfo, dateSetStyles, getInitialDate, determinateRangeOfDays } from "../utils/calendar.js";

import "../styles/calendar.css";

const d = document;

const calendario = `<div class="calendar-container" id="calendar"></div>`;

async function calendarRender(modalElement, data, clients) {

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
    firstDay: 1,
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
    dayMaxEventRows: true,
    nowIndicator: true,
    views: {
      timeGridWeek: {
        type: 'timeGrid',
        duration: { days },
        buttonText: 'Semana',
        dayMaxEventRows: 6,
        visibleRange: function (currentDate) {
          determinateRangeOfDays(currentDate, isMobile)
        },
      },
    },
    allDaySlot: false,
    headerToolbar: {
      left: 'dayGridMonth,timeGridWeek',
      center: 'title',
      right: 'prev,next',
    },
    events: arrayTurns,
    eventContent: function (args) {
      return {
        html: `<div class="fc-event-title">${args.event.title}</div>`
      };
    },
    eventClick: function (info) {
      eventInfo(info, data, clients)
    },
    dateClick: function (info) {
      dateInfo(info, data, modalElement, clients)
    },
    locale: esLocale,
    eventOverlap: false,
    datesSet: function (info) {
      dateSetStyles();
    },
    editable: false,
    selectable: false,
    // editable: true,
    // selectable: true,
    // eventResize: function(info) {
    //   // Esto se ejecuta cuando el usuario redimensiona (estira o reduce) un evento:

    //   console.log("Evento redimensionado:");
    //   console.log("Nuevo inicio:", info.event.start);
    //   console.log("Nuevo fin:", info.event.end);

    //   const dateStart = new Date(info.event.start);
    //   dateStart.setHours(dateStart.getHours() + 3);
    //   console.log('datestart', dateStart);

    //   const dateEnd = new Date(info.event.end);
    //   dateEnd.setHours(dateEnd.getHours() + 3);
    //   console.log('dateend', dateEnd);

    //   console.log(info.event)
    //   putChangeHourOfTurn(info.event._def.publicId, dateStart, dateEnd, data.user.Id);

    //   // Acá podrías hacer una petición a tu backend para guardar los cambios
    // },
    // eventDrop: function(info) {
    //   // Esto se dispara cuando arrastran el evento a otro día u hora:

    //   console.log("Evento movido:");
    //   console.log("Nuevo inicio:", info.event.start);
    //   console.log("Nuevo fin:", info.event.end);

    //   // También podrías guardar los cambios acá
    // },
  });

  calendar.render();

  dateSetStyles();

};

export {
  calendario,
  calendarRender
}
