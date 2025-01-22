import esLocale from "@fullcalendar/core/locales/es";
import { renderTurns } from "./turns.js";
import { getTurnsByUserActive, getRecurrentTurnsByUserActive } from  "./requests.js";
import rrulePlugin from '@fullcalendar/rrule';
import { getWidthDisplay } from "../utils/utils.js";
import { eventInfo, dateInfo, dateSetStyles, getInitialDate, determinateRangeOfDays } from "../utils/calendar.js";

import "../styles/calendar.css";

const d = document;

const calendario = `<div class="calendar-container" id="calendar"></div>`;

async function calendarRender (modalElement, data) {

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
    editable: false,
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
    eventClick: function(info) {
      eventInfo(info, data)
    },
    dateClick: function(info) {
      dateInfo(info, data, modalElement)
    },
    selectable: false,
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
  calendario,
  calendarRender
}
