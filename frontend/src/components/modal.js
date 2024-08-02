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
              <button type="submit" id="saveTurn" class="btn btn-success">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

function clickButtonSubmit(info, button, calendar) {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    
    const inputName = document.getElementById("input-name").value;
    const inputNumber = document.getElementById("input-number").value;
    const inputDate = document.getElementById("input-date").value;
    const inputTime = document.getElementById("input-time").value;
    
    const dateStr = info.dateStr.split('T')[0];
    const eventDateTime = `${dateStr}T${inputTime}:00`;
    
    if (inputName && inputNumber && inputDate && inputTime) {
      // Crear el evento
      const newEvent = {
        title: inputName,
        start: eventDateTime,
        // Puedes agregar más propiedades según lo necesites
        extendedProps: {
          phone: inputNumber,
        }
      };

      // Agregar el evento al calendario
      calendar.addEvent(newEvent);
      
      // Cerrar la modal
      const $modal = document.getElementById("dateClickModal");
      $modal.style.display = "none";
    } else {
      alert("Por favor, completa todos los campos.");
    }
  });
}

// function modal(info) {
//   const d = document;
//   const $modal = d.getElementById("dateClickModal");
//   const $modalContent = d.getElementById("modal-content");
//   const $inputEventDate = d.getElementById("input-date");
//   const $inputEventTime = d.getElementById("input-time");
//   const { dayWithoutYear, timeWithoutSeconds } = parseDate(info.dateStr);
//   const $form = d.getElementById("eventForm");

//   // Set the date input value to the clicked date
//   $inputEventDate.value = dayWithoutYear;
//   // muestra fecha y hora en formateo aaaa-mm-ddThh:mm:ss

//   // Set the Time selected into input value 
//   $inputEventTime.value = timeWithoutSeconds;

//   console.log(`$inputEventTime: `, $inputEventTime)

//   // console.log(dayWithoutYear)
//   // console.log(timeWithoutSeconds)

//   const dateOffParse = info.dateStr
//   console.log("info", info)

//   // Muestra el modal
//   $modal.style.display = "block";

//   // Cerrar el modal por boton cerrar
//   const $closeModal = d.getElementById("closeModal");
//   $closeModal.onclick = function() {
//     $modal.style.display = "none";
//     $modalContent.style.display = "none";
//   };

//   // Cerrar la modal cuando se clickea fuera de ella
//   window.onclick = function(e) {
//     if (e.target == $modal) {
//       $modal.style.display = "none";
//     }
//   };
  
//   clickButtonSubmit(info,$form)

// };

function modal(info, calendar) {
  const d = document;
  const $modal = d.getElementById("dateClickModal");
  const $modalContent = d.querySelector(".modal-content");
  const $inputEventDate = d.getElementById("eventDate");
  const $inputEventTime = d.getElementById("event-datetime");
  const { dayWithoutYear, timeWithoutSeconds } = parseDate(info.dateStr);
  const $buttonSubmit = d.getElementById("saveTurn");

  // Set the date input value to the clicked date
  $inputEventDate.value = dayWithoutYear;

  // Set the Time selected into input value 
  $inputEventTime.value = timeWithoutSeconds;

  // Muestra el modal
  $modal.style.display = "block";

  // Cerrar el modal por botón cerrar
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

  clickButtonSubmit(info, $buttonSubmit, calendar);
}

export {
  modalElement,
  modal
}