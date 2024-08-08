function parseDate(date) {
    // Dividir la fecha original por el guion
    // const dateArray = date.split("-");
    // const year = dateArray[0];
    // const month = dateArray[1];
    // const day = dateArray[2];

    // const parsedDate = `${day}-${month}-${year}`;
    // return parsedDate;

    // Dividir la fecha y la hora
    const [datePart, timePart] = date.split('T');

    // Separar los componentes de la fecha
    const [, month, day] = datePart.split('-');
    // console.log(timePart)

    // Separar los componentes de la hora
    const [hour, minute, ] = timePart.split(":");

    //Formatear las variables
    const dayWithoutYear = `${month}-${day}`;
    const timeWithoutSeconds = `${hour}:${minute}`;

    //Mostrar fecha completa
    const completeDate = date
    // console.log(timeWithoutSecond)

    return {
        dayWithoutYear,
        timeWithoutSeconds,
        completeDate
    }
}

export default parseDate;