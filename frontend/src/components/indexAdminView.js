import { presentation } from './presentation.js';
import { calendario, calendarRender } from './calendarRender.js';
import { menuAdmin } from "./menu.js";
import { header, closeMenu } from "./header.js";
import { modalElement } from "./modalPostTurn.js";
import { loader } from "./loader.js";

import { containerCashView, infoSectionCashView, tableTurns, cashData, paymentSection, handlePaidsForBarber, modalMethodPayment} from "./cashRegister.js";
import { logout } from './logout.js';
import { postEmployee, modal, usersData, manageEmployeesView } from './manageEmployees.js';
import { containerHistoryView, infoSectionHistoryTurnsView, tableTurnsHistory, historyTurnsRender, setupFilters } from './historialTurnos.js';
import { configParamsView, infoSectionParamsView, modalServices, serviceData, configParamsInitialView, configPaymentView, tablePaymentEdit } from './configParams.js';
import { voucherView, infoSectionVoucherView, voucherAddView, modalVoucher, tableVouchersColumns, vouchersRender } from './voucher.js';
import { containerWorkSessionsView, infoSectionWorkSessionsView, tableWorkSessions, handleStartButton, handleEndButton, sessionsRender, addDateFilterListenerWorkSessions } from './workSession.js';
// import deviceId from './deviceId.js';

import { loadBarberSelect, handleChangeBarber } from '../utils/selectables.js';
import { addBarberFilterListener, addDateFilterListener, addEndWeekFilterListner, addDateFilterListenerVoucher, addBarberFilterListenerVoucher } from '../utils/filters.js';
import { cancelPostModal, showPostModal } from '../utils/modal.js';
import { submitRecord, deleteRecord, updateRecord } from '../utils/crud.js';

import "../styles/style.css";
import { clientsData, manageClientsView, modalPostClient, postClient } from './manageClients.js';

// import { setDeviceId, deviceIdStr } from './securityValidator.js'

const indexView = async (data) => {

    /**
     * Renderizamos la vista del admin
     * param: data -> user active.
     */

    let section;

    // setDeviceId();
    
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
                addDateFilterListener($tableBodyTurnsCashRegister, $dateInput, $weekInput, $barberSelect);
                addBarberFilterListener($tableBodyTurnsCashRegister, $dateInput, $weekInput, $barberSelect);
                addEndWeekFilterListner($tableBodyTurnsCashRegister, $dateInput, $weekInput, $barberSelect);

                $containerCashView.insertAdjacentHTML('beforeend', modalMethodPayment);
                
                $containerCashView.insertAdjacentHTML('beforeend', paymentSection);
    
                const $payButton = document.querySelector('.pay-button');
                handlePaidsForBarber($payButton, $dateInput, $weekInput);
    
                break;
    
            case '#historial-de-registro':
    
                app.innerHTML += containerHistoryView;
    
                let $containerHistoryView = document.querySelector('.containerHistoryView');
                $containerHistoryView.insertAdjacentHTML('beforeend', infoSectionHistoryTurnsView);
                $containerHistoryView.insertAdjacentHTML('beforeend', tableTurnsHistory);
                
                const $barberSelectHistory = document.querySelector('#barberSelectHistory');
                await loadBarberSelect($barberSelectHistory);
                
                let $tableBodyTurnsHistoryView = document.querySelector('.table-history-body');
                let $currentDateHistory = document.querySelector('#filterDateInputHistory');
                
                await historyTurnsRender($tableBodyTurnsHistoryView, $currentDateHistory.value);
                
                setupFilters($tableBodyTurnsHistoryView, $currentDateHistory, $barberSelectHistory);
    
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
                const $formPostEmployee = document.querySelector('#formPOSTEmployee');
                const $titleModalEmployee = document.querySelector("#postEmployeeLabel");
                const $btnPost = document.querySelector(".btnPost");
    
                showPostModal($btnPostEmployee, $titleModalEmployee, $btnPost, $formPostEmployee, section = "manageEmployees");
    
                const $modalFooter = document.querySelector('.modal-footer');
                submitRecord($formPostEmployee, $modal, $modalFooter, $btnPost, section = "manageEmployees");
    
                const $btnCancel = document.querySelector('.btnCancel');
                cancelPostModal($btnCancel, $formPostEmployee, $modal);
    
                const $btnsPut = document.querySelectorAll('.modify i');
                updateRecord($btnsPut, $modal, $formPostEmployee, $titleModalEmployee, $btnPost, section = "manageEmployees");
    
                const $btnsDelete = document.querySelectorAll('.delete i');
                deleteRecord($btnsDelete, section = "manageEmployees");
    
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
                const $titleModal = document.querySelector("#postServiceLabel");
                const $btnPostModal = document.querySelector(".btnPost");
                const $formPostService = document.querySelector('#formPOSTService');
                const $modalFooterService = document.querySelector('.modal-footer');
    
                showPostModal($btnPostService, $titleModal, $btnPostModal, $formPostService, section = "config");
    
                submitRecord($formPostService, $modalService, $modalFooterService, $btnPostModal, section = "config");
    
                const $btnCancelService = document.querySelector('.btnCancel');
                cancelPostModal($btnCancelService, $formPostService, $modalService);
    
                const $btnsPutService = document.querySelectorAll('.modify i');
                updateRecord($btnsPutService, $modalService, $formPostService, $titleModal, $btnPostModal, section = "config");
    
                const $btnsDeleteService = document.querySelectorAll('.delete i');
                deleteRecord($btnsDeleteService, section = "config");
    
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
                voucherViewContainer.insertAdjacentHTML('beforeend', modalVoucher);
                voucherViewContainer.insertAdjacentHTML('beforeend', infoSectionVoucherView);
                voucherViewContainer.insertAdjacentHTML('beforeend', voucherAddView);
                voucherViewContainer.insertAdjacentHTML('beforeend', tableVouchersColumns)

                const $barberVoucherSelectModal = document.querySelector('#select-barber-voucher');
                await loadBarberSelect($barberVoucherSelectModal);

                const $barberVoucherSelectFilter = document.querySelector('#barberSelect');
                await loadBarberSelect($barberVoucherSelectFilter);

                let $tableBodyVouchers = document.querySelector('.table-vouchers-body');
                let $currentDateVoucher = document.querySelector('#filterDateInput');

                await vouchersRender($tableBodyVouchers, $currentDateVoucher.value);

                const $btnPostVoucher = document.querySelector('.postVoucher-btn');
                $btnPostVoucher.setAttribute('data-bs-toggle', 'modal');
                $btnPostVoucher.setAttribute('data-bs-target', '#postVoucher');

                const $modalVoucher = new bootstrap.Modal(document.getElementById('postVoucher'));
                const $titleModalVoucher = document.querySelector("#postVoucherLabel");
                const $btnPostModalVoucher = document.querySelector(".btnPost");
                const $formPostVoucher = document.querySelector("#formPOSTVoucher");
                const $modalFooterVoucher = document.querySelector('.modal-footer');

                showPostModal($btnPostVoucher, $titleModalVoucher, $btnPostModalVoucher, $formPostVoucher, section = "voucher");

                submitRecord($formPostVoucher, $modalVoucher, $modalFooterVoucher, $btnPostModalVoucher, section = "voucher");

                addDateFilterListenerVoucher($tableBodyVouchers, $currentDateVoucher, $barberVoucherSelectFilter);

                addBarberFilterListenerVoucher($tableBodyVouchers, $currentDateVoucher, $barberVoucherSelectFilter);

                const $btnCancelVoucher = document.querySelector('.btnCancel');
                cancelPostModal($btnCancelVoucher, $formPostVoucher, $modalVoucher);
                
                break;

            case '#administrar-clientes':

                app.innerHTML += manageClientsView;

                let manageClientsContainer = document.querySelector('.manageClientsContainer');
                manageClientsContainer.insertAdjacentHTML('beforeend', postClient);

                const tableClients = await clientsData();
                if (tableClients) {
                    manageClientsContainer.insertAdjacentHTML('beforeend', tableClients);
                };

                manageClientsContainer.insertAdjacentHTML('beforeend', modalPostClient);

                const $btnPostClient = document.querySelector('.postClient-btn');
                $btnPostClient.setAttribute('data-bs-toggle', 'modal');
                $btnPostClient.setAttribute('data-bs-target', '#postClient');

                const $modalPostClient = new bootstrap.Modal(document.getElementById('postClient'));
                const $formPostClient = document.querySelector('#formPostClient');
                const $titleModalClient = document.querySelector("#postClientLabel");
                const $btnFormPostClient = document.querySelector(".btnPost");

                showPostModal($btnPostClient, $titleModalClient, $btnFormPostClient, $formPostClient, section = "manageClients");

                const $footerModalPostClient = document.querySelector('.modal-footer');
                submitRecord($formPostClient, $modalPostClient, $footerModalPostClient, $btnFormPostClient, section = "manageClients");

                const $btnCancelPostClient = document.querySelector('.btnCancel');
                cancelPostModal($btnCancelPostClient, $formPostClient, $modalPostClient);

                const $btnsPutClient = document.querySelectorAll('.modify i');
                updateRecord($btnsPutClient, $modalPostClient, $formPostClient, $titleModalClient, $btnFormPostClient, section = "manageClients");

                const $btnsDeleteClient = document.querySelectorAll('.delete i');
                deleteRecord($btnsDeleteClient, section = "manageClients");

                break;

            case '#registro-trabajo':
                // const storedDeviceId = localStorage.getItem("devicePelu");

                // if (deviceIdStr !== storedDeviceId) {
                //     alert("❌ Error! El dispositivo no es el indicado.");
                //     window.location.href = "/";
                //     break; 
                // }

                app.innerHTML += containerWorkSessionsView
                let $containerWorkSessionsView = document.querySelector('.containerWorkSessionsView');
                
                $containerWorkSessionsView.insertAdjacentHTML('beforeend',infoSectionWorkSessionsView);

                $containerWorkSessionsView.insertAdjacentHTML('beforeend', tableWorkSessions);
                
                let $tableBodyWorkSessionsView = document.querySelector('.table-worksession-body');

                let $dateFilter = document.querySelector('#filterDateInputWorkSession');
            
                await sessionsRender($tableBodyWorkSessionsView, $dateFilter.value);

                addDateFilterListenerWorkSessions($tableBodyWorkSessionsView, $dateFilter);

                const buttonStart = document.querySelector('#startSession');
                const buttonEnd = document.querySelector('#endSession');

                handleStartButton(buttonStart);
                handleEndButton(buttonEnd);

                break;

            default:
                app.innerHTML += presentation(userActive);
                
                break;
        };

    } catch (error) {
        alert('Error al renderizar la sección.')
    } finally {
        const $loader = document.querySelector('.bg-loader-container');
        if ($loader) $loader.remove();

        closeMenu();

        const $btnLogout = document.querySelector('#logout');
        $btnLogout.addEventListener('click', logout);
    }
};

export default indexView;