import { login } from "./requests"

const mensajeError = document.getElementsByClassName("error")[0];
const $loader = document.querySelector('.login-loader-container');

document.getElementById('login-form').addEventListener('submit', async (event) => {

    event.preventDefault();

    $loader.style.display = "flex";

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await login(username, password);
    
    if (response.ok) {
        setTimeout(() => {
            history.replaceState(null, '', '/');
            window.location.href = '/';
        }, 3000);
    } 

    if (!response.ok) {
        $loader.style.display = "none";

        console.log("error en el la peticion del login", response)
        mensajeError.classList.toggle("escondido", false);

        setTimeout(() => {
            mensajeError.classList.toggle("escondido");
        }, 2500);
    }

});
