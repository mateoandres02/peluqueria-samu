import esLocale from "@fullcalendar/core/locales/es";
import { modal } from "./modalPostTurn.js";
import { modalTurnContent, modalTurnContentDisplay } from "./modalGetTurn.js"
import checkAuthentication from "./auth.js";
import { getTurnsByUserActive, renderTurns } from "./turns.js";
import rrulePlugin from '@fullcalendar/rrule';

const d = document;
let body = document.body;

// param: data -> user active
// param: modalElement -> element html
export default async function calendarRender (modalElement, data) {

  // Obtenemos los turnos del user activo.
  const turns = await getTurnsByUserActive(data);

  // Mapeamos esos turnos en un arreglo para cargarlo en la propiedad events.
  let arrayTurns = await renderTurns(turns);

  // Calendario.
  let calendarEl = d.getElementById("calendar");

  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    timeZone: 'America/Argentina/Cordoba',

    // Establece el rango horario cada media hora
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
    },
    slotLabelInterval: '00:30:00',
    slotDuration: '00:30:00',

    // Establece rango horario desde las 8 hasta las 23
    slotMinTime: '08:00:00',
    
    // Evitamos el manejo manual de horarios de los turnos.
    editable: false,

    dayMaxEventRows: true,

    views: {
      timeGrid: {
        dayMaxEventRows: 6 // adjust to 6 only for timeGridWeek/timeGridDay
      },
      dayGrid: {
        dayMaxEventRows: 3
      }
    },

    //desactiva la opcion todo el dia de la vista semanal en el top de la vista del calendario
    allDaySlot: false,

    // Nav del header
    headerToolbar: { 
      left: 'dayGridMonth,timeGridWeek,timeGridDay,myCustomButton',
      center: 'title',
      right: 'prev,next'
    },

    // Cargamos los turnos del usuario activo.
    events: arrayTurns,

    eventClick: function(info) {
      
      body.insertAdjacentHTML('beforeend', modalTurnContent);

      modalTurnContentDisplay(info);

      const modales = document.querySelectorAll('.modal');

      modales.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function () {
          this.remove();
        });
      });
      
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

    // dayCellDidMount: function(info) {
    //   // Agregar data-atributes a las celdas para que hagan desplegar la modal
    //   info.el.setAttribute('data-bs-toggle', 'modal');
    //   info.el.setAttribute('data-bs-target', '#dateClickModal');
    // },

    // Añadir atributos a las celdas de tiempo
    // datesSet: function (info) {
    //   document.querySelectorAll('.fc-timegrid-slot').forEach(cell => {
    //     cell.info.setAttribute('data-bs-toggle', 'modal');
    //     cell.info.setAttribute('data-bs-target', '#dateClickModal');
    //   });
    // },

    // Añadir atributos a las celdas de tiempo en la vista semanal
    // datesSet: function () {
    //   // document.querySelectorAll('.fc-timegrid-slot').forEach(cell => {
    //   //   cell.setAttribute('data-bs-toggle', 'modal');
    //   //   cell.setAttribute('data-bs-target', '#dateClickModal');
    //   // });
    // },

    // Trabajamos la funcionalidad de modal
    // Se trata de pasar una función anónima como callback en lugar de pasar la referencia directa a la función.
    dateClick: function(info) {

      // Preguntamos si el usuario está autenticado.
      checkAuthentication();

      // Insertamos la modal cuando se hace click en una celda
      body.insertAdjacentHTML('beforeend', modalElement);
      
      // Manejamos funcionalidad de la modal.
      modal(info, calendar, data);

      document.querySelector('.modal').addEventListener('hidden.bs.modal', function () {
        this.remove();
      });

    },

    // Permite que se puedan seleccionar las casillas.
    selectable: false,

    // Restringe la seleccion a un solo dia, es decir que no permite el arrastre de seleccion de dias, sino la seleccion de un solo dia en mas de un horario
    // selectAllow: function(selectInfo) {
    //   const startDate = new Date(selectInfo.start);
    //   const endDate = new Date(selectInfo.end);
    //   // const startDate = selectInfo.startStr; 
    //   // const endDate = selectInfo.endStr; 
    //   // const isSingleDay = selectInfo.startStr === selectInfo.endStr;
      
    //   console.log("startStr:", startDate);
    //   console.log("endStr:", endDate);

    //   // Convertir a solo la parte de la fecha (ignorar la hora)
    //   const isSingleDay = startDate.toISOString().split('T')[0] === endDate.toISOString().split('T')[0];


    //   if (isSingleDay) {
    //     calendarEl.classList.add("fc-allowed-selection");
    //     console.log("Selección permitida para un solo día");
    //   } else {
    //     calendarEl.classList.remove("fc-allowed-selection");
    //   }
      
    //   // document.addEventListener('mouseup', function() {
    //   //   calendarEl.classList.remove("fc-allowed-selection");
    //   // });

    //   return isSingleDay
    // },

    
    // Bloquea selección en dias no trabajables (lunes y domingos).
    // selectAllow: function(selectInfo) {
    //   let day = selectInfo.start.getUTCDay();
    //   return day !== 0 && day !== 1;
    // },

    // titleFormat: { year: "numeric", month: "short", day: "numeric"},

    // Configura el idioma
    locale: esLocale,

    plugins: [rrulePlugin]
  
  });

  calendar.render();
};