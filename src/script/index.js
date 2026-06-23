const hamburger = document.querySelector('.navbar__hamburger');
const menuLinks = document.querySelector('.navbar__menu');
const overlay = document.querySelector('.navbar__overlay');

hamburger.addEventListener('click', () => {
    menuLinks.classList.toggle('navbar__menu--active');
    overlay.classList.toggle('navbar__overlay--active');
    document.body.classList.toggle('body--menu-open');
});

overlay.addEventListener('click', () => {
    menuLinks.classList.remove('navbar__menu--active');
    overlay.classList.remove('navbar__overlay--active');
    document.body.classList.toggle('body--menu-open');
});
