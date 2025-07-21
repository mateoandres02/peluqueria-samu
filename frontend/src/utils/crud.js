import { getBarberById, getBarbers, getClientById, getClients, getServiceById, getServices, getVoucherById, popClient, popService, popUser, popVoucher } from "../components/requests";
import { showModalConfirmDelete } from "./modal.js";
import { modalConfirm } from '../components/modalDeleteTurn.js';


const submitRecord = (form, modal, modalFooter, btnPostModal, section = null) => {

  /**
   * Hace un post del servicio.
   * param: form -> elemento html del formulario.
   * param: modal -> modal para poder hacer el post.
   * param: modalFooter -> elemento html del footer de la modal
   */

  const span = document.createElement('span');
  span.innerHTML = 'Error al crear el servicio.';
  span.style.textAlign = 'center';
  span.style.width = '100%';
  span.style.marginTop = '1rem';
  span.style.marginBottom = '0rem';
  span.style.paddingBottom = '0rem';

  const $barberVoucherSelect = document.querySelector('#select-barber-voucher');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mode = form.getAttribute('data-mode');
    const id = form.getAttribute('data-id');

    const $loader = document.querySelector('.loader-container');
    if ($loader) $loader.style.display = "flex";

    let nombre;
    let precio;
    let contrasena;
    let rol;
    let selectedOption;
    let idBarbero;
    let motivo;
    let monto;
    let telefono;

    if (form.Nombre) nombre = form.Nombre.value;
    if (form.Precio) precio = form.Precio.value;
    if (form.Contrasena) contrasena = form.Contrasena.value;
    if (form.Rol) rol = form.Rol.value;
    if ($barberVoucherSelect) {
      selectedOption = $barberVoucherSelect.options[$barberVoucherSelect.selectedIndex];
      idBarbero = selectedOption.dataset.barberid;
    }
    if (form.Motivo) motivo = form.Motivo.value;
    if (form.Monto) monto = form.Monto.value;
    if (form.Telefono) telefono = form.Telefono.value;

    if (mode === 'update') {

      if (section == "manageEmployees") {

        const allUsers = await getBarbers();

        let isDuplicate = false;

        allUsers.forEach(user => {
          if (user.Nombre === nombre && user.Id !== parseInt(id)) {
            isDuplicate = true;
          }
          return;
        });

        if (isDuplicate) {
          span.innerHTML = 'El usuario ya existe';
          span.style.color = 'red';
          modalFooter.appendChild(span);
          setTimeout(() => {
            modalFooter.removeChild(span);
          }, 2500);
          return;
        };

      }

      if (section == "config") {

        const allServices = await getServices();

        let isDuplicate = false;

        allServices.forEach(service => {
          if (service.Nombre === nombre && service.Id !== parseInt(id)) {
            isDuplicate = true;
          }
          return;
        });

        if (isDuplicate) {
          span.innerHTML = 'El servicio ya existe';
          span.style.color = 'red';
          modalFooter.appendChild(span);
          setTimeout(() => {
            modalFooter.removeChild(span);
          }, 2500);
          return;
        };

      }

    }

    if (section == "manageClients") {
      const allClients = await getClients();

      let isDuplicate = false;

      if (!allClients.message) {
        allClients.forEach(client => {
          if (client.Nombre === nombre && client.Id !== parseInt(id)) {
            isDuplicate = true;
          }
          return;
        });
      }

      if (isDuplicate) {
        $loader.style.display = "none";
        span.innerHTML = 'El cliente ya existe en la base de datos.';
        span.style.color = 'red';
        modalFooter.appendChild(span);
        setTimeout(() => {
          modalFooter.removeChild(span);
        }, 2500);
        return;
      };
    }

    btnPostModal.setAttribute('disabled', 'true');

    let body;

    let url;
    let method;

    let messageSpan;

    if (section == "config") {
      body = { "Nombre": nombre, "Precio": precio }

      if (mode === 'update') {
        url = `https://peluqueria-invasion-backend.vercel.app/cutservices/${id}`;
        // url = `http://localhost:3001/cutservices/${id}`;
        method = 'PUT';
      } else {
        url = `https://peluqueria-invasion-backend.vercel.app/cutservices`;
        // url = 'http://localhost:3001/cutservices';
        method = 'POST';
      }

      messageSpan = 'Nombre de Servicio o Precio incorrectos.';
    };

    if (section == "manageEmployees") {
      body = { "Nombre": nombre, "Contrasena": contrasena, "Rol": rol };

      if (mode === 'update') {
        url = `https://peluqueria-invasion-backend.vercel.app/users/${id}`;
        // url = `http://localhost:3001/users/${id}`;
        method = 'PUT';
      } else {
        url = `https://peluqueria-invasion-backend.vercel.app/register`;
        // url = 'http://localhost:3001/register';
        method = 'POST';
      }

      messageSpan = 'Usuario o contraseña inválida.';
    };

    if (section == "voucher") {
      body = { "IdUsuario": idBarbero, "Motivo": motivo, "CantidadDinero": monto }

      if (mode === 'update') {
        url = `https://peluqueria-invasion-backend.vercel.app/vouchers/${id}`;
        // url = `http://localhost:3001/vouchers/${id}`;
        method = 'PUT';
      } else {
        url = `https://peluqueria-invasion-backend.vercel.app/vouchers`;
        // url = 'http://localhost:3001/vouchers';
        method = 'POST';
      }

      messageSpan = 'Barbero, motivo o monto inválido.';
    }

    if (section == "manageClients") {
      body = { "Nombre": nombre, "Telefono": telefono };

      if (mode === 'update') {
        url = `https://peluqueria-invasion-backend.vercel.app/clients/${id}`;
        // url = `http://localhost:3001/clients/${id}`;
        method = 'PUT';
      } else {
        url = `https://peluqueria-invasion-backend.vercel.app/clients`;
        // url = 'http://localhost:3001/clients';
        method = 'POST';
      }

      messageSpan = 'Nombre o teléfono incorrecto.';
    }

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {

        $loader.style.display = "none";

        if (data.error !== undefined || data.message !== undefined) {
          span.innerHTML = data.error || data.message || messageSpan || 'Error al crear o actualizar el registro.';
          span.style.color = 'red';
        } else {
          span.innerHTML = mode === 'create' ? '¡Se creó correctamente!' : '¡Se actualizó correctamente!';
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
          btnPostModal.removeAttribute('disabled');
        }, 1500);
      })
      .catch((e) => {
        alert('Error al crear o actualizar el registro.');
      });
  });
};

const updateVoucher = (btnPutVoucher) => {
  const $modalVoucher = new bootstrap.Modal(document.getElementById('postVoucher'));
  const $formPostVoucher = document.querySelector("#formPOSTVoucher");
  const $titleModalVoucher = document.querySelector("#postVoucherLabel");
  const $btnPostModalVoucher = document.querySelector(".btnPost");

  btnPutVoucher.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const key = e.currentTarget.getAttribute('key');
      let data;

      data = await getVoucherById(key);

      $titleModalVoucher.textContent = "Actualizar Vale";
      $btnPostModalVoucher.textContent = "Actualizar";

      $formPostVoucher.setAttribute('data-mode', 'update');
      $formPostVoucher.setAttribute('data-id', key);

      $formPostVoucher.Motivo.value = data.Motivo;
      $formPostVoucher.Monto.value = data.CantidadDinero;

      $modalVoucher.show();

      document.querySelector('.closeModal').addEventListener('click', () => {
        $modalVoucher.hide();
      });
    });
  });
}

const deleteVoucher = (btnDeleteVoucher) => {
  btnDeleteVoucher.forEach(btn => {
    btn.addEventListener('click', async (e) => {

      const key = e.currentTarget.closest('tr').getAttribute('key');

      try {
        const confirm = await showModalConfirmDelete(modalConfirm);

        if (confirm) {

          let response;

          response = await popVoucher(key);

          if (response.ok) {
            window.location.reload();
          } else {
            alert('Error al eliminar el registro.');
          };
        }

      } catch (e) {
        alert('Hubo un error al eliminar el registro.')
      };
    });

  });
}

const updateRecord = (btnsPut, modal, $putFormModal, $titleModal, $btnPost, section = null) => {

  /**
   * Hace un update en la base de datos del servicio.
   * param: btnsPut -> botones de actualizar.
   * param: modal -> modal desplegada.
   */

  btnsPut.forEach(btn => {

    btn.addEventListener('click', async (e) => {

      const key = e.currentTarget.getAttribute('key');

      let data;

      if (section == "config") {
        data = await getServiceById(key);

        $titleModal.textContent = "Actualizar Servicio";
      };

      if (section == "manageEmployees") {
        data = await getBarberById(key)

        $titleModal.textContent = "Actualizar Empleado";
      };

      // if (section == "voucher") {
      //   data = await getVoucherById(key);

      //   $titleModal.textContent = "Actualizar Vale";
      // }

      if (section == "manageClients") {
        data = await getClientById(key);

        $titleModal.innerHTML = "Actualizar cliente";
      }

      $btnPost.textContent = "Actualizar";

      $putFormModal.setAttribute('data-mode', 'update');
      $putFormModal.setAttribute('data-id', key);

      if ($putFormModal.Nombre) $putFormModal.Nombre.value = data.Nombre;
      if ($putFormModal.Precio) $putFormModal.Precio.value = data.Precio;
      if ($putFormModal.Contrasena) {
        $putFormModal.Contrasena.placeholder = 'Contraseña';
        $putFormModal.Contrasena.value = '';
      }
      if ($putFormModal.Rol) $putFormModal.Rol.value = data.Rol;
      // if ($putFormModal.Motivo) $putFormModal.Motivo.value = data.Motivo;
      // if ($putFormModal.Monto) $putFormModal.Monto.value = data.CantidadDinero;
      if ($putFormModal.Telefono) $putFormModal.Telefono.value = data.Telefono;

      modal.show();

    });

  });

};


const deleteRecord = (btnsDelete, section = null) => {

  /**
   * Hace un delete en la base de datos del servicio seleccionado.
   */
  btnsDelete.forEach(btn => {
    btn.addEventListener('click', async (e) => {

      const key = e.currentTarget.closest('tr').getAttribute('key');

      try {
        const confirm = await showModalConfirmDelete(modalConfirm);

        if (confirm) {

          let response;

          if (section == "config") response = await popService(key);
          if (section == "manageEmployees") response = await popUser(key);
          // if (section == "voucher") response = await popVoucher(key);
          if (section == "manageClients") response = await popClient(key);

          if (response.ok) {
            window.location.reload();
          } else {
            alert('Error al eliminar el registro.');
          };
        }

      } catch (e) {
        alert('Hubo un error al eliminar el registro.')
      };
    });

  });

}

// Apartado de registro de sesion de trabajo
const postWorkSession = async (fechaInicio, horarioInicio) => {
  try {
    const data = {
      FechaSesion: fechaInicio,
      HorarioInicio: horarioInicio
    };

    // const response = await fetch('http://localhost:3001/worksessions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type':'application/json',
    //   },
    //   body: JSON.stringify(data),
    //   credentials: 'include',
    // });

    const response = await fetch('https://peluqueria-invasion-backend.vercel.app/worksessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    const dataJson = await response.json()

    if (!response.ok) {
      throw new Error('Error al registrar la accion: ' + response.statusText);
    } else {
      console.log("registro anadido", dataJson)
      localStorage.setItem("workSessionId", dataJson.Id)
    }

  } catch (error) {
    console.error("Error al registrar la sesion de trabajo", error.message);
  }
};

const updateWorkSession = async (horaFin, cantHoras) => {
  const sessionId = localStorage.getItem("workSessionId");

  if (!sessionId) {
    console.error("No hay sesion de trabajo activa para actualizar.");
    return;
  }

  try {
    const data = {
      HorarioFin: horaFin,
      CantHoras: cantHoras
    };

    // const response = await fetch(`http://localhost:3001/worksessions/${sessionId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type':'application/json',
    //   },
    //   body: JSON.stringify(data),
    //   credentials: 'include',
    // });

    const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/worksessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });


    const dataJson = await response.json();

    if (!response.ok) {
      throw new Error('Error al actualizar la sesión: ' + response.statusText);
    } else {
      console.log("Sesión de trabajo actualizada:", dataJson);
      localStorage.removeItem("workSessionId");
      localStorage.removeItem("fechaInicio");
      localStorage.removeItem("horarioInicio");
    }
  } catch (error) {
    console.error("Error al actualizar la sesión de trabajo:", error.message);
  }
};

export {
  submitRecord,
  updateRecord,
  deleteRecord,
  updateVoucher,
  deleteVoucher,
  postWorkSession,
  updateWorkSession
}