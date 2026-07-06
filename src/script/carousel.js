/* global Splide */
export const carouselSlider = () => {
    // Defining properties of carousel using splide and make it visible on browser
    const splide = new Splide('.splide', {
        type: 'loop',
        perPage: 1,
        perMove: 1,
        arrows: true,
        pagination: true,
    });

    // this function called the splide to be visible on web page
    splide.mount();
};
