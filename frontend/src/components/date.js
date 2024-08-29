function parseDate(date) {
    const [datePart, timePart] = date.split('T');
    const [, month, day] = datePart.split('-');
    const [hour, minute, ] = timePart.split(":");

    const dayWithoutYear = `${month}-${day}`;
    const timeWithoutSeconds = `${hour}:${minute}`;

    const completeDate = date;

    return {
        dayWithoutYear,
        timeWithoutSeconds,
        completeDate
    }
};

const turnDateEnd = (date) => {
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