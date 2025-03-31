import { parseDate } from "../utils//date";
import { deleteTurn, modalConfirm, modalConfirmDisplay } from "./modalDeleteTurn.js";
import { cancelPostModal, removeAllModals } from "../utils/modal.js";

import '../styles/modal.css';
import { modalUpdateTurn, updateTurn } from "./modalUpdateTurn.js";
import { loadBarberSelect } from "../utils/selectables.js";

const modalTurnContent = `
  <div class="modal fade" id="dateClickModalTurnContent" tabindex="-1" aria-labelledby="dateClickModalLabel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="dateClickModalLabel"><i class="bi bi-info-circle"></i>Informacion de Turno</h2>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <h3 id="infoName"><i class="bi bi-person-lines-fill"></i>Cliente: <span id="spanName"></span> </h3>
          <h3 id="infoTel"><i class="bi bi-telephone"></i>Teléfono: <span id="spanTel"></span></h3>
          <h3 id="infoDay"><i class="bi bi-calendar-event"></i>Día: <span id="spanDay"></span></h3>
          <h3 id="infoStartTime"><i class="bi bi-clock"></i>Inicio de Turno: <span id="spanStartTime"></span></h3>
          <h3 id="infoEndTime"><i class="bi bi-clock-history"></i>Fin de Turno: <span id="spanEndTime"></span></h3>
          <h3 id="regularCustomer"><i class="bi bi-person-lines-fill"></i>Ciente regular: <span id="spanRegularCustomer"></span></h3>
          <div class="modal-footer modal-footer-calendar">
          <button id="editTurn" class="btn btn-edit">
              <i class="bi bi-pencil"></i>
            </button>
            <a id="contactWsp" class="btn btn-success" href="" target="_blank">
              <i class="bi bi-whatsapp"></i>
            </a>
            <button id="deleteTurn" class="btn btn-danger btnCancel" data-bs-dismiss="modal">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;


const actionBtnDelete = ($btnDelete, modalConfirm, info, data) => {

  /**
   * Dispara la acción de eliminar un turno.
   * param: $btnDelete -> elemento html del boton.
   * param: modalConfirm -> modal de confirmación de eliminación del turno.
   * param: info -> información del evento seleccionado propuesta por fullcalendar.
   * param: data -> información del usuario activo.
   */

  let body = document.body;
  $btnDelete.addEventListener('click', async (e) => {
    e.preventDefault();

    body.insertAdjacentHTML('beforeend', modalConfirm);
    modalConfirmDisplay();
    deleteTurn(info, data);

    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => removeAllModals(modal));
  });

}

const actionBtnWsp = (name, day, startTime, tel, $btnWsp) => {

  /**
   * Dispara la acción de envio de mensaje al turno seleccionado.
   * param: name -> nombre del cliente.
   * param: day -> día del turno.
   * param: startTime -> horario del turno.
   * param: tel -> teléfono del cliente.
   * param: $btnWsp -> elemento html del boton.
   */

  const innerWidth = window.innerWidth;
  
  $btnWsp.addEventListener('click', async(e) => {
    e.preventDefault();

    const msg = `¡Hola ${name}! Espero que te encuentres muy bien. Solo quería recordarte que tenés un turno agendado para el día ${day} a las ${startTime} hs. ¡Te esperamos!`;
    let wspUrl = `https://api.whatsapp.com/send?phone=${tel}&text=${encodeURIComponent(msg)}`

    $btnWsp.href = wspUrl;
    
    window.open(wspUrl, '_blank');
  });
  
}

const actionBtnEdit = ($btnEdit, $modalGetTurn, info, data) => {
  let body = document.body;
  $btnEdit.addEventListener("click", async(e) => {
    e.preventDefault();

    const modalGetTurn = bootstrap.Modal.getInstance($modalGetTurn._element);
    modalGetTurn.hide();
    
    body.insertAdjacentHTML('beforeend', modalUpdateTurn);
    const $modalUpdateTurn = new bootstrap.Modal(document.getElementById('updateTurn'));
    $modalUpdateTurn.show();

    const $selectableBarbers = document.getElementById("name-barber-select");
    loadBarberSelect($selectableBarbers);

    const $nameInput = document.getElementById('input-name');
    const $phoneInput = document.getElementById('input-number');
    
    $nameInput.value = info.event._def.title;
    $phoneInput.value = info.event._def.extendedProps.telefono;

    const $btnCancelPutTurn = document.querySelector(".btnCancelPutTurn");
    const $formPutTurn = document.getElementById("formPutTurn");
    cancelPostModal($btnCancelPutTurn, $formPutTurn, $modalUpdateTurn)

    updateTurn($formPutTurn, $modalUpdateTurn, $selectableBarbers, info, data); 

    $selectableBarbers.innerHTML = `<option value="null">Seleccionar barbero</option>`;

    // Close current modal
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => removeAllModals(modal));
  });
}

function modalGetTurn(info, data) {
  
  /**
   * Obtenemos la información del turno y la mostramos en una modal.
   * param: info -> trae info de la celda seleccionada del calendario, proporcionado por fullcalendar.
   */

  const d = document;

  // Inicializamos la modal y obtenemos todos sus elementos.
  const $modal = new bootstrap.Modal(d.getElementById('dateClickModalTurnContent'));
  const $spanName = d.getElementById("spanName");
  const $spanTel = d.getElementById("spanTel");
  const $spanDay = d.getElementById("spanDay");
  const $spanStartTime = d.getElementById("spanStartTime");
  const $spanEndTime = d.getElementById("spanEndTime");
  const $spanRegularCustomer = d.getElementById("spanRegularCustomer");
  
  const { dayWithoutYearParsed, timeWithoutSeconds: timeWithoutSecondsStart } = parseDate(info.event.startStr);
  const { timeWithoutSeconds: timeWithoutSecondsEnd  } = parseDate(info.event.extendedProps.end);

  // Obtenemos los valores de cada input de la modal.
  const name = info.event._def.title;
  const tel = info.event._def.extendedProps.telefono;
  const day = dayWithoutYearParsed;
  const startTime = timeWithoutSecondsStart;
  const endTime = timeWithoutSecondsEnd;
  let regular = info.event._def.extendedProps.regular;

  if (regular === 'true') regular = 'Sí';
  if (regular === 'false') regular = 'No';
  
  $spanName.innerHTML = "";
  $spanTel.innerHTML = "";
  $spanDay.innerHTML = "";
  $spanStartTime.innerHTML = "";
  $spanEndTime.innerHTML = "";
  $spanRegularCustomer.innerHTML = "";

  $spanName.innerHTML += `${name}`;
  $spanTel.innerHTML += `${tel}`;
  $spanDay.innerHTML += `${day}`;
  $spanStartTime.innerHTML += `${startTime}`;
  $spanEndTime.innerHTML += `${endTime}`;
  $spanRegularCustomer.innerHTML += `${regular}`;

  $modal.show();

  const $btnDelete = document.getElementById("deleteTurn");
  const $btnWsp = document.getElementById("contactWsp");
  const $btnEdit = document.getElementById("editTurn");
  
  actionBtnDelete($btnDelete, modalConfirm, info, data);
  
  actionBtnWsp(name, day, startTime, tel, $btnWsp);

  actionBtnEdit($btnEdit, $modal, info, data);

}

export {
  modalTurnContent,
  modalGetTurn
}