import calendarRender from './components/calendarRender.js';
import calendario from "./components/calendario.js";
import menu from "./components/menu.js";
import { modalElement } from "./components/modal.js"

document.addEventListener('DOMContentLoaded', () => {

    const app = document.getElementById('app');

    async function checkAuthentication() {

        try {
            
            const response = await fetch('http://localhost:3001/verify-token', { credentials: 'include' });

            if (!response.ok) {

                window.location.href = '/login.html';

            } else {

                app.innerHTML = '';
                app.innerHTML += menu;
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
            
            } 

        } catch (error) {

            window.location.href = '/login.html';
            
        };
    };

    checkAuthentication();

});