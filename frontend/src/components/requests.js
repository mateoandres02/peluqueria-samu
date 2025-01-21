import { getCookie } from "../utils/utils";


const login = async (username, password) => {
  /**
   * Hace la petición de logueo.
   * param: username -> usuario que intenta loguearse.
   * param: password -> contraseña del usuario que intenta loguearse.
   */

  const response = await fetch('https://peluqueria-invasion-backend.vercel.app/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify({ Nombre: username, Contrasena: password }),
    credentials: 'include'
  });
  // const response = await fetch('http://localhost:3001/login', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json', 
  //   },
  //   body: JSON.stringify({ Nombre: username, Contrasena: password }),
  //   credentials: 'include',
  // });

  return response;

}


const closeActiveSession = async () => {

  /**
   * Procesamos el cierre de sesión.
   */

  const response = await fetch('https://peluqueria-invasion-backend.vercel.app/logout', {
    method: 'POST',
    credentials: 'include'
  });
  // const response = await fetch('http://localhost:3001/logout', {
  //   method: 'POST',
  //   credentials: 'include'
  // });

  return response;
  
}


const getUserActive = async () => {

  /**
   * Obtiene el usuario activo y su token para poder verificarlo.
   */

  try {

    const tokenFromLocalStorage = localStorage.getItem('token');
    const token = await getCookie('token');

     const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/verify-token?token=${tokenFromLocalStorage || token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': tokenFromLocalStorage || token ? `Bearer ${tokenFromLocalStorage || token}` : undefined,
          // Authorization: `Bearer ${token}`, 
        },
        credentials: 'include',
      });

    // const response = await fetch(`http://localhost:3001/verify-token?token=${tokenFromLocalStorage || token}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': tokenFromLocalStorage || token ? `Bearer ${tokenFromLocalStorage || token}` : undefined,
    //     // Authorization: `Bearer ${token}`, 
    //   },
    //   credentials: 'include',
    // });

    return response;

  } catch (error) {
    window.location.href = '/login';
  }
}


const getTurnsByUserActive = async (data) => {

  /** 
   * Obtenemos los turnos normales del usuario activo 
   * param: data -> de acá sacamos la información necesaria para saber el id del usuario activo.
   */ 

  const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/barber/${data.user.Id}`, { credentials: 'include' });
  // const response = await fetch(`http://localhost:3001/turns/barber/${data.user.Id}`);
  const turns = await response.json();

  return turns;

}


const getRecurrentTurnsByUserActive = async (data) => {

  /**
   * Obtenemos los turnos recurrentes del usuario activo 
   * param: data -> de acá sacamos la información necesaria para saber el id del usuario activo.
   */

  const responseRecurrentsTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/${data.user.Id}`, { credentials: 'include' });
  // const responseRecurrentsTurns = await fetch(`http://localhost:3001/recurrent_turns/${data.user.Id}`);
  const recurrentTurns = await responseRecurrentsTurns.json();

  return recurrentTurns;

}


const getBarbers = async () => {

  /**
   * Obtenemos los barberos disponibles en nuestro sistema.
   */

  const barbers = await fetch('https://peluqueria-invasion-backend.vercel.app/users', {credentials: 'include'});
  // const barbers = await fetch('http://localhost:3001/users');
  const dataBarbers = await barbers.json();
  return dataBarbers;

};


const putChangeService = async (rowId, turn) => {

  /**
   * Hacemos un put cada vez que hacemos un cambio de servicio a algun turno.
   * param: rowId -> id de la celda que se selecciona para hacer un cambio.
   * param: turn -> el turno que se modifica.
   */

  await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/${rowId}`, 
    { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(turn),
      credentials: 'include'
    }
  );
  // await fetch(`http://localhost:3001/turns/${rowId}`, 
  //   { 
  //     method: 'PUT', 
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(turn)
  //   }
  // );

};


const getServices = async () => {

  /**
   * Obtenemos los servicios a través de una solicitud al backend.
   */
  
  const responseCutServices = await fetch("https://peluqueria-invasion-backend.vercel.app/cutservices", {credentials: 'include'});
  // const responseCutServices = await fetch("http://localhost:3001/cutservices");
  const cutServices = await responseCutServices.json();
  return cutServices;
};


const getTurnsFilteredByDateAndBarber = async (dateParam, barberParam, recurrent) => {

  /**
   * Obtenemos los turnos filtrando por fecha y por barbero.
   * param: dateParam -> fecha elegida.
   * param: barberParam -> barbero elegido.
   * param: recurrent -> un parámetro por defecto para diferenciar si es filtrado por recurrencia o por turnos normales.
   */

  if (recurrent) {
    const responseRecurrentTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/${barberParam}/${dateParam}`, {credentials: 'include'});
    // const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/${barberParam}/${dateParam}`);
    return responseRecurrentTurns;
  } else {
    const responseTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/${dateParam}/${barberParam}`, {credentials: 'include'});
    // const responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}/${barberParam}`);
    return responseTurns;
  }

}


const getTurnsFilteredByDate = async (dateParam, recurrent) => {

  /**
   * Obtenemos los turnos filtrando por fecha.
   * param: dateParam -> fecha elegida.
   * param: recurrent -> un parámetro por defecto para diferenciar si es filtrado por recurrencia o por turnos normales.
   */

  if (recurrent) {
    const responseRecurrentTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/turn/date/${dateParam}`, {credentials: 'include'});
    // const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/turn/date/${dateParam}`);
    return responseRecurrentTurns;
  } else {
    const responseTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/${dateParam}`, {credentials: 'include'});
    // const responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}`);
    return responseTurns;
  }

}


const getTurnsFilteredByBarber = async (barberParam, recurrent) => {

  /**
   * Obtenemos los turnos filtrando por barbero.
   * param: barberParam -> barbero elegido.
   * param: recurrent -> un parámetro por defecto para diferenciar si es filtrado por recurrencia o por turnos normales.
   */

  if (recurrent) {
    const responseRecurrentTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/${barberParam}`, {credentials: 'include'});
    // const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/${barberParam}`);
    return responseRecurrentTurns;
  } else {
    const responseTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/barber/${barberParam}`, {credentials: 'include'});
    // const responseTurns = await fetch(`http://localhost:3001/turns/barber/${barberParam}`);
    return responseTurns;
  }

}


const getBarberById = async (id) => {

  /**
   * Obtenemos data del barbero seleccionado.
   * param: id -> id del barbero seleccionado.
   */

  const barber = await fetch(`https://peluqueria-invasion-backend.vercel.app/users/${id}`, {credentials: 'include'});
  // const barber = await fetch(`http://localhost:3001/users/${id}`);
  const dataBarber = await barber.json();
  return dataBarber;

}  


const getPaymentUsersById = async (id) => {

  /**
   * Obtenemos los porcentajes de pago del barbero.
   * param: id -> id del barbero.
   */
  
  const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/paymentusers/${id}`, {credentials: 'include'});
  // const response = await fetch(`http://localhost:3001/paymentusers/${id}`);
  const dataBarber = await response.json();
  return dataBarber;

}


const deleteRegularCustomer = async (id, date) => {

  /**
   * Eliminamos un cliente recurrente.
   * param: id -> id del turno recurrente.
   * param: date -> fecha del turno recurrente.
   */

  let response = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/turn/${id}/${date}`, {
    method: 'DELETE',
    credentials: 'include' 
  });
  // let response = await fetch(`http://localhost:3001/recurrent_turns/turn/${id}/${date}`, {
  //   method: 'DELETE'  
  // });

  return response;
}

const deleteNormalCustomer = async (id, date) => {

  /**
   * Eliminamos un turno normal.
   * param: id -> id del turno normal.
   * param: date -> fecha del turno normal.
   */

  let response = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/${id}/${date}`, {
   method: 'DELETE',
   credentials: 'include' 
  });
  // let response = await fetch(`http://localhost:3001/turns/${id}/${date}`, {
  //   method: 'DELETE'  
  // });

  return response;

}


const putChangePercentageService = async (id_usuario, id_service, newValue) => {

  /**
   * Hacemos un update del cambio de porcentajes de pago por servicio a un barbero.
   * param: id_usuario -> id del barbero.
   * param: id_service -> id del servicio a actualizar.
   */

  // const response = await fetch(`http://localhost:3001/paymentusers/${id_usuario}/${id_service}`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ porcentaje_pago: newValue })
  // });
  const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/paymentusers/${id_usuario}/${id_service}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ porcentaje_pago: newValue }),
    credentials: 'include'
  });

  return response;

}


const getServiceById = async (id) => {

  /**
   * Buscamos el servicio por id.
   * param: id -> id del servicio a buscar.
   */

  const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/cutservices/${id}`, {credentials: 'include'});
  // const response = await fetch(`http://localhost:3001/cutservices/${id}`);
  const data = await response.json();
  return data;

};


const popService = async (id) => {

  /**
   * Eliminamos un servicio.
   * param: id -> id del servicio a eliminar.
   */

  const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/cutservices/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  // const response = await fetch(`http://localhost:3001/cutservices/${id}`, {
  //   method: 'DELETE'
  // });

  return response;

}


const popUser = async (id) => {
  
  /**
   * Eliminamos un usuario.
   * param: id -> id del usuario a eliminar.
   */

  const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/users/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  // const response = await fetch(`http://localhost:3001/users/${id}`, {
  //   method: 'DELETE'
  // });

  return response;
}


const getTurnsHistoryFilteredByDateAndBarber = async (dateParam, barberParam) => {
  const responseHistoryturns = await fetch(`https://peluqueria-invasion-backend.vercel.app/historyturns/${dateParam}/${barberParam}`, { credentials: 'include' });

  // const responseHistoryturns = await fetch(`http://localhost:3001/historyturns/${dateParam}/${barberParam}`);

  return responseHistoryturns;
  
}

const getTurnsHistoryFilteredByDate = async (dateParam) => {
  const responseHistoryturns = await fetch(`https://peluqueria-invasion-backend.vercel.app/historyturns/${dateParam}`, { credentials: 'include' });

  // const responseHistoryturns = await fetch(`http://localhost:3001/historyturns/${dateParam}`);

  return responseHistoryturns;
}

const getTurnsHistoryFilteredByBarber = async (barberParam) => {
  const responseHistoryturns = await fetch(`https://peluqueria-invasion-backend.vercel.app/historyturns/${barberParam}`, { credentials: 'include' });

  // const responseHistoryturns = await fetch(`http://localhost:3001/historyturns/barber/${barberParam}`);

  return responseHistoryturns;
}


const getTurnsByWeek = async (startWeek, endWeek, recurrent) => {
  if (recurrent) {
    // const response = await fetch(`http://localhost:3001/recurrent_turns/week/${startWeek}/${endWeek}`);
    const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/week/${startWeek}/${endWeek}`);
    return response;
  } else {
    // const response = await fetch(`http://localhost:3001/turns/week/${startWeek}/${endWeek}`);
    const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/week/${startWeek}/${endWeek}`);
    return response;
  }
}


const getTurnsByWeekAndBarber = async (startWeek, endWeek, barberId, recurrent) => {
  if (recurrent) {
    // const response = await fetch(`http://localhost:3001/recurrent_turns/week/${startWeek}/${endWeek}/${barberId}`);
    const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/week/${startWeek}/${endWeek}/${barberId}`);
    return response;
  } else {
    // const response = await fetch(`http://localhost:3001/turns/week/${startWeek}/${endWeek}/${barberId}`);
    const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/week/${startWeek}/${endWeek}/${barberId}`);
    return response;
  }
}

const getVouchersFilteredByDateAndBarber = async (dateParam, barberParam) => {
  const responseVouchers = await fetch(`https://peluqueria-invasion-backend.vercel.app/vouchers/params/${dateParam}/${barberParam}`, { credentials: 'include' });

  // const responseVouchers = await fetch(`http://localhost:3001/vouchers/params/${dateParam}/${barberParam}`);

  return responseVouchers;
  
}

const getVouchersFilteredByDate = async (dateParam) => {
  const responseVouchers = await fetch(`https://peluqueria-invasion-backend.vercel.app/vouchers/params/${dateParam}`, { credentials: 'include' });

  // const responseVouchers = await fetch(`http://localhost:3001/vouchers/params/${dateParam}`);

  return responseVouchers;
}

const getVouchersFilteredByBarber = async (barberParam) => {
  const responseVouchers = await fetch(`https://peluqueria-invasion-backend.vercel.app/vouchers/params/barber/${barberParam}`, { credentials: 'include' });

  // const responseVouchers = await fetch(`http://localhost:3001/vouchers/params/barber/${barberParam}`);

  return responseVouchers;
}

const getVouchers = async () => {
  // const responseTurns = await fetch('http://localhost:3001/vouchers');
  const responseTurns = await fetch('https://peluqueria-invasion-backend.vercel.app/vouchers', { credentials: 'include' });

  return responseTurns;
}

const getHistoryTurns = async () => {
  // const responseTurns = await fetch('http://localhost:3001/historyturns');
  const responseTurns = await fetch('https://peluqueria-invasion-backend.vercel.app/historyturns', { credentials: 'include' });

  return responseTurns;
}

const getVoucherById = async (id) => {
  const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/vouchers/${id}`, { credentials: 'include' });
  // const response = await fetch(`http://localhost:3001/vouchers/${id}`);
  const data = await response.json();
  return data;
}


const popVoucher = async (id) => {
  const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/vouchers/${id}`, {
   method: 'DELETE',
   credentials: 'include'
  });
  
  // const response = await fetch(`http://localhost:3001/vouchers/${id}`, {
  //   method: 'DELETE'
  // });

  return response;
}


export {
  login,
  getCookie,
  closeActiveSession,
  getUserActive,
  getTurnsByUserActive,
  getRecurrentTurnsByUserActive,
  getBarbers,
  putChangeService,
  getBarberById,
  getServices,
  getTurnsFilteredByDateAndBarber,
  getTurnsFilteredByDate,
  getTurnsFilteredByBarber,
  getPaymentUsersById,
  deleteRegularCustomer,
  deleteNormalCustomer,
  putChangePercentageService,
  getServiceById,
  popService,
  popUser,
  popVoucher,
  getTurnsHistoryFilteredByDateAndBarber,
  getTurnsHistoryFilteredByDate,
  getTurnsHistoryFilteredByBarber,
  getTurnsByWeek,
  getTurnsByWeekAndBarber,
  getVouchers,
  getVouchersFilteredByDateAndBarber,
  getVouchersFilteredByDate,
  getVouchersFilteredByBarber,
  getHistoryTurns,
  getVoucherById
};
