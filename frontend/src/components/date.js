function parseDate(date) {
  
  /**
   * Parseamos la fecha proporcionada por fullcalendar para poder trabajarla.
   * param: date -> es la fecha de la celda seleccionada en el calendario, proporcionada por fullcalendar.
   */

  const [datePart, timePart] = date.split('T');
  const [year, month, day] = datePart.split('-');
  const [hour, minute, seconds] = timePart.split(":");

  const dayWithoutYear = `${month}-${day}`;
  const dateWithoutTime = `${day}/${month}/${year}`
  const timeWithoutSeconds = `${hour}:${minute}`;
  const timeOfTurn = `${hour}:${minute}:${seconds}`;
  const completeDate = date;
  const dayWithoutYearParsed = `${day}/${month}`;

  return {
    dayWithoutYear,
    dateWithoutTime,
    timeWithoutSeconds,
    timeOfTurn,
    completeDate,
    dayWithoutYearParsed
  }
};

const reformatDate = (date) => {

  /**
   * Reformateamos la fecha de yyyy-dd-mm a dd-mm-yyyy
   * param: date -> fecha en formato yyyy-dd-mm
   */

  const [year, month, day] = date.split('-');
  const dateReformated = `${day}/${month}/${year}`;
  return dateReformated;
}

const addHourOfStartDate = (dateWithoutTime, timeOfTurn) => {

  /**
   * Agregamos la hora del turno a la fecha en formato yyyy-dd-mm para poder guardarla bien en la base de datos y poder trabajar correctamente con rrule.
   * param: dateWithoutTime -> fecha sin horario.
   * param: timeOfTurn -> el horario del turno.
   */
  
  const completeDate = `${dateWithoutTime}T${timeOfTurn}`;
  return completeDate;
}

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

const getEndOfMonth = (startDate) => {

  /**
   * Obtenemos el ultimo dia del mes para que no se haga una inserción masiva de registros en la base de datos con los turnos recurrentes.
   * param: startDate -> es la fecha inicial del turno.
   */

  const date = new Date(startDate);
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

const getToday = () => {

  /**
   * Obtiene la fecha del día actual para poder aplicar el filtro.
   * Retorna la fecha formateada.
   */

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const formattedDate = today.toISOString().split('T')[0];
  return formattedDate;
}

export { 
  parseDate, 
  addHourOfStartDate, 
  reformatDate, 
  turnDateEnd, 
  getEndOfMonth, 
  getToday
};