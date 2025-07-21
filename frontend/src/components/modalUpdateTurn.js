import { parseDate } from "../utils/date";
import { getClients, getTurnByDateAndBarber } from "./requests";

const modalUpdateTurn = `
  <div class="modal fade" id="updateTurn" tabindex="-1" aria-labelledby="updateTurnLabel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="updateTurnLabel"><i class="bi bi-pencil-square"></i>Actualizar turno</h2>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="formPutTurn">
            <label for="name-barber-select" class="name-barber-select"><i class="bi bi-person-lines-fill"></i>Empleado</label>
            <select id="name-barber-select" class="input name-barber-select" required>
              <option value="null">Seleccionar empleado</option>
            </select>

            <label for="input-name"><i class="bi bi-person-lines-fill"></i>Nombre</label>
            <input type="text" name="inputName" id="input-name" class="input" required pattern="^[a-zA-Z\\s]{1,25}$" autocomplete="off">

            <label for="input-number"><i class="bi bi-telephone"></i>Teléfono</label>
            <input type="number" name="inputNumber" id="input-number" class="input" required pattern="^\\+?\\d{1,15}$">

            <div class="modal-footer modal-footer-update-turn">
              <button type="submit" id="saveTurn" class="btn btn-success btnPutTurn">Actualizar</button>
              <button id="closeModal" class="btn btn-danger btnCancelPutTurn" data-bs-dismiss="modal">Cancelar</button>
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

const updateTurn = (form, modal, $selectableBarbers, info, data, clients) => {

  const $modalFooter = document.querySelector('.modal-footer.modal-footer-update-turn');
  const $loader = document.querySelector('.loader-container');

  const span = document.createElement('span');
  span.innerHTML = 'Error al crear el turno.';
  span.style.textAlign = 'center'
  span.style.width = '100%';
  span.style.marginTop = '1rem';
  span.style.marginBottom = '0rem';
  span.style.paddingBottom = '0rem';

  const $elementSelectableBarbers = document.querySelectorAll('.name-barber-select');

  if (data.user.Id != 1) {
    $elementSelectableBarbers.forEach((element) => {
      element.style.display = 'none';
    })
  }

  const $inputName = document.getElementById('input-name');
  const $inputNumber = document.getElementById('input-number');

  const autocompleteContainer = document.createElement('div');
  autocompleteContainer.className = 'autocomplete-container';
  if (data.user.Id != 1) {
    autocompleteContainer.style.cssText = 'position: absolute; top: 29%; max-height: 200px; overflow-y: auto; width: 100%; background: white; border: 1px solid #ddd; border-radius: 4px; display: none; z-index: 1000; color: black';
  } else {
    autocompleteContainer.style.cssText = 'position: absolute; top: 48%; max-height: 200px; overflow-y: auto; width: 100%; background: white; border: 1px solid #ddd; border-radius: 4px; display: none; z-index: 1000; color: black';
  }
  $inputName.parentNode.style.position = 'relative';
  $inputName.parentNode.appendChild(autocompleteContainer);

  autocompleteClient(clients, $inputName, $inputNumber, autocompleteContainer)

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    $loader.style.display = 'flex';

    let selectedOption;
    if ($selectableBarbers.options[$selectableBarbers.selectedIndex]) {
      selectedOption = $selectableBarbers.options[$selectableBarbers.selectedIndex];
    }

    let idBarber;
    if (data.user.Id != 1) {
      idBarber = data.user.Id;
    } else {
      idBarber = selectedOption.getAttribute('data-barberid');
    }

    if (idBarber === null) {
      span.innerHTML = 'Seleccione un empleado.';
      span.style.color = 'red';

      setTimeout(() => {
        $loader.style.display = "none";
        $modalFooter.appendChild(span);
      }, 1000);

      setTimeout(() => {
        $modalFooter.removeChild(span);
      }, 3500);

      return;
    }

    // Si el barbero tiene un turno, avisamos que lo tiene.
    if (data.user.Id == 1 && idBarber != data.user.Id) {

      const { completeDate } = parseDate(info.event.startStr)

      const { recurrentTurn, turn } = await getTurnByDateAndBarber(completeDate, idBarber);

      if (recurrentTurn.length > 0 || turn.length > 0) {
        span.innerHTML = 'Ya existe un turno en esa fecha. Consultar al empleado.';
        span.style.color = 'red';

        setTimeout(() => {
          $loader.style.display = "none";
          $modalFooter.appendChild(span);
        }, 1000);

        setTimeout(() => {
          $modalFooter.removeChild(span);
        }, 4000);

        return;
      }
    }
    // aca termina la funcionalidad, si anda mal, comentarla.

    let turn;

    turn = {
      NroUsuario: parseInt(idBarber),
      Nombre: form.inputName.value,
      Telefono: form.inputNumber.value
    }

    const url = `https://peluqueria-invasion-backend.vercel.app/turns/${info.event._def.publicId}`;
    // const url = `http://localhost:3001/turns/${info.event._def.publicId}`;

    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(turn),
      credentials: 'include'
    };

    const response = await fetch(url, options);

    if (response.ok) {
      span.innerHTML = 'Turno actualizado correctamente.';
      span.style.color = '#5cb85c';

      setTimeout(() => {
        $loader.style.display = "none";
        $modalFooter.appendChild(span);
      }, 1000);

      setTimeout(() => {
        $modalFooter.removeChild(span);
        const bootstrapModal = bootstrap.Modal.getInstance(modal._element);
        bootstrapModal.hide();
        window.location.reload();
      }, 3500);

    }

  });

}

export {
  modalUpdateTurn,
  updateTurn
}