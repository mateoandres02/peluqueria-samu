export const logout = async () => {
    try {
        const response = await fetch('https://peluqueria-invasion-backend.vercel.app/logout', {
           method: 'POST',
           credentials: 'include'
        });
        // const response = await fetch('http://localhost:3001/logout', {
        //     method: 'POST',
        //     credentials: 'include'
        // });
    
        if (response.ok) {
            history.replaceState(null, '', '/login.html');
            history.pushState(null, '', '/login.html');
            window.location.href = '/login.html';
        };
    } catch (error) {
        console.error(error)
    }
};
