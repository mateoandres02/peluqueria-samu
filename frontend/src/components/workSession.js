import "../styles/workSessions.css"
import "../styles/configParams.css";
import "../styles/voucher.css"


import { getToday } from '../utils/date.js';
import { postWorkSession, updateWorkSession } from '../utils/crud.js'
import { formatOnlyDate, formatOnlyTime } from '../utils/date.js';
import { getWorkSessionsByDate, getWorkSessions } from './requests.js';

import '/src/styles/historialTurnos.css';

const today = getToday();

const containerWorkSessionsView = `<div class="containerHistoryView containerWorkSessionsView containerFunctionalityView"></div>`

const infoSectionWorkSessionsView = `
<div class="present-container infoSectionHistoryTurnsView">
  <h2>Historial de sesiones de trabajo</h2>
  <p>Marca la presencia de tu horario laboral.</p>
  <div class="present-container-filters work-session-filters">
    <div class="present-container-filter work-session-filter">
      <span>Filtrar por fecha</span>
      <input type="date" id="filterDateInputWorkSession" class="filter-date-cash-tracking" value="${today}"></input>
      <div class="buttons-container">
        <button id="startSession">Iniciar</button>
        <button id="endSession">Finalizar</button>
      </div>
      <div class="cronometro-container">
        <span class="cronometro-label">Tiempo transcurrido</span>
        <span id="cronometro">00:00:00</span>
      </div>
    </div>
  </div>
</div>`

const tableWorkSessions = `
  <div class="table-container table-worksession-container">
    <table>
      <thead>
        <tr>
          <th scope="col">FECHA SESION</th>
          <th scope="col">HORARIO INICIO</th>
          <th scope="col">HORARIO FIN</th>
          <th scope="col">HS TRABAJADAS</th>
        </tr>
      </thead>
      <tbody class="table-history-body table-worksession-body">
      </tbody>
    </table>
  </div>
`


const sessionsRender = async (table, selectedDate = null) => {
  let responseSessions;
  try {
    // console.log("selectedDate", selectedDate)
    if (selectedDate) {
      responseSessions = await getWorkSessionsByDate(selectedDate);
    } else {
      responseSessions = await getWorkSessions();
    }

    if ( responseSessions.message ) {
      table.innerHTML = `
        <tr>
          <td colspan="5" No se encontraron sesiones para los filtros aplicados.</td>
        </tr>
      `;
      return;
    }

    const dataSessions = await responseSessions.json();

    table.innerHTML = dataSessions.length 
    ? rows(dataSessions)
    : '<tr><td colspan="5">No se encontraron sesiones para los filtros aplicados.</td></tr>';

  } catch (error) {
    alert("Error al renderizar el listado de sesiones");
    // console.log('error', error);
  }
};

const rows = (dataSessions) => {
  let row = '';

  // console.log("screen specs w ", screen.width)
  // console.log("screen specs h ", screen.height)

  dataSessions.forEach((session) => {
    // const dateCreate = session.FechaSesion ? parseDate(session.FechaSesion) : {};
    const dateFormatted = session.FechaSesion ? formatOnlyDate(session.FechaSesion): "-";
    const timeStart = session.HorarioInicio ? formatOnlyTime(session.HorarioInicio): "-";
    const timeEnd = session.HorarioFin ? formatOnlyTime(session.HorarioFin): "-";
    // console.log("SESSION", session)
    row += `
      <tr key=${session.Id}>
        <td>${dateFormatted || ''}</td>
        <td>${timeStart || '-'}</td>
        <td>${timeEnd || '-'}</td>
        <td>${session.CantHoras != null ? session.CantHoras : '-'}</td>
      </tr>
    `;
  });

  return row;
};


const applyDateFilter = async (tableBodyWorkSessions, dateInput) => {
  const selectedDate = dateInput ? dateInput.value : null;
  
  await sessionsRender(tableWorkSessions, selectedDate)
}

const setupFilterSessions = (tableBody, dateInput) => {
  dateInput.addEventListener('change', async () => {
    await applyDateFilter(tableBody, dateInput);
  });
}
 
const addDateFilterListenerWorkSessions = async (table, dateInput) => {

  dateInput.removeEventListener('change', handleDateChange);
  dateInput.addEventListener('change', handleDateChange);

  async function handleDateChange(e) {
    let selectedDate = e.target.value;

    await sessionsRender(table, selectedDate);
  }
};

//CRONÓMETRO
let intervalo;
let tiempoInicio = localStorage.getItem("tiempoInicio") ? parseInt(localStorage.getItem("tiempoInicio")) : null;

const actualizarCronometro = () => {
  if (tiempoInicio) {
    const tiempoActual = Date.now();
    const diferencia = tiempoActual - tiempoInicio;

    const horas = Math.floor(diferencia / 3600000);
    const minutos = Math.floor((diferencia % 3600000) / 60000);
    const segundos = Math.floor((diferencia % 60000) / 1000);

    const cronometro = document.getElementById("cronometro");
    if (cronometro) {
      cronometro.textContent =
        (horas < 10 ? "0" : "") + horas + ":" +
        (minutos < 10 ? "0" : "") + minutos + ":" +
        (segundos < 10 ? "0" : "") + segundos;
    }
  }
};

//INICIAR CRONÓMETRO
const handleStartButton = (button) => {
  button.addEventListener("click", () => {
    if (!tiempoInicio) {
      tiempoInicio = Date.now();
      localStorage.setItem("tiempoInicio", tiempoInicio);

      // Capturar fecha (YYYY-MM-DD)
      // const fechaInicio = new Date().toISOString().split("T")[0];
      const fechaInicio = new Date().toLocaleDateString('en-CA'); // formato YYYY-MM-DD
      console.log("VIENDO FECHA INICIO", fechaInicio)

      // Capturar hora exacta (HH:MM:SS)
      const horarioInicio = new Date().toLocaleTimeString("es-AR", {
        hour12: false, // 24 horas
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      // console.log(`Fecha de inicio: ${fechaInicio}`);
      // console.log(`Horario de inicio: ${horarioInicio}`);

      // Guardar en localStorage si quieres persistirlo
      localStorage.setItem("fechaInicio", fechaInicio);
      localStorage.setItem("horarioInicio", horarioInicio);
      
      postWorkSession(fechaInicio, horarioInicio);
    }

    intervalo = setInterval(actualizarCronometro, 1000);
    actualizarCronometro(); // Para mostrar el tiempo de inmediato sin esperar un segundo
    // console.log("Cronómetro iniciado");
  });
};

//DETENER CRONÓMETRO
const handleEndButton = (button) => {
  button.addEventListener("click", async () => {
    if (tiempoInicio) {
      const tiempoActual = Date.now();
      const diferencia = tiempoActual - tiempoInicio;

      const horas = Math.floor(diferencia / 3600000);
      const minutos = Math.floor((diferencia % 3600000) / 60000);
      const segundos = Math.floor((diferencia % 60000) / 1000);

      //capturar horario de finalizacion
      const horarioFin = new Date().toLocaleTimeString("es-AR", {
        hour12: false, // 24 horas
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      // console.log(`Tiempo trabajado: ${horas}h ${minutos}m ${segundos}s`);
      // console.log(`Horario de finalizacion de la sesion: ${horarioFin}`)
      
      // const cantHoras = `${horas}h ${minutos}m`
      const cantHoras = `${horas}h ${minutos}m`

      //Detener cronómetro
      clearInterval(intervalo);
      localStorage.removeItem("tiempoInicio");
      tiempoInicio = null;

      //Reiniciar visualización de cronómetro
      const cronometro = document.getElementById("cronometro");
      if (cronometro) cronometro.textContent = "00:00:00";

      //actualizar registro
      await updateWorkSession(horarioFin, cantHoras);

      //actualizar pagina para que se vea reflejado el cambio
      window.location.reload();
    }
  });
};

// 📌 Verificar al cargar la página si hay un cronómetro activo
document.addEventListener("DOMContentLoaded", () => {
  if (tiempoInicio) {
    actualizarCronometro();
    intervalo = setInterval(actualizarCronometro, 1000);
  }
});

export {
  containerWorkSessionsView,
  infoSectionWorkSessionsView,
  tableWorkSessions,
  handleStartButton,
  handleEndButton,
  setupFilterSessions,
  sessionsRender,
  addDateFilterListenerWorkSessions
}