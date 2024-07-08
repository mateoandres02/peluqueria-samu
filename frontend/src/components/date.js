function parseDate(date) {
    // Dividir la fecha original por el guion
    const dateArray = date.split("-");
    const year = dateArray[0];
    const month = dateArray[1];
    const day = dateArray[2];

    const parsedDate = `${day}-${month}-${year}`;
    return parsedDate;
}

export default parseDate;