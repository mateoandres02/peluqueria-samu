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
            <input type="text" name="inputName" id="input-name" class="input" required>

            <label for="input-number">Teléfono</label>
            <input type="number" name="inputNumber" id="input-number" class="input" required>

            <label for="eventDate">Fecha</label>
            <input type="text" name="eventDate" id="eventDate" class="input" readonly>

            <label for="event-datetime">Horario</label>
            <input type="datetime" name="dateTime" id="event-datetime" class="input" placeholder="hh:mm">

            <div class="modal-footer">
              <button id="closeModal" class="btn btn-danger btnCancel" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" id="saveTurn" class="btn btn-success">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

// El parámetro data contiene información del usuario logueado.
function modal(info, calendar, data) {
  
  const d = document;

  // Inicializamos la modal
  const $modal = new bootstrap.Modal(d.getElementById('dateClickModal'));
  
  const $inputEventDate = d.getElementById("eventDate");
  const $inputEventTime = d.getElementById("event-datetime");
  const { dayWithoutYear, timeWithoutSeconds, completeDate } = parseDate(info.dateStr);
  const $formModal = d.getElementById("eventForm");

  // Set the date input value to the clicked date
  $inputEventDate.value = dayWithoutYear;

  // Set the Time selected into input value 
  $inputEventTime.value = timeWithoutSeconds;

  // Mostramos la modal.
  $modal.show();

  const $btnCancel = document.querySelector('.btnCancel');

  $btnCancel.addEventListener('click', (e) => {
    e.preventDefault();

    const bootstrapModal = bootstrap.Modal.getInstance($modal._element);
    bootstrapModal.hide();

    $modal.hide();
  });

  clickButtonSubmit(info, $formModal, calendar, completeDate, data);
}

async function clickButtonSubmit(info, form, calendar, date, dataUserActive) {

  // Obtenemos el footer de la modal para luego agregarle el mensaje sobre el resultado del envio del formulario.
  const $modalFooter = document.querySelector('.modal-footer');

  // Creamos la etiqueta donde se va a almacenar el resultado del envio del formulario.
  const span = document.createElement('span');
  span.innerHTML = 'Error al crear el turno.';
  span.style.textAlign = 'center'
  span.style.width = '100%';
  span.style.marginTop = '1rem';
  span.style.marginBottom = '0rem';
  span.style.paddingBottom = '0rem';

  form.addEventListener ("submit", async (e) => {
    e.preventDefault();
    
    const idBarber = dataUserActive.user.Id;
    const clientName = form.inputName.value;
    const clientNumber = form.inputNumber.value;
    const dateOutParsed = date;

    const turn = {
      Nombre : clientName,
      Telefono : clientNumber,
      Date: dateOutParsed,
      NroUsuario: idBarber,
    }

    const url = 'http://localhost:3001/turns';

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(turn),
    };

    const response = await fetch(url, options);

    const data = await response.json();

    
    // if (response.ok) {
    //   console.log(data)
    //   console.log('salio bien')
    // } else {
    //   console.log('salio mal')
    // }

    
    // const inputName = document.getElementById("input-name").value;
    // const inputNumber = document.getElementById("input-number").value;
    // // const inputDate = document.getElementById("input-date").value;
    // const inputTime = document.getElementById("input-time").value;
    
    // const dateStr = info.dateStr.split('T')[0];
    // const eventDateTime = `${dateStr}T${inputTime}:00`;
    
    // window.alert("eee")

    // if (inputName && inputNumber && inputDate && inputTime) {
    //   // Crear el evento
    //   const newEvent = {
    //     title: inputName,
    //     start: eventDateTime,
    //     // Puedes agregar más propiedades según lo necesites
    //     extendedProps: {
    //       phone: inputNumber,
    //     }
    //   };

    //   // Agregar el evento al calendario
    //   calendar.addEvent(newEvent);
      
    //   // Cerrar la modal
    //   const $modal = document.getElementById("dateClickModal");
    //   $modal.style.display = "none";
    // } else {
    //   alert("Por favor, completa todos los campos.");
    // }
  });
}

export {
  modalElement,
  modal,
  
}