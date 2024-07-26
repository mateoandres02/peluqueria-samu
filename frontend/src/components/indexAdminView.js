import calendarRender from './calendarRender.js';
import calendario from "./calendario.js";
import menu from "./menuAdmin.js";
import { modalElement } from "./modal.js";

const indexView = (user) => {

    app.innerHTML = '';
    app.innerHTML += menu(user);
    app.innerHTML += calendario;
    app.innerHTML += modalElement;
            
    calendarRender();

    const $btnLogout = document.querySelector('#logout');

    $btnLogout.addEventListener('click', async () => {

        const response = await fetch('http://localhost:3001/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = '/login.html';
        } else {
            console.log('error al realizar el logout');
        }

    });
};

export default indexView;