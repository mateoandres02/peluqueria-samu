import parseDate from "./date";

const modalElement = `
  <div class="modal fade" id="dateClickModal" tabindex="-1" aria-labelledby="dateClickModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="dateClickModalLabel">New message</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="eventForm">
            <label for="eventTitle">Título del Evento:</label>
            <input type="text" id="eventTitle" name="eventTitle" required>

            <label for="eventDate">Fecha del Evento:</label>
            <input type="text" id="eventDate" name="eventDate" readonly>

            <label for="eventDescription">Descripción:</label>
            <textarea id="eventDescription" name="eventDescription"></textarea>

            <button type="submit">Guardar</button>
          </form>
        </div>
        <div class="modal-footer">
          <button id="closeModal" class="modal-close" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary">Send message</button>
        </div>
      </div>
    </div>
  </div>
`;

function modal(info) {
  const d = document;
  const $modal = d.getElementById("dateClickModal");
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