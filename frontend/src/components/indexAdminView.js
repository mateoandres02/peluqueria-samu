import calendarRender from './calendarRender.js';
import calendario from "./calendario.js";
import menu from "./menuAdmin.js";
import { modalElement } from "./modal.js";
import { logout } from './logout.js';
import { registerEmployee, usersData, postEmployeeView } from './postEmployee.js';

const indexView = async (user) => {

    const urlActive = window.location.hash;

    app.innerHTML = '';
    app.innerHTML += menu(user);
    
    switch (urlActive) {
        case '#admin-calendar':
            
            app.innerHTML += calendario;
            app.innerHTML += modalElement;
            
            calendarRender();
            
            break;
        
        case '#cash-register':

            break;

        case '#share-calendar':

            break;
        
        case '#manage-barbers':

            app.innerHTML += postEmployeeView;

            let containerPostEmployee = document.querySelector('.container-postEmployee');

            containerPostEmployee.insertAdjacentHTML('beforeend', registerEmployee);

            const tableEmployees = await usersData();

            if (tableEmployees) {
                containerPostEmployee.insertAdjacentHTML('beforeend', tableEmployees);
            }

            break;

        case '#generate-table':

            break;
    
        default:

            app.innerHTML += calendario;
            app.innerHTML += modalElement;
            
            calendarRender();

            break;

    };

    const $btnLogout = document.querySelector('#logout');
    $btnLogout.addEventListener('click', logout);

};

export default indexView;