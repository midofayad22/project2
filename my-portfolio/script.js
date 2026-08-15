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
// عند الضغط على كارت المعرض يفتح صفحة gallery.html فوراً
const galleryBtn = document.getElementById('visualGalleryBtn');
if (galleryBtn) {
  galleryBtn.addEventListener('click', function() {
    window.location.href = 'gallery.html';
  });
}
// --- تأثير الـ 3D الحركي التفاعلي مع حركة الماوس ---
const midoCard = document.querySelector('.mido-main-box');

if (midoCard) {
    midoCard.addEventListener('mousemove', (e) => {
        const rect = midoCard.getBoundingClientRect();
        const x = e.clientX - rect.left; // موقع الماوس أفقيًا داخل الكارد
        const y = e.clientY - rect.top;  // موقع الماوس رأسيًا داخل الكارد

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // حساب زوايا الميلان (تغيير القيم للتحكم في قوة الحركة)
        const rotateX = -((y - centerY) / centerY) * 8; 
        const rotateY = ((x - centerX) / centerX) * 8;  

        midoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    midoCard.addEventListener('mouseleave', () => {
        // العودة للوضع الطبيعي بسلاسة لما الماوس يخرج
        midoCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
}
// تشغيل حركة الماوس الذهبية
(function() {
  const trail = document.createElement("div");
  trail.className = "gold-cursor-trail";
  document.body.appendChild(trail);

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  window.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;

    trail.style.left = `${trailX}px`;
    trail.style.top = `${trailY}px`;

    requestAnimationFrame(animateTrail);
  }

  animateTrail();
})();