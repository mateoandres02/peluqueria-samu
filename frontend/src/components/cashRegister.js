import { parseDate } from './date';
import '/src/styles/cashRegister.css';

const containerCashView = `<div class="containerCashView"></div>`;

const infoSectionCashView = `
  <div class="infoSectionCashView">
    <h3>Seguimiento de Caja</h3>
    <p>Aquí puedes visualizar métricas obtenidas relacionadas a la caja registradora.</p>
    <div class="cashRegisterFilterContainer">
        <div class="cashRegisterFilter">
          <span>Filtrar por fecha</span>
        <input type="date" class="filter-date-cash-tracking" id="filterDateInput" value="${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }).split(',')[0].split('/').reverse().join('-')}">
      </div>
      <div class="filterBarberCashTracking">
        <span>Filtrar por barbero</span>
        <select id="barberSelect" class="form-select">
          <option value="null">Seleccionar...</option>
        </select>
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

const loadBarberSelect = async (barberSelect) => {
  const barbers = await fetch('http://localhost:3001/users');
  const dataBarbers = await barbers.json();

  dataBarbers.forEach(barber => {
    barberSelect.innerHTML += `<option value="${barber.Nombre}">${barber.Nombre}</option>`;
  });
}

const cashData = async (tableBodyTurnsCashRegister, selectedDate = null, barberId = null) => {

  try {

    const responseCutServices = await fetch("http://localhost:3001/cutservices");

    const dateParam = selectedDate ? `${selectedDate}` : null;
    const barberParam = barberId ? `${barberId}` : null;

    let responseTurns;

    if (barberParam !== null && dateParam !== null) {
      responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}/${barberParam}`);
    } else if (barberParam === null && dateParam !== null) {
      responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}`);
    } else if (barberParam !== null && dateParam === null) {
      responseTurns = await fetch(`http://localhost:3001/turns/barber/${barberParam}`);
    }

    if (!responseTurns.ok) {
      tableBodyTurnsCashRegister.innerHTML = `
        <tr>
          <td colspan="6">No tiene turnos para el día ${selectedDate || 'de hoy'}.</td>
        </tr>
      `;
      return;
    }
    
    const cutServices = await responseCutServices.json();
    const dataTurns = await responseTurns.json();

    if (dataTurns.length <= 0) {
      tableBodyTurnsCashRegister.innerHTML = `
        <tr>
          <td colspan="6">No tiene turnos para el día ${selectedDate || 'de hoy'}.</td>
        </tr>
      `;
      return;
    }

    if (tableBodyTurnsCashRegister !== undefined) {
      tableBodyTurnsCashRegister.innerHTML = `${rows(dataTurns, cutServices)}`;
    }

    handleSelectChange(cutServices);

  } catch (error) {
    console.log(error);
  }

};

const rows = (dataTurns, cutServices) => {
  
  let row = '';
  dataTurns.forEach((user, index) => {

    if (index > -1) {
      let selectOptions = cutServices.map(service => `<option value="${service.servicio.Nombre}">${service.servicio.Nombre}</option>`).join('');

      let serviceField = user.turns && user.turns.Service ? `<span>${user.servicio}</span>` : `<span>Sin selección</span>`;

      let costField = user.precio ? user.precio : '0'; 

      let date = user.turns.Date ? parseDate(user.turns.Date) : '';

      row += `
        <tr key=${user.turns.Id}>
          <td scope="row">${date.dateWithoutTime}</td>
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
  });

  return row;
};

const handleSelectChange = (cutServices) => {

  document.querySelectorAll('.cut-service-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const selectedServiceName = e.target.value;
      const rowId = e.target.dataset.id;

      if (selectedServiceName === "Seleccionar tipo de servicio") {
        const priceCell = document.getElementById(`precio-${rowId}`);
        if (priceCell) {
          priceCell.textContent = '';
        }
        return;
      }

      const selectedService = cutServices.find(service => service.servicio.Nombre === selectedServiceName);

      if (selectedService) {
        const priceCell = document.getElementById(`precio-${rowId}`);
        priceCell.textContent = `$ ${selectedService.servicio.Precio}`;
      }

      const turn = {
        Service: selectedService.servicio.Id
      };

      await fetch(`http://localhost:3001/turns/${rowId}`, 
        { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(turn)
        }
      );

    });
  });
};

const addDateFilterListener = async (tableBodyTurnsCashRegister, dateInput) => {

  // Se elimina el listener porque sino se van acumulando, haciendo varias peticiones a la base de datos cada vez
  // que se cambia la fecha.
  dateInput.removeEventListener('change', handleDateChange); 
  dateInput.addEventListener('change', handleDateChange);

  const barbers = await fetch('http://localhost:3001/users');
  const dataBarbers = await barbers.json();

  async function handleDateChange(e) {
    let selectedDate = e.target.value;

    const barberInput = document.querySelector('#barberSelect');
    const filteredBarber = dataBarbers.filter(barber => barber.Nombre === barberInput.value);
    const selectedBarber = barberInput.value !== 'null' ? filteredBarber[0].Id : null;

    if (!filteredBarber.length > 0) {
      await cashData(tableBodyTurnsCashRegister, selectedDate, null)
    } else {
      await cashData(tableBodyTurnsCashRegister, selectedDate, selectedBarber);
    }

  };

};

const addBarberFilterListener = async (tableBodyTurnsCashRegister, barberSelect) => {

  const barbers = await fetch('http://localhost:3001/users');
  const dataBarbers = await barbers.json();

  barberSelect.addEventListener('change', async (e) => {

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

export {
  containerCashView,
  infoSectionCashView,
  tableTurns,
  cashData,
  addDateFilterListener,
  loadBarberSelect,
  addBarberFilterListener
};