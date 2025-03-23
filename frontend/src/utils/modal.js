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

const showPostModal = (btn, titleModal, btnPostModal, formModal, section = null) => {

  /**
   * Muestra la modal al hacer click en el boton.
   * param: btn -> elemento html del boton que hace el post.
   */

  btn.addEventListener('click', () => {

    if (section == "config") titleModal.textContent = "Registrar Servicio";
    if (section == "manageEmployees") titleModal.textContent = "Registrar Empleado";
    if (section == "voucher") titleModal.textContent = "Registrar Vale";
    if (section == "manageClients") titleModal.textContent = "Registrar Cliente";

    btnPostModal.textContent = "Registrar";

    formModal.setAttribute('data-mode', 'create');

    formModal.removeAttribute('data-id');

    if (formModal.Nombre) formModal.Nombre.value = '';
    if (formModal.Precio) formModal.Precio.value = ''; 
    if (formModal.Contrasena) formModal.Contrasena.value = '';
    if (formModal.Contrasena) formModal.Contrasena.placeholder = '';
    if (formModal.Barbero) formModal.Barbero.value = '';
    if (formModal.Motivo) formModal.Motivo.value = '';
    if (formModal.Monto) formModal.Monto.value = '';
    if (formModal.Telefono) formModal.Telefono.value = '';

  });

}

const cancelPostModal = (btnCancel, form, modal) => {

  /**
   * Cancela el post.
   * param: btnCancel -> elemento html del boton de cancelar.
   * param: form -> elemento html del formulario.
   * param: modal -> elemento html de la modal desplegada.
   */

  btnCancel.addEventListener('click', (e) => {
    e.preventDefault();

    if (form.Nombre) form.Nombre.value = '';
    if (form.Precio) form.Precio.value = '';
    if (form.Contrasena) form.Contrasena.value = '';
    if (form.Motivo) form.Motivo.value = '';
    if (form.Monto) form.Monto.value = '';
    if (form.Telefono) form.Telefono.value = '';

    const bootstrapModalService = bootstrap.Modal.getInstance(modal._element);
    bootstrapModalService.hide();
  });

};


const showModalConfirmDelete = (modal) => {
  return new Promise((resolve, reject) => {
    document.body.insertAdjacentHTML("beforeend", modal);

    const $modal = new bootstrap.Modal(document.getElementById('dateClickModalConfirm'));
    const modalElement = document.getElementById('dateClickModalConfirm');

    $modal.show();

    modalElement.querySelector('#confirmDeleteTurn').addEventListener('click', () => {
      resolve(true);
      $modal.hide();
    });

    modalElement.querySelector('#closeModal').addEventListener('click', () => {
      resolve(false); 
      $modal.hide();
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      modalElement.remove();
    });
  });
};


export {
  removeAllModals,
  modalConfirmDisplay,
  showPostModal,
  cancelPostModal,
  showModalConfirmDelete
}