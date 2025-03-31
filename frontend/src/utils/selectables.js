import { modalMethodPayment } from "../components/cashRegister";
import { paymentData } from "../components/configParams";
import { actionBtnCancel } from "../components/modalPostTurn";
import { getBarbers, getPaymentUsersById, getRecurrentTurnById, getTurnById, putChangeService, putChangeServiceRecurrentTurns } from "../components/requests";
import { getToday, parseDate } from "./date";

import '../styles/modal.css';

const today = getToday();

const loadBarberSelect = async (barberSelect) => {
  
  /**
   * Carga el selector de barberos con los barberos disponibles en la aplicación.
   * param: barberSelect -> elemento html del selectable de barberos.
   */
  
  const barbers = await getBarbers();

  barbers.forEach(barber => {
    barberSelect.innerHTML += `<option value="${barber.Nombre}" data-barberid="${barber.Id}">${barber.Nombre}</option>`;
  });

};

const handleSelectPaymentMethod = () => {

  document.querySelectorAll('.payment-method').forEach(select => {
    select.addEventListener('change', async (e) => {

      const selectedPaymentMethod = e.target.value;
      const rowId = e.target.dataset.id;
      const rowDate = e.target.dataset.date;
      
      const turn_id_data = await getTurnById(rowId);
      const { dateParsed } = parseDate(rowDate);

      let turn_id_data_recurrent_turn;
      if (turn_id_data.turns.Regular === "true") {
        turn_id_data_recurrent_turn = await getRecurrentTurnById(rowId);
      }

      let precio;
      let recurrentTurn;
      
      if (turn_id_data_recurrent_turn) {
        for (const turn of turn_id_data_recurrent_turn) {   
          if (turn.id_turno === parseInt(rowId) && turn.date === rowDate) {
            if (turn.servicio === null) {
              alert('Es necesario primero cargar el servicio.');
              return;
            }
            precio = turn.precio;
            recurrentTurn = turn;
            break;
          }
        }
      }

      if (turn_id_data.precio === null && turn_id_data.date === rowDate) {
        alert('Es necesario primero cargar el servicio.');
        return;
      }

      if (selectedPaymentMethod === "Efectivo") {

        const turn = {
          Forma_Cobro: 1,
          Pago_Efectivo: turn_id_data.precio || precio,
          Pago_Transferencia: 0
        };

        if (turn_id_data.turns.Regular === "true") {
          await putChangeServiceRecurrentTurns(rowId, dateParsed, turn);
        } else {
          await putChangeService(rowId, turn);
        }

      } else if (selectedPaymentMethod === "Transferencia") {

        const turn = {
          Forma_Cobro: 2,
          Pago_Efectivo: 0,
          Pago_Transferencia: turn_id_data.precio || precio
        };

        if (turn_id_data.turns.Regular === "true") {
          await putChangeServiceRecurrentTurns(rowId, dateParsed, turn);
        } else {
          await putChangeService(rowId, turn);
        }

      } else if (selectedPaymentMethod === "Mixto") {
        const $modal = new bootstrap.Modal(document.getElementById('modalMethodPayment'));
        $modal.show()

        const $modalFooter = document.querySelector('.modal-footer');
        const existingSpan = $modalFooter.querySelector('span');
        if (existingSpan) {
          $modalFooter.removeChild(existingSpan);
        }

        const form = document.getElementById('modalMethodPaymentForm');

        const span = document.createElement('span');
        span.innerHTML = 'Error al ingresar la forma de pago.';
        span.style.textAlign = 'center'
        span.style.width = '100%';
        span.style.marginTop = '1rem';
        span.style.marginBottom = '0rem';
        span.style.paddingBottom = '0rem';
        
        // Remove any existing submit event listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        const cancelButton = newForm.querySelector('.btnCancel');
        cancelButton.addEventListener('click', (e) => {
          e.preventDefault();
          const $modalFooter = document.querySelector('.modal-footer');

          const existingSpan = $modalFooter.querySelector('span');
          if (existingSpan) {
            $modalFooter.removeChild(existingSpan);
          }

          const bootstrapModal = bootstrap.Modal.getInstance($modal._element);
          bootstrapModal.hide();
        });

        newForm.addEventListener('submit', async (e) => {
          e.preventDefault();

          const $modalFooter = document.querySelector('.modal-footer');
          const $loader = document.querySelector('.loader-container');

          $loader.style.display = "flex";

          const submitBtn = newForm.querySelector('.btnPost');
          submitBtn.disabled = true;

          const totalAmount = parseInt(newForm.efectivo.value) + parseInt(newForm.transferencia.value);

          if ((turn_id_data.turns.Regular === "false" && (totalAmount > turn_id_data.precio || totalAmount < turn_id_data.precio)) || (turn_id_data.turns.Regular === "true" && (totalAmount > recurrentTurn.precio || totalAmount < recurrentTurn.precio))) {
            $loader.style.display = "none";

            span.innerHTML = 'El monto ingresado no coincide con el precio del servicio.';
            span.style.color = 'red';
            $modalFooter.appendChild(span);

            setTimeout(() => {
              submitBtn.disabled = false;
              const existingSpan = $modalFooter.querySelector('span');
              if (existingSpan) {
                $modalFooter.removeChild(existingSpan);
              }
            }, 2500);

          } else if (totalAmount === turn_id_data.precio || totalAmount === recurrentTurn.precio) {
            
            const efectivo = {
              Forma_Cobro: 3,
              Pago_Efectivo: newForm.efectivo.value || 0
            }
  
            const transferencia = {
              Forma_Cobro: 3,
              Pago_Transferencia: newForm.transferencia.value || 0
            }

            if (turn_id_data.turns.Regular === "true") {
              await putChangeServiceRecurrentTurns(rowId, dateParsed, efectivo);
            } else {
              await putChangeService(rowId, efectivo);
            }

            if (turn_id_data.turns.Regular === "true") {
              await putChangeServiceRecurrentTurns(rowId, dateParsed, transferencia);
            } else {
              await putChangeService(rowId, transferencia);
            }
  
            $loader.style.display = "none";
  
            span.innerHTML = 'Se registró con éxito';
            span.style.color = 'green';
            $modalFooter.appendChild(span);
            
            setTimeout(() => {
              const bootstrapModal = bootstrap.Modal.getInstance($modal._element);
              bootstrapModal.hide();
              const existingSpan = $modalFooter.querySelector('span');
              if (existingSpan) {
                $modalFooter.removeChild(existingSpan);
              }
              submitBtn.disabled = false;
            }, 1500);
          }

          $loader.style.display = "none";
          submitBtn.disabled = false;
          
        });
        
        // Clear form values
        newForm.efectivo.value = '';
        newForm.transferencia.value = '';

      }

    })
  });

}

const handleSelectServiceChange = (cutServices, dateValue, endDateParam) => {

  /**
   * Hacemos un put al backend con el filtro elegido del selectable de servicio. De esta forma logramos actualizar los precios del corte.
   * param: cutServices -> array con los servicios disponibles en la aplicación.
   * param: dateValue -> fecha elegida del calendario.
   */

  document.querySelectorAll('.cut-service-select').forEach(select => {

    select.addEventListener('change', async (e) => {

      const selectedServiceName = e.target.value;
      let valueCalendar = dateValue;
      const rowId = e.target.dataset.id;
      const rowDate = e.target.dataset.date;

      const turn_id_data = await getTurnById(rowId);

      const { dateParsed } = parseDate(rowDate);

      const selectedService = cutServices.find(service => service.Nombre === selectedServiceName);

      if (selectedService) {
        const priceCell = document.getElementById(`precio-${rowId}-${dateParsed}`);
        priceCell.textContent = `$ ${selectedService.Precio}`;
      }

      if (turn_id_data.turns.Regular === "true") {
        const turn = {
          servicio: selectedService.Id
        };
        await putChangeServiceRecurrentTurns(rowId, dateParsed, turn);
      } else {
        const turn = {
          Service: selectedService.Id
        };
        await putChangeService(rowId, turn);
      }

    });
  });
};


const handleChangeBarber = async (table, selectable) => {

  /**
   * Manejamos la selección del barbero para modificarle los porcentajes.
   * param: table -> elemento html de la tabla donde se va a renderizar la información.
   * param: selectable -> elemento html con todos los barberos cargados.
   */

  const dataBarbers = await getBarbers();

  selectable.addEventListener('change', async (e) => {
    
    const filteredBarber = dataBarbers.filter(barber => barber.Nombre === e.target.value);

    if (filteredBarber.length > 0) {
      const dataBarber = await getPaymentUsersById(filteredBarber[0].Id);
      
      if (dataBarber.message) {
        table.innerHTML = `
          <tr>
            <td scope="row" colspan="2">El barbero no tiene servicios asociados.</td>
          </tr>
        `;
      } else {
        paymentData(table, dataBarber)
      }
    }

  });
}

export {
  loadBarberSelect,
  handleSelectPaymentMethod,
  handleSelectServiceChange,
  handleChangeBarber
}
