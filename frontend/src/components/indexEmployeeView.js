import calendarRender from './calendarRender.js';
import calendario from "./calendario.js";
import menu from "./menuEmployee.js";
import { modalElement } from "./modal.js";
import { logout } from './logout.js';

const indexView = (data) => {

    app.innerHTML = '';
    app.innerHTML += menu(data);
    app.innerHTML += calendario;
    app.innerHTML += modalElement;
            
    calendarRender();

    const $btnLogout = document.querySelector('#logout');
    $btnLogout.addEventListener('click', logout);
    
};

export default indexView;