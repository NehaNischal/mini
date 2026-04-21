/* 
  Mini Enterprises - Main Interactivity
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Initialize AOS with more dramatic settings
    AOS.init({
        duration: 1100, // Slower, more elegant
        offset: 100,    // More trigger distance
        once: true,
        easing: 'ease-in-out-cubic',
    });

    // Core Elements
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    const heroVideoWrap = document.querySelector('.hero-video-wrap');
    
    const handleScroll = () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Parallax Effect
        if (heroVideoWrap && window.scrollY <= window.innerHeight) {
            heroVideoWrap.style.transform = `translateY(${window.scrollY * 0.4}px)`;
        }
        
        // Back to Top Button
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    };

    // Run on scroll
    window.addEventListener('scroll', handleScroll);
    
    // Run on load to handle refresh at scroll position
    handleScroll();

    // Responsive Menu
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Before & After Image Comparison Logic
    const comparisonWrapper = document.getElementById('imgComparison');
    const afterImage = document.getElementById('afterImage');
    
    if (comparisonWrapper && afterImage) {
        comparisonWrapper.addEventListener('mousemove', (e) => {
            const rect = comparisonWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            if (percentage >= 0 && percentage <= 100) {
                afterImage.style.width = percentage + '%';
            }
        });

        // Touch support for mobiles
        comparisonWrapper.addEventListener('touchmove', (e) => {
            const rect = comparisonWrapper.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            if (percentage >= 0 && percentage <= 100) {
                afterImage.style.width = percentage + '%';
            }
        });
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // If nav was open, close it (on mobile)
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    });

    // Counter Animation Logic
    const counters = document.querySelectorAll('.count-up');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetEl = entry.target;
                    const targetValue = parseInt(targetEl.getAttribute('data-target'));
                    let current = 0;
                    const speed = 40; // Total frames to reach target
                    const increment = targetValue / speed;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < targetValue && current < 9999) {
                            targetEl.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            targetEl.innerText = targetValue;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(targetEl); // Only animate once
                }
            });
        }, { threshold: 0.3 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Gallery Filtering Logic
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        // Trigger AOS refresh optionally if needed, but display block is usually enough
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Refresh Lightbox if needed (fslightbox usually handles it or might need refresh)
                if (window.refreshFsLightbox) {
                    window.refreshFsLightbox();
                }
            });
        });
    }
});
