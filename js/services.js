

document.addEventListener('DOMContentLoaded', function () {

   
    var cards        = document.querySelectorAll('.srv-card');
    var selectBtns   = document.querySelectorAll('.srv-select-btn');
    var selectionBar = document.getElementById('selection-bar');
    var selIcon      = document.getElementById('sel-icon');
    var selName      = document.getElementById('sel-name');
    var selPrice     = document.getElementById('sel-price');
    var selBookBtn   = document.getElementById('sel-book-btn');
    var selClear     = document.getElementById('sel-clear');
    var filterBtns   = document.querySelectorAll('.filter-btn');

   
    var serviceIcons = {
        'Basic Wash':             '🚿',
        'Premium Wash':           '✨',
        'VIP Detailing':          '👑',
        'Chemical Deep Cleaning': '🧪'
    };

    var selectedService = null;


  

    function selectService(serviceName, price) {
        selectedService = { name: serviceName, price: price };

      
        cards.forEach(function (card) {
            if (card.getAttribute('data-service') === serviceName) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

       
        selIcon.textContent  = serviceIcons[serviceName] || '🚗';
        selName.textContent  = serviceName;
        selPrice.textContent = price + ' EGP';

      
        sessionStorage.setItem('selectedService', serviceName);
        sessionStorage.setItem('selectedPrice',   price);
        selBookBtn.href = 'booking.html';

        
        selectionBar.classList.add('visible');
    }


    
    function clearSelection() {
        selectedService = null;

        cards.forEach(function (card) {
            card.classList.remove('selected');
        });

        sessionStorage.removeItem('selectedService');
        sessionStorage.removeItem('selectedPrice');

        selectionBar.classList.remove('visible');
    }


    

    
    cards.forEach(function (card) {
        card.addEventListener('click', function (e) {
            
            if (e.target.classList.contains('srv-select-btn')) return;

            var service = card.getAttribute('data-service');
            var price   = card.getAttribute('data-price');
            selectService(service, price);
        });
    });

   
    selectBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();   
            var service = btn.getAttribute('data-service');
            var price   = btn.getAttribute('data-price');
            selectService(service, price);
        });
    });

   
    if (selClear) {
        selClear.addEventListener('click', function (e) {
            e.preventDefault();
            clearSelection();
        });
    }


   

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
           
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');

            cards.forEach(function (card) {
                var category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                   
                    card.classList.remove('visible');
                    setTimeout(function () {
                        card.classList.add('visible');
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });

           
            if (selectedService) {
                var selectedCard = document.querySelector('.srv-card.selected');
                if (!selectedCard || selectedCard.classList.contains('hidden')) {
                    clearSelection();
                }
            }
        });
    });



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


   

    var savedService = sessionStorage.getItem('selectedService');
    var savedPrice   = sessionStorage.getItem('selectedPrice');

    if (savedService && savedPrice) {
        selectService(savedService, savedPrice);
    }

});
