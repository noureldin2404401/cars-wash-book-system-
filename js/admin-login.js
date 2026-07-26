

document.addEventListener('DOMContentLoaded', function () {

   
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'admin-dashboard.html';
        return;
    }


    var VALID_EMAIL    = 'admin@gmail.com';
    var VALID_PASSWORD = '123456';

 
    var form          = document.getElementById('login-form');
    var emailInput    = document.getElementById('admin-email');
    var passwordInput = document.getElementById('admin-password');
    var submitBtn     = document.getElementById('login-submit');
    var errorBanner   = document.getElementById('login-error-banner');
    var errorText     = document.getElementById('login-error-text');
    var pwToggle      = document.getElementById('password-toggle');
    var errorEmail    = document.getElementById('error-admin-email');
    var errorPassword = document.getElementById('error-admin-password');


  
    function showFieldError(el, msg) {
        if (!el) return;
        el.textContent = msg;
        el.classList.add('visible');
    }

    function clearFieldError(el) {
        if (!el) return;
        el.textContent = '';
        el.classList.remove('visible');
    }

    function setInputError(input) {
        if (input) input.classList.add('input-error');
    }

    function clearInputError(input) {
        if (input) input.classList.remove('input-error');
    }

    function showBanner(msg) {
        if (errorText)   errorText.textContent = msg;
        if (errorBanner) errorBanner.classList.add('visible');
    }

    function hideBanner() {
        if (errorBanner) errorBanner.classList.remove('visible');
    }


  
    if (pwToggle && passwordInput) {
        pwToggle.addEventListener('click', function () {
            var isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            pwToggle.textContent = isPassword ? '🙈' : '👁';
        });
    }


   
    if (emailInput) {
        emailInput.addEventListener('input', function () {
            clearFieldError(errorEmail);
            clearInputError(emailInput);
            hideBanner();
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            clearFieldError(errorPassword);
            clearInputError(passwordInput);
            hideBanner();
        });
    }


    
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            hideBanner();

            var email    = emailInput    ? emailInput.value.trim()    : '';
            var password = passwordInput ? passwordInput.value.trim() : '';
            var valid    = true;

          
            if (!email) {
                showFieldError(errorEmail, 'Please enter your email address.');
                setInputError(emailInput);
                valid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                showFieldError(errorEmail, 'Please enter a valid email address.');
                setInputError(emailInput);
                valid = false;
            } else {
                clearFieldError(errorEmail);
                clearInputError(emailInput);
            }

         
            if (!password) {
                showFieldError(errorPassword, 'Please enter your password.');
                setInputError(passwordInput);
                valid = false;
            } else {
                clearFieldError(errorPassword);
                clearInputError(passwordInput);
            }

            if (!valid) return;

           
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(function () {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                if (email === VALID_EMAIL && password === VALID_PASSWORD) {
                  
                    sessionStorage.setItem('adminLoggedIn', 'true');
                    window.location.href = 'admin-dashboard.html';
                } else {
                   
                    var msg = 'Invalid email or password. Please try again.';
                    if (email !== VALID_EMAIL) {
                        msg = 'No admin account found with that email.';
                    } else if (password !== VALID_PASSWORD) {
                        msg = 'Incorrect password. Please try again.';
                    }
                    showBanner(msg);
                    setInputError(passwordInput);
                    if (passwordInput) passwordInput.focus();
                }
            }, 800);
        });
    }

});
