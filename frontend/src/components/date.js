function parseDate(date) {
  
  /**
   * Parseamos la fecha proporcionada por fullcalendar para poder trabajarla.
   * param: date -> es la fecha de la celda seleccionada en el calendario, proporcionada por fullcalendar.
   */

  const [datePart, timePart] = date.split('T');
  const [year, month, day] = datePart.split('-');
  const [hour, minute, ] = timePart.split(":");

  const dayWithoutYear = `${month}-${day}`;
  const dateWithoutTime = `${day}/${month}/${year}`
  const timeWithoutSeconds = `${hour}:${minute}`;

  const completeDate = date;

  return {
    dayWithoutYear,
    dateWithoutTime,
    timeWithoutSeconds,
    completeDate
  }
};

const turnDateEnd = (date) => {

  /*
  ** Obtenemos la fecha fin del turno a través de un mapeo específico del horario de la misma.
  * param: date -> recibimos la fecha de inicio del turno para poder luego mapear la fecha final del mismo.
  */

  const [datePart, timePart] = date.split('T');

  const [hour, minute, ] = timePart.split(":");

  let dateHourEnd = hour;
  let dateMinutesEnd = '';

  if (minute === '00') {
    dateMinutesEnd = '30';
  } else if (minute === '30') {
    dateHourEnd = parseInt(dateHourEnd) + 1;
    dateMinutesEnd = '00';
  }

  if (dateHourEnd === 9) {
    dateHourEnd = '09'
  }

  const dateEnd = `${dateHourEnd}:${dateMinutesEnd}`;

  const completeDateEnd = `${datePart}T${dateEnd}`;

  return completeDateEnd;
  
}

export { parseDate, turnDateEnd };