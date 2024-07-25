document.getElementById('login-form').addEventListener('submit', async (event) => {
    
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ Nombre: username, Contrasena: password }),
        credentials: 'include',
    });

    const data = await response.json();
    
    if (response.ok) {

        window.location.href = '/';

    } else {

        alert(data.message);
    }

});
  