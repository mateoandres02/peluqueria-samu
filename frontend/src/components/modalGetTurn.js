import parseDate from "./date";
import '../styles/modal.css';
import { clickDelete, modalConfirm, modalConfirmDisplay } from "./modalDeleteTurn";

const modalTurnContent = `
  <div class="modal fade" id="dateClickModalTurnContent" tabindex="-1" aria-labelledby="dateClickModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="dateClickModalLabel"><i class="bi bi-info-circle"></i>Informacion de Turno</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <h2 id="infoName"><i class="bi bi-person-lines-fill"></i>Nombre y Apellido: <span id="spanName"></span> </h2>
          <h2 id="infoTel"><i class="bi bi-telephone"></i>Teléfono: <span id="spanTel"></span></h2>
          <h2 id="infoDay"><i class="bi bi-calendar-event"></i>Día: <span id="spanDay"></span></h2>
          <h2 id="infoStartTime"><i class="bi bi-clock"></i>Inicio de Turno: <span id="spanStartTime"></span></h2>
          <h2 id="infoEndTime"><i class="bi bi-clock-history"></i>Fin de Turno: <span id="spanEndTime"></span></h2>
          <div class="modal-footer modal-footer-calendar">
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

function modalTurnContentDisplay(info) {
    const d = document;

    let body = document.body;
  
    // Inicializamos la modal
    const $modal = new bootstrap.Modal(d.getElementById('dateClickModalTurnContent'));
  
    // Obtenemos los elementos de la modal 
    const $spanName = d.getElementById("spanName");
    const $spanTel = d.getElementById("spanTel");
    const $spanDay = d.getElementById("spanDay");
    const $spanStartTime = d.getElementById("spanStartTime");
    const $spanEndTime = d.getElementById("spanEndTime");
    
    // Obtenemos la fecha parseada de el start
    const { dayWithoutYear, timeWithoutSeconds:timeWithoutSecondsStart } = parseDate(info.event.startStr);
  
    // Obtenemos la fecha parseada de el end
    const { timeWithoutSeconds:timeWithoutSecondsEnd  } = parseDate(info.event.endStr);
  
    // Obtenemos los valores de cada input
    const name = info.event._def.title;
    const tel = info.event._def.extendedProps.telefono;
    const day = dayWithoutYear;
    const startTime = timeWithoutSecondsStart;
    const endTime = timeWithoutSecondsEnd;
    
    // Reseteamos valores cada vez que se vuelve a abrir la modal
    $spanName.innerHTML = "";
    $spanTel.innerHTML = "";
    $spanDay.innerHTML = "";
    $spanStartTime.innerHTML = "";
    $spanEndTime.innerHTML = "";
  
    // Ingresamos los datos correspondientes a cada elemento
    $spanName.innerHTML += `${name}`;
    $spanTel.innerHTML += `${tel}`;
    $spanDay.innerHTML += `${day}`;
    $spanStartTime.innerHTML += `${startTime}`;
    $spanEndTime.innerHTML += `${endTime}`;
  
    // Mostramos la modal.
    $modal.show();
  
    // Botones de modal footer
    const $btnDelete = document.getElementById("deleteTurn");
    const $btnWsp = document.getElementById("contactWsp");
  
    $btnDelete.addEventListener('click', async (e) => {
        e.preventDefault();

        body.insertAdjacentHTML('beforeend', modalConfirm);
    
        modalConfirmDisplay();

        clickDelete(info);

        const modales = document.querySelectorAll('.modal');

        modales.forEach(modal => {
          modal.addEventListener('hidden.bs.modal', function () {
            this.remove();
          });
        });
        
    });
  
    $btnWsp.addEventListener('click', async(e) => {
      e.preventDefault();
      
      const msg = `¡Hola ${name}! Espero que te encuentres muy bien. Solo quería recordarte que tenés un turno agendado para el día ${day} a las ${startTime} hs. ¡Te esperamos!`
      const wspUrl = `https://api.whatsapp.com/send?phone=${tel}&text=${encodeURIComponent(msg)}`
      $btnWsp.href = wspUrl
      
      window.open(wspUrl, '_blank');
    });
}

export {
    modalTurnContent,
    modalTurnContentDisplay
}