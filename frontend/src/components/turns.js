import { turnDateEnd } from "./date.js";


const getRecurrentTurnsByUserActive = async (data) => {

  /**
   * Obtenemos los turnos recurrentes del usuario activo 
   * param: data -> de acá sacamos la información necesaria para saber el id del usuario activo.
   */

  const responseRecurrentsTurns = await fetch(`https://peluqueria-invasion-backend.vercel.app/recurrent_turns/${data.user.Id}`);
  // const responseRecurrentsTurns = await fetch(`http://localhost:3001/recurrent_turns/${data.user.Id}`);
  const recurrentTurns = await responseRecurrentsTurns.json();

  return recurrentTurns;
}

const getTurnsByUserActive = async (data) => {

  /** 
   * Obtenemos los turnos normales del usuario activo 
   * param: data -> de acá sacamos la información necesaria para saber el id del usuario activo.
   */ 

  const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/barber/${data.user.Id}`);
  // const response = await fetch(`http://localhost:3001/turns/barber/${data.user.Id}`);
  const turns = await response.json();

  return turns;
}

const getEndOfMonth = (startDate) => {

  /**
   * Obtenemos el ultimo dia del mes para que no se haga una inserción masiva de registros en la base de datos con los turnos recurrentes.
   * param: startDate -> es la fecha inicial del turno.
   */

  const date = new Date(startDate);
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

const renderTurns = async (turns, recurrentTurns) => {

  /*
  ** Mapeamos los turnos en un array para poder renderizarlos en el calendario a través de la propiedad events de la librería full calendar.
  * param: turns -> array de turnos normales del usuario activo.
  * param: recurrentTurns -> array de turnos recurrentes del usuario activo.
  */

  const arrayTurns = turns.map(turn => {

    const dateEnd = turnDateEnd(turn.turns.Date);
    let days = [];
    let exdates = [];

    if (turn.turns.Regular === 'true') {
      // Obtenemos solo los días correspondientes a este turno
      const turnoRecurrente = recurrentTurns[turn.turns.Id]; // Usamos el ID del turno para obtener sus días.
      
      if (turnoRecurrente) {
        turnoRecurrente.forEach(day => {
          // En el array de days pusheamos los dias pertenecientes a ese turno.
          if (day.exdate == 1) {
            exdates.push(day.date)
          }
          if (!days.includes(day.dia)) {
            days.push(day.dia);
          }
        });
      }

      const rruleConfig = {
        freq: 'daily', // Frecuencia de repetición
        interval: 1, // Cada 1 semana
        dtstart: turn.turns.Date, // Fecha inicial
        until: getEndOfMonth(turn.turns.Date), // Fecha final (último día del mes)
        byweekday: days,  // Días de repetición para este turno
      };

      return {
        id: turn.turns.Id,
        title: turn.turns.Nombre,
        start: new Date(turn.turns.Date).toISOString(),
        duration: '00:30:00', // Duración
        color: 'gray',
        className: 'fixed-turn-event',
        extendedProps: {
          telefono: turn.turns.Telefono,
          regular: turn.turns.Regular,
          end: new Date(dateEnd).toISOString(),
        },
        exdate: exdates,
        rrule: rruleConfig,
      };
    }

    return {
      id: turn.turns.Id,
      title: turn.turns.Nombre,
      start: turn.turns.Date,
      end: dateEnd,
      className: 'normal-turn',
      extendedProps: {
        telefono: turn.turns.Telefono,
        regular: turn.turns.Regular,
        end: dateEnd
      }

    };
  });

  return arrayTurns;
};


export {
  getRecurrentTurnsByUserActive,
  getTurnsByUserActive,
  renderTurns
}

