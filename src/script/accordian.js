export const initAccordian = () => {
    // Defining accordian working
    const ACCORDIANS = document.querySelectorAll('.footer__accordian');

    ACCORDIANS.forEach((accordian) => {
        accordian.addEventListener('click', function () {
            // Toggling between adding and removing the .active class to opens the accordian content
            // Displaying card of the accordian on which clicked
            const card = this.nextElementSibling;
            this.classList.toggle('active');
            card.classList.toggle('footer__card--active');
        });
    });
};
