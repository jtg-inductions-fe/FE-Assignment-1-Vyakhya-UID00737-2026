export const closeMenu = () => {
    const HAMBURGER = document.querySelector('.navbar__hamburger');
    const MENU_LINKS = document.querySelector('.navbar__menu');
    const OVERLAY = document.querySelector('.overlay');
    MENU_LINKS.classList.remove('navbar__menu--active');
    OVERLAY.classList.remove('overlay--active');
    document.body.classList.remove('no-scroll');
    HAMBURGER.setAttribute('aria-expanded', 'false');
    HAMBURGER.setAttribute('aria-label', 'Open navigation menu');
    MENU_LINKS.hidden = true;
};
