import '../styles/manageEmployees.css';

let manageEmployeesView = '<div class="manageEmployeesContainer"></div>';

const postEmployee = `
  <div class="postEmployee">
    <h3>Administración de Empleados</h3>
    <p class="postEmployee-p">Puede agregar nuevos empleados o quitarlos, además de cambiar su nombre y contraseña.</p>
    <button type="button" class="postEmployee-btn">
      <img src="/assets/icons/person-fill-add.svg">
      Agregar <br> Empleado
    </button>
  </div>
`;

const modal = `
  <div class="modal fade" id="postEmployee" tabindex="-1" aria-labelledby="postEmployeeLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="postEmployeeLabel">Registrar empleado</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
           <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">

          <form id="formPOSTEmployee">
            <label for="username">Usuario</label>
            <input type="text" id="username" name="Nombre" class="input" required>

            <label for="password">Constraseña</label>
            <input type="password" id="password" name="Contrasena" class="input" required>

            <label for="rol">Rol</label>
            <input type="text" id="rol" class="input" name="Rol" value="Empleado" readonly>
            
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
  data.forEach((user, index) => {
    if (index > 0) {
      row += `
        <tr key=${user.Id}>
          <td scope="row">${user.Id}</td>
          <td>${user.Nombre}</td>
          <td>${user.Contrasena}</td>
          <td>${user.Rol}</td>
          <td>
            <button class="table-btns modify">
              <i class="bi bi-pencil-fill" key=${user.Id}></i>
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

const usersData = async () => {
  try {
    // const response = await fetch("https://peluqueria-invasion-backend.vercel.app/users");
    const response = await fetch("http://localhost:3001/users");
    
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

const showRegisterEmployeeModal = (btn) => {

  btn.addEventListener('click', () => {
      // Configurar la modal para registrar un empleado.
      document.querySelector('#postEmployeeLabel').textContent = 'Registrar empleado';
      document.querySelector('.btnPost').textContent = 'Registrar';

      // Configuramos el formulario para registrar un empleado.
      const form = document.querySelector('#formPOSTEmployee');
      form.setAttribute('data-mode', 'create');

      // Removemos el atributo del usuario que se va a actualizar, dado que estamos en modo de hacer un post, no un put.
      form.removeAttribute('data-id');

      form.Contrasena.value = '';
      form.Contrasena.placeholder = '';           
      form.Nombre.value = '';     
  });

};

const submitEmployee = (form, modal, modalFooter) => {
  // Creamos la etiqueta donde se va a almacenar el resultado del envio del formulario.
  const span = document.createElement('span');
  span.innerHTML = 'Error al crear el usuario.';
  span.style.textAlign = 'center'
  span.style.width = '100%';
  span.style.marginTop = '1rem';
  span.style.marginBottom = '0rem';
  span.style.paddingBottom = '0rem';

  form.addEventListener('submit', async(e) => {
    e.preventDefault();

    // Desabilitamos el boton de submit para evitar multiples envios.
    const submitButton = form.querySelector('.btnPost');

    // Obtenemos el modo en el que está el formulario.
    const mode = form.getAttribute('data-mode');

    // Obtenemos el id del usuario que se va a actualizar.
    const id = form.getAttribute('data-id');

    // Tomamos los valores ingresados por el usuario para hacer un post.
    const username = form.Nombre.value;
    const password = form.Contrasena.value;
    const role = form.Rol.value;

    // Validación para el modo 'update'
    if (mode === 'update') {
      const response = await fetch("http://localhost:3001/users");
      const allUsers = await response.json();

      // Verificar si el nuevo nombre ya existe en los servicios
      const isDuplicate = allUsers.some(user => user.Nombre === username && user.Id !== id);

      if (isDuplicate) {
        span.innerHTML = 'El usuario ya existe';
        span.style.color = 'red';
        modalFooter.appendChild(span);
        setTimeout(() => {
          modalFooter.removeChild(span);
        }, 2500);
        return;
      }
    }
    submitButton.setAttribute('disabled', 'true');

    // Creamos un objeto de ese usaurio.
    const user = {
      "Nombre": username,
      "Contrasena": password,
      "Rol": role
    };

    // let url = 'https://peluqueria-invasion-backend.vercel.app/register';
    let url = 'http://localhost:3001/register';
    let method = 'POST';

    // Preguntamos si el modo es update para hacer una correcta request.
    if (mode === 'update') {
      // url = `https://peluqueria-invasion-backend.vercel.app/users/${id}`;
      url = `http://localhost:3001/users/${id}`;
      method = 'PUT';
    };

    // Hacemos la request.
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {

      // Si hubo algun error, lo mostramos en el span.
      if (data.error !== undefined) {
        span.innerHTML = `${data.error}` || 'Usuario o contraseña inválidos.';
        span.style.color = 'red';
      } else {
        // Si entra acá significa que no hubo ningun error.

        // Configuramos el mensaje del resultado del submit para caso positivo, dado que entró a este else.
        span.innerHTML = mode === 'create' ? '¡Usuario creado correctamente!' : '¡Usuario actualizado correctamente!';
        span.style.color = 'green';

        // Configuramos el tiempo de presentación del span y la salida de la modal a través de una instancia de la clase modal de bootstrap.
        setTimeout(() => {
          const bootstrapModal = bootstrap.Modal.getInstance(modal._element);
          bootstrapModal.hide();
          window.location.reload();
        }, 1500);

      };

      // Agregamos el elemento con el mensaje al footer de la modal.
      modalFooter.appendChild(span);

      setTimeout(() => {
        modalFooter.removeChild(span); 
        submitButton.removeAttribute('disabled');
      }, 1500);
    })
    .catch((e) => {
      // Error 500.
      console.log('Error del servidor:', e);
    });

  });
};

const cancelSubmitForm = (btnCancel, form, modal) => {
  // Le damos eventos al boton de cancelar de la modal.
  btnCancel.addEventListener('click', (e) => {
    // Quitamos evento por defecto (detectaba un submit)
    e.preventDefault();

    // Reseteamos contraseña puesta en otro actualizar.
    form.Contrasena.value = '';               
    form.Nombre.value = '';               

    // Cerramos la modal.
    const bootstrapModal = bootstrap.Modal.getInstance(modal._element);
    bootstrapModal.hide();
  });
};

const updateEmployee = (btnsPut, modal) => {
  // A cada botón le damos el evento click.
  btnsPut.forEach(btn => {

    btn.addEventListener('click', async (e) => {

      // Obtenemos la key del boton, el cual coincide con el id del registro.
      const key = e.currentTarget.getAttribute('key');

      // Hacemos una request para modificar el user con el id que coincida con la key del boton apretado
      // const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/users/${key}`);
      const response = await fetch(`http://localhost:3001/users/${key}`);
      const data = await response.json();

      // Configuramos mensajes de la modal.
      document.querySelector('#postEmployeeLabel').textContent = 'Actualizar empleado';
      document.querySelector('.btnPost').textContent = 'Actualizar';

      // Obtenemos el form de la modal
      const $putFormModal = document.querySelector('#formPOSTEmployee');

      // Seteamos atributos para que la modal pase a modo create
      $putFormModal.setAttribute('data-mode', 'update');
      $putFormModal.setAttribute('data-id', key);

      // Reseteamos contraseña posiblemente existente.
      $putFormModal.Contrasena.value = ''; 

      // Cargamos los inputs con los valores del user a modificar.
      $putFormModal.Nombre.value = data.Nombre;
      $putFormModal.Contrasena.placeholder = 'Contraseña';
      $putFormModal.Rol.value = data.Rol;

      // Mostramos la modal.
      modal.show();

    });

  });
};

const deleteEmployee = (btnsDelete) => {
  // A cada boton le damos el evento click.
  btnsDelete.forEach(btn => {
    btn.addEventListener('click', async (e) => {                    
      // Obtenemos la key
      const key = e.currentTarget.closest('tr').getAttribute('key');

      // Hacemos una request para obtener información del registro a eliminar.
      // const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/users/${key}`);
      const response = await fetch(`http://localhost:3001/users/${key}`);
      const data = await response.json();

      console.log(data);

      // Confirmamos la eliminación del registro.
      const $confirm = confirm(`¿Estás seguro que quieres eliminar al empleado ${data.Nombre}?`);

      // Si la confirmación es true, eliminamos el registro.
      if ($confirm) {
        // const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/users/${key}`, {
        //   method: 'DELETE'
        // });
        const response = await fetch(`http://localhost:3001/users/${key}`, {
            method: 'DELETE'
        });

        console.log(response)

        if (response.ok) {
          // Una vez eliminado el registro, recargamos la página.
          window.location.reload();
        } else {
          alert('Error al eliminar el usuario.');
        };
      };
    });
  });
}

export { 
  postEmployee, 
  modal, 
  usersData, 
  manageEmployeesView, 
  showRegisterEmployeeModal, 
  submitEmployee, 
  cancelSubmitForm, 
  updateEmployee, 
  deleteEmployee 
};