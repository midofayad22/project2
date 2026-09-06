/* =========================================================
   FAYAD PORTFOLIO — INTERACTION ENGINE
========================================================= */

(() => {
  "use strict";

  const html = document.documentElement;
  const body = document.body;

  html.classList.add("js-ready");

  /* =======================================================
     HELPERS
  ======================================================= */

  const $ = (selector, parent = document) => parent.querySelector(selector);

  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =======================================================
     LOADER
  ======================================================= */

  const loader = $("#pageLoader");

  const hideLoader = () => {
    if (!loader) return;

    loader.classList.add("is-hidden");

    window.setTimeout(() => {
      loader.remove();
    }, 600);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideLoader, {
      once: true,
    });
  } else {
    hideLoader();
  }

  window.addEventListener("load", hideLoader, {
    once: true,
  });

  window.setTimeout(hideLoader, 1800);

  /* =======================================================
     HEADER SCROLL STATE
  ======================================================= */

  const header = $("#siteHeader");

  let scrollTicking = false;

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle("is-scrolled", window.scrollY > 20);

    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;

      scrollTicking = true;
      requestAnimationFrame(updateHeader);
    },
    { passive: true },
  );

  updateHeader();

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const menuButton = $("#mobileMenuButton");
  const mobileMenu = $("#mobileMenu");

  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;

    menuButton.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");

    body.classList.remove("menu-open");
  };

  const openMenu = () => {
    if (!menuButton || !mobileMenu) return;

    menuButton.classList.add("is-open");
    mobileMenu.classList.add("is-open");

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close menu");

    body.classList.add("menu-open");
  };

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("is-open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    $$(".mobile-menu a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!mobileMenu.classList.contains("is-open")) return;

      if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  /* =======================================================
     RESIZE SAFETY
  ======================================================= */

  const desktopBreakpoint = window.matchMedia("(min-width: 861px)");

  const handleDesktopState = (event) => {
    if (event.matches) {
      closeMenu();
    }
  };

  if (desktopBreakpoint.addEventListener) {
    desktopBreakpoint.addEventListener("change", handleDesktopState);
  }

  /* =======================================================
     SMOOTH ANCHOR SCROLL
  ======================================================= */

  const getHeaderOffset = () => {
    return header ? header.getBoundingClientRect().height + 12 : 12;
  };

  const scrollToTarget = (target) => {
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const id = href.slice(1);

      const target = document.getElementById(id);

      if (!target) return;

      event.preventDefault();

      closeMenu();

      scrollToTarget(target);

      const sectionName = link.dataset.section;

      if (sectionName) {
        setActiveSection(sectionName);
      }
    });
  });

  /* =======================================================
     ACTIVE NAV
  ======================================================= */

  const sectionLinks = $$(".nav-link[data-section], .mobile-menu a[data-section]");

  const observedSections = [$("#about"), $("#skills"), $("#projects"), $("#contact")].filter(Boolean);

  const setActiveSection = (sectionName) => {
    sectionLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === sectionName);
    });
  };

  const sectionObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            const visible = entries
              .filter((entry) => entry.isIntersecting)
              .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (!visible.length) return;

            const activeId = visible[0].target.id;

            setActiveSection(activeId);
          },
          {
            root: null,
            rootMargin: "-30% 0px -58% 0px",
            threshold: [0, 0.15, 0.3, 0.5],
          },
        )
      : null;

  if (sectionObserver) {
    observedSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =======================================================
     REVEAL
  ======================================================= */

  const revealElements = $$(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -45px 0px",
        threshold: 0.08,
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* =======================================================
     TYPING ROLE
  ======================================================= */

  const typingElement = $("#typingRole");

  if (typingElement && !prefersReducedMotion) {
    const roles = ["Front-End Experiences", "Responsive Interfaces", "Interactive Web Experiences", "Clean UI Systems"];

    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;
    let pauseUntil = 0;

    typingElement.textContent = roles[0];

    const typeLoop = (time) => {
      if (!typingElement.isConnected) return;

      const currentRole = roles[roleIndex];

      if (time < pauseUntil) {
        requestAnimationFrame(typeLoop);
        return;
      }

      if (!deleting) {
        charIndex++;

        typingElement.textContent = currentRole.slice(0, charIndex);

        if (charIndex >= currentRole.length) {
          deleting = true;
          pauseUntil = time + 1200;
        }
      } else {
        charIndex--;

        typingElement.textContent = currentRole.slice(0, charIndex);

        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;

          pauseUntil = time + 220;
        }
      }

      const speed = deleting ? 38 : 68;

      window.setTimeout(() => {
        requestAnimationFrame(typeLoop);
      }, speed);
    };

    window.setTimeout(() => {
      requestAnimationFrame(typeLoop);
    }, 1300);
  }

  /* =======================================================
     CURSOR SMEAR
  ======================================================= */

  const cursorTrail = $("#cursorTrail");

  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursorTrail && finePointer && !prefersReducedMotion) {
    let mouseX = -100;
    let mouseY = -100;

    let currentX = -100;
    let currentY = -100;

    let cursorVisible = false;
    let rafId = null;

    const animateCursor = () => {
      currentX += (mouseX - currentX) * 0.16;

      currentY += (mouseY - currentY) * 0.16;

      cursorTrail.style.transform = `translate3d(${currentX - 37}px, ${currentY - 4}px, 0)`;

      rafId = requestAnimationFrame(animateCursor);
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if (!cursorVisible) {
          cursorVisible = true;
          cursorTrail.style.opacity = "1";
        }

        if (!rafId) {
          rafId = requestAnimationFrame(animateCursor);
        }
      },
      { passive: true },
    );

    window.addEventListener("pointerleave", () => {
      cursorTrail.style.opacity = "0";
      cursorVisible = false;
    });

    window.addEventListener("blur", () => {
      cursorTrail.style.opacity = "0";
      cursorVisible = false;
    });
  }

  /* =======================================================
     LIGHT CARD INTERACTION
  ======================================================= */

  if (finePointer && !prefersReducedMotion) {
    const interactiveCards = $$(".profile-card, .featured-project, .project-card, .contact-card");

    interactiveCards.forEach((card) => {
      card.addEventListener(
        "pointermove",
        (event) => {
          const rect = card.getBoundingClientRect();

          const x = (event.clientX - rect.left) / rect.width;

          const y = (event.clientY - rect.top) / rect.height;

          card.style.setProperty("--mx", `${(x - 0.5) * 2}`);

          card.style.setProperty("--my", `${(y - 0.5) * 2}`);
        },
        { passive: true },
      );

      card.addEventListener(
        "pointerleave",
        () => {
          card.style.removeProperty("--mx");
          card.style.removeProperty("--my");
        },
        { passive: true },
      );
    });
  }

  /* =======================================================
     EXTERNAL LINKS SAFETY
  ======================================================= */

  $$('a[target="_blank"]').forEach((link) => {
    const rel = link.getAttribute("rel") || "";

    if (!rel.includes("noopener")) {
      link.setAttribute("rel", `${rel} noopener noreferrer`.trim());
    }
  });

  /* =======================================================
     IMAGE FALLBACK / LAZY SAFETY
  ======================================================= */

  $$(".gallery-image img").forEach((image) => {
    if (!image.hasAttribute("loading")) {
      image.setAttribute("loading", "lazy");
    }

    image.addEventListener(
      "error",
      () => {
        image.style.opacity = "0";
      },
      { once: true },
    );
  });

  /* =======================================================
     INITIAL ACTIVE STATE
  ======================================================= */

  if (window.scrollY < 120) {
    setActiveSection("about");
  }
})();
