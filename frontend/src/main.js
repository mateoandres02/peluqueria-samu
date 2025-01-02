import checkAuthentication from "./components/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

window.addEventListener('popstate', () => {
    checkAuthentication();
});