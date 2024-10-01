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
const rows = (dataUsers) => {
  
  let row = '';

  dataUsers.forEach((user, index) => {
    console.log(user)
    if (index > 0) {
    
      row += `
        <tr key=${user.turns.Id}>
          <td scope="row">${user.turns.Date}</td>
          <td>${user.turns.Nombre}</td>
          <td>${user.peluquero}</td>
          <td></td>
          <td></td>
        </tr>
      `;
    }
    })

  return row;

};

const cashData = async () => {

  try {
    
    // const response = await fetch("https://peluqueria-invasion-backend.vercel.app/users");
    const response = await fetch("http://localhost:3001/turns");
    // const responseTurns = await fetch("https://localhost:3001/turns");

    if (!response.ok) {
      alert('Hubo algun error en obtener los usuarios.');
    } else {
      const dataUsers = await response.json();
      
      if (dataUsers.length > 1) {
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
                 ${rows(dataUsers)}
              </tbody>
            </table>
          </div>
        `;

        return tableCash;

      } else {
        return '<p class="empty">No hay datos registrados en la tabla.</p>'
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