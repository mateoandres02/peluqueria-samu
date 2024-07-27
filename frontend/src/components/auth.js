import renderIndexAdmin from "./indexAdminView.js";
import renderIndexEmployee from "./indexEmployeeView.js";

export default async function checkAuthentication() {

    try {
        
        const response = await fetch('http://localhost:3001/verify-token', { credentials: 'include' });
        
        if (!response.ok) {
            window.location.href = '/login.html';
        } else {

            // Leemos el cuerpo de la respuesta, en el cual recibimos el usuario logueado.
            const data = await response.json(); 

            if (data.user.Rol === "Empleado") {
                renderIndexEmployee(data.user.Nombre);
            } else if (data.user.Rol === "Admin") {
                renderIndexAdmin(data.user.Nombre);
            }
            
        } 

    } catch (error) {
        window.location.href = '/login.html';
    };

};