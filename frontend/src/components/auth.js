import renderIndexAdminView from "./indexAdminView.js";
import renderIndexEmployeeView from "./indexEmployeeView.js";
import { getUserActive } from "./requests.js";

export default async function checkAuthentication() {
  
  const response = await getUserActive();

  if (!response || !response.ok || response.status === 401) {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else {
    const data = await response.json(); 

    if (data.user.Rol === "Empleado") {
      await renderIndexEmployeeView(data);
    } else if (data.user.Rol === "Admin") {
      await renderIndexAdminView(data);
    }
  };
  
}