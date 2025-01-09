import '/src/styles/menu.css';
import { path1, path2, path3 } from './presentation.js';

const menuAdmin = (user) => {

    const menu = `
        <aside class="sidebar">
            <div class="sidebar-nav">
                <div class="profile">
                    <svg version="1.1" viewBox="0 0 2041 2048" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                        ${path1}
                        ${path2}
                        ${path3}
                    </svg>
                    <span class="profile-name">${user}</span>
                </div>
            </div>
            <nav class="menu">
                <ul>
                    <li>
                        <a href="#calendario">
                            <img src="/assets/icons/calendar.svg" alt="Administrar calendario" class="icon">Administrar Calendario
                        </a>
                    </li>
                    <li>
                        <a href="#caja">
                            <img src="/assets/icons/cash-register.svg" alt="Caja registradora" class="icon">
                            Seguimiento de caja
                        </a>
                    </li>
                    <li>
                        <a href="#historial-de-registro">
                            <img src="/assets/icons/history-log.svg" alt="Historial de registro" class="icon">
                            Registro de Turnos
                        </a>
                    </li>
                    <li>
                        <a href="#administrar-empleados">
                            <img src="/assets/icons/edit-user.svg" alt="Administrar empleados" class="icon">
                            Administrar empleados
                        </a>
                    </li>
                    <li>
                        <a href="#configuracion">
                            <img src="/assets/icons/table.svg" alt="Configuración" class="icon">
                            Configurar parametros
                        </a>
                    </li>
                    <li>
                        <a href="#recuento-vales">
                            <img src="/assets/icons/vale.svg" alt="Administrar empleados" class="icon">
                            Recuento de vales y descuentos
                        </a>
                    </li>
                </ul>
                <div class="button-logout-container">
                    <button id="logout">
                        Cerrar Sesion
                    </button>
                </div>
            </nav>
        </aside>
    `;

    return menu;

}

const menuEmployee = (data) => {
    
    const menu = `
        <aside class="sidebar">
            <div class="sidebar-nav">
                <div class="profile">
                    <svg version="1.1" viewBox="0 0 2041 2048" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                        ${path1}
                        ${path2}
                        ${path3}
                    </svg>
                    <span class="profile-name">${data}</span>
                </div>
            </div>
            <nav class="menu">
                <ul>
                    <li>
                        <a href="#calendario">
                            <img src="/assets/icons/calendar.svg" alt="Administrar calendario" class="icon">
                            Administrar Calendario
                        </a>
                    </li>
                </ul>
                <div class="button-logout-container">
                    <button id="logout">
                        Cerrar Sesion
                    </button>
                </div>
            </nav>
        </aside>
    `;

    return menu;

}

export {
    menuAdmin,
    menuEmployee
};

