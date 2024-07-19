import '/src/styles/menu.css';

const menu = `
    <aside class="sidebar">
        <div class="profile">
            <img src="../../public/assets/icons/profile.svg" alt="Profile Icon" class="profile-icon">
            <span class="profile-name">AdminSamu</span>
        </div>
        <nav class="menu">
            <ul>
                <li><a href="#seguimiento-caja"><img src="../../public/assets/icons/cash-register.svg" alt="Ver caja" class="icon">Seguimiento de caja</a></li>
                <li><a href="#compartir-calendario"><img src="../../public/assets/icons/share.svg" alt="Compartir calendario" class="icon">Compartir calendaior</a></li>
                <li><a href="#administrar-calendario"><img src="../../public/assets/icons/calendar.svg" alt="Administrar calendario" class="icon">Administrar Calendario</a></li>
                <li><a href="#administrar-barberos"><img src="../../public/assets/icons/edit-user.svg" alt="Administrar barberos" class="icon">Administrar Barberos</a></li>
                <li><a href="#generar-tabla"><img src="../../public/assets/icons/table.svg" alt="Generar tabla" class="icon">Generar Tabla Turnos</a></li>
                <li><a href="/login.html"><img src="../../public/assets/icons/log-out.svg" alt="Cerrar sesion" class="icon">Cerrar Sesion</a></li>
            </ul>
        </nav>
    </aside>
`;

export default menu;
