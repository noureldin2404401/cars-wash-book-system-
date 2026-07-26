/**
 * services.js — SparkleWash Services Page
 * Member 3 | Dynamic Service Selection & Filter UI
 *
 * Features:
 *  - Click a service card to highlight / select it
 *  - Sticky bottom bar appears showing the selected service & price
 *  - "Book This Service" button passes the selection to booking.html
 *    via sessionStorage (booking.js reads it on load)
 *  - Filter tabs (All / Exterior / Interior / Full Detail)
 *    show/hide cards by data-category attribute
 *  - Clear selection button resets the bar and card highlights
 *  - Reveal animations re-triggered after filter
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ─────────────────────────────────────────────────────
       1. ELEMENT REFERENCES
    ───────────────────────────────────────────────────── */
    var cards        = document.querySelectorAll('.srv-card');
    var selectBtns   = document.querySelectorAll('.srv-select-btn');
    var selectionBar = document.getElementById('selection-bar');
    var selIcon      = document.getElementById('sel-icon');
    var selName      = document.getElementById('sel-name');
    var selPrice     = document.getElementById('sel-price');
    var selBookBtn   = document.getElementById('sel-book-btn');
    var selClear     = document.getElementById('sel-clear');
    var filterBtns   = document.querySelectorAll('.filter-btn');

    /* Map each service name to its emoji icon */
    var serviceIcons = {
        'Basic Wash':             '🚿',
        'Premium Wash':           '✨',
        'VIP Detailing':          '👑',
        'Chemical Deep Cleaning': '🧪'
    };

    var selectedService = null;


    /* ─────────────────────────────────────────────────────
       2. SELECT A SERVICE
    ───────────────────────────────────────────────────── */

    function selectService(serviceName, price) {
        selectedService = { name: serviceName, price: price };

        /* Highlight the right card, deselect others */
        cards.forEach(function (card) {
            if (card.getAttribute('data-service') === serviceName) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        /* Update the sticky bar */
        selIcon.textContent  = serviceIcons[serviceName] || '🚗';
        selName.textContent  = serviceName;
        selPrice.textContent = price + ' EGP';

        /* Build booking URL with the selection stored in sessionStorage
           so booking.js can pre-fill the service on the booking page  */
        sessionStorage.setItem('selectedService', serviceName);
        sessionStorage.setItem('selectedPrice',   price);
        selBookBtn.href = 'booking.html';

        /* Show the sticky bar */
        selectionBar.classList.add('visible');
    }


    /* ─────────────────────────────────────────────────────
       3. CLEAR SELECTION
    ───────────────────────────────────────────────────── */

    function clearSelection() {
        selectedService = null;

        cards.forEach(function (card) {
            card.classList.remove('selected');
        });

        sessionStorage.removeItem('selectedService');
        sessionStorage.removeItem('selectedPrice');

        selectionBar.classList.remove('visible');
    }


    /* ─────────────────────────────────────────────────────
       4. ATTACH CARD CLICK EVENTS
    ───────────────────────────────────────────────────── */

    /* Clicking the whole card also selects it */
    cards.forEach(function (card) {
        card.addEventListener('click', function (e) {
            /* Ignore if the user clicked the select button (handled separately) */
            if (e.target.classList.contains('srv-select-btn')) return;

            var service = card.getAttribute('data-service');
            var price   = card.getAttribute('data-price');
            selectService(service, price);
        });
    });

    /* Clicking the "Select Package" button inside a card */
    selectBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();   /* prevent the card click event firing too */
            var service = btn.getAttribute('data-service');
            var price   = btn.getAttribute('data-price');
            selectService(service, price);
        });
    });

    /* Clear button in sticky bar */
    if (selClear) {
        selClear.addEventListener('click', function (e) {
            e.preventDefault();
            clearSelection();
        });
    }


    /* ─────────────────────────────────────────────────────
       5. FILTER TABS
    ───────────────────────────────────────────────────── */

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            /* Update active button */
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');

            cards.forEach(function (card) {
                var category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    /* Re-trigger reveal animation */
                    card.classList.remove('visible');
                    setTimeout(function () {
                        card.classList.add('visible');
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });

            /* If the currently selected card got hidden, clear the bar */
            if (selectedService) {
                var selectedCard = document.querySelector('.srv-card.selected');
                if (!selectedCard || selectedCard.classList.contains('hidden')) {
                    clearSelection();
                }
            }
        });
    });


    /* ─────────────────────────────────────────────────────
       6. KEYBOARD ACCESSIBILITY
         (Enter or Space on a card triggers selection)
    ───────────────────────────────────────────────────── */

    cards.forEach(function (card) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                var service = card.getAttribute('data-service');
                var price   = card.getAttribute('data-price');
                selectService(service, price);
            }
        });
    });


    /* ─────────────────────────────────────────────────────
       7. RESTORE PREVIOUS SELECTION (if user navigates back)
    ───────────────────────────────────────────────────── */

    var savedService = sessionStorage.getItem('selectedService');
    var savedPrice   = sessionStorage.getItem('selectedPrice');

    if (savedService && savedPrice) {
        selectService(savedService, savedPrice);
    }

});
