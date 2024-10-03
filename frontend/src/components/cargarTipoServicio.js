// url = `http://localhost:3001/cutservices/${id}`
const cargarTipoServicio = async () => {
  tipoServicio1 = {
    "Id":1,
    "Nombre":"Corte",
    "Precio": 6000
  }
  const response = fetch(`http://localhost:3001/cutservices/${tipoServicio1.Id}`, {
    method: POST,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response)
  })
};