document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. ENHANCED MOUSE GLOW TRACKER
       ========================================== */
    const glow = document.getElementById('mouseGlow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        if (glow) {
            glow.style.left = `${glowX}px`;
            glow.style.top = `${glowY}px`;
        }
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    /* ==========================================
       2. DYNAMIC TYPING EFFECT FOR HERO SUBTITLE
       ========================================== */
    const subtitleElement = document.querySelector('.main-subtitle');
    if (subtitleElement) {
        const titles = [
            'مطور برمجيات متكامل (Full-Stack Developer)',
            'طالب هندسة حاسبات - جامعة طنطا',
            'صانع محتوى مرئي ومصور محترف',
            'مطور تطبيقات ويب لشركة العمدة فياض'
        ];
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentTitle = titles[titleIndex];
            
            if (isDeleting) {
                subtitleElement.innerHTML = currentTitle.substring(0, charIndex - 1) + '<span class="cursor">|</span>';
                charIndex--;
            } else {
                subtitleElement.innerHTML = currentTitle.substring(0, charIndex + 1) + '<span class="cursor">|</span>';
                charIndex++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentTitle.length) {
                typeSpeed = 2200; // الانتظار عند اكتمال الجملة
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                typeSpeed = 400;
            }

            setTimeout(typeEffect, typeSpeed);
        }
        typeEffect();
    }

    /* ==========================================
       3. 3D TILT EFFECT ON CARDS (CUSTOM PARALLAX)
       ========================================== */
    const tiltCards = document.querySelectorAll('.custom-card, .stat-box');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            card.style.transition = 'transform 0.1s ease-out';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.5s ease-out';
        });
    });

    /* ==========================================
       4. SCROLL REVEAL ANIMATION FOR ELEMENTS
       ========================================== */
    const revealElements = document.querySelectorAll('.custom-card, .stat-box, .sec-title, .social-btn');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 100;

            if (elementTop < windowHeight - revealPoint) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    // إعداد العناصر قبل التكبير/الظهور
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // لتشغيلها عند التحميل الأولي

    /* ==========================================
       5. ACTIVE NAVBAR LINK ON SCROLL
       ========================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});