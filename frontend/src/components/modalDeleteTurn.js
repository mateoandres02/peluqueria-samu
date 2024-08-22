import '../styles/modal.css';

const modalConfirm = `
  <div class="modal fade" id="dateClickModalConfirm" tabindex="-1" aria-labelledby="dateClickModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="dateClickModalLabel"><i class="bi bi-question-octagon"></i>Advertencia</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <h2>Deseas eliminar el turno?</h2>
        </div>
        <div class="modal-footer-delete">
          <button id="confirmDeleteTurn" class="btn btn-success">Eliminar</button>
          <button id="closeModal" class="btn btn-danger btnCancel" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
`;

function modalConfirmDisplay() {

    const $modal = new bootstrap.Modal(document.getElementById('dateClickModalConfirm'));
  
    const modalConfirm = bootstrap.Modal.getInstance($modal._element);
  
    modalConfirm.show();

}
  
function clickDelete(info){
    const $deleteTurn = document.getElementById("confirmDeleteTurn")
    
    $deleteTurn.addEventListener("click", async (e) => {
      e.preventDefault();
  
      // console.log(info)
  
      // Obtenemos el publicId del turno creado
      const publicId = info.event._def.publicId;
  
      // const response = await fetch(`http://localhost:3001/turns/${publicId}`, {
      //     method: 'DELETE'  
      // });
      const response = await fetch(`http://peluqueria-invasion-backend.vercel.app/turns/${publicId}`, {
        method: 'DELETE'  
      });
  
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Error al eliminar el turno.');
      };
  
    })
}

export {
    modalConfirm,
    modalConfirmDisplay,
    clickDelete
}