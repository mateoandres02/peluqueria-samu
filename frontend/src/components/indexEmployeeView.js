import { presentation } from './presentation.js';
import { calendario, calendarRender } from './calendarRender.js';
import { menuEmployee } from "./menu.js";
import { header, closeMenu } from "./header.js";
import { modalElement } from "./modalPostTurn.js";
import { logout } from './logout.js';
import { loader } from './loader.js';

import "../styles/style.css"
import { containerEmployeeHistory, cutData, infoEmployeeHistory, infoSectionEmployeeHistory } from './employeeHistory.js';
import { handleDateFilter, handleEndWeekFilter } from '../utils/filters.js';

const indexView = async (data) => {

     /**
     * Renderizamos la vista del empleado
     * param: data -> user active.
     */

    const userActive = data.user.Nombre;
    const urlActive = window.location.hash;
    
    app.innerHTML = '';
    app.innerHTML += header;
    app.innerHTML += menuEmployee(userActive);

    app.innerHTML += loader;

    try {
        switch (urlActive) {
        
            case '#calendario':
    
                app.innerHTML += calendario;
                calendarRender(modalElement, data);
                
                break;
        
            case '#historial-trabajo':

                app.innerHTML += containerEmployeeHistory;

                let $containerEmployeeHistory = document.querySelector('.containerEmployeeHistory');
                $containerEmployeeHistory.insertAdjacentHTML('beforeend', infoSectionEmployeeHistory);
                $containerEmployeeHistory.insertAdjacentHTML('beforeend', infoEmployeeHistory);

                let $currentDate = document.querySelector('#filterDateInputEmployeeHistory').value;

                await cutData(data, $currentDate, null);

                const $dateInput = document.querySelector('#filterDateInputEmployeeHistory');
                const $weekInput = document.querySelector('#filterWeekInputEmployeeHistory');
                handleDateFilter(data, $dateInput, $weekInput);
                handleEndWeekFilter(data, $dateInput, $weekInput);

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