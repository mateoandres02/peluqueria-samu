import renderIndexAdmin from "./components/indexAdminView.js";
import renderIndexEmployee from "./components/indexEmployeeView.js";

async function checkAuthentication() {

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

document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

// El evento popstate te permite detectar cuando el usuario navega a una entrada diferente en el historial del navegador
window.addEventListener('popstate', () => {
    
    // Cuando el usuario navegue con las flechas, preguntamos si es un usuario autorizado.
    checkAuthentication();

});