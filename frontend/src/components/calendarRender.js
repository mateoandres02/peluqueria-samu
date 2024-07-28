import esLocale from "@fullcalendar/core/locales/es";
import { modal } from "./modal.js";
import checkAuthentication from "./auth.js";

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
      // reveer despues, checkAuthentication deberia ser cambiado por una logica de verificacion si es ese usuario en vez si es ese rol
      // Preguntamos si el usuario está autenticado.
      checkAuthentication();
      //  Esa estructura es correcta. Se trata de pasar una función anónima como callback en lugar de pasar la referencia directa a la función.
      modal(info);
      console.log("Fecha clickeada", info.dateStr)
    },

    // Permite que se puedan seleccionar las casillas.
    selectable: true,

    // Restringe la seleccion a un solo dia, es decir que no permite el arrastre de seleccion de dias, sino la seleccion de un solo dia en mas de un horario
    selectAllow: function(selectInfo) {
      const startDate = new Date(selectInfo.start);
      const endDate = new Date(selectInfo.end);
      // const startDate = selectInfo.startStr; 
      // const endDate = selectInfo.endStr; 
      // const isSingleDay = selectInfo.startStr === selectInfo.endStr;
      
      console.log("startStr:", startDate);
      console.log("endStr:", endDate);

      // Convertir a solo la parte de la fecha (ignorar la hora)
      const isSingleDay = startDate.toISOString().split('T')[0] === endDate.toISOString().split('T')[0];


      if (isSingleDay) {
        calendarEl.classList.add("fc-allowed-selection");
        console.log("Selección permitida para un solo día");
      } else {
        calendarEl.classList.remove("fc-allowed-selection");
      }
      
      // document.addEventListener('mouseup', function() {
      //   calendarEl.classList.remove("fc-allowed-selection");
      // });

      return isSingleDay
    },

    
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