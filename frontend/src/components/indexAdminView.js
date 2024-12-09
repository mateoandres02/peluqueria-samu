import calendarRender from './calendarRender.js';
import calendario from "./calendario.js";
import { menuFunction } from "./menuAdmin.js";
import { btnHamburger, closeMenu } from "./btnHamburger.js";
import { modalElement } from "./modalPostTurn.js";
import { containerCashView, infoSectionCashView, tableTurns, cashData, addDateFilterListener, loadBarberSelect, addBarberFilterListener, paymentSection } from "./cashRegister.js";
import { logout } from './logout.js';
import { postEmployee, modal, usersData, manageEmployeesView, showRegisterEmployeeModal, submitEmployee, cancelSubmitForm, updateEmployee, deleteEmployee } from './manageEmployees.js';
import { modalServices, serviceData, configParamsView, configParamsInitialView, showRegisterServiceModal, submitService, cancelSubmitFormService, updateService, deleteService } from './configParams.js';


// param: data -> user active.
const indexView = async (data) => {
    
    const userActive = data.user.Nombre;
    const urlActive = window.location.hash;
    
    app.innerHTML = '';
    app.innerHTML += menuFunction(userActive);
    app.innerHTML += btnHamburger;
    
    switch (urlActive) {
        case '#admin-calendar':
            app.innerHTML += calendario;
            calendarRender(modalElement, data);
            break;
        
        case '#cash-register':
            app.innerHTML += containerCashView;

            let $containerCashView = document.querySelector('.containerCashView');
            $containerCashView.insertAdjacentHTML('beforeend', infoSectionCashView);
            $containerCashView.insertAdjacentHTML('beforeend', tableTurns);

            const $barberSelect = document.querySelector('#barberSelect');
            await loadBarberSelect($barberSelect);

            let $tableBodyTurnsCashRegister = document.querySelector('.table-cash-body');            
            let $currentDate = document.querySelector('#filterDateInput').value;

            await cashData($tableBodyTurnsCashRegister, $currentDate, null);
            
            const $dateInput = document.querySelector('#filterDateInput');
            addDateFilterListener($tableBodyTurnsCashRegister, $dateInput);

            addBarberFilterListener($tableBodyTurnsCashRegister, $barberSelect);

            //$containerCashView.insertAdjacentHTML('beforeend', paymentSection);

            break;

        case '#history-register':

            console.log("toque historial de registro")

            break;
        
        case '#manage-employees':

            // Agregamos al div.app el contendor donde se va a desplegar toda la vista para administrar empleados
            app.innerHTML += manageEmployeesView;

            // Obtenemos el contenedor agregado, para luego agregar dentro de él, el resto de componentes.
            let manageEmployeesContainer = document.querySelector('.manageEmployeesContainer');

            // Agregamos el componente para registrar un empleado.
            manageEmployeesContainer.insertAdjacentHTML('beforeend', postEmployee);

            // Hacemos la carga de datos de la tabla con los registros de la base de datos.
            const tableEmployees = await usersData();

            // Cuando la tabla tenga los datos de los registros de la base de datos, la agregamos a la vista.
            if (tableEmployees) {
                manageEmployeesContainer.insertAdjacentHTML('beforeend', tableEmployees);
            };

            // Agregamos la modal para manipular las distintas acciones sobre los empleados, a la vista.
            manageEmployeesContainer.insertAdjacentHTML('beforeend', modal);
            
            // Obtenemos el boton para crear un registro.
            const $btnPostEmployee = document.querySelector('.postEmployee-btn');

            // Seteamos atributos en el boton para conectarlo a la modal.
            $btnPostEmployee.setAttribute('data-bs-toggle', 'modal');
            $btnPostEmployee.setAttribute('data-bs-target', '#postEmployee');

            // Inicializamos la modal
            const $modal = new bootstrap.Modal(document.getElementById('postEmployee'));

            // Al boton para registrar un empleado le damos la funcionalidad de desplegar la modal.
            showRegisterEmployeeModal($btnPostEmployee);

            // Obtenemos el formulario de la modal para darle eventos.
            const $formPostEmployee = document.querySelector('#formPOSTEmployee');

            // Obtenemos el footer de la modal para luego agregarle el mensaje sobre el resultado del envio del formulario.
            const $modalFooter = document.querySelector('.modal-footer');

            // Manejamos el evento submit del formulario.
            submitEmployee($formPostEmployee, $modal, $modalFooter);

            // Obtenemos el boton para cancelar la accion sobre el registro.
            const $btnCancel = document.querySelector('.btnCancel');

            // Manejamos funcionalidad de cancelar el registro de un empleado.
            cancelSubmitForm($btnCancel, $formPostEmployee, $modal);

            // Obtenemos todos los botones para modificar un registro.
            const $btnsPut = document.querySelectorAll('.modify i');

            // Manejamos funcionalidad de actualizar empleados.
            updateEmployee($btnsPut, $modal);

            // Obtenemos todos los botones del delete
            const $btnsDelete = document.querySelectorAll('.delete i');

            // Manejamos funcionalidad de eliminar empleados.
            deleteEmployee($btnsDelete)

            break;

        case '#generate-table':
            

            break;

        case '#config-params':

            app.innerHTML += configParamsView;

            let configParamsContainer = document.querySelector('.configParamsView');

            console.log(configParamsContainer)

            // Agregamos el componente para registrar un empleado.
            configParamsContainer.insertAdjacentHTML('beforeend', configParamsInitialView);

            const tableServices = await serviceData()

            if (tableServices) {
                configParamsContainer.insertAdjacentHTML('beforeend', tableServices);
            }

            configParamsContainer.insertAdjacentHTML('beforeend', modalServices);

            const $btnPostService = document.querySelector('.postService-btn');

            $btnPostService.setAttribute('data-bs-toggle', 'modal');

            $btnPostService.setAttribute('data-bs-target', '#postService');

            const $modalService = new bootstrap.Modal(document.getElementById('postService'));

            console.log($modalService)
            showRegisterServiceModal($btnPostService);

            const $formPostService = document.querySelector('#formPOSTService');

            const $modalFooterService = document.querySelector('.modal-footer');

            //obtener y mostrar
            submitService($formPostService, $modalService, $modalFooterService);

            const $btnCancelService = document.querySelector('.btnCancel');

            cancelSubmitFormService($btnCancelService, $formPostService, $modalService);

            const $btnsPutService = document.querySelectorAll('.modify i');

            updateService($btnsPutService, $modalService);

            const $btnsDeleteService = document.querySelectorAll('.delete i');

            deleteService($btnsDeleteService)

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