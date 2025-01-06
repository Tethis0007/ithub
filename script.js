document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    const loader = document.createElement('div');
    loader.className = 'loading';
    loader.innerHTML = '<div class="loading-animation"></div>';
    document.body.appendChild(loader);

    // Remove loader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 500);
    });

    // Mobile Menu Functionality
    const navLinks = document.getElementById('navLinks');
    const menuButton = document.querySelector('.menu-button');
    const closeButton = document.querySelector('.close-menu');

    function toggleMenu() {
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    }

    // Menu button click handler
    menuButton.addEventListener('click', toggleMenu);

    // Close button click handler
    closeButton.addEventListener('click', toggleMenu);

    // Close menu when clicking on links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !menuButton.contains(e.target)) {
            toggleMenu();
        }
    });

    // Handle mobile menu on resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    }, 250));

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', debounce(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= scrollThreshold) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else if (currentScroll > lastScroll) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        }
        lastScroll = currentScroll;
    }, 10));

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navLinks?.classList.contains('active')) {
                    toggleMenu();
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('hero-text-animation')) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            }
        });
    }, observerOptions);

    // Observe elements with scroll-reveal class
    const elementsToAnimate = document.querySelectorAll('.scroll-reveal, .hero-text-animation, .service-card, .feature, .hero-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
        // Add initial state classes
        if (!el.classList.contains('scroll-reveal')) {
            el.classList.add('scroll-reveal');
        }
    });

    // Fix hero cards hover effect
    const heroCards = document.querySelectorAll('.hero-card');
    heroCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.3s ease';
        });
    });

    // Ensure consistent card heights in services section
    function equalizeCardHeights() {
        const serviceCards = document.querySelectorAll('.service-card');
        let maxHeight = 0;
        
        // Reset heights first
        serviceCards.forEach(card => {
            card.style.height = 'auto';
            maxHeight = Math.max(maxHeight, card.offsetHeight);
        });

        // Apply max height to all cards
        serviceCards.forEach(card => {
            card.style.height = `${maxHeight}px`;
        });
    }

    // Run on load and resize
    window.addEventListener('load', equalizeCardHeights);
    window.addEventListener('resize', debounce(equalizeCardHeights, 250));

    // Center "Why Choose IT HUB?" section
    const whyUsSection = document.querySelector('.why-us .section-header');
    if (whyUsSection) {
        whyUsSection.style.textAlign = 'center';
    }

    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});