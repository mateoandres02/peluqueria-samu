import { turnDateEnd } from "./date.js";

// Renderizamos los turnos del usuario activo.

// Obtenemos todos los turnos del usuario activo.
const getTurnsByUserActive = async (data) => {
  // const response = await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/barber/${data.user.Id}`);
  const response = await fetch(`http://localhost:3001/turns/barber/${data.user.Id}`);
  const turns = await response.json();

  return turns;
}

const renderTurns = async (turns) => {

  // Mapeamos los turnos en un arreglo
  const arrayTurns = turns.map(turn => {
    const dateEnd = turnDateEnd(turn.turns.Date);
  
    return {
      id: turn.turns.Id,
      title: turn.turns.Nombre,
      start: turn.turns.Date,
      end: dateEnd,
      extendedProps: {
        telefono: turn.turns.Telefono
      }
    };
    
  });

  return arrayTurns;
}

export {
  getTurnsByUserActive,
  renderTurns
}

