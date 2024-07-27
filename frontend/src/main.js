import checkAuthentication from "./components/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

// El evento popstate te permite detectar cuando el usuario navega a una entrada diferente en el historial del navegador
window.addEventListener('popstate', () => {
    
    // Cuando el usuario navegue con las flechas, preguntamos si es un usuario autorizado.
    checkAuthentication();

});