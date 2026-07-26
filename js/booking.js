/**
 * booking.js — SparkleWash Booking Page
 * Member 2 | Client-Side Validation & Dynamic UI
 *
 * Features:
 *  - Multi-step form navigation (Step 1 → 2 → 3)
 *  - Live booking summary sidebar updates
 *  - Strict client-side validation on every step:
 *      Step 1 : service must be selected
 *      Step 2 : date (not empty, not in the past), time (not empty)
 *      Step 3 : first/last name (letters only, ≥2 chars),
 *               email (valid format), phone (digits only, 10-11 digits),
 *               car model (not empty), terms checkbox (must be checked)
 *  - Visual error / success states on inputs
 *  - Submit simulation with loading spinner & success screen
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ─────────────────────────────────────────────────────
       0.  ELEMENT REFERENCES
    ───────────────────────────────────────────────────── */
    var form           = document.getElementById('booking-form');
    var successPanel   = document.getElementById('booking-success');
    var successName    = document.getElementById('success-name');
    var successDate    = document.getElementById('success-date');
    var successTime    = document.getElementById('success-time');

    // Step panels
    var panels         = document.querySelectorAll('.form-step-panel');
    // Step indicators (numbered circles in header)
    var stepIndicators = document.querySelectorAll('.form-steps .form-step');
    var connectors     = document.querySelectorAll('.step-connector');

    // Navigation buttons
    var btnStep1Next   = document.getElementById('btn-step1-next');
    var btnStep2Back   = document.getElementById('btn-step2-back');
    var btnStep2Next   = document.getElementById('btn-step2-next');
    var btnStep3Back   = document.getElementById('btn-step3-back');
    var btnSubmit      = document.getElementById('btn-submit');

    // Summary sidebar elements
    var sumService     = document.getElementById('sum-service');
    var sumDate        = document.getElementById('sum-date');
    var sumTime        = document.getElementById('sum-time');
    var sumPrice       = document.getElementById('sum-price');

    // Date input — set min to today (no past dates)
    var dateInput      = document.getElementById('booking-date');
    if (dateInput) {
        dateInput.setAttribute('min', getTodayString());
    }

    var currentStep = 1;


    /* ─────────────────────────────────────────────────────
       1.  UTILITIES
    ───────────────────────────────────────────────────── */

    /** Returns today's date in YYYY-MM-DD format for the min attribute */
    function getTodayString() {
        var d = new Date();
        var month = String(d.getMonth() + 1).padStart(2, '0');
        var day   = String(d.getDate()).padStart(2, '0');
        return d.getFullYear() + '-' + month + '-' + day;
    }

    /** Format YYYY-MM-DD to "Monday, 28 Jul 2026" */
    function formatDate(isoString) {
        if (!isoString) return '—';
        var parts = isoString.split('-');
        var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-GB', {
            weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
        });
    }

    /** Show an error message beneath a field */
    function showError(errorId, message) {
        var el = document.getElementById(errorId);
        if (!el) return;
        el.textContent = message;
        el.classList.add('visible');
    }

    /** Clear error message beneath a field */
    function clearError(errorId) {
        var el = document.getElementById(errorId);
        if (!el) return;
        el.textContent = '';
        el.classList.remove('visible');
    }

    /** Mark input as error state */
    function setInputError(inputEl) {
        if (!inputEl) return;
        inputEl.classList.add('input-error');
        inputEl.classList.remove('input-success');
    }

    /** Mark input as success state */
    function setInputSuccess(inputEl) {
        if (!inputEl) return;
        inputEl.classList.remove('input-error');
        inputEl.classList.add('input-success');
    }

    /** Clear input state (neutral) */
    function clearInputState(inputEl) {
        if (!inputEl) return;
        inputEl.classList.remove('input-error', 'input-success');
    }


    /* ─────────────────────────────────────────────────────
       2.  STEP NAVIGATION
    ───────────────────────────────────────────────────── */

    function goToStep(step) {
        // Hide all panels
        panels.forEach(function (p) { p.classList.remove('active'); });

        // Show target panel
        var targetPanel = document.getElementById('step-panel-' + step);
        if (targetPanel) targetPanel.classList.add('active');

        // Update step indicators
        stepIndicators.forEach(function (indicator, i) {
            var stepNum = i + 1;
            indicator.classList.remove('active', 'done');
            if (stepNum === step) {
                indicator.classList.add('active');
            } else if (stepNum < step) {
                indicator.classList.add('done');
                // Replace number with checkmark
                var dot = indicator.querySelector('.step-dot');
                if (dot) dot.textContent = '✔';
            } else {
                // Reset dot text to number for future steps
                var dot = indicator.querySelector('.step-dot');
                if (dot) dot.textContent = stepNum;
            }
        });

        // Update connectors
        connectors.forEach(function (c, i) {
            if (i + 1 < step) {
                c.classList.add('done');
            } else {
                c.classList.remove('done');
            }
        });

        currentStep = step;

        // Scroll to top of form smoothly
        var formEl = document.querySelector('.booking-form-wrapper');
        if (formEl) {
            formEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }


    /* ─────────────────────────────────────────────────────
       3.  VALIDATION FUNCTIONS
    ───────────────────────────────────────────────────── */

    /** Step 1: at least one service radio must be selected */
    function validateStep1() {
        var selected = document.querySelector('input[name="service"]:checked');
        if (!selected) {
            showError('error-service', 'Please select a wash service to continue.');
            return false;
        }
        clearError('error-service');
        return true;
    }

    /** Step 2: date (not empty, not in the past) + time (not empty) */
    function validateStep2() {
        var valid = true;

        var dateEl = document.getElementById('booking-date');
        var timeEl = document.getElementById('booking-time');

        // ── Date validation ──
        if (!dateEl.value) {
            showError('error-date', 'Please select a date for your appointment.');
            setInputError(dateEl);
            valid = false;
        } else {
            // Check it's not in the past
            var selectedParts = dateEl.value.split('-');
            var selectedDate  = new Date(
                Number(selectedParts[0]),
                Number(selectedParts[1]) - 1,
                Number(selectedParts[2])
            );
            var today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                showError('error-date', 'Appointment date cannot be in the past. Please choose today or a future date.');
                setInputError(dateEl);
                valid = false;
            } else {
                clearError('error-date');
                setInputSuccess(dateEl);
            }
        }

        // ── Time validation ──
        if (!timeEl.value) {
            showError('error-time', 'Please choose a preferred time slot.');
            setInputError(timeEl);
            valid = false;
        } else {
            clearError('error-time');
            setInputSuccess(timeEl);
        }

        return valid;
    }

    /** Step 3: personal details + terms */
    function validateStep3() {
        var valid = true;

        // ── First Name ──
        var firstNameEl = document.getElementById('first-name');
        var firstName   = firstNameEl.value.trim();
        if (!firstName) {
            showError('error-first-name', 'First name is required.');
            setInputError(firstNameEl);
            valid = false;
        } else if (firstName.length < 2) {
            showError('error-first-name', 'First name must be at least 2 characters.');
            setInputError(firstNameEl);
            valid = false;
        } else if (!/^[A-Za-z\u0600-\u06FF\s]+$/.test(firstName)) {
            showError('error-first-name', 'First name must contain letters only.');
            setInputError(firstNameEl);
            valid = false;
        } else {
            clearError('error-first-name');
            setInputSuccess(firstNameEl);
        }

        // ── Last Name ──
        var lastNameEl = document.getElementById('last-name');
        var lastName   = lastNameEl.value.trim();
        if (!lastName) {
            showError('error-last-name', 'Last name is required.');
            setInputError(lastNameEl);
            valid = false;
        } else if (lastName.length < 2) {
            showError('error-last-name', 'Last name must be at least 2 characters.');
            setInputError(lastNameEl);
            valid = false;
        } else if (!/^[A-Za-z\u0600-\u06FF\s]+$/.test(lastName)) {
            showError('error-last-name', 'Last name must contain letters only.');
            setInputError(lastNameEl);
            valid = false;
        } else {
            clearError('error-last-name');
            setInputSuccess(lastNameEl);
        }

        // ── Email ──
        var emailEl = document.getElementById('email');
        var email   = emailEl.value.trim();
        // RFC 5322-inspired simple regex
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!email) {
            showError('error-email', 'Email address is required.');
            setInputError(emailEl);
            valid = false;
        } else if (!emailRegex.test(email)) {
            showError('error-email', 'Please enter a valid email address (e.g. user@example.com).');
            setInputError(emailEl);
            valid = false;
        } else {
            clearError('error-email');
            setInputSuccess(emailEl);
        }

        // ── Phone ──
        var phoneEl = document.getElementById('phone');
        var phone   = phoneEl.value.trim();
        var phoneRegex = /^[0-9]{10,11}$/;
        if (!phone) {
            showError('error-phone', 'Phone number is required.');
            setInputError(phoneEl);
            valid = false;
        } else if (!/^[0-9]+$/.test(phone)) {
            showError('error-phone', 'Phone number must contain digits only (no spaces, dashes, or letters).');
            setInputError(phoneEl);
            valid = false;
        } else if (!phoneRegex.test(phone)) {
            showError('error-phone', 'Phone number must be 10 or 11 digits (e.g. 01012345678).');
            setInputError(phoneEl);
            valid = false;
        } else {
            clearError('error-phone');
            setInputSuccess(phoneEl);
        }

        // ── Car Model ──
        var carEl = document.getElementById('car-model');
        var car   = carEl.value.trim();
        if (!car) {
            showError('error-car-model', 'Please enter your car make and model.');
            setInputError(carEl);
            valid = false;
        } else if (car.length < 3) {
            showError('error-car-model', 'Please provide a more complete car description.');
            setInputError(carEl);
            valid = false;
        } else {
            clearError('error-car-model');
            setInputSuccess(carEl);
        }

        // ── Terms checkbox ──
        var termsEl = document.getElementById('terms');
        if (!termsEl.checked) {
            showError('error-terms', 'You must agree to the Terms & Conditions to proceed.');
            valid = false;
        } else {
            clearError('error-terms');
        }

        return valid;
    }


    /* ─────────────────────────────────────────────────────
       4.  LIVE SUMMARY SIDEBAR UPDATES
    ───────────────────────────────────────────────────── */

    function updateSummary() {
        // Service
        var selectedService = document.querySelector('input[name="service"]:checked');
        if (selectedService) {
            sumService.textContent = selectedService.value;
            sumPrice.textContent   = selectedService.getAttribute('data-price') + ' EGP';
        } else {
            sumService.textContent = '—';
            sumPrice.textContent   = '— EGP';
        }

        // Date
        var dateVal = document.getElementById('booking-date') ?
            document.getElementById('booking-date').value : '';
        sumDate.textContent = dateVal ? formatDate(dateVal) : '—';

        // Time
        var timeEl = document.getElementById('booking-time');
        sumTime.textContent = (timeEl && timeEl.value) ? timeEl.value : '—';
    }

    // Attach live update listeners
    document.querySelectorAll('input[name="service"]').forEach(function (radio) {
        radio.addEventListener('change', updateSummary);
    });

    var dateInputEl = document.getElementById('booking-date');
    if (dateInputEl) dateInputEl.addEventListener('change', updateSummary);

    var timeInputEl = document.getElementById('booking-time');
    if (timeInputEl) timeInputEl.addEventListener('change', updateSummary);


    /* ─────────────────────────────────────────────────────
       5.  LIVE INLINE VALIDATION (clear errors on input)
    ───────────────────────────────────────────────────── */

    function attachLiveValidation(inputId, errorId) {
        var el = document.getElementById(inputId);
        if (!el) return;
        el.addEventListener('input', function () {
            if (el.value.trim() !== '') {
                clearError(errorId);
                clearInputState(el);
            }
        });
        el.addEventListener('blur', function () {
            // Re-validate on blur for immediate feedback
            if (!el.value.trim()) {
                showError(errorId, el.getAttribute('data-error') || 'This field is required.');
                setInputError(el);
            }
        });
    }

    attachLiveValidation('first-name',  'error-first-name');
    attachLiveValidation('last-name',   'error-last-name');
    attachLiveValidation('email',       'error-email');
    attachLiveValidation('phone',       'error-phone');
    attachLiveValidation('car-model',   'error-car-model');

    // Phone: prevent non-numeric input
    var phoneInputEl = document.getElementById('phone');
    if (phoneInputEl) {
        phoneInputEl.addEventListener('keypress', function (e) {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
        phoneInputEl.addEventListener('paste', function (e) {
            var pasted = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^[0-9]+$/.test(pasted)) {
                e.preventDefault();
                showError('error-phone', 'Phone number must contain digits only.');
                setInputError(phoneInputEl);
            }
        });
    }

    // Terms: clear error when checked
    var termsEl = document.getElementById('terms');
    if (termsEl) {
        termsEl.addEventListener('change', function () {
            if (termsEl.checked) clearError('error-terms');
        });
    }


    /* ─────────────────────────────────────────────────────
       6.  BUTTON EVENT LISTENERS
    ───────────────────────────────────────────────────── */

    // Step 1 → 2
    if (btnStep1Next) {
        btnStep1Next.addEventListener('click', function () {
            if (validateStep1()) {
                updateSummary();
                goToStep(2);
            }
        });
    }

    // Step 2 → 1 (back)
    if (btnStep2Back) {
        btnStep2Back.addEventListener('click', function () {
            goToStep(1);
        });
    }

    // Step 2 → 3
    if (btnStep2Next) {
        btnStep2Next.addEventListener('click', function () {
            if (validateStep2()) {
                updateSummary();
                goToStep(3);
            }
        });
    }

    // Step 3 → 2 (back)
    if (btnStep3Back) {
        btnStep3Back.addEventListener('click', function () {
            goToStep(2);
        });
    }


    /* ─────────────────────────────────────────────────────
       7.  FORM SUBMIT
    ───────────────────────────────────────────────────── */

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateStep3()) return;

            // Show loading spinner on submit button
            btnSubmit.classList.add('loading');
            btnSubmit.disabled = true;

            // Simulate a short async "submission" (replace with real fetch/AJAX later)
            setTimeout(function () {
                btnSubmit.classList.remove('loading');
                btnSubmit.disabled = false;

                // Populate success screen
                var firstName = document.getElementById('first-name').value.trim();
                var lastName  = document.getElementById('last-name').value.trim();
                var dateVal   = document.getElementById('booking-date').value;
                var timeVal   = document.getElementById('booking-time').value;

                if (successName) successName.textContent = firstName + ' ' + lastName;
                if (successDate) successDate.textContent = formatDate(dateVal);
                if (successTime) successTime.textContent = timeVal;

                // Hide form, show success
                form.style.display = 'none';
                if (successPanel) {
                    successPanel.classList.add('visible');
                    successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 1500);
        });
    }


    /* ─────────────────────────────────────────────────────
       8.  INITIAL STATE
    ───────────────────────────────────────────────────── */
    updateSummary();
    goToStep(1);

});
