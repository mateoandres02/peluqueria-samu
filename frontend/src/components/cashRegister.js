import { parseDate, reformatDate } from './date';
import '/src/styles/cashRegister.css';

const containerCashView = `<div class="containerCashView"></div>`;

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
const formattedDate = today.toISOString().split('T')[0];

let totalEarned = 0;
let totalEarnedTurns = 0;

let dataFinalsTurns;

let registrosFinalesGlobal = [];

const infoSectionCashView = `
  <div class="infoSectionCashView">
    <h3>Seguimiento de Caja</h3>
    <p>Visualiza los cobros realizados y los pagos por realizar.</p>
    <div class="cashRegisterFilterContainer">
        <div class="cashRegisterFilter">
          <span>Filtrar por fecha</span>
          <input type="date" class="filter-date-cash-tracking" id="filterDateInput" value="${formattedDate}">
      </div>
      <div class="filterBarberCashTracking">
        <span>Filtrar por barbero</span>
        <select id="barberSelect" class="form-select">
          <option value="null">Seleccionar...</option>
        </select>
      </div>
    </div>

    <div class="totalEarned">
      <div>
        <button class="btn btn-primary" >Calcular Total</button>
      </div>
      <div class="infoTotalEarned">
        <h5 id="totalEarnedDisplay">Total ganado en el día: <b>$ 0.00</b></h5>
      </div>
    </div>
  </div>
`;

const tableTurns = `
  <div class="table-cash-container">
    <table class="table-cash-light">
      <thead class="table-cash-head">
        <tr>
          <th scope="col">FECHA</th>
          <th scope="col">HORA</th>
          <th scope="col">CLIENTE</th>
          <th scope="col">BARBERO</th>
          <th scope="col">SERVICIO</th>
          <th scope="col">TIPO DE SERVICIO</th>
          <th scope="col">COSTO</th>
        </tr>
      </thead>
      <tbody class="table-cash-body">
      </tbody>
    </table>
  </div>
`;

const paymentSection = `
  <hr>
  <div class="paymentSection">
    <div class="payment-panel">
      <h3>Pagos</h3>
      <p>Visualiza cuánto tienes que pagarles a tus empleados.</p>
      <div>
        <button class="btn btn-primary pay-button" id="pay-button">Calcular Pagos</button>
      </div>
    </div>
    <div class="table-payment-container table-container">
    <table>
      <thead>
        <tr>
          <th scope="col">BARBERO</th>
          <th scope="col">TOTAL GANADO</th>
          <th scope="col">PAGO CORRESPONDIENTE</th>
        </tr>
      </thead>
      <tbody class="table-pay-body">
      </tbody>
    </table>
  </div>
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

  // Ordenamos los turnos por hora (de forma ascendente)
  dataTurnsConcats.sort((a, b) => {
    const dateA = a.date ? parseDate(a.date).timeWithoutSeconds : '';
    const dateB = b.date ? parseDate(b.date).timeWithoutSeconds : '';
    
    // Convertimos las horas a formato comparable
    if (dateA && dateB) {
      return new Date(`1970-01-01T${dateA}`) - new Date(`1970-01-01T${dateB}`);
    }
    return 0;
  });

  dataTurnsConcats.forEach((user, index) => {

    if (user.exdate == 1) {
      return;
    }

    if (idsPubliqued.includes(user.turns.Id)) {
      return;
    } else {
      registrosFinales.push(user)
      idsPubliqued.push(user.turns.Id);
    }

    if (index > -1) {
      let selectOptions = cutServices.map(service => `<option value="${service.Nombre}">${service.Nombre}</option>`).join('');

      let serviceField = user.turns && user.turns.Service ? `<span>${user.servicio}</span>` : `<span class="span-red">Sin selección</span>`;

      let costField = user.precio ? user.precio : '0'; 

      let date = user.turns.Date ? parseDate(user.turns.Date) : '';
      let dateRecurrentTurn = user.date ? parseDate(user.date) : '';
      let hourTurn = user.date ? parseDate(user.date) : '';

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
                <select class="form-select cut-service-select cut-service-select-notnull" data-id="${user.turns.Id}" aria-label="Tipo de corte">
                  <option selected value="null">Seleccionar...</option>
                  ${selectOptions}
                </select>
              </div>
            </td>
            <td class="precio-corte" id="precio-${user.turns.Id}">$ ${costField}</td>
          </tr>
        `;
      }
    }
  });

  registrosFinalesGlobal = registrosFinales;

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
      const today = new Date().toISOString().split('T')[0];
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

      await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/${rowId}`, 
        { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(turn)
        }
      );
      // await fetch(`http://localhost:3001/turns/${rowId}`, 
      //   { 
      //     method: 'PUT', 
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(turn)
      //   }
      // );

      if (valueCalendar === today) {
        window.location.reload();
      }
    });
  });
};

const getBarbers = async () => {

  /**
   * Obtenemos los barberos disponibles en nuestro sistema.
   */

  const barbers = await fetch('https://peluqueria-invasion-backend.vercel.app/users');
  // const barbers = await fetch('http://localhost:3001/users');
  const dataBarbers = await barbers.json();
  return dataBarbers;
}

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
    
    totalEarnedDisplay.innerHTML = `Total ganado en el día: <b>$ 0.00</b>`;
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
    totalEarnedDisplay.innerHTML = `Total ganado en el día: <b>$ 0.00</b>`;
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

  totalEarnedDisplay.innerHTML = `Total ganado en el día: <b>$ ${totalEarned.toFixed(2)}</b>`;
}

const handleCalculateClick = (dataFinalsTurns, totalEarnedDisplay) => {

  /**
   * Handle del listener del boton que calcula el total realizado en el dia.
   * param: dataturns -> array con los turnos normales.
   * param: dataRecurrentTurns -> array con los turnos recurrentes.
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

const getServices = async () => {

  /**
   * Obtenemos los servicios a través de una solicitud al backend.
   */
  
  const responseCutServices = await fetch("https://peluqueria-invasion-backend.vercel.app/cutservices");
  // const responseCutServices = await fetch("http://localhost:3001/cutservices");
  const cutServices = await responseCutServices.json();
  return cutServices;
}

const getTurnsFilteredByDateAndBarber = async (dateParam, barberParam, recurrent) => {

  /**
   * Obtenemos los turnos filtrando por fecha y por barbero.
   * param: dateParam -> fecha elegida.
   * param: barberParam -> barbero elegido.
   * param: recurrent -> un parámetro por defecto para diferenciar si es filtrado por recurrencia o por turnos normales.
   */

  if (recurrent) {
    const responseRecurrentTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/${barberParam}/${dateParam}`);
    // const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/${barberParam}/${dateParam}`);
    return responseRecurrentTurns;
  } else {
    const responseTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/${dateParam}/${barberParam}`);
    // const responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}/${barberParam}`);
    return responseTurns;
  }
}

const getTurnsFilteredByDate = async (dateParam, recurrent) => {

  /**
   * Obtenemos los turnos filtrando por fecha.
   * param: dateParam -> fecha elegida.
   * param: recurrent -> un parámetro por defecto para diferenciar si es filtrado por recurrencia o por turnos normales.
   */

  if (recurrent) {
    const responseRecurrentTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/turn/date/${dateParam}`);
    // const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/turn/date/${dateParam}`);
    return responseRecurrentTurns;
  } else {
    const responseTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/${dateParam}`);
    // const responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}`);
    return responseTurns;
  }
}

const getTurnsFilteredByBarber = async (barberParam, recurrent) => {

  /**
   * Obtenemos los turnos filtrando por barbero.
   * param: barberParam -> barbero elegido.
   * param: recurrent -> un parámetro por defecto para diferenciar si es filtrado por recurrencia o por turnos normales.
   */

  if (recurrent) {
    const responseRecurrentTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/${barberParam}`);
    // const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/${barberParam}`);
    return responseRecurrentTurns;
  } else {
    const responseTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/barber/${barberParam}`);
    // const responseTurns = await fetch(`http://localhost:3001/turns/barber/${barberParam}`);
    return responseTurns;
  }
}

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
          <td colspan="6">No tiene turnos para el día ${dateReformated || 'de hoy'}.</td>
        </tr>
      `;
      return;
    } else {

      let dataRecurrentTurns = await responseRecurrentTurns.json();
      let dataTurns = await responseTurns.json();

      if (tableBodyTurnsCashRegister !== undefined) {
  
        tableBodyTurnsCashRegister.innerHTML = "";

        if (
            (dataTurns.message && dataRecurrentTurns.message) || 
            (dataTurns.length <= 0 && dataRecurrentTurns.length <= 0)
          ) {

          tableBodyTurnsCashRegister.innerHTML = `
            <tr>
              <td colspan="6">No tiene turnos para el día ${dateReformated || 'de hoy'}.</td>
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
  
      usarCalcular(dataFinalsTurns); 

      handleSelectChange(cutServices, selectedDate);

    }
    
  } catch (error) {
    alert(error);
  }
};

const handlePaidsForBarber = ($payButton) => {
  $payButton.addEventListener('click', () => {
    getPaidForBarbers();
  })
}

const getPaidForBarbers = async () => {
  // Filtrar los turnos que tienen servicio
  const filteredTurns = registrosFinalesGlobal.filter(turn => turn.turns.Service);
  // Crear un objeto para almacenar las ganancias por peluquero
  const totalForBarber = {};

  // Sumar las ganancias por cada peluquero
  filteredTurns.forEach(turn => {
    const barber = turn.peluquero;
    const price = turn.precio || 0;
    const nameService = turn.servicio;

    if (!totalForBarber[barber]) {
      totalForBarber[barber] = 0; // Inicializar si no existe
    }

    // a esto lo podemos aprovechar para dividir los distintos porcentajes
    // if (nameService === 'Corte' || nameService === 'corte') {
    //   totalForBarber[barber] += price * 0.5; // Sumar la mitad del precio al peluquero correspondiente
    // }

    totalForBarber[barber] += price;
  });

  const paymentTableBody = document.querySelector('.table-pay-body');
  paymentTableBody.innerHTML = '';

  for (const barber in totalForBarber) {
    const totalEarned = totalForBarber[barber];

    const paymentBarber = totalEarned * 0.5;
    
    // if (barber === 'Alvaro' || barber === 'alvaro') {

    // }

    paymentTableBody.innerHTML += `
      <tr>
        <td>${barber}</td>
        <td>$${totalEarned.toFixed(2)}</td>
        <td>$${paymentBarber.toFixed(2)}</td>
      </tr>
    `;
  }
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
