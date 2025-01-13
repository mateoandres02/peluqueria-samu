import { putChangePercentageService, getServices} from "./requests";

import "../styles/configParams.css";


const configParamsView = `<div class="configParamsView containerFunctionalityView"></div>`;

const infoSectionParamsView = `
  <div class="present-container">
    <h2>Configuración de Parametros</h2>
    <p class="configParamsView-p">Establece configuraciones para distintas funcionalidades de la aplicación.</p>
  </div>
`;

const configParamsInitialView = `
  <hr>
  <div class="serviceParams">
    <div class="serviceParams-title">
      <h3><img class="svg" src="/assets/icons/config.svg">Configuración de Servicios</h3>
      <p>Agrega, modifica o elimina los servicios que ofreces.</p>
    </div>
    <div class="serviceParams-btn">
      <button type="button" class="postService-btn">
        <img class="svg" src="/assets/icons/add.svg">
          Agregar <br> Servicio
      </button>
    </div>
  </div>
`;

const modalServices = `
  <div class="modal fade" id="postService" tabindex="-1" aria-labelledby="postServiceLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="postServiceLabel">Registrar empleado</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
           <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">

          <form id="formPOSTService">
            <label for="name-service">Nombre</label>
            <input type="text" id="name-service" name="Nombre" class="input" required>

            <label for="price">Precio</label>
            <input type="number" id="price" name="Precio" class="input" required>

            <div class="modal-footer modal-footer-without-padding">
              <button type="submit" class="btn btn-success btnPost">Registrar</button>
              <button class="btn btn-danger btnCancel" data-bs-dismiss="modal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

const configPaymentView = `
  <hr>
  <div class="paymentParams">
    <div class="paymentParams-title">
      <h3><img class="svg" src="/assets/icons/config.svg">Configuración de Pagos</h3>
      <p>Configura los distintos porcentajes con respecto a los pagos que recibirán tus empleados.</p>
    </div>
    <div class="paymentParams-selectable">
      <select id="barberSelectConfigParams" class="form-select barberSelect">
        <option value="null">Seleccionar...</option>
      </select>
    </div>
  </div>
`;

const tablePaymentEdit = `
  <div class="table-container table-payment-container table-config-payment-container">
    <table>
      <thead>
        <tr>
          <th scope="col">SERVICIO</th>
          <th scope="col">% PAGO 
        </tr>
      </thead>
      <tbody class="table-config-pay-body">
      </tbody>
    </table>
  </div>
`;


const rows = (data) => {

  /**
   * Cargamos la tabla de servicios con los servicios de la aplicacion.
   * param: data -> array de servicios almacenados en la base de datos.
   */

  let row = '';
  data.forEach((item, index) => {
    if (index > -1) {
      row += `
        <tr key=${item.Id}>
          <td scope="row">${item.Nombre}</td>
          <td>${item.Precio}</td>
          <td>
            <button class="table-btns modify">
              <i class="bi bi-pencil-fill" key=${item.Id}></i>
            </button>
            <button class="table-btns delete">
              <i class="bi bi-trash-fill"></i>
            </button>
          </td>
        </tr>
      `;
    };
  });

  return row;
};


const serviceData = async () => {

  /**
   * Retornamos la tabla cargada o un mensaje de que no existen servicios en la aplicacion.
   */

  try {
    const data = await getServices();

    if (data.length > 0) {
      let tableServices = `
        <div class="table-container table-payment-container table-config-params">
          <table>
            <thead>
              <tr>
                <th scope="col">NOMBRE DEL SERVICIO</th>
                <th scope="col">PRECIO</th>
                <th scope="col">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              ${rows(data)}
            </tbody>
          </table>
        </div>
      `;

      return tableServices;

    } else {
      return '<p class="empty">No hay servicios registrados.</p>'
    }

  } catch (error) {
    alert("Error al cargar los servicios.");
  };
}


const handleModifyPercentage = (links) => {

  /**
   * Manejamos el cambio de porcentaje a pagarle por el servicio a cada barbero.
   * param: links -> son todos los elementos html "a" de los porcentajes de cada servicio.
   */

  links.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      
      e.preventDefault();
      
      const linkElement = e.target;

      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.max = 100;
      input.value = 0;
      input.id = 'input-new-percentage';
      
      linkElement.parentNode.replaceChild(input, linkElement);

      input.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
          const newValue = parseInt(input.value);

          if (newValue >= 0 && newValue <= 100) {

            const id_usuario = parseInt(btn.getAttribute('data-user'));
            const id_service = parseInt(btn.getAttribute('data-service'));

            try {
              const response = await putChangePercentageService(id_usuario, id_service, newValue);

              if (response.ok) {
                const newLink = document.createElement('a');
                newLink.href = '#';
                newLink.textContent = `${newValue} %`;
                newLink.className = linkElement.className;
                newLink.setAttribute('data-user', id_usuario)
                newLink.setAttribute('data-service', id_service)

                input.parentNode.replaceChild(newLink, input);

                handleModifyPercentage([newLink]);

              } else {
                alert('Error al actualizar el porcentaje.');
              }
            } catch (err) {
              alert('Error de conexión al actualizar el porcentaje.');
            }
          } else {
            alert('El valor debe estar entre 0 y 100.');
          }
        }
      });

      // Enfocamos el input automáticamente después del cambio por la accesibilidad.
      input.focus();
      
    });
  })
}


const rowsServices = (dataServices, dataPaymentBarber) => {

  /**
   * Cargamos los servicios ofrecidos por la barbería junto con los porcentajes de pago de cada servicio del barbero elegido.
   * param: dataServices -> array con todos los servicios.
   * param: dataPaymentBarber -> array con información de porcentajes de pago de cada servicio del barbero elegido.
   */

  let row = '';

  const array = dataPaymentBarber.map(barber => {

    /**
     * Juntamos los dos arrays y filtramos las propiedades que solamente necesitamos guardandolas en un nuevo objeto.
     */

    const service = dataServices.find(service => service.Id === barber.id_servicio);
    if (service) {
      return {
        id_usuario: barber.id_usuario,
        id_servicio: service.Id,
        service: service.Nombre,
        precio: service.Precio,
        porcentaje_pago: barber.porcentaje_pago,
      };
    }
    return null;
  }).filter(Boolean);

  array.forEach((item, index) => {

    /**
     * Cargamos la tabla con los servicios y los porcentajes de pago del barbero elegido.
     */

    if (index > -1) {
      row += `
        <tr key=${index}>
          <td scope="row">${item.service}</td>
          <td scope="row"><a href="#" class="modify-percentage" data-user="${item.id_usuario}" data-service="${item.id_servicio}">${item.porcentaje_pago} %</a></td>
        </tr>
      `;
    };
  });

  return row;

}


const paymentData = async (table, dataBarber) => {

  /**
   * Renderización de la información de los porcentajes de los barberos.
   * param: table -> elemento html donde se renderizará la información.
   * param: dataBarber -> información de los porcentajes de pago de los barberos.
   */

  try {

    const cutServices = await getServices();

    if (table !== undefined) {
      table.innerHTML = `${rowsServices(cutServices, dataBarber)}`;
    }

    const links = document.querySelectorAll('.modify-percentage');
    handleModifyPercentage(links)

  } catch (error) {
    alert('Error al obtener los barberos para poder configurar sus porcentajes de pago.');
  };

}

export { 
  configParamsView,
  infoSectionParamsView,
  configParamsInitialView,
  configPaymentView,
  tablePaymentEdit,
  modalServices,
  serviceData,
  handleModifyPercentage,
  paymentData
};
