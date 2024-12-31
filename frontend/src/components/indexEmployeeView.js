import { calendario, calendarRender } from './calendarRender.js';
import { menuEmployee } from "./menu.js";
import { header, closeMenu } from "./header.js";
import { modalElement } from "./modalPostTurn.js";
import { logout } from './logout.js';

import "../styles/style.css"

// param: data -> user active.
const indexView = async (data) => {

     /**
     * Renderizamos la vista del empleado
     * param: data -> user active.
     */

    const userActive = data.user.Nombre;
    const urlActive = window.location.hash;
    
    app.innerHTML = '';
    app.innerHTML += header;
    app.innerHTML += menuEmployee(userActive);

    switch (urlActive) {
        
        case '#calendario':

            app.innerHTML += calendario;
            calendarRender(modalElement, data, columnsCalendarViewTimeGrid);
            
            break;

        case '#':

            break;
    
        default:
            
            app.innerHTML += calendario;
            calendarRender(modalElement, data, columnsCalendarViewTimeGrid);

            break;

    };

    closeMenu();
    
    const $btnLogout = document.querySelector('#logout');
    $btnLogout.addEventListener('click', logout);
    
};



export default indexView;