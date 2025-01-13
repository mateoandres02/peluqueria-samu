import { parseDate } from "./date";

const sortArrayByDate = (array) => {
  
  /**
   * Ordenamos los turnos por hora (de forma ascendente).
   * param: array -> un array que queremos ordenar de forma ascendente por hora. debe de tener un campo de hora.
   */

  array.sort((a, b) => {

    const dateA = a.date ? parseDate(a.date).completeDate : '';
    const dateB = b.date ? parseDate(b.date).completeDate : '';
    
    if (dateA && dateB) {
      return new Date(dateA) - new Date(dateB);
    }
    return 0;
  });

}


const sortArrayByHour = (array) => {
  
  /**
   * Ordenamos los turnos por hora (de forma ascendente).
   * param: array -> un array que queremos ordenar de forma ascendente por hora. debe de tener un campo de hora.
   */

  array.sort((a, b) => {
    const dateA = a.date ? parseDate(a.date).timeWithoutSeconds : '';
    const dateB = b.date ? parseDate(b.date).timeWithoutSeconds : '';
    
    if (dateA && dateB) {
      return new Date(`1970-01-01T${dateA}`) - new Date(`1970-01-01T${dateB}`);
    }
    return 0;
  });

}


export {
  sortArrayByDate,
  sortArrayByHour
}