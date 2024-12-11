import calendarRender from './calendarRender.js';
import calendario from "./calendario.js";
import { menuFunction } from "./menuAdmin.js";
import { btnHamburger, closeMenu } from "./btnHamburger.js";
import { modalElement } from "./modalPostTurn.js";
import { containerCashView, infoSectionCashView, tableTurns, cashData, addDateFilterListener, loadBarberSelect, addBarberFilterListener, paymentSection } from "./cashRegister.js";
import { logout } from './logout.js';
import { postEmployee, modal, usersData, manageEmployeesView, showRegisterEmployeeModal, submitEmployee, cancelSubmitForm, updateEmployee, deleteEmployee } from './manageEmployees.js';
import { modalServices, serviceData, configParamsView, configParamsInitialView, showRegisterServiceModal, submitService, cancelSubmitFormService, updateService, deleteService } from './configParams.js';

const indexView = async (data) => {

    /**
     * Renderizamos la vista del admin
     * param: data -> user active.
     */
    
    const userActive = data.user.Nombre;
    const urlActive = window.location.hash;
    
    app.innerHTML = '';
    app.innerHTML += menuFunction(userActive);
    app.innerHTML += btnHamburger;
    
    switch (urlActive) {
        case '#calendario':

            app.innerHTML += calendario;
            calendarRender(modalElement, data);

            break;
        
        case '#caja':
            
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

        case '#historial-de-registro':

            console.log("toque historial de registro")

            break;
        
        case '#administrar-empleados':

            app.innerHTML += manageEmployeesView;

            let manageEmployeesContainer = document.querySelector('.manageEmployeesContainer');
            manageEmployeesContainer.insertAdjacentHTML('beforeend', postEmployee);

            const tableEmployees = await usersData();
            if (tableEmployees) {
                manageEmployeesContainer.insertAdjacentHTML('beforeend', tableEmployees);
            };

            manageEmployeesContainer.insertAdjacentHTML('beforeend', modal);
            
            const $btnPostEmployee = document.querySelector('.postEmployee-btn');
            $btnPostEmployee.setAttribute('data-bs-toggle', 'modal');
            $btnPostEmployee.setAttribute('data-bs-target', '#postEmployee');

            const $modal = new bootstrap.Modal(document.getElementById('postEmployee'));

            showRegisterEmployeeModal($btnPostEmployee);

            const $formPostEmployee = document.querySelector('#formPOSTEmployee');
            const $modalFooter = document.querySelector('.modal-footer');
            submitEmployee($formPostEmployee, $modal, $modalFooter);

            const $btnCancel = document.querySelector('.btnCancel');
            cancelSubmitForm($btnCancel, $formPostEmployee, $modal);

            const $btnsPut = document.querySelectorAll('.modify i');
            updateEmployee($btnsPut, $modal);

            const $btnsDelete = document.querySelectorAll('.delete i');
            deleteEmployee($btnsDelete)

            break;

        case '#configuracion':

            app.innerHTML += configParamsView;

            let configParamsContainer = document.querySelector('.configParamsView');
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

            showRegisterServiceModal($btnPostService);

            const $formPostService = document.querySelector('#formPOSTService');
            const $modalFooterService = document.querySelector('.modal-footer');

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