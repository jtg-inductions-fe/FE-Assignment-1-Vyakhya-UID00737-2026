import { closeMenu } from './utils.js';

export const navigationMenu = () => {
    const HAMBURGER = document.querySelector('.navbar__hamburger');
    const MENU_LINKS = document.querySelector('.navbar__menu');
    const OVERLAY = document.querySelector('.overlay');

    // logic for toggling in navigation menu
    const openMenu = () => {
        MENU_LINKS.hidden = false;
        MENU_LINKS.classList.add('navbar__menu--active');
        OVERLAY.classList.add('overlay--active');
        document.body.classList.add('no-scroll');
        HAMBURGER.setAttribute('aria-expanded', 'true');
        HAMBURGER.setAttribute('aria-label', 'Close navigation menu');
    };

    const toggleMenu = () => {
        if (MENU_LINKS.classList.contains('navbar__menu--active')) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    HAMBURGER.addEventListener('click', toggleMenu);
    OVERLAY.addEventListener('click', () => {
        // allowing navigation menu only to be closed when clicked on overlay.
        if (MENU_LINKS.classList.contains('navbar__menu--active')) {
            closeMenu();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'Escape' &&
            MENU_LINKS.classList.contains('navbar__menu--active')
        ) {
            closeMenu();
        }
    });
};
