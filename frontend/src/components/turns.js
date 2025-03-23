import { turnDateEnd, getEndOfMonth } from "../utils/date.js";


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
        freq: 'daily', 
        interval: 1,
        dtstart: turn.turns.Date,
        until: getEndOfMonth(turn.turns.Date),
        byweekday: days,
      };

      return {
        id: turn.turns.Id,
        title: turn.turns.Nombre,
        start: new Date(turn.turns.Date).toISOString(),
        duration: '00:30:00', 
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
  renderTurns
}

