import calendarRender from './calendarRender.js';
import calendario from "./calendario.js";
// import { menu, closeMenu } from "./menuEmployee.js"; closeMenu es para el boton de hamburguesa.
import { menu } from "./menuEmployee.js";
import { btnHamburger, closeMenu } from "./btnHamburger.js";
import { modalElement } from "./modal.js";
import { logout } from './logout.js';

const indexView = async (data) => {

    const userActive = data.user.Nombre;

    const urlActive = window.location.hash;
    
    app.innerHTML = '';
    app.innerHTML += menu(userActive);
    app.innerHTML += btnHamburger;

    switch (urlActive) {
        
        case '#admin-calendar':

            app.innerHTML += calendario;
            
            calendarRender(modalElement, data);
            
            break;

        case '#share-calendar':

            break;

        case '#generate-table':

            break;
    
        default:

            app.innerHTML += calendario;
            
            calendarRender(modalElement, data);

            break;

    };

    closeMenu();
    
    const $btnLogout = document.querySelector('#logout');
    $btnLogout.addEventListener('click', logout);
    
};



export default indexView;