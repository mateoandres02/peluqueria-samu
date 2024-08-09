import esLocale from "@fullcalendar/core/locales/es";
import { modal } from "./modal.js";
import checkAuthentication from "./auth.js";

const d = document;

let body = document.body;

const getTurnsByUserActive = async (data) => {
  const response = await fetch(`http://localhost:3001/turns/${data.user.Id}`);

  const turns = await response.json();

  return turns;
}

const turnDateEnd = (date) => {
  const [datePart, timePart] = date.split('T');

  const [hour, minute, ] = timePart.split(":");

  let dateHourEnd = hour;
  let dateMinutesEnd = '';

  if (minute === '00') {
    dateMinutesEnd = '30';
  } else if (minute === '30') {
    dateHourEnd = parseInt(dateHourEnd) + 1;
    dateMinutesEnd = '00';
  }

  if (dateHourEnd === 9) {
    dateHourEnd = '09'
  }

  const dateEnd = `${dateHourEnd}:${dateMinutesEnd}`;

  const completeDateEnd = `${datePart}T${dateEnd}`;

  return completeDateEnd;
}

// El parámetro data contiene la información del usuario logueado.
export default async function calendarRender (modalElement, data) {

  // Renderizamos los turnos
  const turns = await getTurnsByUserActive(data);
  
  const arrayTurns = turns.map(turn => {
    const dateEnd = turnDateEnd(turn.Date);

    return {
      id: turn.Id,
      title: turn.Nombre,
      start: turn.Date,
      end: dateEnd,
      extendedProps: {
        telefono: turn.Telefono
      }
    };

  });

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
    editable: true,

    //desactiva la opcion todo el dia de la vista semanal en el top de la vista del calendario
    allDaySlot: false,

    // Nav del header
    headerToolbar: { 
      left: 'dayGridMonth,timeGridWeek,timeGridDay,myCustomButton',
      center: 'title',
      right: 'prev,next'
    },

    // Eventos
    // events: [
    //   {
    //     id:"1",
    //     title: "Evento 1",
    //     start: "2024-08-01T10:00:00",
    //     extendedProps: {
    //       telefono: "3517594888"
    //     },
    //     description: "lectura"
    //   },
    //   {
    //     id:"2",
    //     title: "Evento 2",
    //     start: "2024-08-01T16:30:00",
    //     end: "2024-08-01T17:00:00",
    //     extendedProps: {
    //       telefono: "3517594888"
    //     },
    //     description: "lectura"
    //   }
    // ],
    events: arrayTurns,

    eventClick: function(info){
      alert("ula")
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

      console.log(info)

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
    locale: esLocale
  
  });

  calendar.render();
};