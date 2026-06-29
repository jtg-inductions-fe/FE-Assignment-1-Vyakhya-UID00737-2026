const hamburger = document.querySelector('.navbar__hamburger');
const menuLinks = document.querySelector('.navbar__menu');
const overlay = document.querySelector('.navbar__overlay');

// logic for toggling in navigation menu
const openMenu = () => {
    menuLinks.classList.add('navbar__menu--active');
    overlay.classList.add('navbar__overlay--active');
    document.body.classList.add('body--menu-open');
};

const closeMenu = () => {
    menuLinks.classList.remove('navbar__menu--active');
    overlay.classList.remove('navbar__overlay--active');
    document.body.classList.remove('body--menu-open');
};

const toggleMenu = () => {
    if (menuLinks.classList.contains('navbar__menu--active')) {
        closeMenu();
    } else {
        openMenu();
    }
};

hamburger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => {
    if (
        e.key === 'Escape' &&
        menuLinks.classList.contains('navbar__menu--active')
    ) {
        closeMenu();
    }
});
