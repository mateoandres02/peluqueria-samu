import { modalConfirm } from "./modalDeleteTurn";
import { showModalConfirmDelete } from "./manageEmployees";
import { getBarbers, getBarberById, getPaymentUsersById } from "./requests";

import "../styles/configParams.css";

const configParamsView = `<div class="configParamsView containerFunctionalityView"></div>`;

const infoSectionParamsView = `
  <div class="present-container">
    <h2>Configuración de Parametros</h2>
    <p class="configParamsView-p">Establece distintas configuraciones para distintas funcionalidades de la aplicación.</p>
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
      <select id="barberSelectConfigParams" class="barberSelect">
        <option value="null">Seleccionar...</option>
      </select>
    </div>
  </div>
`;

const tablePaymentEdit = `
  <div class="table-container table-payment-container">
    <table>
      <thead>
        <tr>
          <th scope="col">SERVICIO</th>
          <th scope="col">% PAGO INICIAL 
          <th scope="col">% PAGO NUEVO</th>
        </tr>
      </thead>
      <tbody class="table-config-pay-body">
      </tbody>
    </table>
  </div>
`;

const handleModifyPercentage = (links) => {
  console.log(links)

  links.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      
      e.preventDefault();
      
      const key = e.currentTarget.closest('tr').getAttribute('key');

      const input = document.createElement('input');
      input.type = 'number';
      input.value = 0; // Valor inicial
      input.id = 'input-new-percentage'; // Opcional, para identificar el input más tarde

      console.log(key)

      console.log(e.target.parentNode);
      e.target.parentNode.replaceChild(input, e.target);
      
      // try {
      //   const confirm = await showModalConfirmDelete(modalConfirm);

      //   if (confirm) {
      //     // const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/cutservices/${key}`, {
      //     //   method: 'DELETE'
      //     // });
      //     const response = await fetch(`http://localhost:3001/cutservices/${key}`, {
      //       method: 'DELETE'
      //     });

      //     if (response.ok) {
      //       window.location.reload();
      //     } else {
      //       alert('Error al eliminar el servicio.');
      //     };
      //   } else {
      //     console.log('Acción cancelada por el usuario.');
      //   }
      // } catch (e) {};
    });

  })
}

const rowsService = (dataServices, dataPaymentBarber) => {
  let row = '';

  const array = dataPaymentBarber.map(barber => {
    const service = dataServices.find(service => service.Id === barber.id_servicio);
    if (service) {
      return {
        id_usuario: barber.id_usuario,
        service: service.Nombre,
        precio: service.Precio,
        porcentaje_inicial: barber.porcentaje_inicial,
        porcentaje_final: barber.porcentaje_final,
      };
    }
    return null;
  }).filter(Boolean);

  array.forEach((item, index) => {
    if (index > -1) {
      console.log(item)
      row += `
        <tr key=${index}>
          <td scope="row">${item.service}</td>
          <td scope="row">${item.porcentaje_inicial}</td>
          <td scope="row"><a href="#" class="modify-percentage">${item.porcentaje_final}</a></td>
        </tr>
      `;
    };
  });

  console.log(row)
  return row;
}

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
    const response = await fetch("https://peluqueria-invasion-backend.vercel.app/cutservices");
     // const response = await fetch("http://localhost:3001/cutservices");
    
    if (!response.ok) {
      alert('Hubo algun error en obtener los servicios.');
    } else {
      const data = await response.json();

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
    };
  } catch (error) {
    console.log(error);
  };
}

const showRegisterServiceModal = (btn) => {

  /**
   * Muestra la modal al hacer click en el boton.
   * param: btn -> elemento html del boton que hace el post.
   */

  btn.addEventListener('click', () => {
    document.querySelector("#postServiceLabel").textContent = "Registrar Servicio";
    document.querySelector(".btnPost").textContent = "Registrar";

    const formService = document.querySelector("#formPOSTService");
    formService.setAttribute('data-mode', 'create');

    formService.removeAttribute('data-id');

    formService.Nombre.value = '';
    formService.Precio.value = '';
  });
}

const submitService = (form, modal, modalFooter) => {

  /**
   * Hace un post del servicio.
   * param: form -> elemento html del formulario.
   * param: modal -> modal para poder hacer el post.
   * param: modalFooter -> elemento html del footer de la modal
   */

  const span = document.createElement('span');
  const submitServiceButton = document.querySelector('.btnPost');
  span.innerHTML = 'Error al crear el servicio.';
  span.style.textAlign = 'center';
  span.style.width = '100%';
  span.style.marginTop = '1rem';
  span.style.marginBottom = '0rem';
  span.style.paddingBottom = '0rem';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mode = form.getAttribute('data-mode');
    const id = form.getAttribute('data-id');
    const nombre = form.Nombre.value;
    const precio = form.Precio.value;

    submitServiceButton.setAttribute('disabled', 'true');

    const service = {
      "Nombre": nombre,
      "Precio": precio
    }

    let url = `https://peluqueria-invasion-backend.vercel.app/cutservices`;
     // let url = 'http://localhost:3001/cutservices';
    let method = 'POST';

    if (mode === 'update') {
      url = `https://peluqueria-invasion-backend.vercel.app/cutservices/${id}`;
       // url = `http://localhost:3001/cutservices/${id}`;
      method = 'PUT';
    };

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(service)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error !== undefined || data.message !== undefined) {
        span.innerHTML = `${data.message}` || 'Nombre de Servicio o Precio incorrectos.';
        span.style.color = 'red';
      } else {
        span.innerHTML = mode === 'create' ? '¡Servicio creado correctamente!' : '¡Servicio actualizado correctamente!';
        span.style.color = '#5cb85c';

        setTimeout(() => {
          const bootstrapModalService = bootstrap.Modal.getInstance(modal._element);
          bootstrapModalService.hide();
          window.location.reload();
        }, 1300);
      };

      modalFooter.appendChild(span);
      setTimeout(() => {
        modalFooter.removeChild(span); 
        submitServiceButton.removeAttribute('disabled');
      }, 1500);
    })
    .catch((e) => {
      console.log('Error del servidor:', e);
    });
  });
};

const cancelSubmitFormService = (btnCancel, form, modal) => {

  /**
   * Cancela el post.
   */

  btnCancel.addEventListener('click', (e) => {
    e.preventDefault();

    form.Nombre.value = '';
    form.Precio.value = '';


    const bootstrapModalService = bootstrap.Modal.getInstance(modal._element);
    bootstrapModalService.hide();
  });
};

const updateService = (btnsPut, modal) => {

  /**
   * Hace un update en la base de datos del servicio.
   */

  btnsPut.forEach(btn => {

    btn.addEventListener('click', async (e) => {

      const key = e.currentTarget.getAttribute('key');

      const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/cutservices/${key}`);
       // const response = await fetch(`http://localhost:3001/cutservices/${key}`);
      const data = await response.json();

      document.querySelector("#postServiceLabel").textContent = "Actualizar Servicio";
      document.querySelector(".btnPost").textContent = "Actualizar";

      const $putFormModalService = document.querySelector("#formPOSTService");

      $putFormModalService.setAttribute('data-mode', 'update');
      $putFormModalService.setAttribute('data-id', key);

      $putFormModalService.Nombre.value = data.Nombre;
      $putFormModalService.Precio.value = data.Precio;

      modal.show();
    });
  });
};

const deleteService = (btnsDelete) => {

  /**
   * Hace un delete en la base de datos del servicio seleccionado.
   */

  btnsDelete.forEach(btn => {
    btn.addEventListener('click', async (e) => {                    
      
      const key = e.currentTarget.closest('tr').getAttribute('key');
      
      try {
        const confirm = await showModalConfirmDelete(modalConfirm);

        if (confirm) {
          const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/cutservices/${key}`, {
            method: 'DELETE'
          });
          // const response = await fetch(`http://localhost:3001/cutservices/${key}`, {
          //   method: 'DELETE'
          // });

          if (response.ok) {
            window.location.reload();
          } else {
            alert('Error al eliminar el servicio.');
          };
        } else {
          console.log('Acción cancelada por el usuario.');
        }
      } catch (e) {};
    });
  });
}

const handleChangeBarber = async (table, selectable) => {
  const dataBarbers = await getBarbers();

  selectable.addEventListener('change', async (e) => {
    
    const filteredBarber = dataBarbers.filter(barber => barber.Nombre === e.target.value);

    if (filteredBarber.length > 0) {
      const dataBarber = await getPaymentUsersById(filteredBarber[0].Id);
      paymentData(table, dataBarber)
    }

  });
}

const paymentData = async (table, dataBarber) => {
  try {
    // const responseCutServices = await fetch("http://localhost:3001/cutservices");
    const responseCutServices = await fetch("https://peluqueria-invasion-backend.vercel.app/cutservices");
    const cutServices = await responseCutServices.json();

    if (table !== undefined) {
      table.innerHTML = `${rowsService(cutServices, dataBarber)}`;
    }

    const links = document.querySelectorAll('.modify-percentage');
    handleModifyPercentage(links)
    
  } catch (error) {
    console.error('Error al obtener los barberos:', error);
  }
}

export { 
  configParamsView,
  infoSectionParamsView,
  configParamsInitialView,
  configPaymentView,
  serviceData,
  modalServices,
  showRegisterServiceModal,
  submitService,
  cancelSubmitFormService,
  updateService,
  deleteService,
  // paymentData,
  handleChangeBarber,
  tablePaymentEdit,
  handleModifyPercentage
};
