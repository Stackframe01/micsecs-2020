const openMenu = () => {
    const btnBurger = document.querySelector('.btn-menu'),
    mobailNav = document.querySelector('.mobail-nav');


    const toggleMenu = () => {
        btnBurger.classList.toggle('active');
        mobailNav.classList.toggle('active');
    };

    btnBurger.addEventListener('click', toggleMenu);
};

export default openMenu;