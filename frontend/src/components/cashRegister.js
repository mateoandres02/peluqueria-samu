import { parseDate } from './date';
import '/src/styles/cashRegister.css';

const containerCashView = `<div class="containerCashView"></div>`;
//<input type="date" class="filter-date-cash-tracking" id="filterDateInput" value="${new DatetoL().ocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }).split(',')[0].split('/').reverse().join('-')}">
const infoSectionCashView = `
  <div class="infoSectionCashView">
    <h3>Seguimiento de Caja</h3>
    <p>Aquí puedes visualizar métricas obtenidas relacionadas a la caja registradora.</p>
    <div class="cashRegisterFilterContainer">
        <div class="cashRegisterFilter">
          <span>Filtrar por fecha</span>
          <input type="date" class="filter-date-cash-tracking" id="filterDateInput" value="${new Date().toISOString().split('T')[0]}">
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
        <h5 id="totalEarnedDisplay">Total ganado: <b>$0.00</b></h5>
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

const paymentSection = `
  <div class="paymentSection">
    <div class="payment-panel">
      <h4>Pagos</h4>
      <div>
        <button class="btn btn-primary pay-button" id="pay-button">Calcular Pagos</button>
      </div>
    </div>
    <div class="table-cash-container">
    <table class="table-cash-light">
      <thead class="table-cash-head">
        <tr>
          <th scope="col">BARBERO</th>
          <th scope="col">TOTAL GANADO</th>
          <th scope="col">CORRESPONDIENTE</th>
        </tr>
      </thead>
      <tbody class="table-pay-body">
      </tbody>
    </table>
  </div>
  </div>
`

const loadBarberSelect = async (barberSelect) => {
  const barbers = await fetch('http://localhost:3001/users');
  const dataBarbers = await barbers.json();

  dataBarbers.forEach(barber => {
    barberSelect.innerHTML += `<option value="${barber.Nombre}">${barber.Nombre}</option>`;
  });
}



const rows = (dataTurns, cutServices) => {
  let row = '';
  dataTurns.forEach((user, index) => {

    if (index > -1) {
      let selectOptions = cutServices.map(service => `<option value="${service.Nombre}">${service.Nombre}</option>`).join('');

      let serviceField = user.turns && user.turns.Service ? `<span>${user.servicio}</span>` : `<span class="span-red">Sin selección</span>`;

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

const handleSelectChange = (cutServices, dateValue) => {

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

      await fetch(`http://localhost:3001/turns/${rowId}`, 
        { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(turn)
        }
      );

      if (valueCalendar === today) {
        window.location.reload();
      }
    });
  });
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

// const getEarnedForBarber = async (dateValue) => {
//   try {
//     // Hacer la solicitud para obtener los turnos de la fecha seleccionada
//     const responseTurns = await fetch(`http://localhost:3001/turns/${dateValue}`);
//     const dataTurns = await responseTurns.json();

//     // Filtrar los turnos que tienen servicio
//     const filteredTurns = dataTurns.filter(turn => turn.turns.Service);

//     // Crear un objeto para almacenar las ganancias por peluquero
//     const totalForBarber = {};

//     // Sumar las ganancias por cada peluquero
//     filteredTurns.forEach(turn => {
//       const barber = turn.peluquero; // Asumiendo que el nombre del peluquero está en turn.peluquero
//       const price = turn.precio || 0; // Asegurarse de que el precio sea un número

//       if (!totalForBarber[barber]) {
//         totalForBarber[barber] = 0; // Inicializar si no existe
//       }

//       totalForBarber[barber] += price; // Sumar el precio al peluquero correspondiente
      
//     });

//      // Limpiar la tabla de pagos antes de agregar nuevos datos
//      const paymentTableBody = document.querySelector('.table-pay-body'); // Asegúrate de que esta clase sea la correcta
//      paymentTableBody.innerHTML = ''; // Limpiar la tabla

//     for (const barber in totalForBarber) {
//       const totalEarned = totalForBarber[barber];
//       const paymentBarber = totalEarned * 0.5;
//       console.log(`El peluquero ${barber} ha juntado: $${totalForBarber[barber].toFixed(2)}, y su pago es de: $${paymentBarber.toFixed(2)}`);
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${barber}</td>
//         <td>$${totalEarned.toFixed(2)}</td>
//         <td>$${paymentBarber.toFixed(2)}</td>
//       `;
//       paymentTableBody.appendChild(row);
//     }
//   } catch (error) {
//     console.log('Error al calcular las ganancias por peluquero:', error);
//   }
// }


let totalEarned = 0;
let dataBarbers = [];

const usarCalcular = (dataTurns) => {
  const $boton = document.querySelector('.btn-primary');
  const totalEarnedDisplay = document.getElementById('totalEarnedDisplay'); // Asegúrate de que este ID sea correcto

  // Definir la función calculateTotal
  async function calculateTotal() {
    // Resetear el total antes de calcular
    totalEarnedDisplay.innerHTML = 'Total ganado: <b>$0.00</b>'; // Resetea el contador a cero
    totalEarned = 0; // Reiniciar totalEarned

    // Calcular el total solo con los datos actuales
    totalEarned = dataTurns.reduce((acc, turn) => {
      return acc + (turn.precio || 0);
    }, 0);

    // Actualizar el display del total
    totalEarnedDisplay.innerHTML = `Total ganado: <b>$${totalEarned.toFixed(2)}</b>`;
    // console.log(`Total ganado RARO: $${totalEarned.toFixed(2)}`);
  }

  // Eliminar el listener anterior para evitar acumulación
  $boton.removeEventListener('click', calculateTotal); // Asegúrate de que esta función esté definida

  // Agregar el nuevo listener
  $boton.addEventListener('click', calculateTotal);
};
  // $boton.addEventListener('click', async () => {
  //   console.log("boton tocado", $boton) 
  //   console.log("la fecha seleccionada es", dateValue)
  //   try {
  //     totalEarnedDisplay.innerHTML = `Total ganado: <b>$${zero}</b>`;
  //     console.log(dateValue)
  //     const responseTurns = await fetch(`http://localhost:3001/turns/${dateValue}`);
  //     const dataTurns = await responseTurns.json();

  //     const filteredTurns = dataTurns.filter(turn => turn.turns.Service);

  //     totalEarned = filteredTurns.reduce((acc, turn) => {
  //       return acc + (turn.precio || 0);
  //     }, 0)

  //     totalEarnedDisplay.innerHTML = `Total ganado: <b>$${totalEarned.toFixed(2)}</b>`;
  //     console.log(`total ganado RARO: $${totalEarned.toFixed(2)}`);
  //     //console.log(`Total de los cortes para el dia ${dateValue}: $${totalEarned.toFixed(2)}`);

  //   } catch (error) {
  //     console.log("Error al calcular el total: ", error)
  //   }
  // })
  // }

const getPayForBarber = (dateValue) => {
  const $payButton = document.querySelector('.pay-button');

  if ($payButton) { // Verifica que el botón exista
    $payButton.addEventListener('click', async () => {
      try {
        await getEarnedForBarber(dateValue); // Asegúrate de que esta función se ejecute
      } catch (error) {
        console.error('Error al calcular los pagos:', error);
      }
    });
  } else {
    console.error('El botón de calcular pagos no se encontró en el DOM.');
  }
}

const addDateFilterListener = async (tableBodyTurnsCashRegister, dateInput) => {
  // Obtener los barberos una vez y almacenarlos en dataBarbers
  const barbers = await fetch('http://localhost:3001/users');
  dataBarbers = await barbers.json();

  // Se elimina el listener porque sino se van acumulando, haciendo varias peticiones a la base de datos cada vez
  dateInput.removeEventListener('change', handleDateChange); 
  dateInput.addEventListener('change', handleDateChange);

  async function handleDateChange(e) {
    let selectedDate = e.target.value;

    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Comparar la fecha seleccionada con la fecha de hoy
    if (selectedDate !== today) {
      // console.log("Hola"); // Mensaje si las fechas son diferentes
    }

    // Limpiar la tabla y el display del total
    totalEarned = 0; // Resetea el contador
    totalEarnedDisplay.innerHTML = 'Total ganado: <b>$0.00</b>'; // Resetea el display del total
    tableBodyTurnsCashRegister.innerHTML = ''; // Limpia el contenido de la tabla

    const barberInput = document.querySelector('#barberSelect');
    const filteredBarber = dataBarbers.filter(barber => barber.Nombre === barberInput.value);
    const selectedBarber = barberInput.value !== 'null' ? filteredBarber[0].Id : null;

    // Obtener los nuevos datos para la nueva fecha
    await cashData(tableBodyTurnsCashRegister, selectedDate, selectedBarber);
  };
};

// const getTurns = async (tableBodyTurnsCashRegister, selectedDate = null, barberId = null) => {
//   // let responseTurns;

//   // if (barberParam !== null && dateParam !== null) {
//   //   responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}/${barberParam}`);
//   // } else if (barberParam === null && dateParam !== null) {
//   //   responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}`);
//   // } else if (barberParam !== null && dateParam === null) {
//   //   responseTurns = await fetch(`http://localhost:3001/turns/barber/${barberParam}`);
//   // }

//   const dateParam = selectedDate ? `${selectedDate}` : null;
//   const barberParam = barberId ? `${barberId}` : null;

//   console.log(dateParam)

//   const responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}`);

//   if (!responseTurns.ok) {
//     tableBodyTurnsCashRegister.innerHTML = `
//       <tr>
//         <td colspan="6">No tiene turnos para el día ${selectedDate || 'de hoy'}.</td>
//       </tr>
//     `;
//     return;
//   }

//   const dataTurns = await responseTurns.json();

//   console.log(dataTurns)

//   return dataTurns;
// }

// const getRecurrentTurns = async (dataTurns, recurrentTurnsList) => {
//   for (const turn of dataTurns) {
//     const turnActive = turn.turns;
//     if (turnActive.Regular === "true") {
//       const turnRecurrentActiveId = turnActive.Id;

//       const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/turn/${turnRecurrentActiveId}`);
//       const dataRecurrentTurns = await responseRecurrentTurns.json();

//       recurrentTurnsList.push(dataRecurrentTurns);
//       console.log('lista actualizada', recurrentTurnsList)
//     }
//   }
// }

const cashData = async (tableBodyTurnsCashRegister, selectedDate = null, barberId = null) => {
  try {
    const responseCutServices = await fetch("http://localhost:3001/cutservices");
    const cutServices = await responseCutServices.json();

    const dateParam = selectedDate ? `${selectedDate}` : null;
    const barberParam = barberId ? `${barberId}` : null;

    let responseTurns;
    
    responseTurns = await fetch(`http://localhost:3001/recurrent_turns/${dateParam}`);

    // if (barberParam !== null && dateParam !== null) {
    //   responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}/${barberParam}`);
    // } else if (barberParam === null && dateParam !== null) {
    //   responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}`);
    // } else if (barberParam !== null && dateParam === null) {
    //   responseTurns = await fetch(`http://localhost:3001/turns/barber/${barberParam}`);
    // }

    if (!responseTurns.ok) {
      tableBodyTurnsCashRegister.innerHTML = `
        <tr>
          <td colspan="6">No tiene turnos para el día ${selectedDate || 'de hoy'}.</td>
        </tr>
      `;
      return;
    }

    const dataTurns = await responseTurns.json();

    console.log(dataTurns)

    // const dataTurns = await getTurns(tableBodyTurnsCashRegister, selectedDate = null, barberId = null)
    // console.log(dataTurns)

    // let recurrentTurnsList = [];
    // const recurrentTurns = await getRecurrentTurns(dataTurns, recurrentTurnsList);

    if (dataTurns.length <= 0) {
      tableBodyTurnsCashRegister.innerHTML = `
        <tr>
          <td colspan="6">No tiene turnos para el día ${selectedDate || 'de hoy'}.</td>
        </tr>
      `;
      return;
    }

    // Llamar a usarCalcular con los datos actuales
    usarCalcular(dataTurns); // Asegúrate de pasar los datos correctos

    // Mostrar los datos en la tabla
    if (tableBodyTurnsCashRegister !== undefined) {
      tableBodyTurnsCashRegister.innerHTML = `${rows(dataTurns, cutServices)}`;
    }

    handleSelectChange(cutServices, selectedDate);
  } catch (error) {
    console.log(error);
  }
};


export {
  containerCashView,
  infoSectionCashView,
  tableTurns,
  paymentSection,
  cashData,
  addDateFilterListener,
  loadBarberSelect,
  addBarberFilterListener
};