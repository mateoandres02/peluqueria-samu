import renderIndexAdmin from "./components/indexAdminView.js";
import renderIndexEmployee from "./components/indexEmployeeView.js";

document.addEventListener('DOMContentLoaded', () => {

    const app = document.getElementById('app');

    async function checkAuthentication() {

        try {
            
            const response = await fetch('http://localhost:3001/verify-token', { credentials: 'include' });

            console.log(response);
            
            if (!response.ok) {
                
                window.location.href = '/login.html';
                
            } else {

                // Leemos el cuerpo de la respuesta, en el cual recibimos el usuario logueado.
                const data = await response.json(); 
                console.log(data);
                console.log(data.user);

                if (data.user.Rol === "Empleado") {
                    console.log(window)
                    renderIndexEmployee(data.user.Nombre);
                } else if (data.user.Rol === "Admin") {
                    console.log(window)
                    renderIndexAdmin(data.user.Nombre);
                }
                
            } 

        } catch (error) {

            window.location.href = '/login.html';
            
        };

    };

    checkAuthentication();

});