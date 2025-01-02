import { closeActiveSession } from "./requests";

export const logout = async () => {
    try {
        const response = await closeActiveSession();
    
        if (response.ok) {
            // Eliminar el token de localStorage
            localStorage.removeItem('accessToken');

            history.replaceState(null, '', '/login.html');
            history.pushState(null, '', '/login.html');
            window.location.href = '/login.html';
        };

    } catch (error) {
        console.error(error)
    }
};
