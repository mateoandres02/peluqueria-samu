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
    const $btn = document.querySelector('.btnHamburger button');

    // Eliminar cualquier listener existente
    $btn.removeEventListener('click', toggleHamburger);

    // Añadir el listener de click
    $btn.addEventListener('click', toggleHamburger);
}

const toggleHamburger = (e) => {
    const $btn = e.currentTarget;
    $btn.classList.toggle('is-active');
};

export {
    btnHamburger,
    closeMenu
};