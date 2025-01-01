import { closeActiveSession } from "./requests";

export const logout = async () => {
    try {
<<<<<<< HEAD
        //const response = await fetch('https://peluqueria-invasion-backend.vercel.app/logout', {
        //   method: 'POST',
        //   credentials: 'include'
        //});
        const response = await fetch('http://localhost:3001/logout', {
             method: 'POST',
             credentials: 'include'
         });
=======
        const response = await closeActiveSession();
>>>>>>> 0f81250e2fe4e644a30a896143c2259bae6b7e8b
    
        if (response.ok) {
            history.replaceState(null, '', '/login.html');
            history.pushState(null, '', '/login.html');
            window.location.href = '/login.html';
        };
    } catch (error) {
        console.error(error)
    }
};
