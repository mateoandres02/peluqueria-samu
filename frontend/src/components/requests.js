const getTurnsByUserActive = async (data) => {

    /** 
     * Obtenemos los turnos normales del usuario activo 
     * param: data -> de acá sacamos la información necesaria para saber el id del usuario activo.
     */ 
  
    //const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/barber/${data.user.Id}`, { credentials: 'include' });
    const response = await fetch(`http://localhost:3001/turns/barber/${data.user.Id}`);
    const turns = await response.json();
  
    return turns;
}

const getRecurrentTurnsByUserActive = async (data) => {

    /**
     * Obtenemos los turnos recurrentes del usuario activo 
     * param: data -> de acá sacamos la información necesaria para saber el id del usuario activo.
     */
  
    //const responseRecurrentsTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/${data.user.Id}`, { credentials: 'include' });
    const responseRecurrentsTurns = await fetch(`http://localhost:3001/recurrent_turns/${data.user.Id}`);
    const recurrentTurns = await responseRecurrentsTurns.json();
  
    return recurrentTurns;
}

const getBarbers = async () => {

    /**
     * Obtenemos los barberos disponibles en nuestro sistema.
     */
  
    //const barbers = await fetch('https://peluqueria-invasion-backend.vercel.app/users', { credentials: 'include' });
    const barbers = await fetch('http://localhost:3001/users');
    const dataBarbers = await barbers.json();
    return dataBarbers;
}

const getBarberById = async (id) => {
  //const barber = await fetch(`https://peluqueria-invasion-backend.vercel.app/users/${id}`, { credentials: 'include' });
  const barber = await fetch(`http://localhost:3001/users/${id}`);
  const dataBarber = await barber.json();
  return dataBarber;
}

const getServices = async () => {

    /**
     * Obtenemos los servicios a través de una solicitud al backend.
     */
    
    //const responseCutServices = await fetch("https://peluqueria-invasion-backend.vercel.app/cutservices", { credentials: 'include' });
    const responseCutServices = await fetch("http://localhost:3001/cutservices");
    const cutServices = await responseCutServices.json();
    return cutServices;
}

const getTurnsFilteredByDateAndBarber = async (dateParam, barberParam, recurrent) => {

    /**
     * Obtenemos los turnos filtrando por fecha y por barbero.
     * param: dateParam -> fecha elegida.
     * param: barberParam -> barbero elegido.
     * param: recurrent -> un parámetro por defecto para diferenciar si es filtrado por recurrencia o por turnos normales.
     */
  
    if (recurrent) {
      //const responseRecurrentTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/${barberParam}/${dateParam}`, { credentials: 'include' });
      const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/${barberParam}/${dateParam}`);
      return responseRecurrentTurns;
    } else {
      //const responseTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/${dateParam}/${barberParam}`, { credentials: 'include' });
      const responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}/${barberParam}`);
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
      //const responseRecurrentTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/turn/date/${dateParam}`, { credentials: 'include' });
      const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/turn/date/${dateParam}`);
      return responseRecurrentTurns;
    } else {
      //const responseTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/${dateParam}`, { credentials: 'include' });
      const responseTurns = await fetch(`http://localhost:3001/turns/${dateParam}`);
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
      //const responseRecurrentTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/${barberParam}`, { credentials: 'include' });
      const responseRecurrentTurns = await fetch(`http://localhost:3001/recurrent_turns/${barberParam}`);
      return responseRecurrentTurns;
    } else {
      //const responseTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/barber/${barberParam}`, { credentials: 'include' });
      const responseTurns = await fetch(`http://localhost:3001/turns/barber/${barberParam}`);
      return responseTurns;
    }
}

const getPaymentUsersById = async (id) => {
  //const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/paymentusers/${id}`, { credentials: 'include' });
  const response = await fetch(`http://localhost:3001/paymentusers/${id}`);
  const dataBarber = await response.json();
  return dataBarber;
}

const getTurnsHistoryFilteredByDateAndBarber = async (dateParam, barberParam) => {
  //const responseHistoryturns = await fetch(`https://peluqueria-invasion-backend.vercel.app/history_turns/${dateParam}/${barberParam}`, { credentials: 'include' });

  const responseHistoryturns = await fetch(`http://localhost:3001/historyturns/${dateParam}/${barberParam}`);

  return responseHistoryturns;
  
}

const getTurnsHistoryFilteredByDate = async (dateParam) => {
  //const responseHistoryturns = await fetch(`https://peluqueria-invasion-backend.vercel.app/history_turns/${dateParam}`, { credentials: 'include' });

  const responseHistoryturns = await fetch(`http://localhost:3001/historyturns/${dateParam}`);

  return responseHistoryturns;
}

const getTurnsHistoryFilteredByBarber = async (barberParam) => {
  //const responseHistoryturns = await fetch(`https://peluqueria-invasion-backend.vercel.app/history_turns/${barberParam}`, { credentials: 'include' });

  const responseHistoryturns = await fetch(`http://localhost:3001/historyturns/barber/${barberParam}`);

  return responseHistoryturns;
}

export {
    getTurnsByUserActive,
    getRecurrentTurnsByUserActive,
    getBarbers,
    getBarberById,
    getServices,
    getTurnsFilteredByDateAndBarber,
    getTurnsFilteredByDate,
    getTurnsFilteredByBarber,
    getPaymentUsersById,
    getTurnsHistoryFilteredByDateAndBarber,
    getTurnsHistoryFilteredByDate,
    getTurnsHistoryFilteredByBarber
}