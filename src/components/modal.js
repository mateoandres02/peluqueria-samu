export function createModal() {
  const modalHTML = `
  <div id="dateClickModal" class="modal">
    <div class="modal-content">
      <h4>Detalles del Evento</h4>
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
      <button id="closeModal" class="modal-close">Cerrar</button>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}
