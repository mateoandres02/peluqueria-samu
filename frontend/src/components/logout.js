import { closeActiveSession } from "./requests";
import { removeDeviceId } from "./securityValidator.js";

export const logout = async () => {
    try {
        const response = await closeActiveSession();
    
        if (response.ok) {
            // Eliminar el token de localStorage
            localStorage.removeItem('token');
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

            removeDeviceId();

            history.replaceState(null, '', '/login.html');
            history.pushState(null, '', '/login.html');
            window.location.href = '/login.html';
        };

    } catch (error) {
        console.error(error)
    }
};