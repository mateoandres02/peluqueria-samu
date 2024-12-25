import { getWidthDisplay } from './calendarRender.js';
import { calendarRender } from './calendarRender.js';
import calendario from "./calendario.js";
import { menuFunction } from "./menuAdmin.js";
import { header, closeMenu } from "./header.js";
import { modalElement } from "./modalPostTurn.js";
import { containerCashView, infoSectionCashView, tableTurns, cashData, addDateFilterListener, loadBarberSelect, addBarberFilterListener, paymentSection, handlePaidsForBarber} from "./cashRegister.js";
import { logout } from './logout.js';
import { postEmployee, modal, usersData, manageEmployeesView, showRegisterEmployeeModal, submitEmployee, cancelSubmitForm, updateEmployee, deleteEmployee } from './manageEmployees.js';
import { containerHistoryView, infoSectionHistoryTurnsView, tableTurnsHistory, loadBarberSelectHistory, historyData } from './historialTurnos.js';
import { configParamsView, infoSectionParamsView, modalServices, serviceData, configParamsInitialView, showRegisterServiceModal, submitService, cancelSubmitFormService, updateService, deleteService, configPaymentView, tablePaymentEdit, handleChangeBarber, handleModifyPercentage } from './configParams.js';
import "../styles/style.css";

const indexView = async (data) => {

    /**
     * Renderizamos la vista del admin
     * param: data -> user active.
     */
    
    const userActive = data.user.Nombre;
    const urlActive = window.location.hash;

    app.innerHTML = '';
    app.innerHTML += header;
    app.innerHTML += menuFunction(userActive);

    let columnsCalendarViewTimeGrid;
    columnsCalendarViewTimeGrid = getWidthDisplay();
    
    switch (urlActive) {
        case '#calendario':

            app.innerHTML += calendario;
            calendarRender(modalElement, data, columnsCalendarViewTimeGrid);

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
            
            $containerCashView.insertAdjacentHTML('beforeend', paymentSection);

            const $payButton = document.querySelector('.pay-button');
            handlePaidsForBarber($payButton);

            break;

        case '#historial-de-registro':

            app.innerHTML += containerHistoryView;

            let $containerHistoryView = document.querySelector('.containerHistoryView');
            $containerHistoryView.insertAdjacentHTML('beforeend', infoSectionHistoryTurnsView);
            $containerHistoryView.insertAdjacentHTML('beforeend', tableTurnsHistory);

            const $barberSelectHistory = document.querySelector('#barberSelectHistory');
            await loadBarberSelectHistory($barberSelectHistory);

            let $tableBodyTurnsHistoryView = document.querySelector('.table-history-body');
            let $currentDateHistory = document.querySelector('#filterDateInputHistory').value;

            await historyData($tableBodyTurnsHistoryView, $currentDateHistory, null);

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
            configParamsContainer.insertAdjacentHTML('beforeend', infoSectionParamsView);
            configParamsContainer.insertAdjacentHTML('beforeend', configParamsInitialView);

            const tableServices = await serviceData();
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

            //
            configParamsContainer.insertAdjacentHTML('beforeend', configPaymentView);
            configParamsContainer.insertAdjacentHTML('beforeend', tablePaymentEdit);

            const $barberSelectConfigParams = document.querySelector('#barberSelectConfigParams');
            let $tableBodyPaymentEdit = document.querySelector('.table-config-pay-body');   
            console.log($tableBodyPaymentEdit)

            await loadBarberSelect($barberSelectConfigParams);
            await handleChangeBarber($tableBodyPaymentEdit, $barberSelectConfigParams);

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