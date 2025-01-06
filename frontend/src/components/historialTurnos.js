import { parseDate, reformatDate } from '../utils/date.js';
import { getBarbers, getTurnsHistoryFilteredByDate, getTurnsHistoryFilteredByDateAndBarber, getTurnsHistoryFilteredByBarber } from './requests.js';

import '/src/styles/historialTurnos.css';

const containerHistoryView = `<div class="containerHistoryView containerFunctionalityView"></div>`;

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
const formattedDate = today.toISOString().split('T')[0];

const infoSectionHistoryTurnsView = `
  <div class="present-container infoSectionHistoryTurnsView">
    <h2>Historial de turnos</h2>
    <p>Visualiza un historial respecto a la creación o eliminación de turnos.</p>
    <div class="present-container-filters cashRegisterFilterContainer">
      <div class="present-container-filter cashRegisterFilter">
        <span>Filtrar por fecha</span>
        <input type="date" id="filterDateInputHistory" class="filter-date-cash-tracking" value="${formattedDate}">
      </div>
      <div class="present-container-filter filterBarber">
        <span>Filtrar por barbero</span>
        <select id="barberSelectHistory" class="form-select">
          <option value="null">Seleccionar...</option>
        </select>
      </div>
    </div>
  </div>
`;

const tableTurnsHistory = `
  <div class="table-container table-history-container">
    <table>
      <thead>
        <tr>
          <th scope="col">FECHA CREACION</th>
          <th scope="col">HORARIO CREACION</th>
          <th scope="col">FECHA TURNO</th>
          <th scope="col">HORA TURNO</th>
          <th scope="col">BARBERO</th>
          <th scope="col">CLIENTE</th>
          <th scope="col">FIJO</th>
          <th scope="col">ACCION</th>
        </tr>
      </thead>
      <tbody class="table-history-body">
      </tbody>
    </table>
  </div>
`;

const loadBarberSelectHistory = async (barberSelect) => {
  const barbers = await fetch('https://peluqueria-invasion-backend.vercel.app/users', { credentials: 'include' });
  // const barbers = await fetch('http://localhost:3001/users');
  const dataBarbers = await barbers.json();

  dataBarbers.forEach(barber => {
    barberSelect.innerHTML += `<option value="${barber.Nombre}">${barber.Nombre}</option>`;
  });
}

const rows = (dataTurns) => {
  let row = '';
  let idsTurnHistoryPubliqued = [];

  //let dataTurnsConcats = [...dataTurns, ...dataRecurrentTurns];

  dataTurns.forEach((turn, index) => {
    //if (user.exdate == 1) {
    //  return;
    //}
    console.log("TURNOS", turn)
    if (idsTurnHistoryPubliqued.includes(turn.FechaTurno)) {
     return;
    } else {
      idsTurnHistoryPubliqued.push(turn.FechaTurno);
    }

    if (index > -1) {

      //let costField = user.precio ? user.precio : '0'; 

      let dateCreate = turn.FechaCreacion ? parseDate(turn.FechaCreacion) : '';
      let dateTurn = turn.FechaTurno ? parseDate(turn.FechaTurno) : '';


      let action = turn.Accion == 'POST' ? 'AGREGADO' : 'ELIMINADO';
      let fijo = turn.Fijo == 'true' ? 'SI' : 'NO';
      const rowClass = turn.Accion == 'POST' ? 'agregado' : 'eliminado';

      row += `
        <tr key=${turn.Id} class="${rowClass}">
          <td scope="row">${dateCreate.dateWithoutTime}</td>
          <td>${dateCreate.timeWithoutSeconds}</td>
          <td>${dateTurn.dateWithoutTime}</td>
          <td>${dateTurn.timeWithoutSeconds}</td>
          <td>${turn.Barbero}</td>
          <td>${turn.Cliente}</td>
          <td>${fijo}</td>
          <td>${action}</td>
        </tr>
      `;
    }
  });

  return row;
};

const getHistoryTurns = async () => {
  // const responseTurns = await fetch('http://localhost:3001/historyturns');
  const responseTurns = await fetch('https://peluqueria-invasion-backend.vercel.app/historyturns', { credentials: 'include' });

  return responseTurns;
}

const applyFilters = async (tableBodyTurnsHistoryView) => {
  const dateInput = document.querySelector('#filterDateInputHistory');
  const barberSelect = document.querySelector('#barberSelectHistory');

  // Obtener los valores seleccionados
  const selectedDate = dateInput ? dateInput.value : null;
  const selectedBarber = barberSelect && barberSelect.value !== 'null' ? barberSelect.value : null;

  // Llamar a la función de renderizado con los filtros aplicados
  await historyTurnsRender(tableBodyTurnsHistoryView, selectedDate, selectedBarber);
};

const setupFilters = (tableBodyTurnsHistoryView) => {
  const dateInput = document.querySelector('#filterDateInputHistory');
  const barberSelect = document.querySelector('#barberSelectHistory');

  // Listener para el filtro por fecha
  dateInput.addEventListener('change', async () => {
    await applyFilters(tableBodyTurnsHistoryView);
  });

  // Listener para el filtro por barbero
  barberSelect.addEventListener('change', async () => {
    await applyFilters(tableBodyTurnsHistoryView);
  });
};

const historyTurnsRender = async (tableBodyTurnsHistoryView, selectedDate = null, barberId = null) => {
  try {
    let responseHistoryTurns;

    if (selectedDate && barberId) {
      responseHistoryTurns = await getTurnsHistoryFilteredByDateAndBarber(selectedDate, barberId);
    } else if (selectedDate) {
      responseHistoryTurns = await getTurnsHistoryFilteredByDate(selectedDate);
    } else if (barberId) {
      responseHistoryTurns = await getTurnsHistoryFilteredByBarber(barberId);
    } else {
      responseHistoryTurns = await getHistoryTurns();
    }

    if (!responseHistoryTurns.ok) {
      tableBodyTurnsHistoryView.innerHTML = `
        <tr>
          <td colspan="7">No se encontraron turnos para los filtros aplicados.</td>
        </tr>`;
      return;
    }

    const dataHistoryTurns = await responseHistoryTurns.json();

    tableBodyTurnsHistoryView.innerHTML = dataHistoryTurns.length
      ? rows(dataHistoryTurns)
      : `<tr>
           <td colspan="7">No se encontraron turnos para los filtros aplicados.</td>
         </tr>`;
  } catch (error) {
    console.error("Error al renderizar el historial de turnos:", error);
  }
};

export {
  containerHistoryView,
  infoSectionHistoryTurnsView,
  tableTurnsHistory,
  loadBarberSelectHistory,
  historyTurnsRender,
  setupFilters
};
