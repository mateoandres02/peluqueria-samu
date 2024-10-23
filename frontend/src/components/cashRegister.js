import '/src/styles/cashRegister.css';

let containerCashView = `<div class="containerCashView"></div>`

const infoSectionCashView = `
  <div class="infoSectionCashView">
    <h3>Seguimiento de Caja</h3>
    <p>Aquí puedes visualizar métricas obtenidas relacionadas a la caja registradora.</p>
    <div>
      <input type="date" class="filter-date-cash-tracking">
    </div>
  </div>
`;

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

      window.location.reload();

    });
  });
};

const rows = (dataTurns, cutServices) => {
  
  let row = '';

  dataTurns.forEach((user, index) => {

    if (index > -1) {
        let selectOptions = cutServices.map(service => 
          `
            <option value="${service.servicio.Nombre}">
              ${service.servicio.Nombre}
            </option>
          `
          )
          .join('');

        let serviceField = user.turns.Service 
          ? `
            <span>${user.servicio}</span>
            <select class="form-select cut-service-select cut-service-select-notnull" data-id="${user.turns.Id}" aria-label="Tipo de corte">
                <option selected>Seleccionar...</option>
                ${selectOptions}
              </select>
            `
          : `<select class="form-select cut-service-select cut-service-select-null" data-id="${user.turns.Id}" aria-label="Tipo de corte">
              <option selected>Seleccionar...</option>
              ${selectOptions}
            </select>`;

        let costField = user.precio ? user.precio : '0'; 

        row += `
          <tr key=${user.turns.Id}>
            <td scope="row">${user.turns.Date}</td>
            <td>${user.turns.Nombre}</td>
            <td>${user.peluquero}</td>
            <td id="tdService">
              <div>${serviceField}</div>
            </td>
            <td class="precio-corte" id="precio-${user.turns.Id}">$ ${costField}</td>
          </tr>
        `;
      }
    });

  return row;

};

const cashData = async () => {

  try {

    // const responseTurns = await fetch("https://peluqueria-invasion-backend.vercel.app/turns");
    // const responseCutServices = await fetch("https://peluqueria-invasion-backend.vercel.app/cutservices");
    const responseTurns = await fetch("http://localhost:3001/turns");
    const responseCutServices = await fetch("http://localhost:3001/cutservices");

    if (!responseTurns.ok || !responseCutServices.ok) {
      alert('Hubo algun error en obtener los usuarios o los servicios de corte.');
    } else {
      const dataTurns = await responseTurns.json();
      const cutServices = await responseCutServices.json();
      
      if (dataTurns.length > 0 && cutServices.length > 0) {
        let tableCash = `
          <div class="table-container">
            <table class="table-light">
              <thead>
                <tr>
                  <th scope="col">FECHA</th>
                  <th scope="col">CLIENTE</th>
                  <th scope="col">BARBERO</th>
                  <th scope="col">SERVICIO</th>
                  <th scope="col">COSTO</th>
                </tr>
              </thead>
              <tbody>
                 ${rows(dataTurns, cutServices)}
              </tbody>
            </table>
          </div>
        `;

        document.querySelector('.containerCashView').innerHTML += tableCash;

        handleSelectChange(cutServices);

        // return tableCash;

      } else {
        document.querySelector('.containerCashView').innerHTML += '<p class="empty">No hay turnos registrados.</p>';

        // return algun mensaje;

        // la idea es que no haya una relación con la vista desde acá, sino que los componentes se agreguen desde 
        // el index admin view.
      }
    };
  } catch (error) {
    console.log(error);
  }

};

export {
  containerCashView,
  cashData,
  infoSectionCashView
} 