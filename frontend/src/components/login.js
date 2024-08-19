const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById('login-form').addEventListener('submit', async (event) => {

    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // const response = await fetch('https://peluqueria-invasion-backend.vercel.app/login', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json', 
    //     },
    //     body: JSON.stringify({ Nombre: username, Contrasena: password }),
    //     credentials: 'include',
    // });
    const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ Nombre: username, Contrasena: password }),
        credentials: 'include',
    });

    if (response.ok) {
        history.replaceState(null, '', '/');
        window.location.href = '/';
    } 

    if (!response.ok) {
        return mensajeError.classList.toggle("escondido", false);
    }

});