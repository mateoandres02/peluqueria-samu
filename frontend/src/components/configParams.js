import "../styles/configParams.css"

let configParamsView = 
`<div class="configParamsView">
  <h3>Configuración de Parametros</h3>
  <p class="infoConfigParams-p">Puede establecer valores de ciertos parametros en funcion a precios y servicios que cambien en el dia a dia!</p>
</div>`;

const configParamsInitialView = `
  <div class="serviceParams">
    <h4><img class="svg" src="/assets/icons/config.svg">Configuración de Servicios</h4>
    <button type="button" class="postService-btn">
      <img class="svg" src="/assets/icons/add.svg">
        Agregar <br> Servicio
    </button>
  </div>
`;

const modalServices = `
  <div class="modal fade" id="postService" tabindex="-1" aria-labelledby="postServiceLabel" aria-hidden="true">
    <div class="modal-dialog">
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

            <div class="modal-footer">
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
  <div class="paymentParams">
    <h4><img class="svg" src="/assets/icons/config.svg">Configuración de Pagos</h4>
    <select id="barberSelectConfigParams" class="barberSelect">
      <option value="null">Seleccionar...</option>
    </select>
  </div>`


const tablePaymentEdit = `
<div class="table-pay-container">
  <table class="table-pay-light">
    <thead class="table-pay-head">
      <tr>
        <th scope="col">SERVICIO</th>
        <th scope="col">% PAGO</th>
      </tr>
    </thead>
    <tbody class="table-pay-body">
    </tbody>
  </table>
</div>
`;

const rows = (data) => {
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

const rowsPayment = (data) => {
  let row = '';
  data.forEach((item, index) => {
    if (index > -1) {
      row += `
        <tr key=${item.Id}>
          <td scope="row">${item.Nombre}</td>
          <td>PORCENTAJE</td>
        </tr>
      `;
    };
  });

  return row;
};

const serviceData = async () => {
  try {
    // const response = await fetch("https://peluqueria-invasion-backend.vercel.app/users");
    const response = await fetch("http://localhost:3001/cutservices");
    
    if (!response.ok) {
      alert('Hubo algun error en obtener los servicios.');
    } else {
      const data = await response.json();

      if (data.length > 1) {
        let tableServices = `
          <div class="table-container">
            <table class="table-light">
              <thead>
                <tr>
                  <th scope="col">NOMBRE</th>
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
  btn.addEventListener('click', () => {
    document.querySelector("#postServiceLabel").textContent = "Registrar Servicio";
    document.querySelector(".btnPost").textContent = "Registrar";

    const formService = document.querySelector("#formPOSTService");
    formService.setAttribute('data-mode', 'create');

    formService.removeAttribute('data-id');

    formService.Nombre.value = '';
    formService.Precio.value = '';

    console.log('click', formService);
  });
}

const submitService = (form, modal, modalFooter) => {
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

    let url = 'http://localhost:3001/cutservices';
    let method = 'POST';

    if (mode === 'update') {
      // url = `https://peluqueria-invasion-backend.vercel.app/users/${id}`;
      url = `http://localhost:3001/cutservices/${id}`;
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
  btnCancel.addEventListener('click', (e) => {
    e.preventDefault();

    form.Nombre.value = '';
    form.Precio.value = '';


    const bootstrapModalService = bootstrap.Modal.getInstance(modal._element);
    bootstrapModalService.hide();
  });
};

const updateService = (btnsPut, modal) => {
  btnsPut.forEach(btn => {

    btn.addEventListener('click', async (e) => {

      const key = e.currentTarget.getAttribute('key');


      // const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/cutservices/${key}`);
      const response = await fetch(`http://localhost:3001/cutservices/${key}`);
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
  // A cada boton le damos el evento click.
  btnsDelete.forEach(btn => {
    btn.addEventListener('click', async (e) => {                    
      // Obtenemos la key
      const key = e.currentTarget.closest('tr').getAttribute('key');
      console.log("anda delete")
      // Hacemos una request para obtener información del registro a eliminar.
      // const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/users/${key}`);
      const response = await fetch(`http://localhost:3001/cutservices/${key}`);
      
      const data = await response.json();

      console.log(data);

      // Confirmamos la eliminación del registro.
      const $confirm = confirm(`¿Estás seguro que quieres eliminar el servicio ${data.Nombre}?`);

      // Si la confirmación es true, eliminamos el registro.
      if ($confirm) {
        // const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/users/${key}`, {
        //   method: 'DELETE'
        // });
        const response = await fetch(`http://localhost:3001/cutservices/${data.Id}`, {
            method: 'DELETE'
        });

        console.log(response)

        if (response.ok) {
          // Una vez eliminado el registro, recargamos la página.
          window.location.reload();
        } else {
          alert('Error al eliminar el servicio.');
        };
      };
    });
  });
}

/////PAYMENT SECTION//////////////////////////////////////////

const loadBarbersConfigSection = async (barberSelect) => {
  const barbers = await fetch('http://localhost:3001/users');
  const dataBarbers = await barbers.json();

  dataBarbers.forEach(barber => {
    barberSelect.innerHTML += `<option value="${barber.Nombre}">${barber.Nombre}</option>`;
  });
}

const paymentData = async (tableBodyPaymentEdit) => {
  try {
    const responseCutServices = await fetch("http://localhost:3001/cutservices");
    const cutServices = await responseCutServices.json();

    if (tableBodyPaymentEdit !== undefined) {
      tableBodyPaymentEdit.innerHTML = `${rows(dataTurns, cutServices)}`;
    }
    
  } catch (error) {
    console.error('Error al obtener los barberos:', error);
  }
}


const rowsPay = (cutServices) => {
  console.log("cutServices", cutServices);
  let row = '';
  dataTurns.forEach((user, index) => {

    if (index > -1) {

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

export { 
  configParamsView,
  configParamsInitialView,
  configPaymentView,
  serviceData,
  modalServices,
  showRegisterServiceModal,
  submitService,
  cancelSubmitFormService,
  updateService,
  deleteService,
  paymentData,
  loadBarbersConfigSection
};