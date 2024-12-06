import { turnDateEnd } from "./date.js";

// Renderizamos los turnos del usuario activo.

// Obtenemos todos los turnos del usuario activo.
const getTurnsByUserActive = async (data) => {
  // const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/barber/${data.user.Id}`);
  const response = await fetch(`http://localhost:3001/turns/barber/${data.user.Id}`);
  const turns = await response.json();

  return turns;
}

const getEndOfMonth = (startDate) => {
  // con esta función obtenemos el ultimo dia del mes, para que si el cliente es regular, la gestión de turnos recurrentes dure solo el mes actual en el que se genera el turno.
  // esto lo necesitamos para no hacer inserciones masivas en la base de datos.
  const date = new Date(startDate);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const renderTurns = async (turns) => {

  // Mapeamos los turnos en un arreglo
  const arrayTurns = turns.map(turn => {

    const dateEnd = turnDateEnd(turn.turns.Date);

    if (turn.turns.Regular === "true") {
      const rruleConfig = {
        freq: 'weekly', // esta propiedad es la frecuencia de repetición. daily, weekly, monthly
        interval: 1, // el intervalo sería cada 1 semana en este caso
        dtstart: turn.turns.Date, // es la date inicial, es la que ponemos cuando se crea el turno.
        until: getEndOfMonth(turn.turns.Date), // el until sería la fecha final de la recurrencia. pongo el ultimo dia del mes para que no se generen inserciones en la base de datos masivamente.
        byweekday: ['mo', 'fr']  // esto hay que cambiarlo por una selección manual de samu
      };

      return {
        id: turn.turns.Id,
        title: turn.turns.Nombre,
        start: turn.turns.Date,
        duration: '00:30:00', // es la duración de cada turno, pongo media hora porque es la que estaba plasmada desde un principio.
        color: 'gray', 
        extendedProps: {
          telefono: turn.turns.Telefono,
          regular: turn.turns.Regular,
          end: dateEnd
        },
        rrule: rruleConfig,
      };
    }
  
    return {
      id: turn.turns.Id,
      title: turn.turns.Nombre,
      start: turn.turns.Date,
      end: dateEnd,
      extendedProps: {
        telefono: turn.turns.Telefono,
        regular: turn.turns.Regular,
        end: dateEnd
      }
    };
    
  });

  return arrayTurns;
}

export {
  getTurnsByUserActive,
  renderTurns
}

