import { getWidthDisplay } from './calendarRender.js';
import { calendarRender } from './calendarRender.js';
import calendario from "./calendario.js";
import { menu } from "./menuEmployee.js";
import { header, closeMenu } from "./btnHamburger.js";
import { modalElement } from "./modalPostTurn.js";
import { logout } from './logout.js';

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
    app.innerHTML += menu(userActive);

    let columnsCalendarViewTimeGrid;
    columnsCalendarViewTimeGrid = getWidthDisplay();

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