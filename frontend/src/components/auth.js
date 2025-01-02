import renderIndexAdminView from "./indexAdminView.js";
import renderIndexEmployeeView from "./indexEmployeeView.js";
import { getUserActive } from "./requests.js";

export default async function checkAuthentication() {
  
  const response = await getUserActive();

  // Si la respuesta no es válida o el token es inválido, redirigir al login
  if (!response || !response.ok || response.status === 401) {
    console.log('response', response)
    // window.location.href = '/login';
  } else {
    const data = await response.json(); 

    // Dependiendo del rol, renderizamos la vista correspondiente
    if (data.user.Rol === "Empleado") {
      await renderIndexEmployeeView(data);
    } else if (data.user.Rol === "Admin") {
      await renderIndexAdminView(data);
    }
  } 
}
