const mensajeError = document.getElementsByClassName("error")[0];

const $ = el => document.getElementById(el);

const loginForm = $('login-form');

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = $('user').value;
  const password = $('password').value;

  const response = await fetch('http://localhost:3001/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Nombre: username,
      Contrasena: password
    })
  });

  if (response.ok) {
    alert('Inicio de sesión exitoso');
    window.location.href = '/index.html';
  } else {
    return mensajeError.classList.toggle("escondido", false)
  };

});