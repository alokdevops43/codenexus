document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. Custom Glow Pointer (Mouse Parallax / Tracking)
       ========================================================================== */
    const glowPointer = document.getElementById('glowPointer');
    
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            glowPointer.style.left = `${e.clientX}px`;
            glowPointer.style.top = `${e.clientY}px`;
        });
    });

    /* ==========================================================================
       2. Scroll Progress Bar & Navbar Scroll State
       ========================================================================== */
    const scrollProgress = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            
            scrollProgress.style.width = `${scrollPercent * 100}%`;

            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }, { passive: true });

    /* ==========================================================================
       3. Typing Effect
       ========================================================================== */
    const words = ["Velocity", "Precision", "Confidence", "Elegance"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }
        
        typewriterElement.textContent = currentWord.substring(0, charIndex);
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing effect after short delay
    setTimeout(typeEffect, 1000);

    /* ==========================================================================
       4. Reveal on Scroll (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply optional transition delay based on custom property or data attribute
                const delay = entry.target.style.getPropertyValue('--delay');
                if (delay) {
                    entry.target.style.transitionDelay = delay;
                }
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only reveal once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       5. Animated Counters
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                const duration = 2000; // ms
                const stepTime = 20; // ms
                const steps = duration / stepTime;
                const increment = target / steps;
                let current = 0;
                
                const updateCounter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target % 1 === 0 ? target : target.toFixed(2);
                        clearInterval(updateCounter);
                    } else {
                        entry.target.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(2);
                    }
                }, stepTime);
                
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => counterObserver.observe(counter));

    /* ==========================================================================
       6. Magnetic Buttons
       ========================================================================== */
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Limit movement
            const maxMove = 10;
            const moveX = (x / rect.width) * maxMove;
            const moveY = (y / rect.height) * maxMove;
            
            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    /* ==========================================================================
       7. FAQ Accordion
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       8. SVG Timeline Animation (Workflow)
       ========================================================================== */
    const timelineProgress = document.querySelector('.timeline-progress');
    const workflowSection = document.getElementById('workflow');
    const workflowSteps = document.querySelectorAll('.step-item');
    
    if (timelineProgress && workflowSection) {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const rect = workflowSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Calculate how much of the section has been scrolled through
                // Starts when section top hits middle of viewport
                const scrollStart = rect.top - (windowHeight / 2);
                const sectionHeight = rect.height;
                
                let progress = 0;
                if (scrollStart < 0) {
                    progress = Math.min(1, Math.abs(scrollStart) / (sectionHeight * 0.8));
                }
                
                // Max stroke-dasharray is 400 (based on SVG path length)
                const dashOffset = 400 - (progress * 400);
                timelineProgress.style.strokeDashoffset = dashOffset;
                
                // Highlight workflow steps based on progress
                if (progress > 0.1 && progress < 0.4) {
                    workflowSteps.forEach((s, i) => s.classList.toggle('active', i === 0));
                } else if (progress >= 0.4 && progress < 0.7) {
                    workflowSteps.forEach((s, i) => s.classList.toggle('active', i === 1));
                } else if (progress >= 0.7) {
                    workflowSteps.forEach((s, i) => s.classList.toggle('active', i === 2));
                } else {
                    workflowSteps.forEach((s, i) => s.classList.toggle('active', i === 0));
                }
            });
        }, { passive: true });
    }

    /* ==========================================================================
       9. Exploded View Assembly (Scroll Driven 3D Parallax)
       ========================================================================== */
    const heroSection = document.getElementById('hero');
    const scene = document.getElementById('dashboard-scene');
    const dashBase = scene.querySelector('.dash-base');
    const dashParts = document.querySelectorAll('.dash-part');
    
    // We want the explosion to assemble as the user scrolls DOWN out of the hero section.
    // Or vice versa. Let's make it start exploded, and assemble as we scroll down.
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Map scroll 0 -> windowHeight to progress 0 -> 1
            let progress = Math.min(1, Math.max(0, scrollY / (windowHeight * 0.8)));
            
            // Easing function for smoother assembly (ease-out cubic)
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            
            // Rotate the entire scene slightly on scroll
            const sceneRotX = 15 - (easeOutProgress * 15); // Starts tilted 15deg, flattens to 0
            const sceneRotY = -10 + (easeOutProgress * 10);
            scene.style.transform = `rotateX(${sceneRotX}deg) rotateY(${sceneRotY}deg)`;
            
            // Scale dashbase based on progress
            const baseScale = 0.9 + (easeOutProgress * 0.1);
            dashBase.style.transform = `scale(${baseScale})`;
            
            // Animate each exploding part
            dashParts.forEach(part => {
                // Get target explosion coords from dataset
                const exX = parseFloat(part.getAttribute('data-explode-x'));
                const exY = parseFloat(part.getAttribute('data-explode-y'));
                const exZ = parseFloat(part.getAttribute('data-explode-z'));
                const exRx = parseFloat(part.getAttribute('data-explode-rx'));
                const exRy = parseFloat(part.getAttribute('data-explode-ry'));
                
                // Interpolate from exploded (progress 0) to assembled (progress 1)
                // When progress = 1, all values should be 0 (assembled)
                const curX = exX * (1 - easeOutProgress);
                const curY = exY * (1 - easeOutProgress);
                const curZ = exZ * (1 - easeOutProgress);
                const curRx = exRx * (1 - easeOutProgress);
                const curRy = exRy * (1 - easeOutProgress);
                
                // Optional: add a slight blur when fully exploded, clear when assembled
                const blurAmount = 4 * (1 - easeOutProgress);
                
                part.style.transform = `
                    translate3d(${curX}px, ${curY}px, ${curZ}px) 
                    rotateX(${curRx}deg) 
                    rotateY(${curRy}deg)
                `;
                
                // Use filter for blur and slight opacity fade for depth
                part.style.filter = `blur(${blurAmount}px)`;
                part.style.opacity = 0.5 + (easeOutProgress * 0.5);
            });
        });
    }, { passive: true });
    
    // Trigger initial scroll calculation to set initial exploded state
    window.dispatchEvent(new Event('scroll'));
});
