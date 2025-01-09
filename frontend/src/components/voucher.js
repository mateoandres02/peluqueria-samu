import { getVouchers } from "./requests";
import { parseDate } from "../utils/date";
import "../styles/configParams.css";


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
    <div class="serviceParams-btn">
      <button type="button" class="postService-btn">
        <img class="svg" src="/assets/icons/add.svg">
          Agregar <br> Vale
      </button>
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

const rows = (data) => {

  /**
   * Cargamos la tabla de servicios con los servicios de la aplicacion.
   * param: data -> array de servicios almacenados en la base de datos.
   */

  let row = '';
  data.forEach((voucher, index) => {
    let dateCreate = voucher.FechaCreacion ? parseDate(voucher.FechaCreacion) : '';
    console.log("fecha parseada", dateCreate)
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

const vouchersData = async () => {
  try {
    const data = await getVouchers();

    console.log("dataa",data);
    if (data.length > 0) {
      let tableServices = 
      `
      <div class="table-container table-payment-container table-config-params">
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
            <tbody>
              ${rows(data)}
            </tbody>
          </table>
        </div>
      `;

      return tableServices;

    } else {
      return '<p>No hay vales registrados</p>';
    }
  } catch (error) {
    console.log(error);
  }
};

export {
  voucherView,
  infoSectionVoucherView,
  voucherAddView,
  modalVoucher,
  vouchersData
};