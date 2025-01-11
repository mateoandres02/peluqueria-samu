import { presentation } from './presentation.js';
import { calendario, calendarRender } from './calendarRender.js';
import { menuAdmin } from "./menu.js";
import { header, closeMenu } from "./header.js";
import { modalElement } from "./modalPostTurn.js";
import { containerCashView, infoSectionCashView, tableTurns, cashData, addDateFilterListener, loadBarberSelect, addBarberFilterListener, paymentSection, handlePaidsForBarber, handleWeekFilterChange} from "./cashRegister.js";
import { logout } from './logout.js';
import { postEmployee, modal, usersData, manageEmployeesView, showRegisterEmployeeModal, submitEmployee, cancelSubmitForm, updateEmployee, deleteEmployee } from './manageEmployees.js';
import { containerHistoryView, infoSectionHistoryTurnsView, tableTurnsHistory, loadBarberSelectHistory, historyTurnsRender, setupFilters } from './historialTurnos.js';
import { configParamsView, infoSectionParamsView, modalServices, serviceData, configParamsInitialView, showRegisterServiceModal, submitService, cancelSubmitFormService, updateService, deleteService, configPaymentView, tablePaymentEdit, handleChangeBarber, handleModifyPercentage } from './configParams.js';
import { voucherView, infoSectionVoucherView, voucherAddView, showRegisterVoucherModal, modalVoucher, submitVoucher, cancelSubmitVoucherForm, updateVoucher, deleteVoucher, tableVouchersColumns, vouchersRender, setupFiltersVouchers } from './voucher.js';
import { loader } from "./loader.js";

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
    app.innerHTML += menuAdmin(userActive);

    app.innerHTML += loader;

    try {
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
    
                await cashData($tableBodyTurnsCashRegister, $currentDate, null, null, null);
                
                const $dateInput = document.querySelector('#filterDateInput');
                const $weekInput = document.getElementById('filterWeekInput');
                addDateFilterListener($tableBodyTurnsCashRegister, $dateInput, $weekInput);
                addBarberFilterListener($tableBodyTurnsCashRegister, $barberSelect, $dateInput, $weekInput);
                handleWeekFilterChange($tableBodyTurnsCashRegister, $dateInput, $weekInput);
                
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
                
                // Render inicial
                await historyTurnsRender($tableBodyTurnsHistoryView, $currentDateHistory);
                
                // Configurar filtros
                setupFilters($tableBodyTurnsHistoryView);
    
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
    
                configParamsContainer.insertAdjacentHTML('beforeend', configPaymentView);
                configParamsContainer.insertAdjacentHTML('beforeend', tablePaymentEdit);
    
                const $barberSelectConfigParams = document.querySelector('#barberSelectConfigParams');
                let $tableBodyPaymentEdit = document.querySelector('.table-config-pay-body');   
    
                await loadBarberSelect($barberSelectConfigParams);
                await handleChangeBarber($tableBodyPaymentEdit, $barberSelectConfigParams);
    
                break;
            case '#recuento-vales':
                app.innerHTML += voucherView;

                let voucherViewContainer = document.querySelector('.voucherView');
                voucherViewContainer.insertAdjacentHTML('beforeend', infoSectionVoucherView);
                voucherViewContainer.insertAdjacentHTML('beforeend', voucherAddView);
                voucherViewContainer.insertAdjacentHTML('beforeend',tableVouchersColumns)
                voucherViewContainer.insertAdjacentHTML('beforeend', modalVoucher);

                const $barberVoucherSelect = document.querySelector('#barberSelectHistory');
                await loadBarberSelect($barberVoucherSelect);
                
                let $tableBodyVouchers = document.querySelector('.table-vouchers-body');
                let $currentDateVoucher = document.querySelector('#filterDateInputHistory').value;

                //renderizacion de vales
                await vouchersRender($tableBodyVouchers, $currentDateVoucher);

                const $btnPostVoucher = document.querySelector('.postService-btn');
                $btnPostVoucher.setAttribute('data-bs-toggle', 'modal');
                $btnPostVoucher.setAttribute('data-bs-target', '#postService');

                const $modalVoucher = new bootstrap.Modal(document.getElementById('postService'));

                showRegisterVoucherModal($btnPostVoucher);

                const $barberModalSelect = document.querySelector('#barber-select');
                await loadBarberSelect($barberModalSelect);
                const $formPostVoucher = document.querySelector("#formPOSTService");
                const $modalFooterVoucher = document.querySelector('.modal-footer');
                submitVoucher($formPostVoucher, $modalVoucher, $modalFooterVoucher, $barberVoucherSelect);

                const $btnCancelVoucher = document.querySelector('.btnCancel');
                cancelSubmitVoucherForm($btnCancelVoucher, $formPostVoucher, $modalVoucher);

                const $btnPutVoucher = document.querySelectorAll('.modify i');
                updateVoucher($btnPutVoucher, $modalVoucher);

                const $btnDeleteVoucher = document.querySelectorAll('.delete i');
                deleteVoucher($btnDeleteVoucher);

                setupFiltersVouchers($tableBodyVouchers);
                
                break;
            default:
                // app.innerHTML += calendario;
                // calendarRender(modalElement, data);

                app.innerHTML += presentation(userActive);
                
                break;
        };

    } catch (error) {
        console.error('Error loading the section:', error);
    } finally {
        const $loader = document.querySelector('.bg-loader-container');
        if ($loader) $loader.remove();

        closeMenu();

        const $btnLogout = document.querySelector('#logout');
        $btnLogout.addEventListener('click', logout);
    }
};

export default indexView;