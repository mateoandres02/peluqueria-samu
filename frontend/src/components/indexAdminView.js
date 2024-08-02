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

            // Seteamos atributos en el boton para conectarlo a la modal.
            $btnPostEmployee.setAttribute('data-bs-toggle', 'modal');
            $btnPostEmployee.setAttribute('data-bs-target', '#postEmployee');

            const $modal = document.querySelector('#postEmployee');

            $btnPostEmployee.addEventListener('click', () => {

                $modal.style.display = 'block';

                const $closeModal = document.querySelector(".closeModal");
                $closeModal.onclick = function() {
                    $modal.style.display = "none";
                };

                window.onclick = function(e) {
                    if (e.target == $modal) {
                        $modal.style.display = "none";
                    }
                };

            });

            const $formPostEmployee = document.querySelector('#formPOSTEmployee');
            const $modalFooter = document.querySelector('.modal-footer');
            const span = document.createElement('span');
            span.innerHTML = 'Error al crear el usuario.';
            span.style.textAlign = 'center'
            span.style.width = '100%';
            span.style.marginTop = '1rem';
            span.style.marginBottom = '0rem';
            span.style.paddingBottom = '0rem';

            const bootstrapModal = bootstrap.Modal.getInstance($modal);
            
            $formPostEmployee.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const username = $formPostEmployee.Nombre.value;
                const password = $formPostEmployee.Contrasena.value;
                const role = $formPostEmployee.Rol.value;
                
                const user = {
                    "Nombre": username,
                    "Contrasena": password,
                    "Rol": role
                };
                
                fetch('http://localhost:3001/register', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json'}, 
                    body: JSON.stringify(user)
                })
                .then(response => response.json())
                .then(data => {
                    
                    if (data.error !== undefined) {
                        span.innerHTML = `${data.error}`;
                        span.style.color = 'red';
                    } else {
                        span.innerHTML = '¡Usuario creado correctamente!'
                        span.style.color = 'green';

                        setInterval(() => {
                            bootstrapModal.hide();
                        }, 1500);

                    };

                    $modalFooter.appendChild(span);

                })
                .catch((e) => {
                    console.log('error del servidor:', e);
                });

            });

            const $btnPut = document.querySelector('.modify');

            console.log($btnPut)

            $btnPut.addEventListener('click', () => {
                console.log('click en el lapiz azul')
                bootstrapModal.show();
            })

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