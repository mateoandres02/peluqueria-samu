import '/src/styles/cashRegister.css';

// aca va a ir la tabla para visualizar los datos
let cashView = `
<div class="contenedorCashView">
</div>`

const infoSectionCashView = `
  <div class="infoSectionCashView">
    <h3>Seguimiento de Caja</h3>
    <p>Visualiza metricas obtenidas relacionadas a la caja registradora.</p>
  </div>
`;

// console.log("usuario Activo", usuarioActivo)
const rows = (dataUsers, cutServices) => {
  
  let row = '';

  dataUsers.forEach((user, index) => {
    // console.log(user)
    if (index > 0) {
      let selectOptions = cutServices.map(service => `<option value="${service.servicio.Nombre}">${service.servicio.Nombre}</option>`).join('');
      row += `
        <tr key=${user.turns.Id}>
          <td scope="row">${user.turns.Date}</td>
          <td>${user.turns.Nombre}</td>
          <td>${user.peluquero}</td>
          <td>
            <select class="form-select cut-service-select" data-id="${user.turns.Id}" aria-label="Tipo de corte">
              <option selected>Seleccionar tipo de servicio</option>
              ${selectOptions}
            </select>
          </td>
          <td class="precio-corte" id="precio-${user.turns.Id}"></td>
        </tr>
      `;
     }
    });

  return row;

};

// ANTERIOR
const handleSelectChange = (cutServices) => {
  document.querySelectorAll('.cut-service-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const selectedServiceName = e.target.value;
      // console.log(selectedServiceName)
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
        priceCell.textContent = `$${selectedService.servicio.Precio}`;
      }
    });
  });
};

// const handleSelectChange = (cutServices) => {
//   document.querySelectorAll('.cut-service-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//       const selectedServiceName = event.target.value;
//       const rowId = event.target.dataset.id;

//       console.log(`Selected Service: ${selectedServiceName}, Row ID: ${rowId}`); // Verifica que rowId es correcto

//       const selectedService = cutServices.find(service => service.servicio.Nombre === selectedServiceName);

//       if (selectedService) {
//         const priceCell = document.getElementById(`precio-${rowId}`);
//         console.log(`Price cell:`, priceCell); // Verifica que priceCell no es null

//         if (priceCell) {
//           priceCell.textContent = `$${selectedService.servicio.Precio}`;
//         } else {
//           console.error(`No se encontró el elemento con id precio-${rowId}`);
//         }
//       }
//     });
//   });
// };

const cashData = async () => {

  try {
    
    // const response = await fetch("https://peluqueria-invasion-backend.vercel.app/users");
    // const responseTurns = await fetch("https://localhost:3001/turns");
    const responseTurns = await fetch("http://localhost:3001/turns");
    const responseCutServices = await fetch("http://localhost:3001/cutservices");

    if (!responseTurns.ok || !responseCutServices.ok) {
      alert('Hubo algun error en obtener los usuarios o los servicios de corte.');
    } else {
      const dataUsers = await responseTurns.json();
      const cutServices = await responseCutServices.json();
      
      if (dataUsers.length > 1 && cutServices.length > 0) {
        let tableCash = `
          <div class="table-container">
            <table class="table-light">
              <thead>
                <tr>
                  <th scope="col">FECHA</th>
                  <th scope="col">CLIENTE</th>
                  <th scope="col">BARBERO</th>
                  <th scope="col">TIPO CORTE</th>
                  <th scope="col">COSTO</th>
                </tr>
              </thead>
              <tbody>
                 ${rows(dataUsers, cutServices)}
              </tbody>
            </table>
          </div>
        `;

        document.querySelector('.contenedorCashView').innerHTML = tableCash
        // return tableCash;

        handleSelectChange(cutServices);

      } else {
        // return '<p class="empty">No hay datos registrados en la tabla.</p>'
        document.querySelector('.contenedorCashView').innerHTML = '<p class="empty">No hay datos registrados en la tabla.</p>';
      }
    };
  } catch (error) {
    console.log(error);
  }

};

export {
  cashView,
  cashData,
  infoSectionCashView,
} 