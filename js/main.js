

document.addEventListener('DOMContentLoaded', function () {


    const navbar = document.querySelector('.navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();



    const navToggle = document.querySelector('.navbar-toggle');
    const navLinks = document.querySelector('.navbar-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }



    const track = document.querySelector('.testimonial-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dots = document.querySelectorAll('.testimonial-dots .dot');

    if (track && prevBtn && nextBtn) {
        let currentSlide = 0;
        const totalSlides = document.querySelectorAll('.testimonial-card').length;

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentSlide = index;
            track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        prevBtn.addEventListener('click', function () {
            goToSlide(currentSlide - 1);
        });

        nextBtn.addEventListener('click', function () {
            goToSlide(currentSlide + 1);
        });

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                goToSlide(i);
            });
        });

        let autoSlide = setInterval(function () {
            goToSlide(currentSlide + 1);
        }, 5000);

        var sliderContainer = document.querySelector('.testimonials-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', function () {
                clearInterval(autoSlide);
            });
            sliderContainer.addEventListener('mouseleave', function () {
                autoSlide = setInterval(function () {
                    goToSlide(currentSlide + 1);
                }, 5000);
            });
        }
    }



    const revealElements = document.querySelectorAll('.reveal');

    function checkReveal() {
        var windowHeight = window.innerHeight;
        revealElements.forEach(function (el) {
            var elementTop = el.getBoundingClientRect().top;
            var revealPoint = 120;
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    checkReveal();



    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    function animateCounters() {
        if (statsCounted) return;
        var statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        var rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsCounted = true;
            statNumbers.forEach(function (el) {
                var target = parseInt(el.getAttribute('data-target'), 10);
                if (isNaN(target)) return;
                var suffix = el.getAttribute('data-suffix') || '';
                var duration = 2000;
                var start = 0;
                var startTime = null;

                function updateCounter(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var easedProgress = 1 - Math.pow(1 - progress, 3);
                    var current = Math.floor(easedProgress * target);
                    el.textContent = current + suffix;
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target + suffix;
                    }
                }
                requestAnimationFrame(updateCounter);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();



    var bubblesContainer = document.querySelector('.hero-bubbles');

    if (bubblesContainer) {
        for (var i = 0; i < 15; i++) {
            var bubble = document.createElement('div');
            bubble.classList.add('bubble');
            var size = Math.random() * 80 + 20;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.animationDuration = (Math.random() * 12 + 8) + 's';
            bubble.style.animationDelay = (Math.random() * 10) + 's';
            bubblesContainer.appendChild(bubble);
        }
    }



    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    var sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        var scrollPos = window.scrollY + 200;
        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');
            var navLink = document.querySelector('.navbar-links a[href="#' + sectionId + '"]');
            if (navLink) {
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    document.querySelectorAll('.navbar-links a').forEach(function (a) {
                        a.classList.remove('active');
                    });
                    navLink.classList.add('active');
                }
            }
        });
    }
   window.addEventListener('scroll', highlightNavLink);

});


