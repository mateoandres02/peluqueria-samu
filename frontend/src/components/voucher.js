import { getVouchers } from "./requests";
import { getToday, parseDate } from "../utils/date";
import { getVouchersFilteredByDate, getVouchersFilteredByDateAndBarber, getVouchersFilteredByBarber } from "./requests";
import { deleteVoucher, updateVoucher } from "../utils/crud";
import "../styles/configParams.css";
import "../styles/voucher.css"

const today = getToday();

const voucherView = `<div class="voucherView containerFunctionalityView"></div>`;

const infoSectionVoucherView = `
  <div class="present-container">
    <h2>Administración de vales y retiros de dinero</h2>
    <p class="configParamsView-p">Registra los retiros de dinero por parte de tus empleados.</p>
  </div>
`;

const voucherAddView = `
  <hr>
  <div class="voucher-container present-container">
    <div class="voucher-present">
      <h3><img class="svg" src="/assets/icons/config.svg">Administración de vales</h3>
      <p>Agrega, modifica o elimina los vales.</p>
    </div>
    <div class="present-container-filters present-container-filters-voucher">
      <div class="present-container-filter voucherPost">
        <button type="button" class="postVoucher-btn">
          <img class="svg" src="/assets/icons/add.svg">
          Agregar <br> Vale
        </button>
      </div>
      <div class="present-container-filter voucherDateFilter">
        <span>Filtrar por fecha</span>
        <input type="date" id="filterDateInput" value="${today}">
      </div>
      <div class="present-container-filter voucherBarberFilter">
        <span>Filtrar por barbero</span>
        <select id="barberSelect" class="form-select">
          <option value="null">Seleccionar...</option>
        </select>
      </div>
    </div>
  </div>
`;

const tableVouchersColumns = `
  <div class="table-container table-voucher-container">
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
  <div class="table-container-footer"></div>
`;

const modalVoucher = `
  <div class="modal fade" id="postVoucher" tabindex="-1" aria-labelledby="postVoucherLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="postVoucherLabel">Registrar Vale</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
           <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">

          <form id="formPOSTVoucher">
            <label for="select-barber-voucher">Barbero</label>
            <select id="select-barber-voucher" name="Barbero" class="input" required>
              <option value="" disabled selected>Seleccionar Barbero</option>
            </select>
            
            <label for="reason-voucher">Motivo</label>
            <input type="text" id="reason-voucher" name="Motivo" class="input" required>
            
            <label for="price">Monto $</label>
            <input type="number" id="price" name="Monto" class="input" required>

            <div class="modal-footer modal-footer-without-padding">
              <button type="submit" class="btn btn-success btnPost">Registrar</button>
              <button class="btn btn-danger btnCancel" data-bs-dismiss="modal">Cancelar</button>
              <div class="loader-container">
                <img src="/assets/tube-spinner.svg" alt="loading" class="loader">
              </div>
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
          <td title="${voucher.Motivo}">${voucher.Motivo}</td>
          <td>$ ${voucher.CantidadDinero}</td>
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

const vouchersRender = async (table, selectedDate = null, barberId = null) => {
  let responseVouchers;
  try {
    if (selectedDate && barberId) {
      responseVouchers = await getVouchersFilteredByDateAndBarber(selectedDate, barberId);
    } else if (selectedDate)  {
      responseVouchers = await getVouchersFilteredByDate(selectedDate);
    } else if (barberId) {
      responseVouchers = await getVouchersFilteredByBarber(barberId);
    } else {
      responseVouchers = await getVouchers();
    }

    if ( !responseVouchers || !responseVouchers.ok) {
      table.innerHTML = `
        <tr>
          <td colspan="5">No se encontraron vales para los filtros aplicados.</td>
        </tr>`;
      return;
    }

    const dataVouchers = await responseVouchers.json();

    table.innerHTML = dataVouchers.length 
    ? rows(dataVouchers) 
    : '<tr><td colspan="5">No se encontraron vales para los filtros aplicados.</td></tr>';

    
    if (dataVouchers) {
      const $btnPutVoucher = document.querySelectorAll('.modify i');
      const $btnDeleteVoucher = document.querySelectorAll('.delete i');

      updateVoucher($btnPutVoucher)
      deleteVoucher($btnDeleteVoucher);
    }
  } catch (error) {
    alert("Error al renderizar el listado de vales");
  }
}


const applyFilters = async (tableBodyTurnsHistoryView, dateInput, barberSelect) => {
  const selectedDate = dateInput ? dateInput.value : null;
  const selectedBarber = barberSelect && barberSelect.value !== 'null' ? barberSelect.value : null;

  await vouchersRender(tableBodyTurnsHistoryView, selectedDate, selectedBarber);
};


const setupFiltersVouchers = (tableBody, dateInput, barberSelect) => {
  dateInput.addEventListener('change', async () => {
    await applyFilters(tableBody, dateInput, barberSelect);
  });

  barberSelect.addEventListener('change', async () => {
    await applyFilters(tableBody, dateInput, barberSelect);
  });
};


export {
  voucherView,
  infoSectionVoucherView,
  voucherAddView,
  modalVoucher,
  tableVouchersColumns,
  vouchersRender,
  setupFiltersVouchers
};