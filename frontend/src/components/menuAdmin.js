import '/src/styles/menu.css';

const menuFunction = (user) => {

    const menu = `
        <aside class="sidebar">
            <div class="sidebar-nav">
                <div class="profile">
                    <img src="/assets/icons/profile.svg" alt="Profile Icon" class="profile-icon">
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
                            <img src="/assets/icons/share.svg" alt="Historial de registro" class="icon">
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
    menuFunction
};

