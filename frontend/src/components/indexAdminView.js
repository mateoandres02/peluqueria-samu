import calendarRender from './calendarRender.js';
import calendario from "./calendario.js";
import menu from "./menuAdmin.js";
import { modalElement } from "./modal.js";
import { logout } from './logout.js';
import { registerEmployee, modalRegisterEmployee, usersData, postEmployeeView } from './postEmployee.js';
import '../styles/postEmployee.css';

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
        
        case '#manage-employees':

            app.innerHTML += postEmployeeView;

            let containerPostEmployee = document.querySelector('.containerPostEmployee');

            containerPostEmployee.insertAdjacentHTML('beforeend', registerEmployee);

            const tableEmployees = await usersData();

            if (tableEmployees) {
                containerPostEmployee.insertAdjacentHTML('beforeend', tableEmployees);
            };

            containerPostEmployee.insertAdjacentHTML('beforeend', modalRegisterEmployee);
            
            const $btnPostEmployee = document.querySelector('.registerEmployee-btn');
            const $modal = document.querySelector('#postEmployee');
            
            $btnPostEmployee.addEventListener('click', () => {
                console.log('boton', $btnPostEmployee)
                console.log('modal', $modal);
                console.log('se hizoc lick ene l boton');

                $modal.style.display = 'block';

                const $closeModal = document.querySelector(".btn-close");
                $closeModal.onclick = function() {
                    $modal.style.display = "none";
                };

                  // Cerrar la modal cuando se clickea fuera de ella
                window.onclick = function(e) {
                    if (e.target == $modal) {
                        $modal.style.display = "none";
                    }
                };
            });

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