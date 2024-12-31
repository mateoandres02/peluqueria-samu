import '/src/styles/header.css';

const header = `
    <header class="header">
        <div class="header-title">
            <h1><a href="/">Peluquería Invasión</a></h1>
        </div>
        <div class="header-btn">
            <div class="btnHamburger">
                <button class="hamburger hamburger--collapse" type="button">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
            </div>
        </div>
    </header>
`;

const closeMenu = () => {

    /**
     * Cierra el menu
     */
    
    const $btn = document.querySelector('.btnHamburger button');
    
    $btn.removeEventListener('click', toggleHamburger);
    $btn.addEventListener('click', toggleHamburger);
}

const toggleHamburger = (e) => {

    /**
     * Cambia la forma del boton de hamburguesa
     */

    const $sidebar = document.querySelector('.sidebar');

    const $btn = e.currentTarget;
    $btn.classList.toggle('is-active');

    if ($btn.classList.contains('is-active')) {
        $sidebar.style.display = "grid";
    } else {
        $sidebar.style.display = "none";
    }

};

export {
    header,
    closeMenu
};