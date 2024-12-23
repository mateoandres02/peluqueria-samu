const logActions = async (data) => {
  try {
      const response = await fetch(' http://localhost:3001/historyturns', { // Cambia la URL según tu configuración
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });
       if (!response.ok) {
          throw new Error('Error al registrar la acción: ' + response.statusText);
      }
  } catch (error) {
      console.error("Error al registrar la acción:", error.message);
  }
};
export default logActions;