import { getVouchers } from "./requests";
import { modalConfirm } from './modalDeleteTurn.js';
import { parseDate } from "../utils/date";
import { getVouchersFilteredByDate, getVouchersFilteredByDateAndBarber, getVouchersFilteredByBarber } from "./requests";
import "../styles/configParams.css";
import "../styles/voucher.css"

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
const formattedDate = today.toISOString().split('T')[0];

const voucherView = `<div class="voucherView containerFunctionalityView"></div>`;

const infoSectionVoucherView = `
  <div class="present-container">
    <h2>Administración de vales y retiros de dinero</h2>
    <p class="configParamsView-p">Lleva una cuenta de los vales hechos a barberos y retiros de dinero.</p>
  </div>
`;

const voucherAddView = `
  <hr>
  <div class="serviceParams">
    <div class="serviceParams-title">
      <h3><img class="svg" src="/assets/icons/config.svg">Administración de vales</h3>
      <p>Agrega, modifica o elimina los vales.</p>
    </div>
    <div class="voucher-params">
    <div class="serviceParams-btn">
      <button type="button" class="postService-btn">
        <img class="svg" src="/assets/icons/add.svg">
          Agregar <br> Vale
      </button>
    </div>
    <div class="present-container-filter cashRegisterFilter">
      <span>Filtrar por fecha</span>
      <input type="date" id="filterDateInputHistory" class="filter-date-cash-tracking" value="${formattedDate}">
    </div>
    <div class="present-container-filter filterBarber">
      <span>Filtrar por barbero</span>
      <select id="barberSelectHistory" class="form-select">
        <option value="null">Todos</option>
      </select>
    </div>
    </div>
  </div>
`;

const modalVoucher = `
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
            <label for="name-service">Barbero</label>
            <select id="barber-select" name="Barbero" class="input" required>
              <option value="" disabled selected>Seleccionar Barbero</option>
            </select>
            
            <label for="reason-voucher">Motivo</label>
            <input type="text" id="reason-voucher" name="Motivo" class="input" required>
            
            <label for="price">Monto $</label>
            <input type="number" id="price" name="Monto" class="input" required>

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

const rows = (data) => {

  /**
   * Cargamos la tabla de servicios con los servicios de la aplicacion.
   * param: data -> array de servicios almacenados en la base de datos.
   */

  let row = '';
  data.forEach((voucher, index) => {
    let dateCreate = voucher.FechaCreacion ? parseDate(voucher.FechaCreacion) : '';
    if (index > -1) {
      row += `
        <tr key=${voucher.Id}>
          <td scope="row">${dateCreate.dateWithoutTime}</td>
          <td>${voucher.Barbero}</td>
          <td>${voucher.Motivo}</td>
          <td>${voucher.CantidadDinero}</td>
          <td>
            <button class="table-btns modify">
              <i class="bi bi-pencil-fill" key=${voucher.Id}></i>
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

const tableVouchersColumns = `
  <div class="table-container table-history-container">
    <table>
      <thead>
        <tr>
          <th scope="col">FECHA CREACION</th>
          <th scope="col">BARBERO</th>
          <th scope="col">MOTIVO</th>
          <th scope="col">MONTO</th>
          <th scope="col">ACCION</th>
        </tr>
      </thead>
      <tbody class="table-vouchers-body">
      </tbody>
    </table>
  </div>
`;

const applyFilters = async (tableBodyTurnsHistoryView) => {
  const dateInput = document.querySelector('#filterDateInputHistory');
  const barberSelect = document.querySelector('#barberSelectHistory');

  // Obtener los valores seleccionados
  const selectedDate = dateInput ? dateInput.value : null;
  const selectedBarber = barberSelect && barberSelect.value !== 'null' ? barberSelect.value : null;

  // Llamar a la función de renderizado con los filtros aplicados
  await vouchersRender(tableBodyTurnsHistoryView, selectedDate, selectedBarber);
};

const setupFiltersVouchers = (tableBody) => {
  const dateInput = document.querySelector('#filterDateInputHistory');
  const barberSelect = document.querySelector('#barberSelectHistory');

  // Listener para el filtro por fecha
  dateInput.addEventListener('change', async () => {
    await applyFilters(tableBody);
  });

  // Listener para el filtro por barbero
  barberSelect.addEventListener('change', async () => {
    await applyFilters(tableBody);
  });
};


const showRegisterVoucherModal = (btn) => {
  /**
   * Muestra la modal al hacer click en el boton.
   * param: btn -> elemento html del boton que hace el post.
   */

  btn.addEventListener('click', () => {
    document.querySelector("#postServiceLabel").textContent = "Registrar Vale";
    document.querySelector(".btnPost").textContent = "Registrar";

    const formVoucher = document.querySelector("#formPOSTService");
    formVoucher.setAttribute('data-mode', 'create');

    formVoucher.removeAttribute('data-id');

    formVoucher.Barbero.value = '';
    formVoucher.Motivo.value = '';
    formVoucher.Monto.value = '';
  });
}

const submitVoucher = (form, modal, modalFooter, barberSelect) => {

  /**
   * Hace un post del servicio.
   * param: form -> elemento html del formulario.
   * param: modal -> modal para poder hacer el post.
   * param: modalFooter -> elemento html del footer de la modal
   */

  const span = document.createElement('span');
  const submitServiceButton = document.querySelector('.btnPost');
  span.innerHTML = 'Error al crear el vale.';
  span.style.textAlign = 'center';
  span.style.width = '100%';
  span.style.marginTop = '1rem';
  span.style.marginBottom = '0rem';
  span.style.paddingBottom = '0rem';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mode = form.getAttribute('data-mode');
    const id = form.getAttribute('data-id');
    const selectedOption = barberSelect.options[barberSelect.selectedIndex];
    const idBarbero = selectedOption.dataset.barberid;
    const barbero = form.Barbero.value;
    const motivo = form.Motivo.value;
    const monto = form.Monto.value;

    submitServiceButton.setAttribute('disabled', 'true');
    const voucher = {
      "IdUsuario": idBarbero,
      "Motivo": motivo,
      "CantidadDinero": monto
    }

    /**
     * No conviene modularizarlo a request porque está trabajada completamente como promesa y deberíamos exportar todo lo de acá.
     */

    // let url = `https://peluqueria-invasion-backend.vercel.app/vouchers`;
    let url = 'http://localhost:3001/vouchers';
    let method = 'POST';

    if (mode === 'update') {
      // url = `https://peluqueria-invasion-backend.vercel.app/vouchers/${id}`;
      url = `http://localhost:3001/vouchers/${id}`;
      method = 'PUT';
    };

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(voucher),
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.error !== undefined || data.message !== undefined) {
        span.innerHTML = `${data.message}` || 'Barbero, motivo o monto inválido.';
        span.style.color = 'red';
      } else {
        span.innerHTML = mode === 'create' ? '¡Servicio creado correctamente!' : 'Vale actualizado correctamente!';
        span.style.color = '#5cb85c';

        setTimeout(() => {
          const bootstrapModalService = bootstrap.Modal.getInstance(modal._element);
          bootstrapModalService.hide();
          window.location.reload();
        }, 500);
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

const cancelSubmitVoucherForm = (btnCancel, form, modal) => {
  // Le damos eventos al boton de cancelar de la modal.
  btnCancel.addEventListener('click', (e) => {
    // Quitamos evento por defecto (detectaba un submit)
    e.preventDefault();

    // Reseteamos contraseña puesta en otro actualizar.
    form.Motivo.value = '';               
    form.Monto.value = '';               

    // Cerramos la modal.
    const bootstrapModal = bootstrap.Modal.getInstance(modal._element);
    bootstrapModal.hide();
  });
};

const updateVoucher = (btnsPut, modal) => {
  // A cada botón le damos el evento click.
  btnsPut.forEach(btn => {

    btn.addEventListener('click', async (e) => {

      // Obtenemos la key del boton, el cual coincide con el id del registro.
      const key = e.currentTarget.getAttribute('key');

      // Hacemos una request para modificar el user con el id que coincida con la key del boton apretado
      // const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/vouchers/${key}`, { credentials: 'include' });
      const response = await fetch(`http://localhost:3001/vouchers/${key}`);
      const data = await response.json();

      // Configuramos mensajes de la modal.
      // document.querySelector('#postEmployeeLabel').textContent = 'Actualizar vale';
      document.querySelector('.btnPost').textContent = 'Actualizar';

      // Obtenemos el form de la modal
      const $putFormModal = document.querySelector('#formPOSTService');

      // Seteamos atributos para que la modal pase a modo create
      $putFormModal.setAttribute('data-mode', 'update');
      $putFormModal.setAttribute('data-id', key);

      
      // Cargamos los inputs con los valores del user a modificar.
      $putFormModal.Barbero.value = '';
      $putFormModal.Motivo.value = data.Motivo;
      $putFormModal.Monto.value = data.CantidadDinero; 

      // Mostramos la modal.
      modal.show();

    });

  });
};

const showModalConfirmDelete = (modal) => {
  return new Promise((resolve, reject) => {
    // Insertamos la modal en el DOM
    document.body.insertAdjacentHTML("beforeend", modal);

    const $modal = new bootstrap.Modal(document.getElementById('dateClickModalConfirm'));
    const modalElement = document.getElementById('dateClickModalConfirm');

    // Mostrar la modal
    $modal.show();

    // Escuchar el clic en el botón "Eliminar"
    modalElement.querySelector('#confirmDeleteTurn').addEventListener('click', () => {
      resolve(true); // Se confirma la acción
      $modal.hide();
    });

    // Escuchar el clic en el botón "Cancelar"
    modalElement.querySelector('#closeModal').addEventListener('click', () => {
      resolve(false); // Se cancela la acción
      $modal.hide();
    });

    // Eliminar la modal del DOM cuando se cierre
    modalElement.addEventListener('hidden.bs.modal', () => {
      modalElement.remove();
    });
  });
};

const deleteVoucher = (btnsDelete) => {
  btnsDelete.forEach(btn => {
    console.log("btn",btn)
    btn.addEventListener('click', async (e) => {   
      console.log("hizo click")                 
      const key = e.currentTarget.closest('tr').getAttribute('key');
      console.log("key",key)
      try {
        // const confirm = window.confirm('¿Desea eliminar este registro?');
        const confirm = await showModalConfirmDelete(modalConfirm);
        console.log(confirm);
        if (confirm) {
          console.log("entro aca ke riko")
          // const responseDelete = await fetch(`https://peluqueria-invasion-backend.vercel.app/vouchers/${key}`, {
          //  method: 'DELETE',
          //  credentials: 'include'
          // });
          
          const responseDelete = await fetch(`http://localhost:3001/vouchers/${key}`, {
            method: 'DELETE'
          });
          
          if (responseDelete.ok) {
            window.location.reload();
          } else {
            alert('Error al eliminar el usuario.');
          };
        } 
      } catch (error) {
        alert('Error al eliminar el vale.');
      }
        
    });
  });
}

const vouchersRender = async (table, selectedDate = null, barberId = null) => {
  try {
    let responseVouchers;

    if (selectedDate && barberId) {
      responseVouchers = await getVouchersFilteredByDateAndBarber(selectedDate, barberId);
    } else if (selectedDate)  {
      responseVouchers = await getVouchersFilteredByDate(selectedDate);
    } else if (barberId) {
      responseVouchers = await getVouchersFilteredByBarber(barberId);
    } else {
      responseVouchers = await getVouchers();
    }

    if (!responseVouchers.ok) {
      table.innerHTML = `
        <tr>
          <td colspan="8">No se encontraron vales para los filtros aplicados.</td>
        </tr>`;
      return;
    }

    const dataVouchers = await responseVouchers.json();

    table.innerHTML = dataVouchers.length ? rows(dataVouchers) : '<tr><td colspan="8">No se encontraron vales para los filtros aplicados.</td></tr>';
  } catch (error) {
    console.error("Error al renderizar el listado de vales", error);
  }
}

export {
  voucherView,
  tableVouchersColumns,
  infoSectionVoucherView,
  voucherAddView,
  modalVoucher,
  showRegisterVoucherModal,
  submitVoucher,
  cancelSubmitVoucherForm,
  updateVoucher,
  deleteVoucher,
  vouchersRender,
  setupFiltersVouchers
};