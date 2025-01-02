import checkAuthentication from "./components/auth.js";

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthentication();
});

window.addEventListener('popstate', () => {
    checkAuthentication();
});