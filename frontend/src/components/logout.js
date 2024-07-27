export const logout = async () => {

    try {

        const response = await fetch('http://localhost:3001/logout', {
            method: 'POST',
            credentials: 'include'
        });
    
        if (response.ok) {
            window.location.href = '/login.html';
        };
        
    } catch (error) {
        console.error(error)
    }

};