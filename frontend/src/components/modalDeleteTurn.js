import '../styles/modal.css';
import logAction from '../utils/logActions.js';

const modalConfirm = `
  <div class="modal fade" id="dateClickModalConfirm" tabindex="-1" aria-labelledby="dateClickModalLabel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="dateClickModalLabel"><i class="bi bi-question-octagon"></i>Advertencia</h2>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <h3 class="modal-body-confirm">¿Deseas eliminar el turno?</h3>
        </div>
        <div class="modal-footer modal-footer-delete">
          <button id="confirmDeleteTurn" class="btn btn-danger btn-success">Eliminar</button>
          <button id="closeModal" class="btn btn-outline-secondary btnCancel" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
`;

function formattedEndDate(dateString) {
  // Convertir el string en un objeto Date
  const date = new Date(dateString);

  // Restar 30 minutos
  date.setMinutes(date.getMinutes() - 30);

  // Formatear la fecha y hora de salida
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son base 0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Retornar la fecha formateada
  return `${year}-${month}-${day}T${hours}:${minutes}`;
} 

function modalConfirmDisplay() {

  /**
   * Mostramos la modal de confirmación de la acción para eliminar el turno.
   */

  const $modal = new bootstrap.Modal(document.getElementById('dateClickModalConfirm'));
  console.log($modal)
  const modalConfirm = bootstrap.Modal.getInstance($modal._element);
  modalConfirm.show();
}
  
function deleteTurn(info, data){

  /**
   * Gestionamos el delete del turno.
   * param: info -> info proporcionada por fullcalendar de la celda seleccinada, por ende del turno seleccionado.
   * param: data -> info del usuario logueado.
   */
  
  const $deleteTurn = document.getElementById("confirmDeleteTurn");
  
  $deleteTurn.addEventListener("click", async (e) => {
    e.preventDefault();

    const publicId = info.event._def.publicId;
    const date = new Date(info.event._instance.range.start).toISOString().split("T")[0];
    const regularCustomer = info.event._def.extendedProps.regular;
    const userName = data.user.Nombre
    let response;

    const formatedStartDate = formattedEndDate(info.event._def.extendedProps.end);

    if (regularCustomer === "true") {
      response = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/turn/${publicId}/${date}`, {
       method: 'DELETE'  
      });
      logAction({
        Barbero: userName,
        Cliente: info.event._def.title,
        FechaTurno: formatedStartDate,
        Accion: 'DELETE'
      })

      // response = await fetch(`http://localhost:3001/recurrent_turns/turn/${publicId}/${date}`, {
      //   method: 'DELETE'  
      // });
    } else {
      response = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/${publicId}/${date}`, {
       method: 'DELETE'  
      });
      logAction({
        Barbero: userName,
        Cliente: info.event._def.title,
        FechaTurno: formatedStartDate,
        Accion: 'DELETE'
      })

      // response = await fetch(`http://localhost:3001/turns/${publicId}/${date}`, {
      //   method: 'DELETE'  
      // });
    }
    
    if (response.ok) {
      const focusableElement = document.querySelector('.fc-button-active') || document.body;
      focusableElement.focus();
      window.location.reload();
    } else {
      alert('Error al eliminar el turno.');
    };

  })
}

export {
  modalConfirm,
  modalConfirmDisplay,
  deleteTurn
}
