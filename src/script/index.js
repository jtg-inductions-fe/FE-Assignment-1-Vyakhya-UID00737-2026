/* global Splide */

const hamburger = document.querySelector('.navbar__hamburger');
const menuLinks = document.querySelector('.navbar__menu');
const overlay = document.querySelector('.overlay');

// logic for toggling in navigation menu
const openMenu = () => {
    menuLinks.hidden = false;
    menuLinks.classList.add('navbar__menu--active');
    overlay.classList.add('overlay--active');
    document.body.classList.add('body--no-scroll');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
};

const closeMenu = () => {
    menuLinks.classList.remove('navbar__menu--active');
    overlay.classList.remove('overlay--active');
    document.body.classList.remove('body--no-scroll');
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
overlay.addEventListener('click', () => {
    if (menuLinks.classList.contains('navbar__menu--active')) {
        closeMenu();
    }
});
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
    accordian.addEventListener('click', function () {
        // Toggling between adding and removing the .active class to opens the accordian content
        // Displaying card of the accordian on which clicked
        const card = this.nextElementSibling;
        this.classList.toggle('active');
        card.classList.toggle('footer__card--active');
    });
});

// Special deals modal working
const dealLink = document.querySelectorAll('.special-deals');
const modal = document.querySelector('.deals');
const closeBtn = document.querySelector('.deals__close-btn');
const loader = document.querySelector('.deals__loader');
const spinner = document.querySelector('.deals__spinner-wheel');
const dealsBtn = document.querySelector('.deals__btn');

const closeModal = () => {
    overlay.classList.remove('overlay--active');
    modal.classList.remove('deals--active');
    document.body.classList.remove('body--no-scroll');
};

const showSpinnerWheel = () => {
    loader.hidden = false;
    spinner.hidden = true;
    dealsBtn.hidden = true;

    setTimeout(() => {
        loader.hidden = true;
        spinner.hidden = false;
        dealsBtn.hidden = false;
    }, 2000);
};

const showDealsModal = () => {
    openModal();
    showSpinnerWheel();
};

// control to open modal by link
dealLink.forEach((link) => {
    link.addEventListener('click', () => {
        if (menuLinks.classList.contains('navbar__menu--active')) {
            closeMenu();

            setTimeout(() => {
                showDealsModal();
            }, 300);
        } else {
            showDealsModal();
        }
    });
});

// Spinner wheel functionality
const spinWheel = document.querySelector('.deals__wheel');
const winBox = document.querySelector('.deals__win-deal');
const url =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';
let dealsData = null;
let currentDeal = [];
let deals = 4;
let wonDeals = JSON.parse(localStorage.getItem('wonDeals')) || [];

const resetWinBox = () => {
    winBox.classList.remove('deals__win-deal--active');
    winBox.innerHTML = '';
};

const winCard = (deal) => {
    return `
        <p class="deals__win-heading p-text-sm-primary">You won!</p>
        <div class="deal-card">
            <div class="deal-card__info">
                <p class="deal-card__deal-label">${deal.label}</p>
                <p class="deal-card__valid-date">Expires in ${deal.validFor ? deal.validFor : 7}d</p>
            </div>
            <div class="deal-card__code">
                <p class="deal-card__deal-id">${deal.promoCode}</p>
                <button
                    class="deal-card__copy"
                    aria-label="Copy promo code"
                >
                    <img
                        class="deal-card__copy-icon"
                        src="/assets/icons/copy-icon.svg"
                        alt="Copy Icon"
                    />
                    <img
                        class="deal-card__tick-icon"
                        src="/assets/icons/tick.svg"
                        alt="Green Tick Icon"
                    />
                </button>
            </div>
        </div>
    `;
};

// copy the promoCode of winning deal
const copyCode = () => {
    const copyBtn = document.querySelector('.deal-card__copy');
    const copyIcon = document.querySelector('.deal-card__copy-icon');
    const tickIcon = document.querySelector('.deal-card__tick-icon');

    copyBtn.addEventListener('click', async () => {
        const codeId = document.querySelector('.deal-card__deal-id');
        if (!codeId) return;

        await navigator.clipboard.writeText(codeId.textContent);
        tickIcon.classList.add('deal-card__tick-icon--active');
        copyIcon.classList.add('deal-card__copy-icon--active');

        setTimeout(() => {
            tickIcon.classList.remove('deal-card__tick-icon--active');
            copyIcon.classList.remove('deal-card__copy-icon--active');
        }, 2000);
    });
};

const getDealsData = async () => {
    if (dealsData) {
        return dealsData;
    }

    const response = await fetch(url);
    dealsData = await response.json();
    return dealsData;
};

// get the deals randomly and if not present, sector will have no deal
const getDeals = (allDeal) => {
    const availableDeals = allDeal.filter(
        (deal) =>
            !wonDeals.some((wonDeal) => wonDeal.promoCode === deal.promoCode),
    );
    availableDeals.sort(() => Math.random() - 0.5);
    const dealSelect = availableDeals.slice(0, deals);
    while (dealSelect.length < deals) {
        dealSelect.push({
            label: 'No Deal',
        });
    }
    return dealSelect;
};

const getOneDeal = (allDeal) => {
    const availableDeals = allDeal.filter(
        (deal) =>
            !wonDeals.some((wonDeal) => wonDeal.promoCode === deal.promoCode) &&
            !currentDeal.some((cur) => cur.promoCode === deal.promoCode),
    );

    availableDeals.sort(() => Math.random() - 0.5);
    if (availableDeals[0]) return availableDeals[0];
    else return { label: 'No Deal' };
};

const colors = ['#f4436c', '#FBBF24', '#06B6D4', '#7C3AED'];

const getDealRotation = (idx) => {
    const rotations = [
        'rotate(-45deg)',
        'rotate(45deg)',
        'rotate(-135deg)',
        'rotate(135deg)',
    ];

    return rotations[idx];
};

const displayDeals = (deals) => {
    spinWheel.querySelectorAll('.deals__deal').forEach((deal) => deal.remove());
    deals.forEach((deal, idx) => {
        const dealDiv = document.createElement('div');
        dealDiv.classList.add('deals__deal');
        const dealSpan = document.createElement('span');
        dealSpan.classList.add('deals__deal-text');
        dealSpan.textContent = deal.label;
        dealSpan.style.transform = getDealRotation(idx);
        dealDiv.append(dealSpan);
        dealDiv.style.backgroundColor = colors[idx % colors.length];
        spinWheel.append(dealDiv);
    });
};

const getSpinnerDeals = async () => {
    await getDealsData();
    currentDeal = getDeals(dealsData);
    displayDeals(currentDeal);
};

const spinBtn = document.querySelector('.deals__spin-btn');
let rotationCount = 0;

const getWinningDeal = (angle) => {
    if (angle > 0 && angle < 90) {
        return { deal: currentDeal[0], idx: 0 };
    }
    if (angle > 90 && angle < 180) {
        return { deal: currentDeal[2], idx: 2 };
    }
    if (angle > 180 && angle < 270) {
        return { deal: currentDeal[3], idx: 3 };
    }
    if (angle > 270 && angle < 360) {
        return { deal: currentDeal[1], idx: 1 };
    }
};

// displaying the winning deal
const displayWinDeal = (angle) => {
    const response = getWinningDeal(angle);
    if (response.deal.label === 'No Deal') {
        return;
    }

    const dealWon = response.deal;
    winBox.classList.add('deals__win-deal--active');
    winBox.innerHTML = winCard(dealWon);
    copyCode();
    wonDeals.push(dealWon);
    localStorage.setItem('wonDeals', JSON.stringify(wonDeals));
    currentDeal[response.idx] = getOneDeal(dealsData);
    displayDeals(currentDeal);
};

// rotate the wheel by random number of times and at some extra random angle to get deal selected
const generateWheelRotation = () => {
    const count = Math.floor(Math.random() * 15) + 1;
    let angle;
    do {
        angle = Math.floor(Math.random() * 361);
    } while (angle % 90 === 0);
    rotationCount += count * 360 + angle;
    spinWheel.style.transform = `rotate(${rotationCount}deg)`;
    setTimeout(() => {
        displayWinDeal(rotationCount % 360);
    }, 2500);
};

spinBtn.addEventListener('click', () => {
    resetWinBox();
    generateWheelRotation();
});

const openModal = async () => {
    overlay.classList.add('overlay--active');
    modal.classList.add('deals--active');
    document.body.classList.add('body--no-scroll');
    await getSpinnerDeals();
};

// close the modal and reset all functionalities
closeBtn.addEventListener('click', () => {
    rotationCount = 0;
    spinWheel.style.transform = 'rotate(0deg)';
    resetWinBox();
    closeModal();
});

// close modal using escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('deals--active')) {
        closeModal();
    }
});
