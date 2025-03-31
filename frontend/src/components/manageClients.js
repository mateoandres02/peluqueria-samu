import { getClients } from "./requests";

import '../styles/manageClients.css';
import { sortArrayByName } from "../utils/arrays";


const manageClientsView = '<div class="manageClientsContainer containerFunctionalityView"></div>';

const postClient = `
  <div class="postClient present-container">
    <h2>Administrar clientes</h2>
    <p class="postClient-p">Agenda a tus clientes más frecuentes para optimizar la creación de su turno.</p>
    <button type="button" class="postClient-btn">
      <img src="/assets/icons/person-fill-add.svg">
      Agregar <br> Cliente
    </button>
  </div>
`;


const modalPostClient = `
  <div class="modal fade" id="postClient" tabindex="-1" aria-labelledby="postClientLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="postClientLabel">Registrar cliente</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
           <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">

          <form id="formPostClient">
            <label for="name"><i class="bi bi-person-lines-fill"></i>Nombre</label>
            <input type="text" name="Nombre" id="Nombre" class="input" required pattern="^[a-zA-Z\\s]{1,25}$">

            <label for="number"><i class="bi bi-telephone"></i>Teléfono</label>
            <input type="number" name="Telefono" id="Telefono" class="input" required pattern="^\\+?\\d{1,15}$">
            
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
  let row = '';
  data.forEach((client, index) => {
    if (index > -1) {
      row += `
        <tr key=${client.Id}>
          <td scope="row">${client.Id}</td>
          <td>${client.Nombre}</td>
          <td>${client.Telefono}</td>
          <td class="btns-actions">
            <button class="table-btns modify">
              <i class="bi bi-pencil-fill" key=${client.Id}></i>
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

const clientsData = async () => {
  try {
    const data = await getClients();
      
    sortArrayByName(data);

    if (data.length > 0) {
      let tableClients = `
        <div class="table-container table-manageClients-container">
          <table>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">NOMBRE</th>
                <th scope="col">TELÉFONO</th>
                <th scope="col" class="container-btns-actions">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              ${rows(data)}
            </tbody>
          </table>
        </div>
        <div class="table-container-footer"></div>
      `;

        return tableClients;

    } else {
      return '<p class="empty">No hay clientes registrados.</p>'
    }
  } catch (error) {
    alert('Error al cargar los clientes.');
  };
};

export {
  manageClientsView,
  postClient,
  modalPostClient,
  clientsData
}