import renderIndexAdminView from "./indexAdminView.js";
import renderIndexEmployeeView from "./indexEmployeeView.js";

export default async function checkAuthentication() {
    try {

        const response = await fetch('https://peluqueria-invasion-backend.vercel.app/verify-token', { credentials: 'include' });
        //  const response = await fetch('http://localhost:3001/verify-token', { credentials: 'include' });

        if (!response.ok || response.status === 401) {
            window.location.href = '/login';
        } else {
          
            const data = await response.json(); 

            if (data.user.Rol === "Empleado") {
                await renderIndexEmployeeView(data);
            } else if (data.user.Rol === "Admin") {
                await renderIndexAdminView(data);
            }

        } 

    } catch (error) {
        window.location.href = '/login';
    };

};
