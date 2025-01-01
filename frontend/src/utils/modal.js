const removeAllModals = (modal) => {

  /**
   * Remueve todas las modales activas y devuelve el puntero a un objeto del dom para la accesibilidad.
   * param: modal -> modal activa.
   */

  modal.addEventListener('hidden.bs.modal', function () {
    const focusableElement = document.querySelector('.fc-button-active') || document.body;
    focusableElement.focus();
    this.remove();
  });

}

function modalConfirmDisplay() {

  /**
   * Mostramos la modal de confirmación de la acción para eliminar el turno.
   */

  const $modal = new bootstrap.Modal(document.getElementById('dateClickModalConfirm'));
  const modalConfirm = bootstrap.Modal.getInstance($modal._element);
  modalConfirm.show();
}

export {
  removeAllModals,
  modalConfirmDisplay
}