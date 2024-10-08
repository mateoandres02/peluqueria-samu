import '/src/styles/menu.css';

const menu = (data) => {
    
    const menu = `
        <aside class="sidebar">
            <div class="sidebar-nav">
                <div class="profile">
                    <img src="/assets/icons/profile.svg" alt="Profile Icon" class="profile-icon">
                    <span class="profile-name">${data}</span>
                </div>
            </div>
            <nav class="menu">
                <ul>
                    <li>
                        <a href="#admin-calendar">
                            <img src="/assets/icons/calendar.svg" alt="Administrar calendario" class="icon">
                            Administrar Calendario
                        </a>
                    </li>
                    <li>
                        <a href="#share-calendar">
                            <img src="/assets/icons/share.svg" alt="Compartir calendario" class="icon">
                            Compartir calendario
                        </a>
                    </li>
                    <li>
                        <a href="#generate-table">
                            <img src="/assets/icons/table.svg" alt="Generar tabla" class="icon">
                            Generar Tabla Turnos
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
    menu
};

