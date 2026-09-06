/* =========================================================
   FAYAD PORTFOLIO — INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     HEADER
  ======================================================= */

  const header = document.getElementById("siteHeader");

  const handleHeader = () => {
    if (window.scrollY > 30) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleHeader, {
    passive: true,
  });

  handleHeader();

  /* =======================================================
     TYPING ROLE
  ======================================================= */

  const typingElement = document.getElementById("typingRole");

  const roles = [
    "Front-End Developer",
    "UI-Focused Developer",
    "Computer Engineering Student",
    "Web Experience Builder",
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeRole = () => {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (!deleting) {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);

      charIndex++;

      if (charIndex === currentRole.length) {
        deleting = true;

        setTimeout(typeRole, 1800);

        return;
      }
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);

      charIndex--;

      if (charIndex === 0) {
        deleting = false;

        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(typeRole, deleting ? 45 : 80);
  };

  typeRole();

  /* =======================================================
     REVEAL
  ======================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  /* =======================================================
     ACTIVE NAV
  ======================================================= */

  const sections = document.querySelectorAll("main section[id]");

  const navLinks = document.querySelectorAll(".nav-link");

  const updateActiveNav = () => {
    let current = "";

    sections.forEach((section) => {
      const top = section.offsetTop - 180;

      if (window.scrollY >= top) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");

      const href = link.getAttribute("href");

      if (href === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  /* =======================================================
     SMOOTH INTERNAL LINKS
  ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  /* =======================================================
     SUBTLE POINTER EFFECT ON FEATURED PROJECT
  ======================================================= */

  const featured = document.querySelector(".featured-project");

  if (featured && window.matchMedia("(pointer: fine)").matches) {
    featured.addEventListener("pointermove", (event) => {
      const rect = featured.getBoundingClientRect();

      const x = ((event.clientX - rect.left) / rect.width) * 100;

      const y = ((event.clientY - rect.top) / rect.height) * 100;

      featured.style.background = `
          radial-gradient(
            circle at ${x}% ${y}%,
            rgba(45,212,191,0.09),
            transparent 32%
          ),
          linear-gradient(
            145deg,
            #10231f,
            #081714
          )
        `;
    });

    featured.addEventListener("pointerleave", () => {
      featured.style.background = `
          radial-gradient(
            circle at 15% 20%,
            rgba(45,212,191,0.08),
            transparent 30%
          ),
          linear-gradient(
            145deg,
            #10231f,
            #081714
          )
        `;
    });
  }

  /* =======================================================
     LAZY LOAD IMAGES
  ======================================================= */

  const images = document.querySelectorAll("img");

  images.forEach((image) => {
    image.loading = image.classList.contains("profile-image") ? "eager" : "lazy";

    image.decoding = "async";
  });

  /* =======================================================
     PWA
  ======================================================= */

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("FAYAD PWA registered:", registration.scope);
        })
        .catch((error) => {
          console.warn("FAYAD PWA registration failed:", error);
        });
    });
  }
});
