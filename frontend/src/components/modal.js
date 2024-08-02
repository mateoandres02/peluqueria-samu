import parseDate from "./date";
import '../styles/modal.css';

const modalElement = `
  <div class="modal fade" id="dateClickModal" tabindex="-1" aria-labelledby="dateClickModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="dateClickModalLabel">Registrar cliente</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="eventForm" >
            <label for="input-name">Nombre</label>
            <input type="text" id="input-name" class="input" required>

            <label for="input-number">Teléfono</label>
            <input type="number" id="input-number" class="input" required>

            <label for="eventDate">Fecha</label>
            <input type="text" id="eventDate" class="input" readonly>

            <label for="event-datetime">Horario</label>
            <input type="datetime" id="event-datetime" class="input" placeholder="hh:mm">

            <div class="modal-footer">
              <button id="closeModal" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-success">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

function modal(info) {
  const d = document;
  const $modal = d.getElementById("dateClickModal");
  const $modalContent = d.querySelector(".modal-content");
  const $inputEventDate = d.getElementById("eventDate");

  // Set the date input value to the clicked date
  $inputEventDate.value = parseDate(info.dateStr);

  // console.log(info)

  // Muestra el modal
  $modal.style.display = "block";

  // Cerrar el modal por boton cerrar
  const $closeModal = d.getElementById("closeModal");
  $closeModal.onclick = function() {
    $modal.style.display = "none";
    $modalContent.style.display = "none";
  };

  // Cerrar la modal cuando se clickea fuera de ella
  window.onclick = function(e) {
    if (e.target == $modal) {
      $modal.style.display = "none";
    }
  };
};

export {
  modalElement,
  modal
}