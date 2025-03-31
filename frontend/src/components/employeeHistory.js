import { getToday, parseDate } from "../utils/date";
import { getPaymentUsersById, getTurnsByWeekAndBarber, getTurnsFilteredByBarber, getTurnsFilteredByDateAndBarber, getVouchersFilteredByBarber } from "./requests";

import "../styles/employeeHistory.css"

const today = getToday();

const containerEmployeeHistory = `<div class="containerEmployeeHistory containerFunctionalityView"></div>`;

const infoSectionEmployeeHistory = `
  <div class="present-container">
    <h2>Historial de trabajo</h2>
    <p>Visualiza un historial acerca de tu trabajo realizado en la barbería.</p>
    <div class="present-container-filters">
      <div class="present-container-filter">
        <span>Fecha Inicio</span>
        <input type="date" id="filterDateInputEmployeeHistory" value="${today}">
      </div>
      <div class="present-container-filter">
        <span>Fecha Fin</span>
        <input type="date" id="filterWeekInputEmployeeHistory">
      </div>
    </div>
  </div>
`;

const infoEmployeeHistory = `
  <div class="infoEmployeeHistory">
    <div class="infoEmployeeHistory-present">
      <h3>En el tiempo seleccionado...</h3>
    </div>
    <div class="infoEmployeeHistory-description">
      <div class="infoEmployeeHistory-description-cutsForServices">
        <h4>Total de cortes por servicio</h4>
        <ul>
        </ul>
      </div>
      <div class="infoEmployeeHistory-description-vouchers">
        <h4>Total de vales</h4>
        <p>
        </p>
      </div>
    </div>
    <div class="infoEmployeeHistory-footer">
    </div>
  </div>
`;

const getCutsForServices = async (dataUserActive, data, dateInput, weekInput) => {
 
  const paymentForBarber = await getPaymentUsersById(dataUserActive.user.Id);
  const valesForBarber = await getVouchersFilteredByBarber(dataUserActive.user.Nombre);
  const dataVales = await valesForBarber.json();

  const filteredTurns = data.filter(turn => turn.servicio);

  let cutsData = { services: {}, percentages: {}, vales: {}, monto_final: 0 };

  for (const turn of filteredTurns) {

    const price = turn.precio || 0;
    const nameService = turn.servicio;

    if (!paymentForBarber.message) {
      paymentForBarber.forEach((item) => {
        if (!cutsData.percentages[item.servicio]) {
          cutsData.percentages[item.servicio] = item.porcentaje_pago || 50;
        }
      })        
    }

    cutsData.vales = { cantidad_vales: 0, total_vales_por_date: 0 }

    if (!dataVales.message) {
      dataVales.forEach((item) => {
        const { datePart } = parseDate(item.FechaCreacion);

        if ((!weekInput && datePart == dateInput) || (datePart >= dateInput && datePart <= weekInput)) {
          cutsData.vales.total_vales_por_date += item.CantidadDinero;
          cutsData.vales.cantidad_vales += 1;
        }
        
      });
    }

    if (!cutsData.services[nameService]) {
      cutsData.services[nameService] = { total_ganado: 0, total_cobrado: 0, cantidad_cortes_realizados: 0 };
    }
    cutsData.services[nameService].total_ganado += price;
    cutsData.services[nameService].total_cobrado += (price * (cutsData.percentages[nameService] || 50)) / 100;
    cutsData.services[nameService].cantidad_cortes_realizados += 1;
    
    cutsData.monto_final += (price * (cutsData.percentages[nameService] || 50)) / 100;
  }

  const $textCutsForServices = document.querySelector('.infoEmployeeHistory-description-cutsForServices ul');
  $textCutsForServices.innerHTML = '';
  const $textVales = document.querySelector('.infoEmployeeHistory-description-vouchers p');
  $textVales.innerHTML = '';
  const $textFooter = document.querySelector('.infoEmployeeHistory-footer');
  $textFooter.innerHTML = '';

  Object.keys(cutsData.services).forEach((barberData) => {
    
    const serviceName = barberData;
    const serviceData = cutsData.services[serviceName];
    const $li = document.createElement('li');

    let messageCutsForServices = '';
    if (serviceData.cantidad_cortes_realizados === 1) {
      messageCutsForServices = `Realizaste <b>${serviceData.cantidad_cortes_realizados}</b> vez este tipo de servicio, generando un total de <b> $ ${serviceData.total_ganado}</b>, cobrando <b> $ ${serviceData.total_cobrado} </b> por ello.`;
    };
    if (serviceData.cantidad_cortes_realizados > 1) {
      messageCutsForServices = `Realizaste <b>${serviceData.cantidad_cortes_realizados}</b> veces este tipo de servicio, generando un total de <b> $ ${serviceData.total_ganado}</b>, cobrando <b> $ ${serviceData.total_cobrado} </b> por ello.`;
    };
    if (serviceData.cantidad_cortes_realizados === 0) {
      messageCutsForServices = 'No tuviste cortes.';
    };

    $li.innerHTML = `
      <p>
        <span><b>${serviceName}</b>: ${messageCutsForServices} </span>
      </p>
    `;
    
    $textCutsForServices.appendChild($li);

  });

  let messageForVales = '';
  if (cutsData.vales.cantidad_vales === 1) {
    messageForVales = `Retiraste <b>${cutsData.vales.cantidad_vales}</b> vale por la cantidad de <b>$ ${cutsData.vales.total_vales_por_date}</b>.`;
  };
  if (cutsData.vales.cantidad_vales > 1) {
    messageForVales = `Retiraste <b>${cutsData.vales.cantidad_vales}</b> vales por un total de <b>$ ${cutsData.vales.total_vales_por_date}</b>.`;
  };
  if (cutsData.vales.cantidad_vales === 0) {
    messageForVales = 'No realizaste vales.';
  };

  $textVales.innerHTML = `
    <p>
      ${messageForVales}
    </p>
  `;

  const monto_final = parseInt(cutsData.monto_final) - parseInt(cutsData.vales.total_vales_por_date)

  $textFooter.innerHTML = `
    <h4>
      Por lo tanto, tus ganancias son de: <b>$ ${monto_final}</b>.
    </h4>
  `;

  if (filteredTurns.length === 0) {
    $textCutsForServices.innerHTML = 'No hay registros.';
    $textVales.innerHTML = 'No hay registros.';
    $textFooter.innerHTML = '';   
  }

}

const showData = (dataUserActive, dataTurns, dataRecurrentTurns, dateInput, weekInput) => {

  let finalArrayOfTurns = [];
  
  let dataTurnsConcats = [...dataTurns, ...dataRecurrentTurns];

  
  dataTurnsConcats.forEach((user) => {
    
    if (!finalArrayOfTurns.some(registro => registro.turns.Id === user.turns.Id && registro.date === user.date)) {
      finalArrayOfTurns.push(user);
    } else {
      return;
    }
    
  })
  
  getCutsForServices(dataUserActive, finalArrayOfTurns, dateInput, weekInput);

}

const cutData = async (dataUserActive, selectedDate = null, endWeekDate = null) => {

  try {
    const dateParam = selectedDate ? `${selectedDate}` : today;
    const endDateParam = endWeekDate ? `${endWeekDate}` : null;
    const barberParam = dataUserActive.user.Id;

    let responseTurns;
    let responseRecurrentTurns;
    let recurrent = false;

    const $textCutsForServices = document.querySelector('.infoEmployeeHistory-description-cutsForServices ul');
    const $textVales = document.querySelector('.infoEmployeeHistory-description-vouchers p');
    const $textFooter = document.querySelector('.infoEmployeeHistory-footer');

    if (endDateParam !== null && dateParam !== null && barberParam !== null) {
      responseTurns = await getTurnsByWeekAndBarber(dateParam, endDateParam, barberParam, recurrent = false);
      responseRecurrentTurns = await getTurnsByWeekAndBarber(dateParam, endDateParam, barberParam, recurrent = true);
    } else if (endDateParam === null && barberParam !== null && dateParam !== null) {
      responseTurns = await getTurnsFilteredByDateAndBarber(dateParam, barberParam, recurrent = false);
      responseRecurrentTurns = await getTurnsFilteredByDateAndBarber(dateParam, barberParam, recurrent = true);
    } else if (endDateParam === null && barberParam !== null && dateParam === null) {
      responseTurns = await getTurnsFilteredByBarber(barberParam, recurrent = false);
      responseRecurrentTurns = await getTurnsFilteredByBarber(barberParam, recurrent = true);
    }

    if (!responseTurns.ok && !responseRecurrentTurns.ok) {
      $textCutsForServices.innerHTML = 'No existen registros.';
      $textVales.innerHTML = 'No existen registros.';
      $textFooter.innerHTML = '';
      return;
    } else {

      let dataRecurrentTurns = await responseRecurrentTurns.json();
      let dataTurns = await responseTurns.json();

      if (
          (dataTurns.message && dataRecurrentTurns.message) || 
          (dataTurns.length <= 0 && dataRecurrentTurns.length <= 0)
        ) {

          $textCutsForServices.innerHTML = 'No existen registros.';
          $textVales.innerHTML = 'No existen registros.';
          $textFooter.innerHTML = '';

      } else if ((dataTurns.message && !dataRecurrentTurns.message) || (dataTurns.length <= 0 && dataRecurrentTurns.length > 0))  {
        showData(dataUserActive, dataTurns = [], dataRecurrentTurns, dateParam, endDateParam);
      } else if ((!dataTurns.message && dataRecurrentTurns.message) || (dataTurns.length > 0 && dataRecurrentTurns.length <= 0)) {
        showData(dataUserActive, dataTurns, dataRecurrentTurns = [], dateParam, endDateParam);
      } else {
        showData(dataUserActive, dataTurns, dataRecurrentTurns, dateParam, endDateParam);
      }

    }

  } catch (error) {
    alert('Error al cargar la tabla con los turnos.');
  }
  
};

export {
  containerEmployeeHistory,
  infoSectionEmployeeHistory,
  cutData,
  infoEmployeeHistory
}