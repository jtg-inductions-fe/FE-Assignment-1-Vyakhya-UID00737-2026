import { closeMenu } from './utils.js';
import {
    SPIN_TIME,
    COPY_FEEDBACK_TIME,
    DEALS,
    MILLISECOND_PER_DAY,
} from './constants.js';

export const getSpecialDeals = () => {
    // Special deals modal working
    const DEAL_LINK = document.querySelectorAll('.special-deals');
    const MENU_LINKS = document.querySelector('.navbar__menu');
    const MODAL = document.querySelector('.deals');
    const CLOSE_BTN = document.querySelector('.deals__close-btn');
    const LOADER = document.querySelector('.deals__loader');
    const SPINNER = document.querySelector('.deals__spinner-wheel');
    const DEALS_BTN = document.querySelector('.deals__btn');
    const WHEEL_POINTER = document.querySelector('.deals__arrow-img');
    const OVERLAY = document.querySelector('.overlay');
    const UNLOCK_BTN = document.querySelector('.deals__btn');
    const UNLOCK_DEALS_SECTION = document.querySelector(
        '.deals__unlock-deals-section',
    );
    const SPINNER_WHEEL_SECTION = document.querySelector(
        '.deals__spinner-section',
    );
    const SHOW_WIN_DEAL = document.querySelector('.deals__show-win-deal');
    const BACK_BTN = document.querySelector('.deals__back-btn');
    const COUNT = document.querySelector('.counter');

    // added to close the modal
    const closeModal = () => {
        OVERLAY.classList.remove('overlay--active');
        MODAL.classList.remove('deals--active');
        WHEEL_POINTER.classList.remove('active');
        document.body.classList.remove('no-scroll');
        UNLOCK_DEALS_SECTION.classList.remove(
            'deals__unlock-deals-section--active',
        );
        SPINNER_WHEEL_SECTION.classList.remove(
            'deals__spinner-section--disable',
        );
        document.body.classList.remove('body--no-scroll');
    };

    /**
     * shows loading status
     * till the time fetching data from API
     */
    const showLoading = () => {
        LOADER.hidden = false;
        SPINNER.hidden = true;
        DEALS_BTN.hidden = true;
    };

    /**
     * Opens modal on screen
     * Get deals data from API or cache
     * Display the spinner and hides loading state
     */
    const openModal = async () => {
        OVERLAY.classList.add('overlay--active');
        MODAL.classList.add('deals--active');
        document.body.classList.add('no-scroll');
        COUNT.textContent = wonDeals.length;
        await getSpinnerDeals();
        LOADER.hidden = true;
        SPINNER.hidden = false;
        DEALS_BTN.hidden = false;
        WHEEL_POINTER.classList.add('active');
    };

    // opens modal and starts spinner wheel loading state
    const showDealsModal = () => {
        openModal();
        showLoading();
    };

    // control to open modal by link
    DEAL_LINK.forEach((link) => {
        link.addEventListener('click', () => {
            if (MENU_LINKS.classList.contains('navbar__menu--active')) {
                closeMenu();
            }
            showDealsModal();
        });
    });

    // Spinner wheel functionality
    const SPIN_WHEEL = document.querySelector('.deals__wheel');
    const WINBOX = document.querySelector('.deals__win-deal');
    const DEAL_LABEL = document.querySelector('.deal-card__deal-label');
    const DEAL_VALIDDATE = document.querySelector('.deal-card__valid-date');
    const DEAL_PROMOCODE = document.querySelector('.deal-card__deal-id');
    const DEAL_API_URL = import.meta.env.VITE_DEAL_API_URL;

    // defined HTML literal to use in unlock deal-section to display n-number of all unlocked deals
    const wonCards = (deal) => {
        const leftDays = calculateLeftTimeForDeal(deal);
        return `
            <div class="deal-card ${leftDays === 0 ? 'deal-card--expired' : ''}">
                <div class="deal-card__info">
                    <p class="deal-card__deal-label text-label">${deal.label}</p>
                    <p class="deal-card__valid-date p-text-primary ${leftDays === 0 ? 'deal-card__valid-date--expired' : ''}">${leftDays === 0 ? 'Deal Expired' : `Expires in ${leftDays}d`}</p>
                </div>
                <div class="deal-card__code">
                    <p class="deal-card__deal-id p-text-secondary">${deal.promoCode}</p>
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
                            hidden
                        />
                    </button>
                </div>
            </div>
        `;
    };

    // Spinner wheel functionality
    let dealsData = null;
    let activeDeals = [];
    let wonDeals = JSON.parse(localStorage.getItem('wonDeals')) || [];
    const DEAL_MESSAGE = document.querySelector('.deals__message');

    // resets the winDeal box (to show no winning deal at starting state when modal opens)
    const resetWinBox = () => {
        WINBOX.classList.remove('deals__win-deal--active');
        DEAL_LABEL.innerHTML = '';
        DEAL_VALIDDATE.innerHTML = '';
        DEAL_PROMOCODE.innerHTML = '';
    };

    /**
     * Copies the promo code of the won deal.
     * Shows a tick icon to indicate that
     * the code has copied successfully.
     */
    const copyCode = async (copyButton) => {
        const DEAL_CARD = copyButton.closest('.deal-card');
        const CODE_ID = DEAL_CARD.querySelector('.deal-card__deal-id');
        const COPY_ICON = DEAL_CARD.querySelector('.deal-card__copy-icon');
        const TICK_ICON = DEAL_CARD.querySelector('.deal-card__tick-icon');

        if (!CODE_ID) return;

        await navigator.clipboard.writeText(CODE_ID.textContent);

        TICK_ICON.hidden = false;
        TICK_ICON.classList.add('deal-card__tick-icon--active');
        COPY_ICON.classList.add('deal-card__copy-icon--active');

        setTimeout(() => {
            TICK_ICON.classList.remove('deal-card__tick-icon--active');
            COPY_ICON.classList.remove('deal-card__copy-icon--active');
            TICK_ICON.hidden = true;
        }, COPY_FEEDBACK_TIME);
    };

    /**
     * Fetches all deals from the API.
     * Once fetched, the data is stored so the API
     * is not called again.
     *
     * @returns {Array} List of deals.
     */
    const getDealsData = async () => {
        if (dealsData) {
            return dealsData;
        }

        const RESPONSE = await fetch(DEAL_API_URL);
        dealsData = await RESPONSE.json();
        return dealsData;
    };

    /** Pick the deals randomly
     * Deals that user has already won, will be skipped
     * If less than 4 deals are remaining, 'No Deal; will be displayed at that section of spinner
     * @param {Array} list of all deals
     * @returns {Array} list of deals to show on spinner
     */
    const getDeals = (allDeal) => {
        const AVAILABLE_DEALS = allDeal.filter(
            (deal) =>
                !wonDeals.some(
                    (wonDeal) => wonDeal.promoCode === deal.promoCode,
                ),
        );
        AVAILABLE_DEALS.sort(() => Math.random() - 0.5);
        const DEAL_SELECT = AVAILABLE_DEALS.slice(0, DEALS);
        while (DEAL_SELECT.length < DEALS) {
            DEAL_SELECT.push({
                label: 'No Deal',
            });
        }
        return DEAL_SELECT;
    };

    /**
     * Replaces won deal with new one
     * New deal shown will not already won
     *
     * @param {Array} List of all deals
     * @returns {Object} New deal or No deal
     */
    const getOneDeal = (allDeal) => {
        const AVAILABLE_DEALS = allDeal.filter(
            (deal) =>
                !wonDeals.some(
                    (wonDeal) => wonDeal.promoCode === deal.promoCode,
                ) &&
                !activeDeals.some((cur) => cur.promoCode === deal.promoCode),
        );

        AVAILABLE_DEALS.sort(() => Math.random() - 0.5);
        if (AVAILABLE_DEALS[0]) return AVAILABLE_DEALS[0];
        else return { label: 'No Deal' };
    };

    // defines the rotation angle of text inside spinner wheel
    const getDealRotation = (idx) => {
        const COLORS = ['#f4436c', '#FBBF24', '#06B6D4', '#7C3AED'];
        const ROTATIONS = [
            'rotate(-45deg)',
            'rotate(45deg)',
            'rotate(-135deg)',
            'rotate(135deg)',
        ];

        return {
            rotation: ROTATIONS[idx],
            selectedColor: COLORS[idx],
        };
    };

    /**
     * If none of the deals are available
     * Disable the spin button
     * Display the message of no deals available
     */
    const updateSpinState = () => {
        const NO_DEALS_AVAILABLE = activeDeals.every(
            (deal) => deal.label === 'No Deal',
        );

        if (NO_DEALS_AVAILABLE) {
            SPIN_BTN.disabled = true;
            DEAL_MESSAGE.textContent = 'No Deals Available!';
        }
    };

    /**
     * Display the selected deals on the spinner
     * First existing sectors will remove
     * New sectors will be added
     * @param {Array} deals to be displayed on spinner
     */
    const displayDeals = (deals) => {
        SPIN_WHEEL.querySelectorAll('.deals__deal').forEach((deal) =>
            deal.remove(),
        );
        deals.forEach((deal, idx) => {
            const DEAL_DIV = document.createElement('div');
            DEAL_DIV.classList.add('deals__deal');
            const DEAL_SPAN = document.createElement('span');
            DEAL_SPAN.classList.add('deals__deal-text');
            DEAL_SPAN.textContent = deal.label;
            const RESPONSE = getDealRotation(idx);
            DEAL_SPAN.style.transform = RESPONSE.rotation;
            DEAL_DIV.append(DEAL_SPAN);
            DEAL_DIV.style.backgroundColor =
                deal.label === 'No Deal'
                    ? DEAL_DIV.classList.add('deals__deal--disable')
                    : RESPONSE.selectedColor;
            SPIN_WHEEL.append(DEAL_DIV);
        });
        updateSpinState();
    };

    // selects deals and displays them on spinner wheel.
    const getSpinnerDeals = async () => {
        await getDealsData();
        activeDeals = getDeals(dealsData);
        displayDeals(activeDeals);
    };

    const SPIN_BTN = document.querySelector('.deals__spin-btn');
    let rotationCount = 0;

    /**
     * Finds the selected deal
     * according to the extra angle spinner has rotated
     * @param {number} extra angle spinner rotated
     * @returns {Object} deal won and its index
     */
    const getWinningDeal = (angle) => {
        if (angle > 0 && angle < 90) {
            return { deal: activeDeals[0], idx: 0 };
        }
        if (angle > 90 && angle < 180) {
            return { deal: activeDeals[2], idx: 2 };
        }
        if (angle > 180 && angle < 270) {
            return { deal: activeDeals[3], idx: 3 };
        }
        if (angle > 270 && angle < 360) {
            return { deal: activeDeals[1], idx: 1 };
        }
    };

    /**
     * Shows the winning deal to the user.
     * The deal is saved and replaced with a new one on the spinner.
     * @param {angle} extra angle spinner rotated
     */
    const displayWinDeal = (angle) => {
        const RESPONSE = getWinningDeal(angle);
        if (RESPONSE.deal.label === 'No Deal') {
            return;
        }

        const DEAL_WON = RESPONSE.deal;
        WINBOX.classList.add('deals__win-deal--active');
        DEAL_LABEL.textContent = DEAL_WON.label;
        DEAL_VALIDDATE.textContent = `Expires in ${DEAL_WON.validFor ? DEAL_WON.validFor : '7'}d`;
        DEAL_PROMOCODE.textContent = DEAL_WON.promoCode;
        wonDeals.push({
            ...DEAL_WON,
            validFor: DEAL_WON.validFor || 7,
            wonDate: new Date(),
        });
        localStorage.setItem('wonDeals', JSON.stringify(wonDeals));
        activeDeals[RESPONSE.idx] = getOneDeal(dealsData);
        COUNT.textContent = wonDeals.length;
        displayDeals(activeDeals);
    };

    /**
     * Spins the wheel by a random number of rotations
     * Ignored the angle which is multiple of 90
     * So, pointer will never stop on edges
     */
    const generateWheelRotation = () => {
        let count = Math.floor(Math.random() * 15) + 1;
        let angle;
        do {
            angle = Math.floor(Math.random() * 361);
        } while (angle % 90 === 0);
        rotationCount += count * 360 + angle;
        SPIN_WHEEL.style.transform = `rotate(${rotationCount}deg)`;
        setTimeout(() => {
            displayWinDeal(rotationCount % 360);
        }, SPIN_TIME);
    };

    SPIN_BTN.addEventListener('click', () => {
        resetWinBox();
        generateWheelRotation();
    });

    /**
     * Handles clicks on the copy button.
     * Event delegation is used because
     * the deal card is created dynamically.
     */
    const handleEventOnModal = () => {
        MODAL.addEventListener('click', (e) => {
            const COPY_BTN = e.target.closest('.deal-card__copy');
            if (COPY_BTN) {
                copyCode(COPY_BTN);
            }
        });
    };

    // Sort deals by expiring date
    const sortDeals = (allWinDeal) => {
        allWinDeal.sort((a, b) => b.validFor - a.validFor);
    };

    // Displaying all winning deals showWinDeal
    const displayAllWinDeals = () => {
        UNLOCK_DEALS_SECTION.classList.add(
            'deals__unlock-deals-section--active',
        );
        SPINNER_WHEEL_SECTION.classList.add('deals__spinner-section--disable');
        SHOW_WIN_DEAL.innerHTML = '';
        if (wonDeals.length === 0) {
            SHOW_WIN_DEAL.innerHTML =
                '<p class=text-body>No Deal Available!</p>';
            return;
        }
        sortDeals(wonDeals);
        wonDeals.forEach((deal) => {
            SHOW_WIN_DEAL.innerHTML += wonCards(deal);
        });
        SHOW_WIN_DEAL.classList.add('deals__show-win-deal--active');
    };

    // calculating time left for unlocked deal to get expired
    const calculateLeftTimeForDeal = (deal) => {
        const DEAL_DATE = new Date(deal.wonDate);
        const VALID_DATE = deal.validFor;
        const CUR_DATE = new Date();
        const TIME = Math.abs(DEAL_DATE - CUR_DATE);
        const DAYS = Math.floor(TIME / MILLISECOND_PER_DAY);
        return VALID_DATE - DAYS;
    };

    UNLOCK_BTN.addEventListener('click', () => {
        displayAllWinDeals();
    });

    handleEventOnModal();
    BACK_BTN.addEventListener('click', () => {
        UNLOCK_DEALS_SECTION.classList.remove(
            'deals__unlock-deals-section--active',
        );
        SPINNER_WHEEL_SECTION.classList.remove(
            'deals__spinner-section--disable',
        );
    });

    // close the modal and reset all functionalities
    CLOSE_BTN.addEventListener('click', () => {
        rotationCount = 0;
        SPIN_WHEEL.style.transform = 'rotate(0deg)';
        resetWinBox();
        closeModal();
    });

    // close modal using escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && MODAL.classList.contains('deals--active')) {
            closeModal();
        }
    });
};
