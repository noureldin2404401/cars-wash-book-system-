

document.addEventListener('DOMContentLoaded', function () {

    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }


    var form           = document.getElementById('add-service-form');
    var submitBtn      = document.getElementById('ms-submit');
    var resetFormBtn   = document.getElementById('reset-form-btn');
    var successAlert   = document.getElementById('form-success');
    var successText    = document.getElementById('form-success-text');
    var servicesList   = document.getElementById('services-list');
    var servicesEmpty  = document.getElementById('services-empty');
    var addFeatureBtn  = document.getElementById('add-feature-btn');
    var featuresWrap   = document.getElementById('features-inputs');
    var descTextarea   = document.getElementById('svc-description');
    var charCount      = document.getElementById('char-count');

    var topbarTime     = document.getElementById('topbar-time');
    var logoutBtn      = document.getElementById('logout-btn');
    var sidebar        = document.getElementById('sidebar');
    var sidebarOpen    = document.getElementById('sidebar-open');
    var sidebarClose   = document.getElementById('sidebar-close');
    var sidebarOverlay = document.getElementById('sidebar-overlay');


    
    var defaultServices = [
        {
            name:     'Basic Wash',
            category: 'Exterior',
            price:    500,
            duration: 30,
            icon:     '🚿',
            desc:     'Exterior hand wash, wheel & tire cleaning, window cleaning and microfiber dry.'
        },
        {
            name:     'Premium Wash',
            category: 'Interior',
            price:    750,
            duration: 45,
            icon:     '✨',
            desc:     'Everything in Basic plus full interior vacuum, dashboard wipe-down, tire shine and air freshener.'
        },
        {
            name:     'VIP Detailing',
            category: 'Full Detail',
            price:    1000,
            duration: 90,
            icon:     '👑',
            desc:     'Everything in Premium plus clay bar, hand wax, paint sealant, leather conditioning and engine bay cleaning.'
        },
        {
            name:     'Chemical Deep Cleaning',
            category: 'Full Detail',
            price:    1500,
            duration: 120,
            icon:     '🧪',
            desc:     'Everything in VIP plus deep chemical interior shampoo, stain removal, antibacterial sanitisation and AC vent disinfection.'
        }
    ];


   
    function showError(id, msg) {
        var el = document.getElementById(id);
        if (!el) return;
        el.textContent = msg;
        el.classList.add('visible');
    }

    function clearError(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.textContent = '';
        el.classList.remove('visible');
    }

    function setErr(input) {
        if (input) { input.classList.add('input-error'); input.classList.remove('input-success'); }
    }

    function setOk(input) {
        if (input) { input.classList.remove('input-error'); input.classList.add('input-success'); }
    }

    function clearState(input) {
        if (input) { input.classList.remove('input-error', 'input-success'); }
    }


    
    function validateForm() {
        var valid = true;

      
        var nameEl  = document.getElementById('svc-name');
        var nameVal = nameEl ? nameEl.value.trim() : '';
        if (!nameVal) {
            showError('error-svc-name', 'Service name is required.');
            setErr(nameEl); valid = false;
        } else if (nameVal.length < 3) {
            showError('error-svc-name', 'Service name must be at least 3 characters.');
            setErr(nameEl); valid = false;
        } else if (nameVal.length > 60) {
            showError('error-svc-name', 'Service name must be 60 characters or fewer.');
            setErr(nameEl); valid = false;
        } else if (!/^[A-Za-z0-9\u0600-\u06FF\s\-&]+$/.test(nameVal)) {
            showError('error-svc-name', 'Service name can only contain letters, numbers, spaces, & and -.');
            setErr(nameEl); valid = false;
        } else {
            clearError('error-svc-name'); setOk(nameEl);
        }

        
        var catEl  = document.getElementById('svc-category');
        var catVal = catEl ? catEl.value : '';
        if (!catVal) {
            showError('error-svc-category', 'Please select a category.');
            setErr(catEl); valid = false;
        } else {
            clearError('error-svc-category'); setOk(catEl);
        }

       
        var priceEl  = document.getElementById('svc-price');
        var priceVal = priceEl ? priceEl.value.trim() : '';
        var priceNum = Number(priceVal);
        if (!priceVal) {
            showError('error-svc-price', 'Price is required.');
            setErr(priceEl); valid = false;
        } else if (isNaN(priceNum) || !Number.isInteger(priceNum)) {
            showError('error-svc-price', 'Price must be a whole number (e.g. 500).');
            setErr(priceEl); valid = false;
        } else if (priceNum < 1) {
            showError('error-svc-price', 'Price must be a positive number greater than 0.');
            setErr(priceEl); valid = false;
        } else if (priceNum > 99999) {
            showError('error-svc-price', 'Price cannot exceed 99,999 EGP.');
            setErr(priceEl); valid = false;
        } else {
            clearError('error-svc-price'); setOk(priceEl);
        }

    
        var durEl  = document.getElementById('svc-duration');
        var durVal = durEl ? durEl.value.trim() : '';
        var durNum = Number(durVal);
        if (!durVal) {
            showError('error-svc-duration', 'Duration is required.');
            setErr(durEl); valid = false;
        } else if (isNaN(durNum) || !Number.isInteger(durNum)) {
            showError('error-svc-duration', 'Duration must be a whole number of minutes (e.g. 45).');
            setErr(durEl); valid = false;
        } else if (durNum < 5) {
            showError('error-svc-duration', 'Duration must be at least 5 minutes.');
            setErr(durEl); valid = false;
        } else if (durNum > 480) {
            showError('error-svc-duration', 'Duration cannot exceed 480 minutes (8 hours).');
            setErr(durEl); valid = false;
        } else {
            clearError('error-svc-duration'); setOk(durEl);
        }

      
        var descEl  = document.getElementById('svc-description');
        var descVal = descEl ? descEl.value.trim() : '';
        if (!descVal) {
            showError('error-svc-description', 'Description is required.');
            setErr(descEl); valid = false;
        } else if (descVal.length < 10) {
            showError('error-svc-description', 'Description must be at least 10 characters.');
            setErr(descEl); valid = false;
        } else {
            clearError('error-svc-description'); setOk(descEl);
        }

        
        var featureInputs = featuresWrap ? featuresWrap.querySelectorAll('.feature-input') : [];
        var filledFeatures = [];
        featureInputs.forEach(function (inp) {
            var val = inp.value.trim();
            if (val) filledFeatures.push(val);
        });
        if (filledFeatures.length < 2) {
            showError('error-features', 'Please provide at least 2 features for this service.');
            valid = false;
        } else {
            clearError('error-features');
        }

        return valid;
    }



    function renderServiceRow(svc, isNew) {
        var row = document.createElement('div');
        row.className = 'svc-row ' + (isNew ? 'added' : 'preset');

        var newBadge = isNew ? '<span class="svc-new-badge">NEW</span>' : '';
        var iconStr  = svc.icon ? svc.icon : '🚗';

        row.innerHTML =
            '<div class="svc-row-icon">' + iconStr + '</div>' +
            '<div class="svc-row-info">' +
                '<div class="svc-row-name">' + escapeHtml(svc.name) + ' ' + newBadge + '</div>' +
                '<div class="svc-row-meta">' +
                    '<span class="svc-row-price">' + svc.price + ' EGP</span>' +
                    '<span class="svc-row-cat">'   + escapeHtml(svc.category) + '</span>' +
                    '<span class="svc-row-duration">⏱ ' + svc.duration + ' min</span>' +
                '</div>' +
                '<p class="svc-row-desc">' + escapeHtml(svc.desc) + '</p>' +
            '</div>' +
            '<button class="svc-delete-btn" aria-label="Delete ' + escapeHtml(svc.name) + '">🗑️</button>';

       
        var deleteBtn = row.querySelector('.svc-delete-btn');
        deleteBtn.addEventListener('click', function () {
            row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            row.style.opacity    = '0';
            row.style.transform  = 'translateX(30px)';
            setTimeout(function () {
                row.remove();
                checkEmpty();
            }, 300);
        });

        return row;
    }

    function checkEmpty() {
        var rows = servicesList ? servicesList.querySelectorAll('.svc-row') : [];
        if (servicesEmpty) {
            servicesEmpty.style.display = rows.length === 0 ? 'block' : 'none';
        }
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    
    if (servicesList) {
        defaultServices.forEach(function (svc) {
            servicesList.appendChild(renderServiceRow(svc, false));
        });
        checkEmpty();
    }


   
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (successAlert) successAlert.classList.remove('visible');

            if (!validateForm()) return;

           
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(function () {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                
                var iconEl = document.getElementById('svc-icon');
                var newSvc = {
                    name:     document.getElementById('svc-name').value.trim(),
                    category: document.getElementById('svc-category').value,
                    price:    Number(document.getElementById('svc-price').value),
                    duration: Number(document.getElementById('svc-duration').value),
                    icon:     iconEl && iconEl.value.trim() ? iconEl.value.trim() : '🚗',
                    desc:     document.getElementById('svc-description').value.trim()
                };

              
                if (servicesList) {
                    servicesList.insertBefore(renderServiceRow(newSvc, true), servicesList.firstChild);
                    checkEmpty();

                    
                    servicesList.scrollTo({ top: 0, behavior: 'smooth' });
                }

               
                if (successText) successText.textContent = '"' + newSvc.name + '" has been added successfully!';
                if (successAlert) successAlert.classList.add('visible');

               
                form.reset();
                resetFeatureRows();
                if (charCount) charCount.textContent = '0';
                clearAllStates();

               
                setTimeout(function () {
                    if (successAlert) successAlert.classList.remove('visible');
                }, 4000);

            }, 700);
        });
    }


    
    function clearAllStates() {
        form.querySelectorAll('.form-input').forEach(function (inp) {
            clearState(inp);
        });
        form.querySelectorAll('.field-error').forEach(function (el) {
            el.textContent = '';
            el.classList.remove('visible');
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', function () {
            form.reset();
            resetFeatureRows();
            if (charCount) charCount.textContent = '0';
            clearAllStates();
            if (successAlert) successAlert.classList.remove('visible');
        });
    }


   
    var MAX_FEATURES = 8;

    function resetFeatureRows() {
        if (!featuresWrap) return;
        featuresWrap.innerHTML = '';
        addFeatureRow(); addFeatureRow();
        updateRemoveButtons();
    }

    function addFeatureRow(value) {
        if (!featuresWrap) return;
        var currentCount = featuresWrap.querySelectorAll('.feature-input-row').length;
        if (currentCount >= MAX_FEATURES) return;

        var row = document.createElement('div');
        row.className = 'feature-input-row';
        row.innerHTML =
            '<input type="text" class="form-input feature-input" placeholder="e.g. Exterior hand wash" maxlength="80" value="' +
            (value ? escapeHtml(value) : '') + '">' +
            '<button type="button" class="feature-remove-btn" aria-label="Remove feature">✕</button>';

        var removeBtn = row.querySelector('.feature-remove-btn');
        removeBtn.addEventListener('click', function () {
            row.remove();
            updateRemoveButtons();
        });

        featuresWrap.appendChild(row);
        updateRemoveButtons();

        if (addFeatureBtn) {
            addFeatureBtn.style.display =
                featuresWrap.querySelectorAll('.feature-input-row').length >= MAX_FEATURES ? 'none' : 'inline-block';
        }
    }

    function updateRemoveButtons() {
        if (!featuresWrap) return;
        var rows   = featuresWrap.querySelectorAll('.feature-input-row');
        var btns   = featuresWrap.querySelectorAll('.feature-remove-btn');
        btns.forEach(function (btn) {
            btn.disabled = rows.length <= 2;
        });
        if (addFeatureBtn) {
            addFeatureBtn.style.display = rows.length >= MAX_FEATURES ? 'none' : 'inline-block';
        }
    }

    if (addFeatureBtn) {
        addFeatureBtn.addEventListener('click', function () {
            addFeatureRow();
        });
    }

    
    resetFeatureRows();


  
    if (descTextarea && charCount) {
        descTextarea.addEventListener('input', function () {
            charCount.textContent = descTextarea.value.length;
        });
    }


   
    var liveFields = ['svc-name', 'svc-category', 'svc-price', 'svc-duration', 'svc-description'];
    var errorIds   = ['error-svc-name', 'error-svc-category', 'error-svc-price', 'error-svc-duration', 'error-svc-description'];

    liveFields.forEach(function (id, i) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function () {
            clearError(errorIds[i]);
            clearState(el);
        });
        el.addEventListener('change', function () {
            clearError(errorIds[i]);
            clearState(el);
        });
    });


    function updateClock() {
        if (!topbarTime) return;
        topbarTime.textContent = new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }
    setInterval(updateClock, 1000);
    updateClock();


 
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'admin-login.html';
        });
    }


    
    function openSidebar()  {
        if (sidebar)        sidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('visible');
    }
    function closeSidebar() {
        if (sidebar)        sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('visible');
    }

    if (sidebarOpen)    sidebarOpen.addEventListener('click',    openSidebar);
    if (sidebarClose)   sidebarClose.addEventListener('click',   closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

});
