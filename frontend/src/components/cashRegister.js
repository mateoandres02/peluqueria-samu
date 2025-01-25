import { parseDate, reformatDate, getToday } from '../utils/date';
import { sortArrayByDate, sortArrayByHour } from '../utils/arrays';
import { handleSelectPaymentMethod, handleSelectServiceChange } from '../utils/selectables';

import { getServices, getTurnsFilteredByDateAndBarber, getTurnsFilteredByDate, getTurnsFilteredByBarber, getPaymentUsersById, getTurnsByWeek, getTurnsByWeekAndBarber, getVouchersFilteredByBarber, getVouchers } from "./requests";

import '/src/styles/table.css';
import '/src/styles/presentFunctionality.css';


const today = getToday();

let totalEarned = 0;
let totalEarnedEfect = 0;
let totalEarnedTransf = 0;
let totalCashVouchers = 0;

let totalEarnedTurns = 0;
let totalEarnedEfectTurns = 0;
let totalEarnedTransfTurns = 0;

let dataFinalsTurns;
let globalDataFinalTurns = [];

const containerCashView = `<div class="containerCashView containerFunctionalityView"></div>`;

const infoSectionCashView = `
  <div class="present-container">
    <h2>Seguimiento de Caja</h2>
    <p>Visualiza los cobros realizados y los pagos por realizar.</p>
    <div class="present-container-filters">
      <div class="present-container-filter">
        <span>Fecha Inicio</span>
        <input type="date" id="filterDateInput" value="${today}">
      </div>
      <div class="present-container-filter">
        <span>Fecha Fin</span>
        <input type="date" id="filterWeekInput">
      </div>
      <div class="present-container-filter">
        <span>Filtrar por barbero</span>
        <select id="barberSelect" class="form-select">
          <option value="null">Todos</option>
        </select>
      </div>
    </div>
    <div class="totalEarned">
      <div class="totalEarnedBtn">
        <button class="btn btn-primary">Calcular Total</button>
      </div>
      <div class="totalEarnedInfo">
        <h5 id="totalEarnedDisplay">Total ganado: <br class="totalEarnedInfo-br"> <b>$ 0.00</b></h5>
        <h5 id="totalEarnedForEfectDisplay">Efectivo: <br class="totalEarnedInfo-br"> <b>$ 0.00</b></h5>
        <h5 id="totalEarnedForTransfDisplay">Transferencia: <br class="totalEarnedInfo-br"> <b>$ 0.00</b></h5>
        <h5 id="totalVouchers">Total vales a restar: <br class="totalEarnedInfo-br"> <b class="span-red">$ 0.00</b></h5>
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
          <th scope="col">PAGO</th>
          <th scope="col">FORMA PAGO</th>
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
          <th scope="col">DIFERENCIA POR VALES</th>
          <th scope="col">TOTAL A PAGAR</th>
          <th scope="col">DEBE</th>
        </tr>
      </thead>
      <tbody class="table-pay-body">
      </tbody>
    </table>
  </div>
`;


const rows = (dataTurns, dataRecurrentTurns, cutServices, endDateParam) => {

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

  if (endDateParam !== null) {
    sortArrayByDate(dataTurnsConcats);
  } else {
    sortArrayByHour(dataTurnsConcats);
  }

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

      let serviceField = user.turns && user.turns.Service ? `<span>${user.servicio}</span>` : `<span class="span-red">Sin servicio</span>`;

      let paymentField = user.forma_pago ? `<span>${user.forma_pago}</span>` : `<span class="span-red">Sin pago</span>`;

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
            <td>${paymentField}</td>
            <td id="tdPaymentMethod">
              <div>
                <select class="form-select payment-method" data-id="${user.turns.Id}" data-date="${user.date}" aria-label="Forma de pago">
                  <option selected value="null">Seleccionar...</option>
                  <option value="Efec.">EFECTIVO</option>
                  <option value="Transf.">TRANSFERENCIA</option>
                </select>
              </div>
            </td>
          </tr>
        `;
      }
    }
  });

  globalDataFinalTurns = registrosFinales;

  return { row, registrosFinales };

};


const calculateTotal = async (dataFinalsTurns, totalEarnedDisplay, totalEarnedEfectDisplay, totalEarnedTransfDisplay, totalVouchers, selectedDate, endDateParam, barberParam) => {

  /**
   * Calcula el total hecho en el dia.
   * param: dataturns -> array con los turnos normales.
   * param: dataRecurrentTurns -> array con los turnos recurrentes.
   * param: totalEarnedDisplay -> elemento html para poder mostrar el total hecho en el dia.
   */

  // Refactorizar porque el endpoint por fecha ya esta creado.

  const vouchersForBarber = await getVouchers();
  const dataVouchers = await vouchersForBarber.json();

  let vouchersTodayForBarbers = [];
  let vouchersToday = [];

  dataVouchers.forEach(voucher => {
    const { datePart } = parseDate(voucher.FechaCreacion);

    if (datePart == selectedDate || (datePart >= selectedDate && datePart <= endDateParam)) {

      if (voucher.IdUsuario == barberParam) {
        vouchersTodayForBarbers.push(voucher);
      } else {
        vouchersToday.push(voucher)
      }

    }
  });

  totalEarnedTurns = dataFinalsTurns.reduce((acc, turn) => {
    if (turn.forma_pago === "Efec.") {
      totalEarnedEfectTurns += (turn.precio || 0);
    };
    if (turn.forma_pago === "Transf.") {
      totalEarnedTransfTurns += (turn.precio || 0);
    }
    return acc + (turn.precio || 0);
  }, 0);
  
  totalEarned = totalEarnedTurns;
  totalEarnedEfect = totalEarnedEfectTurns;
  totalEarnedTransf = totalEarnedTransfTurns;
  
  if (barberParam == null) {
    vouchersToday.forEach(voucher => {
      // totalEarned -= voucher.CantidadDinero;
      // totalEarnedEfect -= voucher.CantidadDinero;
      totalCashVouchers += voucher.CantidadDinero;
    })
  } else {
  
    vouchersTodayForBarbers.forEach(voucher => {
      // totalEarned -= voucher.CantidadDinero;
      // totalEarnedEfect -= voucher.CantidadDinero;
      totalCashVouchers += voucher.CantidadDinero;
    })

  }

  totalEarnedDisplay.innerHTML = `Total ganado: <br class="totalEarnedInfo-br"> <b>$ ${totalEarned.toFixed(2)}</b>`;
  totalEarnedEfectDisplay.innerHTML = `Efectivo: <br class="totalEarnedInfo-br"> <b>$ ${totalEarnedEfect.toFixed(2)}</b>`;
  totalEarnedTransfDisplay.innerHTML = `Transferencia: <br class="totalEarnedInfo-br"> <b>$ ${totalEarnedTransf.toFixed(2)}</b>`;
  totalVouchers.innerHTML = `Total vales a restar: <br class="totalEarnedInfo-br"> <b class="span-red">$ ${totalCashVouchers}.00 </b>`
}

const handleCalculateClick = (dataFinalsTurns, totalEarnedDisplay, totalEarnedEfectDisplay, totalEarnedTransfDisplay, totalVouchers, selectedDate, endDateParam, barberParam) => {

  /**
   * Handle del listener del boton que calcula el total realizado en el dia.
   * param: dataFinalsTurns -> array con los turnos finales.
   * param: totalEarnedDisplay -> elemento html para poder mostrar el total hecho en el dia.
   */

  totalEarned = 0;
  totalEarnedEfect = 0;
  totalEarnedTransf = 0;
  totalCashVouchers = 0;

  totalEarnedTurns = 0;
  totalEarnedEfectTurns = 0;
  totalEarnedTransfTurns = 0;

  const calculateTotalBtn = document.querySelector('.totalEarnedBtn button');
  calculateTotalBtn.setAttribute('disabled', 'true');

  setTimeout(() => {
    const calculateTotalBtn = document.querySelector('.totalEarnedBtn button');
    calculateTotalBtn.removeAttribute('disabled');
  }, 1000);

  calculateTotal(dataFinalsTurns, totalEarnedDisplay, totalEarnedEfectDisplay, totalEarnedTransfDisplay, totalVouchers, selectedDate, endDateParam, barberParam);

};

const usarCalcular = (dataFinalsTurns, selectedDate, endDateParam, barberParam) => {

  /**
   * Agrega un listener al boton que calcula lo realizado en el dia.
   * param: dataturns -> array con los turnos normales.
   * param: dataRecurrentTurns -> array con los turnos recurrentes.
   */

  const $boton = document.querySelector('.totalEarnedBtn button');
  const totalEarnedDisplay = document.getElementById('totalEarnedDisplay');
  const totalEarnedEfectDisplay = document.getElementById('totalEarnedForEfectDisplay');
  const totalEarnedTransfDisplay = document.getElementById('totalEarnedForTransfDisplay');
  const totalVouchers = document.getElementById('totalVouchers');

  // Eliminar todos los event listeners anteriores
  $boton.replaceWith($boton.cloneNode(true));
  const $nuevoBoton = document.querySelector('.totalEarnedBtn button');

  $nuevoBoton.addEventListener('click', () => handleCalculateClick(dataFinalsTurns, totalEarnedDisplay, totalEarnedEfectDisplay, totalEarnedTransfDisplay, totalVouchers, selectedDate, endDateParam, barberParam));

};

const cashData = async (tableBodyTurnsCashRegister, selectedDate = null, barberId = null, endWeekDate = null) => {

  /**
   * Renderiza los turnos en una tabla.
   * param: tableBodyTurnsCashRegister -> elemento html de la tabla en donde se renderizarán los turnos.
   * param: selectedDate -> fecha seleccionada, declarada por defecto null. Luego se actualiza su valor.
   * param: barberId -> barbero seleccionado, declarado por defecto null. Luego se actualiza su valor.
   */

  try {
    const cutServices = await getServices();
    const dateParam = selectedDate ? `${selectedDate}` : today;
    const barberParam = barberId ? `${barberId}` : null;
    const endDateParam = endWeekDate ? `${endWeekDate}` : null;

    let dateReformated;
    if (selectedDate !== null) dateReformated = reformatDate(selectedDate);

    let responseTurns;
    let responseRecurrentTurns;
    let recurrent = false;

    if (endDateParam !== null && dateParam !== null && barberParam === null) {
      responseTurns = await getTurnsByWeek(dateParam, endDateParam, recurrent = false);
      responseRecurrentTurns = await getTurnsByWeek(dateParam, endDateParam, recurrent = true);
    } else if (endDateParam !== null && dateParam !== null && barberParam !== null) {
      responseTurns = await getTurnsByWeekAndBarber(dateParam, endDateParam, barberParam, recurrent = false);
      responseRecurrentTurns = await getTurnsByWeekAndBarber(dateParam, endDateParam, barberParam, recurrent = true);
    } else if (endDateParam === null && barberParam !== null && dateParam !== null) {
      responseTurns = await getTurnsFilteredByDateAndBarber(dateParam, barberParam, recurrent = false);
      responseRecurrentTurns = await getTurnsFilteredByDateAndBarber(dateParam, barberParam, recurrent = true);
    } else if (endDateParam === null && barberParam === null && dateParam !== null) {
      responseTurns = await getTurnsFilteredByDate(dateParam, recurrent = false);
      responseRecurrentTurns = await getTurnsFilteredByDate(dateParam, recurrent = true);
    } else if (endDateParam === null && barberParam !== null && dateParam === null) {
      responseTurns = await getTurnsFilteredByBarber(barberParam, recurrent = false);
      responseRecurrentTurns = await getTurnsFilteredByBarber(barberParam, recurrent = true);
    }

    let message = `No tiene turnos para el día ${dateReformated || 'de hoy'}`;

    if (endDateParam !== null) message = `No tiene turnos para estos dias`;

    if (!responseTurns.ok && !responseRecurrentTurns.ok) {
      tableBodyTurnsCashRegister.innerHTML = `
        <tr>
          <td colspan="10">${message}.</td>
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
              <td colspan="10">${message}.</td>
            </tr>
          `;

        } else if (dataTurns.message && !dataRecurrentTurns.message) {
          let { row, registrosFinales } = rows(dataTurns = [], dataRecurrentTurns, cutServices, endDateParam);
          dataFinalsTurns = registrosFinales;
          tableBodyTurnsCashRegister.innerHTML += row;
        } else if (!dataTurns.message && dataRecurrentTurns.message) {
          let { row, registrosFinales } = rows(dataTurns, dataRecurrentTurns = [], cutServices, endDateParam)
          dataFinalsTurns = registrosFinales;
          tableBodyTurnsCashRegister.innerHTML += row;
        } else {
          let { row, registrosFinales } = rows(dataTurns, dataRecurrentTurns, cutServices, endDateParam)
          dataFinalsTurns = registrosFinales;
          tableBodyTurnsCashRegister.innerHTML += row;
        }

      }

      if (dataFinalsTurns === undefined || dataFinalsTurns.length == 0) {
        tableBodyTurnsCashRegister.innerHTML = `
          <tr>
            <td colspan="10">${message}.</td>
          </tr>
        `;
      }
  
      usarCalcular(dataFinalsTurns, selectedDate, endDateParam, barberParam);

      handleSelectServiceChange(cutServices, selectedDate, endDateParam);

      handleSelectPaymentMethod(selectedDate, endDateParam);

    }
    
  } catch (error) {
    alert('Error al cargar la tabla con los turnos.');
  }
  
};

const fillTheObjectWithFilteredTurns = async (barbersData, filteredTurns, dateInput, weekInput) => {

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
      barbersData[barber].vales = 0;

      // Pedimos los porcentajes de los distintos serivicios de cada barbero
      const paymentForBarber = await getPaymentUsersById(turn.turns.NroUsuario);
      const valesForBarber = await getVouchersFilteredByBarber(turn.peluquero);
      const dataVales = await valesForBarber.json();
      
      if (!paymentForBarber.message) {
        paymentForBarber.forEach((item) => {
          if (!barbersData[barber].percentages[item.servicio]) {
            barbersData[barber].percentages[item.servicio] = item.porcentaje_pago || 50;
          }
        })        
      }

      if (!dataVales.message) {
        dataVales.forEach((item) => {
          const { datePart } = parseDate(item.FechaCreacion);
  
          if ((datePart >= dateInput && datePart <= weekInput)) {
            barbersData[barber].vales += item.CantidadDinero;
          }
          
        });
      }
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

    barberData.totalAdjustedEarnings -= barberData.vales;

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

    let totalAdjustedEarningsFormatted;
    if (barberData.totalAdjustedEarnings < 0) {
      totalAdjustedEarningsFormatted = 0;
    } else {
      totalAdjustedEarningsFormatted = barberData.totalAdjustedEarnings;
    }

    let totalDebt;
    if (barberData.totalAdjustedEarnings < 0) {
      totalDebt = barberData.totalAdjustedEarnings;
    } else {
      totalDebt = 0;
    }

    const totalDebtString = totalDebt.toString();

    let totalDebtFinal;
    if (totalDebt < 0) {
      totalDebtFinal = `- $ ${totalDebtString.split("-")[1]}`;
    } else {
      totalDebtFinal = `$ 0`;
    }

    paymentTableBody.innerHTML += `
      <tr>
        <td>${barber}</td>
        <td>$ ${barberData.totalEarnings}</td>
        <td>$ ${barberData.vales}</td>
        <td>$ ${totalAdjustedEarningsFormatted}</td>
        <td>${totalDebtFinal}</td>
      </tr>
    `;
  };

}

const getPaidForBarbers = async (dateInput, weekInput) => {

  /**
   * Obtiene el pago para los barberos.
   */

  // Filtramos los turnos que tienen servicio
  const filteredTurns = globalDataFinalTurns.filter(turn => turn.turns.Service);

  let barbersData = {};

  const paymentTableBody = document.querySelector('.table-pay-body');

  paymentTableBody.innerHTML = '';
  paymentTableBody.innerHTML += `
    <tr>
      <td colspan="5">Cargando...</td>
    </tr>
  `;

  if (filteredTurns.length == 0) {
    paymentTableBody.innerHTML = '';
    paymentTableBody.innerHTML += `
      <tr>
        <td colspan="5">No hay turnos registrados con algun servicio elegido <br> para poder sacar un cálculo de pago.</td>
      </tr>
    `;
    return;
  }

  await fillTheObjectWithFilteredTurns(barbersData, filteredTurns, dateInput, weekInput);

  await calculateEarnedForBarber(barbersData);

  await showPaymentsForEachBarber(paymentTableBody, barbersData);

}

const handlePaidsForBarber = ($payButton, $dateInput, $weekInput) => {

  /**
   * Maneja el pago para los barberos.
   * param: $payButton -> elemento html del boton de pago.
   */

  
  $payButton.addEventListener('click', () => {
    getPaidForBarbers($dateInput.value, $weekInput.value);
  });

}

export {
  containerCashView,
  infoSectionCashView,
  tableTurns,
  paymentSection,
  cashData,
  handlePaidsForBarber
};
