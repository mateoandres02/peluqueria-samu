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

export {
  getWidthDisplay,
}