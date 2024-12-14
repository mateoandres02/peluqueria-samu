import '/src/styles/btnHamburger.css';

const btnHamburger = `
    <div class="btnHamburger">
        <button class="hamburger hamburger--collapse" type="button">
            <span class="hamburger-box">
                <span class="hamburger-inner"></span>
            </span>
        </button>
    </div>
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
    const $btn = e.currentTarget;
    $btn.classList.toggle('is-active');
};

export {
    btnHamburger,
    closeMenu
};