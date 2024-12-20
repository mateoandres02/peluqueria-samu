import { parseDate, reformatDate } from './date.js';
import '/src/styles/historialTurnos.css';

const containerHistoryView = `<div class="containerHistoryView"></div>`;

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
const formattedDate = today.toISOString().split('T')[0];

const infoSectionHistoryTurnsView = `
  <div class="infoSectionHistoryTurnsView">
    <h3>Historial de Turnos</h3>
    <p>Se visualizaran registros de agregacion o eliminacion de turnos por barbero y fecha.</p>
    <div class="cashRegisterFilterContainer">
        <div class="cashRegisterFilter">
          <span>Filtrar por fecha</span>
          <input type="date" class="filter-date-cash-tracking" id="filterDateInputHistory" value="${formattedDate}">
      </div>
      <div class="filterBarber">
        <span>Filtrar por barbero</span>
        <select id="barberSelectHistory" class="form-select">
          <option value="null">Seleccionar...</option>
        </select>
      </div>
    </div>
  </div>
`;

const tableTurnsHistory = `
  <div class="table-history-container">
    <table class="table-cash-light">
      <thead class="table-cash-head">
        <tr>
          <th scope="col">FECHA</th>
          <th scope="col">HORA</th>
          <th scope="col">BARBERO</th>
          <th scope="col">CLIENTE</th>
          <th scope="col">ACCION</th>
        </tr>
      </thead>
      <tbody class="table-history-body">
      </tbody>
    </table>
  </div>
`;

//const loadBarberSelect = async (barberSelect) => {
  const barbers = await fetch('http://localhost:3001/users');
  const dataBarbers = await barbers.json();

  dataBarbers.forEach(barber => {
    barberSelect.innerHTML += `<option value="${barber.Nombre}">${barber.Nombre}</option>`;
  });
//}

//const rows = (dataTurns) => {
  let row = '';
  //let idsPubliqued = [];

  //let dataTurnsConcats = [...dataTurns, ...dataRecurrentTurns];

  dataTurns.forEach((user, index) => {
    //if (user.exdate == 1) {
    //  return;
    //}

    //if (idsPubliqued.includes(user.turns.Id)) {
    //  return;
    //} else {
    //  idsPubliqued.push(user.turns.Id);
    //}

    if (index > -1) {

      let costField = user.precio ? user.precio : '0'; 

      let date = user.turns.Date ? parseDate(user.turns.Date) : '';
      //let dateRecurrentTurn = user.date ? parseDate(user.date) : '';

      row += `
        <tr key=${user.turns.Id}>
          <td scope="row">${date.dateWithoutTime}</td>
          <td>${date.timeWithoutSeconds}</td>
          <td>${user.peluquero}</td>
          <td>${user.turns.Nombre}</td>
          <td>Accionnnn</td>
          
        </tr>
      `;
    }
  });

  return row;
//};

//const getTurnsFilteredByDateAndBarber = async (dateParam, barberParam, recurrent) => {

  /**
   * Obtenemos los turnos filtrando por fecha y por barbero.
   * param: dateParam -> fecha elegida.
   * param: barberParam -> barbero elegido.
   * param: recurrent -> un parámetro por defecto para diferenciar si es filtrado por recurrencia o por turnos normales.
   */

  //if (recurrent) {
    //  const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/${barberParam}/${dateParam}`);
    //  return responseRecurrentTurns;
    //} else {
      //  const responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}/${barberParam}`);
      //  return responseTurns;
      //}
  //const responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}/${barberParam}`);
      
  //return responseTurns;
//}

//const getTurnsFilteredByBarber = async (barberParam, recurrent) => {

  /**
   * Obtenemos los turnos filtrando por barbero.
   * param: barberParam -> barbero elegido.
   * param: recurrent -> un parámetro por defecto para diferenciar si es filtrado por recurrencia o por turnos normales.
   */

  //if (recurrent) {
  //  const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/${barberParam}`);
  //  return responseRecurrentTurns;
  //} else {
  //  const responseTurns = await fetch(`http://localhost:3001/turns/barber/${barberParam}`);
   // return responseTurns;
  //}
  //const responseTurns = await fetch(`http://localhost:3001/turns/barber/${barberParam}`);
    //return responseTurns;
//}

//const getTurnsFilteredByDate = async (dateParam, recurrent) => {

  /**
   * Obtenemos los turnos filtrando por fecha.
   * param: dateParam -> fecha elegida.
   * param: recurrent -> un parámetro por defecto para diferenciar si es filtrado por recurrencia o por turnos normales.
   */

  //if (recurrent) {
  //  const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/turn/date/${dateParam}`);
  //  return responseRecurrentTurns;
  //} else {
  //  const responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}`);
  //  return responseTurns;
  //}
  //const responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}`);
  //return responseTurns;
//}

//const historyData = async (tableBodyTurnsHistoryView, selectedDate = null, barberId = null) => {

  /**
   * Renderiza los turnos en una tabla.
   * param: tableBodyTurnsCashRegister -> elemento html de la tabla en donde se renderizarán los turnos.
   * param: selectedDate -> fecha seleccionada, declarada por defecto null. Luego se actualiza su valor.
   * param: barberId -> barbero seleccionado, declarado por defecto null. Luego se actualiza su valor.
   */

  try {
    const dateParam = selectedDate ? `${selectedDate}` : null;
    const barberParam = barberId ? `${barberId}` : null;

    let dateReformated = reformatDate(selectedDate);

    let responseTurns;
    let responseRecurrentTurns;
    let recurrent;

    if (barberParam !== null && dateParam !== null) {
      responseTurns = await getTurnsFilteredByDateAndBarber(dateParam, barberParam, recurrent = false);
      //responseRecurrentTurns = await getTurnsFilteredByDateAndBarber(dateParam, barberParam, recurrent = true);
    } else if (barberParam === null && dateParam !== null) {
      responseTurns = await getTurnsFilteredByDate(dateParam, recurrent = false);
      //responseRecurrentTurns = await getTurnsFilteredByDate(dateParam, recurrent = true);
    } else if (barberParam !== null && dateParam === null) {
      responseTurns = await getTurnsFilteredByBarber(barberParam, recurrent = false);
      //responseRecurrentTurns = await getTurnsFilteredByBarber(barberParam, recurrent = true);
    }

    //if (!responseTurns.ok && !responseRecurrentTurns.ok) {
    if (!responseTurns.ok){  
      tableBodyTurnsHistoryView.innerHTML = `
        <tr>
          <td colspan="6">No tiene turnos para el día ${dateReformated || 'de hoy'}.</td>
        </tr>
      `;
      return;
    } else {

     /* PARTE DEL CONFLICTO
     
    // Llamar a usarCalcular con los datos actuales
    // usarCalcular(dataTurns); // Asegúrate de pasar los datos correctos

    // getPayForBarber(selectedDate);

    // Mostrar los datos en la tabla
    //if (tableBodyTurnsCashRegister !== undefined) {
      //tableBodyTurnsCashRegister.innerHTML = `${rows(dataTurns, cutServices)}`;
      
      */
      //let dataRecurrentTurns = await responseRecurrentTurns.json();
      let dataTurns = await responseTurns.json();

  
      if (tableBodyTurnsHistoryView !== undefined) {
  
        tableBodyTurnsHistoryView.innerHTML = "";

        if (
            (dataTurns.message) || 
            (dataTurns.length <= 0 )
          ) {

            tableBodyTurnsHistoryView.innerHTML = `
            <tr>
              <td colspan="6">No tiene turnos para el día ${dateReformated || 'de hoy'}.</td>
            </tr>
          `;

        
        } else if (!dataTurns.message) {
          tableBodyTurnsHistoryView.innerHTML += `${rows(dataTurns)}`;
        }
      } 
    }
  } catch (error) {
    console.log(error);
  }
//};

export {
  containerHistoryView,
  infoSectionHistoryTurnsView,
  tableTurnsHistory,
  historyData
};
