import '/src/styles/menu.css';

const menu = (user) => {

    const menu = `
        <aside class="sidebar">
            <div class="profile">
                <img src="../../public/assets/icons/profile.svg" alt="Profile Icon" class="profile-icon">
                <span class="profile-name">${user}</span>
            </div>
            <nav class="menu">
                <ul>
                    <li><a href="#compartir-calendario"><img src="../../public/assets/icons/share.svg" alt="Compartir calendario" class="icon">Compartir calendaior</a></li>
                    <li><a href="#administrar-calendario"><img src="../../public/assets/icons/calendar.svg" alt="Administrar calendario" class="icon">Administrar Calendario</a></li>
                    <li><a href="#generar-tabla"><img src="../../public/assets/icons/table.svg" alt="Generar tabla" class="icon">Generar Tabla Turnos</a></li>
                    <li class="button-logout-container">
                        <button id="logout">
                            Cerrar Sesion
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    `;

    return menu;

}

export default menu;

