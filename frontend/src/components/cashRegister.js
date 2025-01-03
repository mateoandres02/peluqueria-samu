import { parseDate, reformatDate, getToday } from '../utils/date';
import { getBarbers, putChangeService, getServices, getTurnsFilteredByDateAndBarber, getTurnsFilteredByDate, getTurnsFilteredByBarber, getPaymentUsersById } from "./requests"
import '/src/styles/table.css';
import '/src/styles/presentFunctionality.css';

const today = getToday();

let totalEarned = 0;
let totalEarnedTurns = 0;

let dataFinalsTurns;
let globalDataFinalTurns = [];

const containerCashView = `<div class="containerCashView containerFunctionalityView"></div>`;

const infoSectionCashView = `
  <div class="present-container">
    <h2>Seguimiento de Caja</h2>
    <p>Visualiza los cobros realizados y los pagos por realizar.</p>
    <div class="present-container-filters">
      <div class="present-container-filter">
        <span>Filtrar por fecha</span>
        <input type="date" id="filterDateInput" value="${today}">
      </div>
      <div class="present-container-filter">
        <span>Filtrar por barbero</span>
        <select id="barberSelect" class="form-select">
          <option value="null">Seleccionar...</option>
        </select>
      </div>
    </div>
    <div class="totalEarned">
      <div class="totalEarnedBtn">
        <button class="btn btn-primary">Calcular Total</button>
      </div>
      <div class="totalEarnedInfo">
        <h5 id="totalEarnedDisplay">Total ganado: <br class="totalEarnedInfo-br"> <b>$ 0.00</b></h5>
      </div>
    </div>
  </div>
`;

const tableTurns = `
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th scope="col">FECHA</th>
          <th scope="col">HORA</th>
          <th scope="col">CLIENTE</th>
          <th scope="col">BARBERO</th>
          <th scope="col">SERVICIO</th>
          <th scope="col">TIPO DE SERVICIO</th>
          <th scope="col">COSTO</th>
          <th scope="col">FIJO</th>
        </tr>
      </thead>
      <tbody class="table-cash-body">
      </tbody>
    </table>
  </div>
`;

const paymentSection = `
  <hr>
  <div class="present-container">
    <h2>Pagos</h2>
    <p>Visualiza cuánto tienes que pagarles a tus empleados.</p>
    <div class="present-container-btn">
      <button class="btn btn-primary pay-button" id="pay-button">Calcular Pagos</button>
    </div>
  </div>
  <div class="table-container table-payment-container">
    <table>
      <thead>
        <tr>
          <th scope="col">BARBERO</th>
          <th scope="col">TOTAL GANADO</th>
          <th scope="col">TOTAL A PAGAR</th>
        </tr>
      </thead>
      <tbody class="table-pay-body">
      </tbody>
    </table>
  </div>
`;

const loadBarberSelect = async (barberSelect) => {
  
  /**
   * Carga el selector de barberos con los barberos disponibles en la aplicación.
   * param: barberSelect -> elemento html del selectable de barberos.
   */
  
  const barbers = await getBarbers();

  barbers.forEach(barber => {
    barberSelect.innerHTML += `<option value="${barber.Nombre}">${barber.Nombre}</option>`;
  });

};

const sortArrayByHour = (array) => {
  
  /**
   * Ordenamos los turnos por hora (de forma ascendente).
   * param: array -> un array que queremos ordenar de forma ascendente por hora. debe de tener un campo de hora.
   */

  array.sort((a, b) => {
    const dateA = a.date ? parseDate(a.date).timeWithoutSeconds : '';
    const dateB = b.date ? parseDate(b.date).timeWithoutSeconds : '';
    
    // Convertimos las horas a formato comparable
    if (dateA && dateB) {
      return new Date(`1970-01-01T${dateA}`) - new Date(`1970-01-01T${dateB}`);
    }
    return 0;
  });

}

const rows = (dataTurns, dataRecurrentTurns, cutServices) => {

  /**
   * Carga la tabla con los registros de los turnos generados en el calendario.
   * param: dataTurns -> array que contiene todos los turnos normales filtrados de acuerdo a la elección del filtro.
   * param: dataRecurrentTurns -> array que contiene todos los turnos recurrentes filtrados de acuerdo a la elección del filtro.
   * param: cutServices -> array con los servicios disponibles en la aplicación.
   */

  let row = '';
  let idsPubliqued = [];
  let registrosFinales = [];
  let dataTurnsConcats = [...dataTurns, ...dataRecurrentTurns];

  sortArrayByHour(dataTurnsConcats);

  dataTurnsConcats.forEach((user, index) => {
    if (user.exdate == 1) {
      return;
    }

    if (idsPubliqued.includes(user.turns.Id)) {
      return;
    } else {
      registrosFinales.push(user);
      idsPubliqued.push(user.turns.Id);
    }

    if (index > -1) {
      let selectOptions = cutServices.map(service => `<option value="${service.Nombre}">${service.Nombre}</option>`).join('');

      let serviceField = user.turns && user.turns.Service ? `<span>${user.servicio}</span>` : `<span class="span-red">Sin selección</span>`;

      let costField = user.precio ? user.precio : '0'; 

      let date = user.turns.Date ? parseDate(user.turns.Date) : '';
      let dateRecurrentTurn = user.date ? parseDate(user.date) : '';
      let hourTurn = user.date ? parseDate(user.date) : '';
      let isRecurrent = user.turns.Regular === "true" ? 'Si' : 'No';

      if (user.exdate != 1) {
        row += `
          <tr key=${user.turns.Id}>
            <td scope="row">${dateRecurrentTurn.dateWithoutTime || date.dateWithoutTime}</td>
            <td>${hourTurn.timeWithoutSeconds || date.timeWithoutSeconds}</td>
            <td>${user.turns.Nombre}</td>
            <td>${user.peluquero}</td>
            <td><div>${serviceField}</div></td>
            <td id="tdService">
              <div>
                <select class="form-select cut-service-select" data-id="${user.turns.Id}" data-date="${user.date}" aria-label="Tipo de corte">
                  <option selected value="null">Seleccionar...</option>
                  ${selectOptions}
                </select>
              </div>
            </td>
            <td class="precio-corte" id="precio-${user.turns.Id}">$ ${costField}</td>
            <td>${isRecurrent}</td>
          </tr>
        `;
      }
    }
  });

  globalDataFinalTurns = registrosFinales;

  return { row, registrosFinales };

};

const handleSelectChange = (cutServices, dateValue) => {

  /**
   * Hacemos un put al backend con el filtro elegido del selectable de servicio. De esta forma logramos actualizar los precios del corte.
   * param: cutServices -> array con los servicios disponibles en la aplicación.
   * param: dateValue -> fecha elegida del calendario.
   */

  document.querySelectorAll('.cut-service-select').forEach(select => {

    select.addEventListener('change', async (e) => {

      const selectedServiceName = e.target.value;
      let valueCalendar = dateValue;
      const rowId = e.target.dataset.id;

      if (selectedServiceName === "Seleccionar tipo de servicio") {
        const priceCell = document.getElementById(`precio-${rowId}`);
        if (priceCell) {
          priceCell.textContent = '';
        }
        return;
      }

      const selectedService = cutServices.find(service => service.Nombre === selectedServiceName);

      if (selectedService) {
        const priceCell = document.getElementById(`precio-${rowId}`);
        priceCell.textContent = `$ ${selectedService.Precio}`;
      }

      const turn = {
        Service: selectedService.Id
      };

      await putChangeService(rowId, turn);

      if (valueCalendar === today) {
        window.location.reload();
      }

    });
  });
};


const addBarberFilterListener = async (tableBodyTurnsCashRegister, barberSelect) => {

  /**
   * Hace un filtrado de los turnos mostrados en la tabla del barbero seleccionado.
   * param: tableBodyTurnsCashRegister -> elemento html de la tabla en donde se visualizarán los turnos.
   * param: barberSelect -> elemento html del selectable para elegir algun barbero.
   */

  const dataBarbers = await getBarbers();
  const totalEarnedDisplay = document.getElementById('totalEarnedDisplay');
  const paymentTableBody = document.querySelector('.table-pay-body');
  
  barberSelect.addEventListener('change', async (e) => {
    
    totalEarnedDisplay.innerHTML = `Total ganado: <b>$ 0.00</b>`;
    paymentTableBody.innerHTML = '';

    const filteredBarber = dataBarbers.filter(barber => barber.Nombre === e.target.value);
    
    const dateInput = document.querySelector('input[type="date"]');
    const selectedDate = dateInput ? dateInput.value : null;

    if (!filteredBarber.length > 0) {
      await cashData(tableBodyTurnsCashRegister, selectedDate, null)
    } else {
      await cashData(tableBodyTurnsCashRegister, selectedDate, filteredBarber[0].Id);
    }

  });
}

const addDateFilterListener = async (tableBodyTurnsCashRegister, dateInput) => {

  /**
   * Hace un filtrado de los turnos mostrados en la tabla del dia seleccionado.
   * param: tableBodyTurnsCashRegister -> elemento html de la tabla en donde se visualizarán los turnos.
   * param: dateInput -> dia elegido en el filtro.
   */
  
  const dataBarbers = await getBarbers();
  const totalEarnedDisplay = document.getElementById('totalEarnedDisplay');
  const paymentTableBody = document.querySelector('.table-pay-body');
  
  dateInput.removeEventListener('change', handleDateChange); 
  dateInput.addEventListener('change', handleDateChange);
  
  async function handleDateChange(e) {
    totalEarnedDisplay.innerHTML = `Total ganado: <b>$ 0.00</b>`;
    paymentTableBody.innerHTML = '';

    let selectedDate = e.target.value;

    const barberInput = document.querySelector('#barberSelect');
    const filteredBarber = dataBarbers.filter(barber => barber.Nombre === barberInput.value);
    const selectedBarber = barberInput.value !== 'null' ? filteredBarber[0].Id : null;

    await cashData(tableBodyTurnsCashRegister, selectedDate, selectedBarber);
  };

};

const calculateTotal = (dataFinalsTurns, totalEarnedDisplay) => {

  /**
   * Calcula el total hecho en el dia.
   * param: dataturns -> array con los turnos normales.
   * param: dataRecurrentTurns -> array con los turnos recurrentes.
   * param: totalEarnedDisplay -> elemento html para poder mostrar el total hecho en el dia.
   */

  totalEarnedTurns = dataFinalsTurns.reduce((acc, turn) => {
    return acc + (turn.precio || 0);
  }, 0);
  totalEarned = totalEarnedTurns;

  totalEarnedDisplay.innerHTML = `Total ganado: <b>$ ${totalEarned.toFixed(2)}</b>`;

}

const handleCalculateClick = (dataFinalsTurns, totalEarnedDisplay) => {

  /**
   * Handle del listener del boton que calcula el total realizado en el dia.
   * param: dataFinalsTurns -> array con los turnos finales.
   * param: totalEarnedDisplay -> elemento html para poder mostrar el total hecho en el dia.
   */

  calculateTotal(dataFinalsTurns, totalEarnedDisplay);

};

const usarCalcular = (dataFinalsTurns) => {

  /**
   * Agrega un listener al boton que calcula lo realizado en el dia.
   * param: dataturns -> array con los turnos normales.
   * param: dataRecurrentTurns -> array con los turnos recurrentes.
   */

  const $boton = document.querySelector('.btn-primary');
  const totalEarnedDisplay = document.getElementById('totalEarnedDisplay');

  // Eliminar todos los event listeners anteriores
  $boton.replaceWith($boton.cloneNode(true));
  const $nuevoBoton = document.querySelector('.btn-primary');

  $nuevoBoton.addEventListener('click', () => handleCalculateClick(dataFinalsTurns, totalEarnedDisplay));

};

const cashData = async (tableBodyTurnsCashRegister, selectedDate = null, barberId = null) => {

  /**
   * Renderiza los turnos en una tabla.
   * param: tableBodyTurnsCashRegister -> elemento html de la tabla en donde se renderizarán los turnos.
   * param: selectedDate -> fecha seleccionada, declarada por defecto null. Luego se actualiza su valor.
   * param: barberId -> barbero seleccionado, declarado por defecto null. Luego se actualiza su valor.
   */

  try {
    const cutServices = await getServices();
    const dateParam = selectedDate ? `${selectedDate}` : null;
    const barberParam = barberId ? `${barberId}` : null;

    let dateReformated = reformatDate(selectedDate);

    let responseTurns;
    let responseRecurrentTurns;
    let recurrent = false;
    
    if (barberParam !== null && dateParam !== null) {
      responseTurns = await getTurnsFilteredByDateAndBarber(dateParam, barberParam, recurrent = false);
      responseRecurrentTurns = await getTurnsFilteredByDateAndBarber(dateParam, barberParam, recurrent = true);
    } else if (barberParam === null && dateParam !== null) {
      responseTurns = await getTurnsFilteredByDate(dateParam, recurrent = false);
      responseRecurrentTurns = await getTurnsFilteredByDate(dateParam, recurrent = true);
    } else if (barberParam !== null && dateParam === null) {
      responseTurns = await getTurnsFilteredByBarber(barberParam, recurrent = false);
      responseRecurrentTurns = await getTurnsFilteredByBarber(barberParam, recurrent = true);
    }

    if (!responseTurns.ok && !responseRecurrentTurns.ok) {
      tableBodyTurnsCashRegister.innerHTML = `
        <tr>
          <td colspan="7">No tiene turnos para el día ${dateReformated || 'de hoy'}.</td>
        </tr>
      `;
      globalDataFinalTurns.splice(0, globalDataFinalTurns.length);
      return;
    } else {

      let dataRecurrentTurns = await responseRecurrentTurns.json();
      let dataTurns = await responseTurns.json();

      if (tableBodyTurnsCashRegister !== undefined) {
  
        tableBodyTurnsCashRegister.innerHTML = "";
        globalDataFinalTurns.splice(0, globalDataFinalTurns.length);

        if (
            (dataTurns.message && dataRecurrentTurns.message) || 
            (dataTurns.length <= 0 && dataRecurrentTurns.length <= 0)
          ) {

          tableBodyTurnsCashRegister.innerHTML = `
            <tr>
              <td colspan="7">No tiene turnos para el día ${dateReformated || 'de hoy'}.</td>
            </tr>
          `;

        } else if (dataTurns.message && !dataRecurrentTurns.message) {
          let { row, registrosFinales } = rows(dataTurns = [], dataRecurrentTurns, cutServices);
          dataFinalsTurns = registrosFinales;
          tableBodyTurnsCashRegister.innerHTML += row;
        } else if (!dataTurns.message && dataRecurrentTurns.message) {
          let { row, registrosFinales } = rows(dataTurns, dataRecurrentTurns = [], cutServices)
          dataFinalsTurns = registrosFinales;
          tableBodyTurnsCashRegister.innerHTML += row;
        } else {
          let { row, registrosFinales } = rows(dataTurns, dataRecurrentTurns, cutServices)
          dataFinalsTurns = registrosFinales;
          tableBodyTurnsCashRegister.innerHTML += row;
        }

      }

      if (dataFinalsTurns.length == 0) {
        tableBodyTurnsCashRegister.innerHTML = `
          <tr>
            <td colspan="7">No tiene turnos para el día ${dateReformated || 'de hoy'}.</td>
          </tr>
        `;
      }
  
      usarCalcular(dataFinalsTurns); 

      handleSelectChange(cutServices, selectedDate);

    }
    
  } catch (error) {
    alert(error);
  }
  
};

const handlePaidsForBarber = ($payButton) => {

  /**
   * Maneja el pago para los barberos.
   * param: $payButton -> elemento html del boton de pago.
   */

  $payButton.addEventListener('click', () => {
    getPaidForBarbers();
  });

}

const fillTheObjectWithFilteredTurns = async (barbersData, filteredTurns) => {

  /**
   * Cargamos el objeto barbersData con la información de los turnos filtrados para luego poder hacer el cálculo de manera correcta.
   * param: barbersData -> objeto vacío.
   * param: filteredTurns -> array de turnos filtrados con servicios activos.
   */

  for (const turn of filteredTurns) {
    const barber = turn.peluquero;
    const price = turn.precio || 0;
    const nameService = turn.servicio;

    if (!barbersData[barber]) {
      barbersData[barber] = { services: {}, percentages: {} };

      // Pedimos los porcentajes de los distintos serivicios de cada barbero
      const paymentForBarber = await getPaymentUsersById(turn.turns.NroUsuario);

      paymentForBarber.forEach((item) => {
        if (!barbersData[barber].percentages[item.servicio]) {
          barbersData[barber].percentages[item.servicio] = item.porcentaje_pago || 50;
        }
      })

    }

    // Agregamos y acumulamos el costo del servicio
    if (!barbersData[barber].services[nameService]) {
      barbersData[barber].services[nameService] = 0;
    }
    barbersData[barber].services[nameService] += price;

  };
};

const calculateEarnedForBarber = async (barbersData) => {

  /**
   * Calculamos las ganancias ajustadas por porcentaje y las ganancias totales.
   * param: barbersData -> objeto cargado con la información de cada barbero.
   */

  for (const barber in barbersData) {

    const barberData = barbersData[barber];
    barberData.adjustedEarnings = {};
    barberData.totalAdjustedEarnings = 0;
    barberData.totalEarnings = 0;

    for (const service in barberData.services) {
      const totalForService = barberData.services[service];
      const percentage = barberData.percentages[service] || 50;

      barberData.adjustedEarnings[service] = (totalForService * percentage) / 100;
      barberData.totalAdjustedEarnings += barberData.adjustedEarnings[service];
      barberData.totalEarnings += barberData.services[service];
    }

  }

}

const showPaymentsForEachBarber = async (paymentTableBody, barbersData) => {

  /**
   * Mostramos los pagos a hacerle a cada barbero.
   * param: paymentTableBody -> elemento html de la tabla para mostrar la información de manera ordenada.
   * param: barbersData -> objeto con la información de cada barbero.
   */

  paymentTableBody.innerHTML = '';

  for (const barber in barbersData) {
    const barberData = barbersData[barber];

    paymentTableBody.innerHTML += `
      <tr>
        <td>${barber}</td>
        <td>$ ${barberData.totalEarnings}</td>
        <td>$ ${barberData.totalAdjustedEarnings}</td>
      </tr>
    `;
  };

}


const getPaidForBarbers = async () => {

  /**
   * Obtiene el pago para los barberos.
   */

  // Filtramos los turnos que tienen servicio
  const filteredTurns = globalDataFinalTurns.filter(turn => turn.turns.Service);

  let barbersData = {};

  const paymentTableBody = document.querySelector('.table-pay-body');

  if (filteredTurns.length == 0) {
    paymentTableBody.innerHTML = '';
    paymentTableBody.innerHTML += `
      <tr>
        <td colspan="3">No hay turnos registrados con algun servicio elegido <br> para poder sacar un cálculo de pago.</td>
      </tr>
    `;
    return;
  }

  await fillTheObjectWithFilteredTurns(barbersData, filteredTurns);

  await calculateEarnedForBarber(barbersData);

  await showPaymentsForEachBarber(paymentTableBody, barbersData);

}

export {
  containerCashView,
  infoSectionCashView,
  tableTurns,
  paymentSection,
  cashData,
  addDateFilterListener,
  loadBarberSelect,
  addBarberFilterListener,
  handlePaidsForBarber,
};
