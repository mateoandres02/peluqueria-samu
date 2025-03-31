import { getToday, parseDate } from '../utils/date.js';

import { getTurnsHistoryFilteredByDate, getTurnsHistoryFilteredByDateAndBarber, getTurnsHistoryFilteredByBarber, getHistoryTurns } from './requests.js';

import '/src/styles/historialTurnos.css';

const today = getToday() 

const containerHistoryView = `<div class="containerHistoryView containerFunctionalityView"></div>`;

const infoSectionHistoryTurnsView = `
  <div class="present-container infoSectionHistoryTurnsView">
    <h2>Historial de turnos</h2>
    <p>Visualiza un historial respecto a la creación o eliminación de turnos.</p>
    <div class="present-container-filters cashRegisterFilterContainer">
      <div class="present-container-filter cashRegisterFilter">
        <span>Filtrar por fecha</span>
        <input type="date" id="filterDateInputHistory" class="filter-date-cash-tracking" value="${today}">
      </div>
      <div class="present-container-filter filterBarber">
        <span>Filtrar por barbero</span>
        <select id="barberSelectHistory" class="form-select">
          <option value="null">Todos</option>
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
  <div class="table-container-footer"></div>
`;


const rows = (dataTurns) => {
  let row = '';
  let idsTurnHistoryPubliqued = [];

  dataTurns.forEach((turn, index) => {

    if (idsTurnHistoryPubliqued.includes(turn.FechaTurno)) {
     return;
    } else {
      idsTurnHistoryPubliqued.push(turn.FechaTurno);
    }

    if (index > -1) {

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
          <td colspan="8">No se encontraron turnos para los filtros aplicados.</td>
        </tr>`;
      return;
    }

    const dataHistoryTurns = await responseHistoryTurns.json();

    tableBodyTurnsHistoryView.innerHTML = dataHistoryTurns.length
      ? rows(dataHistoryTurns)
      : `<tr>
           <td colspan="8">No se encontraron turnos para los filtros aplicados.</td>
         </tr>`;
  } catch (error) {
    alert("Error al renderizar el historial de turnos");
  }
};


const applyFilters = async (tableBodyTurnsHistoryView, dateInput, barberSelect) => {

  const selectedDate = dateInput ? dateInput.value : null;
  const selectedBarber = barberSelect && barberSelect.value !== 'null' ? barberSelect.value : null;

  await historyTurnsRender(tableBodyTurnsHistoryView, selectedDate, selectedBarber);

};


const setupFilters = (tableBody, dateInput, barberSelect) => {

  dateInput.addEventListener('change', async () => {
    await applyFilters(tableBody, dateInput, barberSelect);
  });

  barberSelect.addEventListener('change', async () => {
    await applyFilters(tableBody, dateInput, barberSelect);
  });

};


export {
  containerHistoryView,
  infoSectionHistoryTurnsView,
  tableTurnsHistory,
  historyTurnsRender,
  setupFilters
};
