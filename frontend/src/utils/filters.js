import { cashData } from "../components/cashRegister";
import { vouchersRender } from "../components/voucher"
import { getBarbers } from "../components/requests";
import { getToday } from "./date";

const today = getToday();

const addBarberFilterListener = async (table, $dateInput, $weekInput, $barberSelect) => {

  /**
   * Hace un filtrado de los turnos mostrados en la tabla del barbero seleccionado.
   * param: table -> elemento html de la tabla en donde se visualizarán los turnos.
   * param: $barberSelect -> elemento html del selectable para elegir algun barbero.
   */

  const dataBarbers = await getBarbers();

  const totalEarnedDisplay = document.getElementById('totalEarnedDisplay');
  const totalEarnedEfectDisplay = document.getElementById('totalEarnedForEfectDisplay');
  const totalEarnedTransfDisplay = document.getElementById('totalEarnedForTransfDisplay');
  const totalVouchers = document.getElementById('totalVouchers');
  const paymentTableBody = document.querySelector('.table-pay-body');
  
  $barberSelect.addEventListener('change', async (e) => {
    
    totalEarnedDisplay.innerHTML = `Total ganado: <b>$ 0.00</b>`;
    totalEarnedEfectDisplay.innerHTML = `Efectivo: <b>$ 0.00</b>`;
    totalEarnedTransfDisplay.innerHTML = `Transferencia: <b>$ 0.00</b>`;
    totalVouchers.innerHTML = `Total vales a restar: <br class="totalEarnedInfo-br"> <b class="span-red">$ 0.00</b>`;
    paymentTableBody.innerHTML = '';

    const filteredBarber = dataBarbers.filter(barber => barber.Nombre === e.target.value);
    
    let selectedDate = $dateInput.value;
    let endDateWeek = $weekInput.value;

    let endWeekDatePlusOne;
    
    if (endDateWeek) {
      const endDate = new Date(endDateWeek);
      endDate.setDate(endDate.getDate() + 1);
      endWeekDatePlusOne = endDate.toISOString().split('T')[0];
    } else {
      endWeekDatePlusOne = null
    }

    if (!filteredBarber.length > 0) {
      await cashData(table, selectedDate, null, endWeekDatePlusOne)
    } else {
      await cashData(table, selectedDate, filteredBarber[0].Id, endWeekDatePlusOne);
    }

  });
}

const addDateFilterListener = async (table, dateInput, $weekInput, $barberSelect) => {

  /**
   * Hace un filtrado de los turnos mostrados en la tabla del dia seleccionado.
   * param: table -> elemento html de la tabla en donde se visualizarán los turnos.
   * param: dateInput -> dia elegido en el filtro.
   * param: $weekInput -> elemento html del calendario para elegir el final de la semana.
   */

  const dataBarbers = await getBarbers();
  
  const totalEarnedDisplay = document.getElementById('totalEarnedDisplay');
  const totalEarnedEfectDisplay = document.getElementById('totalEarnedForEfectDisplay');
  const totalEarnedTransfDisplay = document.getElementById('totalEarnedForTransfDisplay');
  const totalVouchers = document.getElementById('totalVouchers');
  const paymentTableBody = document.querySelector('.table-pay-body');
  
  dateInput.removeEventListener('change', handleDateChange); 
  dateInput.addEventListener('change', handleDateChange);
  
  async function handleDateChange(e) {
    
    if ($weekInput.value != "" && e.target.value > $weekInput.value) {
      alert("La fecha inicial no puede ser mayor a la final.");
      // dateInput.value = new Date($weekInput.value).toISOString().split("T")[0];
      dateInput.value = today;
    } else {
      totalEarnedDisplay.innerHTML = `Total ganado: <b>$ 0.00</b>`;
      totalEarnedEfectDisplay.innerHTML = `Efectivo: <b>$ 0.00</b>`;
      totalEarnedTransfDisplay.innerHTML = `Transferencia: <b>$ 0.00</b>`;
      totalVouchers.innerHTML = `Total vales a restar: <br class="totalEarnedInfo-br"> <b class="span-red">$ 0.00</b>`
      paymentTableBody.innerHTML = '';
  
      let selectedDate = e.target.value;
      let endWeekDate = $weekInput.value;
  
      const filteredBarber = dataBarbers.filter(barber => barber.Nombre ===  $barberSelect.value);
      const selectedBarber = $barberSelect.value !== 'null' ? filteredBarber[0].Id : null;
  
      await cashData(table, selectedDate, selectedBarber, endWeekDate);
    }
    
  };

};

const addEndWeekFilterListner = async (table, $dateInput, $weekInput, $barberSelect) => {
  
  /**
   * Hace un filtrado de los turnos mostrados en la tabla del dia seleccionado.
   * param: table -> elemento html de la tabla en donde se visualizarán los turnos.
   * param: dateInput -> dia elegido en el filtro.
   */
  
  const dataBarbers = await getBarbers();

  const totalEarnedDisplay = document.getElementById('totalEarnedDisplay');
  const totalEarnedEfectDisplay = document.getElementById('totalEarnedForEfectDisplay');
  const totalEarnedTransfDisplay = document.getElementById('totalEarnedForTransfDisplay');
  const totalVouchers = document.getElementById('totalVouchers');
  const paymentTableBody = document.querySelector('.table-pay-body');

  $weekInput.removeEventListener('change', handleDateChange); 
  $weekInput.addEventListener('change', handleDateChange);

  async function handleDateChange(e) {

    if ($weekInput.value != "" && e.target.value <= $dateInput.value) {
      alert("La fecha final no puede ser menor o igual a la inicial.");
      $weekInput.value = ""
    } else {
      totalEarnedDisplay.innerHTML = `Total ganado: <b>$ 0.00</b>`;
      totalEarnedEfectDisplay.innerHTML = `Efectivo: <b>$ 0.00</b>`;
      totalEarnedTransfDisplay.innerHTML = `Transferencia: <b>$ 0.00</b>`;
      totalVouchers.innerHTML = `Total vales a restar: <br class="totalEarnedInfo-br"> <b class="span-red">$ 0.00</b>`;
      paymentTableBody.innerHTML = '';
  
      let startWeekDate = $dateInput.value;
      let endWeekDate = e.target.value;
      let endWeekDatePlusOne;

      if (endWeekDate) {
        const endDate = new Date(endWeekDate);
        endDate.setDate(endDate.getDate() + 1);
        endWeekDatePlusOne = endDate.toISOString().split('T')[0];
      } else {
        endWeekDatePlusOne = e.target.value;
      }
  
      const filteredBarber = dataBarbers.filter(barber => barber.Nombre ===  $barberSelect.value);
      const selectedBarber = $barberSelect.value !== 'null' ? filteredBarber[0].Id : null;
  
      await cashData(table, startWeekDate, selectedBarber, endWeekDatePlusOne);
    }

  };
};

// FILTROS PARA SECCION VOUCHERS
const addDateFilterListenerVoucher = async (table, dateInput, $barberSelect) => {
  /**
   * Hace un filtrado de los turnos mostrados en la tabla del barbero seleccionado.
   * param: table -> elemento html de la tabla en donde se visualizarán los turnos.
   * param: $barberSelect -> elemento html del selectable para elegir algun barbero.
   */

  const dataBarbers = await getBarbers();

  dateInput.removeEventListener('change', handleDateChange);
  dateInput.addEventListener('change', handleDateChange);

  async function handleDateChange(e) {
  
    let selectedDate = e.target.value;

    const filteredBarber = dataBarbers.filter(barber => barber.Nombre ===  $barberSelect.value);
    const selectedBarber = $barberSelect.value !== 'null' ? filteredBarber[0].Nombre : null;

    await vouchersRender(table, selectedDate, selectedBarber);
  }
    
};

const addBarberFilterListenerVoucher = async (table, $dateInput, $barberSelect) => {
  /**
   * Hace un filtrado de los turnos mostrados en la tabla del barbero seleccionado.
   * param: table -> elemento html de la tabla en donde se visualizarán los turnos.
   * param: $barberSelect -> elemento html del selectable para elegir algun barbero.
   */

  const dataBarbers = await getBarbers();

  $barberSelect.addEventListener('change', async (e) => {
    
    const filteredBarber = dataBarbers.filter(barber => barber.Nombre === e.target.value);
    
    let selectedDate = $dateInput.value;

    if (!filteredBarber.length > 0) {
      await vouchersRender(table, selectedDate, null)
    } else {
      await vouchersRender(table, selectedDate, filteredBarber[0].Nombre);
    }

  });
}

export {
  addBarberFilterListener,
  addDateFilterListener,
  addEndWeekFilterListner,
  addDateFilterListenerVoucher,
  addBarberFilterListenerVoucher
}