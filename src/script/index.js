/* global Splide */

const hamburger = document.querySelector('.navbar__hamburger');
const menuLinks = document.querySelector('.navbar__menu');
const overlay = document.querySelector('.navbar__overlay');

// logic for toggling in navigation menu
const openMenu = () => {
    menuLinks.hidden = false;
    menuLinks.classList.add('navbar__menu--active');
    overlay.classList.add('navbar__overlay--active');
    document.body.classList.add('body--menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
};

const closeMenu = () => {
    menuLinks.classList.remove('navbar__menu--active');
    overlay.classList.remove('navbar__overlay--active');
    document.body.classList.remove('body--menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    menuLinks.hidden = true;
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

// Defining properties of carousel using splide and make it visible on browser
const splide = new Splide('.splide', {
    type: 'loop', // loop continues to go for the available cards
    perPage: 1, // only one card should be visible per page at a time
    perMove: 1, // number of slides the slider should skip when clicked on next or prev button
    arrows: true, // made control buttons to be visible
    pagination: true, // made the pagination to be visible
});

// this function called the splide to be visible on web page
splide.mount();

// Defining accordian working
const accordians = document.querySelectorAll('.footer__accordian');

accordians.forEach((accordian) => {
    accordian.addEventListener('click', () => {
        // Toggling between adding and removing the .active class to opens the accordian content
        // Displaying card of the accordian on which clicked
        const card = this.nextElementSibling;
        this.classList.toggle('active');
        card.classList.toggle('footer__card--active');
    });
});
