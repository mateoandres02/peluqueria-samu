import { paymentData } from "../components/configParams";
import { getBarbers, getPaymentUsersById, putChangeService } from "../components/requests";
import { getToday } from "./date";

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

const handleSelectPaymentMethod = (selectedDate, endDateParam) => {

  document.querySelectorAll('.payment-method').forEach(select => {
    select.addEventListener('change', async (e) => {
      const selectedPaymentMethod = e.target.value;
      const rowId = e.target.dataset.id;

      const turn = {
        Forma_Pago: selectedPaymentMethod
      };

      await putChangeService(rowId, turn);

      if (selectedDate === today && endDateParam === null) {
        window.location.reload();
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

      if (selectedServiceName === "Seleccionar tipo de servicio") {
        const priceCell = document.getElementById(`precio-${rowId}`);
        if (priceCell) {
          priceCell.textContent = '';
        }
        return;
      }

      const selectedService = cutServices.find(service => service.Nombre === selectedServiceName);

      if (selectedService) {
        const priceCell = document.getElementById(`precio-${rowId}`);
        priceCell.textContent = `$ ${selectedService.Precio}`;
      }

      const turn = {
        Service: selectedService.Id
      };

      await putChangeService(rowId, turn);

      if (valueCalendar === today && endDateParam === null) {
        window.location.reload();
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