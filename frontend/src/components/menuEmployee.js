import '/src/styles/menu.css';

const menu = (data) => {

    // <div class="btnHamburger">
    //     <button class="hamburger hamburger--collapse" type="button">
    //         <span class="hamburger-box">
    //             <span class="hamburger-inner"></span>
    //         </span>
    //     </button>
    // </div>
    
    const menu = `
        <aside class="sidebar">
            <div class="sidebar-nav">
                <div class="profile">
                    <img src="../../assets/icons/profile.svg" alt="Profile Icon" class="profile-icon">
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
                            <img src="../../public/assets/icons/share.svg" alt="Compartir calendario" class="icon">
                            Compartir calendario
                        </a>
                    </li>
                    <li>
                        <a href="#generate-table">
                            <img src="../../public/assets/icons/table.svg" alt="Generar tabla" class="icon">
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

// const closeMenu = () => {
//     const $btn = document.querySelector('.btnHamburger button');

//     // Eliminar cualquier listener existente
//     $btn.removeEventListener('click', toggleHamburger);

//     // Añadir el listener de click
//     $btn.addEventListener('click', toggleHamburger);
// }

// const toggleHamburger = (e) => {
//     const $btn = e.currentTarget;
//     $btn.classList.toggle('is-active');
// };

export {
    menu,
    // closeMenu
};

