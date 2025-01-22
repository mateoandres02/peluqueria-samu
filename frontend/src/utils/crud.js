import { getBarberById, getBarbers, getServiceById, getServices, getVoucherById, popService, popUser, popVoucher } from "../components/requests";
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

    let nombre;
    let precio;
    let contrasena;
    let rol;
    let selectedOption;
    let idBarbero;
    let motivo;
    let monto;

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

export {
  submitRecord,
  updateRecord,
  deleteRecord,
  updateVoucher,
  deleteVoucher
}