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

const rows = (data) => {
  let row = '';
  data.forEach((item, index) => {
    if (index > 0) {
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
      if (data.error !== undefined) {
        span.innerHTML = `{data.error}` || 'Nombre de Servicio o Precio incorrectos.';
        span.style.color = 'red';
      } else {
        span.innerHTML = mode === 'create' ? '¡Servicio creado correctamente!' : '¡Servicio actualizado correctamente!';
        span.style.color = 'green';

        setTimeout(() => {
          const bootstrapModalService = bootstrap.Modal.getInstance(modal._element);
          bootstrapModalService.hide();
          window.location.reload();
        }, 1300);
      };

      modalFooter.appendChild(span);
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




/*
const showServices = async () => {
    const data = await getServices();
    console.log(data);

    document.querySelector('.table-container').innerHTML = tableServices;

    if (data.length > 0) {
      let services = '';
      console.log(data);
      data.forEach(item => {
        services += `
          <tr>
            <td>${item.Nombre}</td>
            <td>${item.Precio}</td>
          </tr>
        `;
      });

      document.querySelector('.table-cash-body').innerHTML = services;
    }
}
*/

/*
const servicesData = async () => {
  try {
    // const response = await fetch("https://peluqueria-invasion-backend.vercel.app/users");
    const response = await fetch("http://localhost:3001/cutservices");
    
    if (!response.ok) {
      alert('Hubo algun error en obtener los usuarios.');
    } else {
      const data = await response.json();
      
      if (data.length > 1) {
        let tableEmployees = `
          <div class="table-container">
            <table class="table-light">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">USUARIO</th>
                  <th scope="col">CONTRASEÑA</th>
                  <th scope="col">ROL</th>
                  <th scope="col">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                ${rows(data)}
              </tbody>
            </table>
          </div>
        `;

        return tableEmployees;

      } else {
        return '<p class="empty">No hay empleados registrados.</p>'
      }
    };
  } catch (error) {
    console.log(error);
  };
};
*/

export { 
  configParamsView,
  configParamsInitialView,
  serviceData,
  modalServices,
  showRegisterServiceModal,
  submitService,
  cancelSubmitFormService,
  updateService,
  deleteService 
};