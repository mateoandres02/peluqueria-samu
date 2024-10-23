import { parseDate } from "./date";
import '../styles/modal.css';

const modalElement = `
  <div class="modal fade" id="dateClickModal" tabindex="-1" aria-labelledby="dateClickModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="dateClickModalLabel"><i class="bi bi-pencil-square"></i>Registrar cliente</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="eventForm" >
            <label for="input-name"><i class="bi bi-person-lines-fill"></i>Nombre</label>
            <input type="text" name="inputName" id="input-name" class="input" required pattern="^[a-zA-Z\\s]{1,25}$">

            <label for="input-number"><i class="bi bi-telephone"></i>Teléfono</label>
            <input type="number" name="inputNumber" id="input-number" class="input" required pattern="^\\+?\\d{1,15}$">

            <label for="eventDate"><i class="bi bi-calendar-event"></i>Fecha</label>
            <input type="text" name="eventDate" id="eventDate" class="input" readonly>

            <label for="event-datetime"> <i class="bi bi-clock"></i>Horario</label>
            <input type="datetime" name="dateTime" id="event-datetime" class="input" placeholder="hh:mm" readonly>

            <div class="modal-footer">
              <button type="submit" id="saveTurn" class="btn btn-success">Guardar</button>
              <button id="closeModal" class="btn btn-danger btnCancel" data-bs-dismiss="modal">Cancelar</button>
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
  
  // Obtenemos los inputs del formulario.
  const $inputEventDate = d.getElementById("eventDate");
  const $inputEventTime = d.getElementById("event-datetime");

  // Parseamos los datos de la fechas y el horario.
  const { dayWithoutYear, timeWithoutSeconds, completeDate } = parseDate(info.dateStr);

  // Obtenemos el formulario.
  const $formModal = d.getElementById("eventForm");

  // Reseteamos valores de los inputs de escritura.
  $formModal.inputName.value = '';
  $formModal.inputNumber.value = '';

  // Le cargamos los valores a los inputs de lectura.
  $inputEventDate.value = dayWithoutYear;
  $inputEventTime.value = timeWithoutSeconds;

  // Mostramos la modal.
  $modal.show();

  // Programamos la funcionalidad de cancelar el registro del turno.
  const $btnCancel = document.querySelector('.btnCancel');

  $btnCancel.addEventListener('click', (e) => {
    e.preventDefault();

    const bootstrapModal = bootstrap.Modal.getInstance($modal._element);
    bootstrapModal.hide();
  });

  // Instanciamos la función que maneja el envio del formulario para registrar el turno.
  handleSubmit($formModal, completeDate, data, $modal);
}

async function handleSubmit(form, date, dataUserActive, $modal) {
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

  document.getElementById('input-name').addEventListener('input', function(event) {
    const input = event.target;
  
    const namePattern = /^[a-zA-Z\s]{1,25}$/;
  
    if (!namePattern.test(input.value)) {
      input.setCustomValidity("Solo letras y espacios hasta 25 caracteres.");
    } else {
      input.setCustomValidity(""); // Restablece la validez del input si coincide con el patrón
    }
  });
  
  document.getElementById('input-number').addEventListener('input', function(event) {
    const input = event.target;
  
    const numberPattern = /^\+?\d{1,15}$/;
  
    if (!numberPattern.test(input.value)) {
      input.setCustomValidity("Solo números hasta 15 digitos.");
    } else {
      input.setCustomValidity(""); // Restablece la validez del input si coincide con el patrón
    }
  });

  // Programamos el evento del formulario que enviará los datos al back.
  form.addEventListener ("submit", async (e) => {
    e.preventDefault();
    
    const $nameInput = document.getElementById('input-name');
    const $numberInput = document.getElementById('input-number');

    // Obtenemos los datos ingresados por el usuario.
    const clientName = form.inputName.value.trim();
    const clientNumber = form.inputNumber.value.trim();
    const idBarber = dataUserActive.user.Id;
    const dateOutParsed = date;


    // Validación al enviar el formulario
    if ($nameInput.checkValidity() && $numberInput.checkValidity()) {
      // Aquí puedes manejar el envío del formulario si los valores son válidos
      // Por ejemplo, realizar la petición al servidor como lo hacías antes
      console.log("Formulario válido. Enviando datos...");
    } else {
      // Si hay algún error, se mostrará el mensaje personalizado correspondiente
      $nameInput.reportValidity(); 
      $numberInput.reportValidity();
    }
      // // Validar el nombre
    // if (!namePattern.test(clientName)) {
    //   span.innerHTML = 'El nombre debe contener solo letras, espacios y tener máximo 25 caracteres.';
    //   span.style.color = 'red';
    //   $modalFooter.appendChild(span);
    //   return;
    // }

    // // Validar el número de teléfono
    // if (!numberPattern.test(clientNumber)) {
    //     span.innerHTML = 'El teléfono debe contener solo números y un máximo de 15 dígitos. Puede comenzar con +.';
    //     span.style.color = 'red';
    //     $modalFooter.appendChild(span);
    //     return;
    // }

    // Creamos el turno.
    const turn = {
      Nombre : clientName,
      Telefono : clientNumber,
      Date: dateOutParsed,
      NroUsuario: idBarber,
      Service: null
    }

    // Manejamos el post de la información ingresada por el usuario al back.
    // const url = 'https://peluqueria-invasion-backend.vercel.app/turns';
    const url = 'http://localhost:3001/turns';

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(turn),
    };

    const response = await fetch(url, options);

    if (response.ok) {
      span.innerHTML = 'Turno creado correctamente!'
      span.style.color = '#02C028';

      setTimeout(() => {
        const bootstrapModal = bootstrap.Modal.getInstance($modal._element);
        bootstrapModal.hide();
        window.location.reload();
      }, 1500);

    } else {
      span.style.color = 'red';
    }

    // Agregamos el elemento con el mensaje al footer de la modal.
    $modalFooter.appendChild(span);
    
  });

}

export {
  modal,
  modalElement
}