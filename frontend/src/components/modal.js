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
            <input type="text" name="inputName" id="input-name" class="input" required pattern="^[a-zA-Z\\s]{1,25}$">

            <label for="input-number">Teléfono</label>
            <input type="number" name="inputNumber" id="input-number" class="input" required pattern="^\\+?\\d{1,15}$">

            <label for="eventDate">Fecha</label>
            <input type="text" name="eventDate" id="eventDate" class="input" readonly>

            <label for="event-datetime">Horario</label>
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

const modalTurnContent = `
  <div class="modal fade" id="dateClickModalTurnContent" tabindex="-1" aria-labelledby="dateClickModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="dateClickModalLabel">Informacion de Turno</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <h2 id="infoName">Nombre y Apellido: <span id="spanName"></span> </h2>
          <h2 id="infoTel">Teléfono: <span id="spanTel"></span></h2>
          <h2 id="infoDay">Día: <span id="spanDay"></span></h2>
          <h2 id="infoStartTime">Inicio de Turno: <span id="spanStartTime"></span></h2>
          <h2 id="infoEndTime">Fin de Turno: <span id="spanEndTime"></span></h2>
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

const modalConfirm = `
  <div class="modal fade" id="dateClickModalConfirm" tabindex="-1" aria-labelledby="dateClickModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="dateClickModalLabel">Advertencia</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <h2>Deseas eliminar el turno?</h2>
        </div>
        <div class="modal-body">
          <button id="deleteTurn" class="btn btn-success">Eliminar</button>
          <button id="closeModal" class="btn btn-danger btnCancel" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
`;

function modalConfirmDisplay() {
  const $modalConfirm = new bootstrap.Modal(document.getElementById('dateClickModalConfirm'));

  const $confirm = document.getElementById('deleteTurn');
  // const $cancel = document.getElementById('deleteTurn');

  $modalConfirm.show();
  
}

function modalTurnContentDisplay(info) {
  const d = document;

  // Inicializamos la modal
  const $modal = new bootstrap.Modal(d.getElementById('dateClickModalTurnContent'));
  
  // Obtenemos los elementos de la modal 
  const $h2Name = d.getElementById("infoName");
  const $h2Tel = d.getElementById("infoTel");
  const $h2Day = d.getElementById("infoDay");
  const $h2StartTime = d.getElementById("infoStartTime");
  const $h2EndTime = d.getElementById("infoEndTime");

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
  const $btnCancel = document.getElementById("deleteTurn");
  const $btnWsp = document.getElementById("contactWsp")
  const body = document.body

  $btnCancel.addEventListener('click', async (e) => {
    e.preventDefault();
    alert("sad")
    // body.insertAdjacentHTML('beforeend', modalConfirm);

    // modalConfirmDisplay();
    // const publicId = info.event._def.publicId;
    // document.querySelector('.modal').addEventListener('hidden.bs.modal', function () {
    //   this.remove();
    // });
  })
  // Programamos la funcionalidad de cancelar el registro del turno.
  // $btnCancel.addEventListener('click', async (e) => {
  //   e.preventDefault();

  //   // Obtenemos el publicId del turno creado
  //   const publicId = info.event._def.publicId;

  //   // Confirmamos la eliminación del registro.
  //   const $confirm = confirm(`¿Estás seguro que quieres eliminar el turno?`);

  //   // Si la confirmación es true, eliminamos el registro.
  //   if ($confirm) {
  //     const response = await fetch(`http://localhost:3001/turns/${publicId}`, {
  //       method: 'DELETE'  
  //     });

  //     if (response.ok) {
  //       // Una vez eliminado el registro, recargamos la página.
  //       window.location.reload();
  //     } else {
  //       alert('Error al eliminar el turno.');
  //     };
  //   };

  //   const bootstrapModal = bootstrap.Modal.getInstance($modal._element);
  //   bootstrapModal.hide();
  // });

  $btnWsp.addEventListener('click', async(e) => {
    e.preventDefault();
    
    const msg = `Hola ${name} espero que te encuentres muy bien!, tenes un turno agendado para el dia ${day}, a las ${startTime}`
    const wspUrl = `https://api.whatsapp.com/send?phone=${tel}&text=${encodeURIComponent(msg)}`
    $btnWsp.href = wspUrl
    
    window.open(wspUrl, '_blank');
  });
}
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
      input.setCustomValidity("solo letras y espacios hasta 25 caracteres.");
    } else {
      input.setCustomValidity(""); // Restablece la validez del input si coincide con el patrón
    }
  });
  
  document.getElementById('input-number').addEventListener('input', function(event) {
    const input = event.target;
  
    const numberPattern = /^\+?\d{1,15}$/;
  
    if (!numberPattern.test(input.value)) {
      input.setCustomValidity("Solo numeros hasta 15 digitos.");
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
    }

    // Manejamos el post de la información ingresada por el usuario al back.
    const url = 'https://peluqueria-invasion-backend.vercel.app/turns';

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(turn),
    };

    const response = await fetch(url, options);

    if (response.ok) {
      span.innerHTML = 'Turno creado correctamente'
      span.style.color = 'green';

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
  modalElement,
  modalTurnContent,
  modalTurnContentDisplay
}