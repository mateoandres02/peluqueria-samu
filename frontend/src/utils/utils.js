const getWidthDisplay = () => {

  /**
   * Determina la vista inicial y los días visibles según el ancho de la pantalla.
   */

  const innerWidth = window.innerWidth;

  return {
    days: innerWidth <= 640 ? 3 : 7,
    isMobile: innerWidth <= 640,
  };

};

const getCookie = async (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export {
  getWidthDisplay,
  getCookie
}