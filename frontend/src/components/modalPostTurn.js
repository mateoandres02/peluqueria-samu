import { parseDate, addHourOfStartDate } from "../utils/date";
import logAction from "../utils/logActions.js";
import { loadBarberSelect } from "../utils/selectables.js";

import '../styles/modal.css';
import { getClients, getTurnByDateAndBarber, getTurnsFilteredByDateAndBarber } from "./requests.js";

const modalElement = `
  <div class="modal fade" id="dateClickModal" tabindex="-1" aria-labelledby="dateClickModalLabel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="dateClickModalLabel"><i class="bi bi-pencil-square"></i>Registrar cliente</h2>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="eventForm">
            <label for="name-barber-select" class="name-barber-select"><i class="bi bi-person-lines-fill"></i>Barbero</label>
            <select id="name-barber-select" class="input name-barber-select" required>
              <option value="null">Seleccionar barbero</option>
            </select>

            <label for="input-name"><i class="bi bi-person-lines-fill"></i>Nombre</label>
            <input type="text" name="inputName" id="input-name" class="input" required pattern="^[a-zA-Z\\s]{1,25}$" autocomplete="off">

            <label for="input-number"><i class="bi bi-telephone"></i>Teléfono</label>
            <input type="number" name="inputNumber" id="input-number" class="input" required pattern="^\\+?\\d{1,15}$">

            <label for="eventDate"><i class="bi bi-calendar-event"></i>Fecha</label>
            <input type="text" name="eventDate" id="eventDate" class="input" readonly>

            <label for="event-datetime"> <i class="bi bi-clock"></i>Horario</label>
            <input type="datetime" name="dateTime" id="event-datetime" class="input" placeholder="hh:mm" readonly>

            <div class="form-switch">
              <label for="regular-customer">¿Cliente fijo?</label>
              <input class="form-check-input form-check-input-regular" type="checkbox" role="switch" id="regular-customer" value="false">
            </div>

            <div class="form-checkboxes">
              <div class="form-checks">
                <input class="form-check-input form-check-input-day" type="checkbox" id="checkboxMonday" value="1">
                <label class="form-check-label" for="checkboxMonday">Lun</label>
              </div>
              <div class="form-checks">
                <input class="form-check-input form-check-input-day" type="checkbox" id="checkboxTuesday" value="2">
                <label class="form-check-label" for="checkboxTuesday">Mar</label>
              </div>
              <div class="form-checks">
                <input class="form-check-input form-check-input-day" type="checkbox" id="checkboxWednesday" value="3">
                <label class="form-check-label" for="checkboxWednesday">Mié</label>
              </div>
              <div class="form-checks">
                <input class="form-check-input form-check-input-day" type="checkbox" id="checkboxThursday" value="4">
                <label class="form-check-label" for="checkboxThursday">Jue</label>
              </div>
              <div class="form-checks">
                <input class="form-check-input form-check-input-day" type="checkbox" id="checkboxFriday" value="5">
                <label class="form-check-label" for="checkboxFriday">Vie</label>
              </div>
              <div class="form-checks">
                <input class="form-check-input form-check-input-day" type="checkbox" id="checkboxSaturday" value="6">
                <label class="form-check-label" for="checkboxSaturday">Sáb</label>
              </div>
              <div class="form-checks">
                <input class="form-check-input form-check-input-day" type="checkbox" id="checkboxSunday" value="0">
                <label class="form-check-label" for="checkboxSunday">Dom</label>
              </div>
            </div>

            <div class="modal-footer">
              <button type="submit" id="saveTurn" class="btn btn-success btnPost">Guardar</button>
              <button id="closeModal" class="btn btn-danger btnCancel" data-bs-dismiss="modal">Cancelar</button>
              <div class="loader-container">
                <img src="/assets/tube-spinner.svg" alt="loading" class="loader">
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

const activatedCheckboxes = (info, checksActivated) => {

  /**
   * Seteamos como por defecto el checked del dia seleccionado en el calendario.
   * Cargamos en checksActiated los checkboxes seleccionados.
   * param: info -> info provista por fullcalendar.
   * param: checksActivated -> array vacio para guardar los checkboxes de los dias seleccionados.
   */

  const eventDate = new Date(info.dateStr);
  const dayOfWeek = eventDate.getDay();

  const dayCheckboxes = {
    0: document.getElementById('checkboxSunday'),
    1: document.getElementById('checkboxMonday'),
    2: document.getElementById('checkboxTuesday'),
    3: document.getElementById('checkboxWednesday'),
    4: document.getElementById('checkboxThursday'),
    5: document.getElementById('checkboxFriday'),
    6: document.getElementById('checkboxSaturday'),
  };

  Object.values(dayCheckboxes).forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Cargamos el array de checksActivated con los checks activados.
  if (dayCheckboxes[dayOfWeek]) {
    dayCheckboxes[dayOfWeek].checked = true;
    checksActivated.push(parseInt(dayCheckboxes[dayOfWeek].value))
  }
};

const actionBtnCancel = ($btnCancel, $modal) => {

  /**
   * Acción del botón de cancelar de la modal.
   * param: $btnCancel -> elemento html que contiene el boton de cancelar a tocar.
   * param: $modal -> elemento html que contiene la modal a ocultar.
   */

  $btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    const bootstrapModal = bootstrap.Modal.getInstance($modal._element);
    bootstrapModal.hide();
  });
}

const handleSelectionCheckboxes = (checksActivated) => {
  
  /**
   * Manejamos la selección de los checkboxes de los dias de recurrencia y los guardamos en el array de checksActivated.
   * param: checksActivated -> array vacío que guardará la selección de los dias de recurrencia.
   */

  const $checkboxesInputs = document.querySelectorAll('.form-checks input');

  for (let i = 0; i < $checkboxesInputs.length; i++) {
    $checkboxesInputs[i].addEventListener('change', (e) => {
      let contains = checksActivated.find(day => parseInt(day) == parseInt(e.target.value));

      if (!contains) {
        checksActivated.push(parseInt(e.target.value))
      } else {
        checksActivated.pop(parseInt(e.target.value))
      }
    })
  }
};

const activateSectionCheckboxes = ($inputRegularCostumer, $checkboxesDays, checksActivated) => {
  
  /**
   * Activamos la sección de los checkboxes para poder elegir los dias de recurrencia.
   * param: $inputRegularCustomer -> contiene el elemento html del checkbox principal que si se habilita, se activa la sección de los checkboxes de los días de recurrencia.
   * param: $checkboxesDays -> elemento html de la sección de los checkboxes de los dias de recurrencia.
   * param: checksActivated -> array vacío para guardar los dias de recurrencia seleccionados.
   */

  $inputRegularCostumer.addEventListener('change', (e) => {
    if ($inputRegularCostumer.getAttribute('checked')) {
      $inputRegularCostumer.removeAttribute('checked')
      $inputRegularCostumer.value = false;
      $checkboxesDays.style.display = 'none';
    } else {
      $inputRegularCostumer.setAttribute('checked', 'true')
      $inputRegularCostumer.value = true;
      $checkboxesDays.style.display = 'flex';

      handleSelectionCheckboxes(checksActivated);
    }
  })
}

function modalPostTurn(info, data) {

  /**
   * Modal que contiene el formulario para hacer el post.
   * param: info -> info de la celda seleccionada. info proporcionada por fullcalendar.
   * param: data -> info del usuario logueado/activo.
   */

  const d = document;
  const $modal = new bootstrap.Modal(d.getElementById('dateClickModal'));
  const $inputEventDate = d.getElementById("eventDate");
  const $inputEventTime = d.getElementById("event-datetime");
  const $inputRegularCostumer = document.getElementById("regular-customer");
  const $selectableBarbers = d.getElementById("name-barber-select");
  const $elementSelectableBarbers = d.querySelectorAll('.name-barber-select');

  // Autocomplete de la ia
  const $inputName = d.getElementById('input-name');
  const $inputNumber = d.getElementById('input-number');

  // Add autocomplete container after name input
  const autocompleteContainer = document.createElement('div');
  autocompleteContainer.className = 'autocomplete-container';
  if (data.user.Id != 1) {
    autocompleteContainer.style.cssText = 'position: absolute; top: 16%; max-height: 200px; overflow-y: auto; width: 100%; background: white; border: 1px solid #ddd; border-radius: 4px; display: none; z-index: 1000; color: black';
  } else {
    autocompleteContainer.style.cssText = 'position: absolute; top: 30%; max-height: 200px; overflow-y: auto; width: 100%; background: white; border: 1px solid #ddd; border-radius: 4px; display: none; z-index: 1000; color: black';
  }
  $inputName.parentNode.style.position = 'relative';
  $inputName.parentNode.appendChild(autocompleteContainer);

  // Add input event listener for autocomplete
  $inputName.addEventListener('input', async (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length < 2) {
      autocompleteContainer.style.display = 'none';
      return;
    }

    const clients = await getClients();
    const matches = clients.filter(client => 
      client.Nombre.toLowerCase().includes(inputValue)
    );

    if (matches.length > 0) {
      autocompleteContainer.style.display = 'block';
      autocompleteContainer.innerHTML = matches
        .map(client => `<div class="autocomplete-item" style="padding: 8px; cursor: pointer; hover: background-color: #f0f0f0;">${client.Nombre}</div>`)
        .join('');

      // Add click handlers for autocomplete items
      autocompleteContainer.querySelectorAll('.autocomplete-item').forEach((item, index) => {
        item.addEventListener('click', () => {
          $inputName.value = matches[index].Nombre;
          $inputNumber.value = matches[index].Telefono;
          autocompleteContainer.style.display = 'none';
        });

        item.addEventListener('mouseover', () => {
          item.style.backgroundColor = '#f0f0f0';
        });

        item.addEventListener('mouseout', () => {
          item.style.backgroundColor = 'white';
        });
      });
    } else {
      autocompleteContainer.style.display = 'none';
    }
  });

  // Close autocomplete when clicking outside
  document.addEventListener('click', (e) => {
    if (!autocompleteContainer.contains(e.target) && e.target !== $inputName) {
      autocompleteContainer.style.display = 'none';
    }
  });
  // Hasta aca el autocomplete de la ia. cualquier cosa borrar todo esto.

  if (data.user.Id != 1) {
    $elementSelectableBarbers.forEach((element) => {
      element.style.display = 'none';
    })
  }

  // Obtenemos los checks de los dias de recurrencia.
  const $checkboxesDays = d.querySelector('.form-checkboxes');
  $checkboxesDays.style.display = 'none';

  let checksActivated = [];
  activatedCheckboxes(info, checksActivated);

  const { dayWithoutYear, timeWithoutSeconds, completeDate } = parseDate(info.dateStr);

  const $formModal = d.getElementById("eventForm");
  
  loadBarberSelect($selectableBarbers);

  $formModal.inputName.value = '';
  $formModal.inputNumber.value = '';
  $inputEventDate.value = dayWithoutYear;
  $inputEventTime.value = timeWithoutSeconds;

  $modal.show();

  const $btnCancel = document.querySelector('.btnCancel');
  actionBtnCancel($btnCancel, $modal);

  activateSectionCheckboxes($inputRegularCostumer, $checkboxesDays, checksActivated);

  handleSubmit($formModal, completeDate, data, $modal, checksActivated, $selectableBarbers);
}

const validateInputString = () => {

  /**
   * Validamos lo ingresado en el input del nombre del cliente.
   */

  document.getElementById('input-name').addEventListener('input', function(event) {
    const input = event.target;
  
    const namePattern = /^[a-zA-Z\s]{1,25}$/;
  
    if (!namePattern.test(input.value)) {
      input.setCustomValidity("Solo letras y espacios hasta 25 caracteres.");
    } else {
      input.setCustomValidity(""); 
    }
  });
}

const validateInputNumber = () => {

  /**
   * Validamos lo ingresado en el input del numero telefónico del cliente.
   */

  document.getElementById('input-number').addEventListener('input', function(event) {
    const input = event.target;
  
    const numberPattern = /^\+?\d{1,15}$/;
  
    if (!numberPattern.test(input.value)) {
      input.setCustomValidity("Solo números hasta 15 digitos.");
    } else {
      input.setCustomValidity("");
    }
  });
}

const addDatesOfMonth = (date, dateOutParsed, datesOfMonth, checksActivated) => {

  /**
   * Agregamos las fechas de los dias de recurrencia seleccionados, para luego poder identificarlos por separado y poder trabajarlos.
   * param: date -> fecha completa de la celda seleccionada.
   * param: dateOutParsed -> fecha completa pero parseada de la celda seleccionada.
   * param: datesOfMonth -> array vacío de las fechas del mes de los dias de recurrencia seleccionados. 
   * param: checksActivates -> array con los checks activados de los dias de recurrencia seleccionados.
   */

  const actualDate = new Date(date);
  const actualDay = actualDate.getDate();
  const actualMonth = actualDate.getMonth();
  const actualYear = actualDate.getFullYear();
  const { timeOfTurn } = parseDate(dateOutParsed);

  for (const day of checksActivated) {
    const newDate = new Date(actualYear, actualMonth, actualDay);
    while (newDate.getMonth() === actualMonth) {
      if (newDate.getDay() === day) {
        datesOfMonth.push({
          date: addHourOfStartDate(newDate.toISOString().split('T')[0], timeOfTurn),
          id_dia: day
        })
      }
      newDate.setDate(newDate.getDate() + 1);
    }
  }
}

async function handleSubmit(form, date, dataUserActive, $modal, checksActivated, $selectableBarbers) {
  
  /**
   * Manejamos el envio de los datos del turno a crear.
   * param: form -> es el elemento html del formulario de la modal.
   * param: date -> es la fecha completa parseada.
   * param: data -> es la información del usuario logueado.
   * param: $modal -> es el elemento html de la modal.
   * param: checksActivated -> es un array con los dias de recurrencia activados.
   */
  
  const $modalFooter = document.querySelector('.modal-footer');
  const $loader = document.querySelector('.loader-container');
  
  // Creamos la etiqueta donde se va a almacenar el resultado del envio del formulario.
  const span = document.createElement('span');
  span.innerHTML = 'Error al crear el turno.';
  span.style.textAlign = 'center'
  span.style.width = '100%';
  span.style.marginTop = '1rem';
  span.style.marginBottom = '0rem';
  span.style.paddingBottom = '0rem';

  validateInputString();
  validateInputNumber();

  form.addEventListener ("submit", async (e) => {
    e.preventDefault();

    $loader.style.display = "flex";
    
    const submitBtn = form.querySelector('.btnPost');

    const $nameInput = document.getElementById('input-name');
    const $numberInput = document.getElementById('input-number');
    const $inputRegularCostumer = document.getElementById("regular-customer");

    const clientName = form.inputName.value.trim();
    const clientNumber = form.inputNumber.value.trim();

    let selectedOption;
    if ($selectableBarbers.options[$selectableBarbers.selectedIndex]) {
      selectedOption = $selectableBarbers.options[$selectableBarbers.selectedIndex];
    }

    let idBarber;
    if (dataUserActive.user.Id != 1) {
      idBarber = dataUserActive.user.Id;
    } else {
      idBarber = selectedOption.getAttribute('data-barberid');
    }
    
    if (idBarber === null) {
      
      span.innerHTML = 'Seleccione un barbero';
      span.style.color = 'red';
      
      setTimeout(() => {
        $loader.style.display = "none";
        $modalFooter.appendChild(span);
        submitBtn.removeAttribute('disabled');
      }, 1000);

      setTimeout(() => {
        $modalFooter.removeChild(span);
      }, 3500);

      return;
    }

    const dateOutParsed = date;
    const regularCustomer = $inputRegularCostumer.value;
    const nameBarber = dataUserActive.user.Nombre;

    if (!$nameInput.checkValidity() && !$numberInput.checkValidity()) {
      $nameInput.reportValidity(); 
      $numberInput.reportValidity();
    }

    // Si el barbero tiene un turno, avisamos que lo tiene.
    if (dataUserActive.user.Id == 1) {
      submitBtn.setAttribute('disabled', 'true');

      const { recurrentTurn, turn } = await getTurnByDateAndBarber(dateOutParsed, idBarber);

      if ((recurrentTurn.length > 0 && recurrentTurn[0].exdate === 0) || turn.length > 0) {

        span.innerHTML = 'Ya existe un turno en esa fecha. Consultar al barbero.';
        span.style.color = 'red';

        setTimeout(() => {
          $loader.style.display = "none";
          $modalFooter.appendChild(span);
        }, 1000);
        
        setTimeout(() => {
          submitBtn.removeAttribute('disabled');
          $modalFooter.removeChild(span);
        }, 4000);

        return;
      }
    }
    // aca termina la funcionalidad, si anda mal, comentarla.

    
    submitBtn.setAttribute('disabled', 'true');
    
    // Trabajamos con el turno normal.
    const turn = {
      Nombre: clientName,
      Telefono: clientNumber,
      Date: dateOutParsed,
      Regular: regularCustomer,
      NroUsuario: idBarber,
      Service: null
    }

    const url = 'https://peluqueria-invasion-backend.vercel.app/turns';
    // const url = 'http://localhost:3001/turns';

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(turn),
      credentials: 'include'
    };

    const response = await fetch(url, options);

    logAction({
      Barbero: nameBarber,
      Cliente: clientName,
      FechaTurno: dateOutParsed,
      Fijo: `${regularCustomer}`,
      Accion: 'POST'
    })

    if (!response.ok) {
      span.style.color = 'red';
      return;
    }

    const data = await response.json();
    let id_turn = data.Id;

    let responses = [];

    if (regularCustomer === 'true') {

      // Trabajamos con el turno recurrente
      let regularTurn;
      let urlRegularTurn;
      let optionsRegularTurn;
      let responseRegularTurn;

      const datesOfMonth = [];
      addDatesOfMonth(date, dateOutParsed, datesOfMonth, checksActivated);

      for (const date of datesOfMonth) {
        regularTurn = {
          id_turno: id_turn,
          id_dia: date.id_dia,
          date: date.date
        };

        urlRegularTurn = 'https://peluqueria-invasion-backend.vercel.app/recurrent_turns';
        // urlRegularTurn = 'http://localhost:3001/recurrent_turns';

        optionsRegularTurn = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(regularTurn),
          credentials: 'include'
        };

        responseRegularTurn = await fetch(urlRegularTurn, optionsRegularTurn);

        responses.push(responseRegularTurn);

        logAction({
          Barbero: nameBarber,
          Cliente: clientName,
          FechaTurno: date.date,
          Fijo: `${regularCustomer}`,
          Accion: 'POST'
        })

      };
      
    }

    // Verificamos si todas las respuestas a todos los post de cada dia del turno recurrente son exitosas.
    const allResponsesOk = responses.every(res => res.ok);

    if (
      (regularCustomer === 'true' && allResponsesOk && response.ok) ||
      (regularCustomer === 'false' && response.ok)
    ) {
      span.innerHTML = '¡Turno creado correctamente!'
      span.style.color = '#5cb85c';

      setTimeout(() => {
        const bootstrapModal = bootstrap.Modal.getInstance($modal._element);
        bootstrapModal.hide();
        submitBtn.removeAttribute('disabled');
        window.location.reload();
      }, 1500);

    } else {
      span.style.color = 'red';
    }      

    if (!$modalFooter.contains(span)) {
      $loader.style.display = "none";
      $modalFooter.appendChild(span);
    }    

    
  });

}

export {
  modalPostTurn,
  actionBtnCancel,
  modalElement
}
