/* =========================================================
   FAYAD PORTFOLIO — INTERACTION ENGINE
   Performance • Accessibility • Smooth Micro Interactions
========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CORE
  ======================================================= */

  const html = document.documentElement;
  const body = document.body;

  html.classList.add("js-ready");

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const finePointer = window.matchMedia(
    "(pointer: fine)"
  );

  const isReducedMotion = () => prefersReducedMotion.matches;

  /* =======================================================
     LOADER
  ======================================================= */

  const loader = $("#pageLoader");

  let loaderHidden = false;

  const hideLoader = () => {
    if (!loader || loaderHidden) return;

    loaderHidden = true;

    loader.classList.add("is-hidden");

    window.setTimeout(() => {
      if (loader && loader.isConnected) {
        loader.remove();
      }
    }, 650);
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      hideLoader,
      { once: true }
    );
  } else {
    hideLoader();
  }

  window.addEventListener(
    "load",
    hideLoader,
    { once: true, passive: true }
  );

  /*
   * Safety fallback.
   * The loader should never block the page for too long.
   */
  window.setTimeout(hideLoader, 1800);

  /* =======================================================
     HEADER SCROLL STATE
  ======================================================= */

  const header = $("#siteHeader");

  let scrollFrame = 0;

  const updateHeader = () => {
    scrollFrame = 0;

    if (!header) return;

    const scrolled = window.scrollY > 24;

    header.classList.toggle("is-scrolled", scrolled);
  };

  const requestHeaderUpdate = () => {
    if (scrollFrame) return;

    scrollFrame = window.requestAnimationFrame(
      updateHeader
    );
  };

  window.addEventListener(
    "scroll",
    requestHeaderUpdate,
    { passive: true }
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

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.setAttribute(
      "aria-label",
      "Open menu"
    );

    body.classList.remove("menu-open");
  };

  const openMenu = () => {
    if (!menuButton || !mobileMenu) return;

    menuButton.classList.add("is-open");
    mobileMenu.classList.add("is-open");

    menuButton.setAttribute(
      "aria-expanded",
      "true"
    );

    menuButton.setAttribute(
      "aria-label",
      "Close menu"
    );

    body.classList.add("menu-open");
  };

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const isOpen =
        mobileMenu.classList.contains("is-open");

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
      if (!mobileMenu.classList.contains("is-open")) {
        return;
      }

      const target = event.target;

      if (
        target instanceof Node &&
        !mobileMenu.contains(target) &&
        !menuButton.contains(target)
      ) {
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
     RESPONSIVE MENU SAFETY
  ======================================================= */

  const desktopBreakpoint = window.matchMedia(
    "(min-width: 861px)"
  );

  const handleDesktopState = (event) => {
    if (event.matches) {
      closeMenu();
    }
  };

  if (desktopBreakpoint.addEventListener) {
    desktopBreakpoint.addEventListener(
      "change",
      handleDesktopState
    );
  } else {
    desktopBreakpoint.addListener(
      handleDesktopState
    );
  }

  /* =======================================================
     SMOOTH ANCHOR SCROLL
  ======================================================= */

  const getHeaderOffset = () => {
    if (!header) return 16;

    return Math.ceil(
      header.getBoundingClientRect().height + 14
    );
  };

  const scrollToTarget = (target) => {
    if (!target) return;

    const targetTop =
      target.getBoundingClientRect().top +
      window.scrollY -
      getHeaderOffset();

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: isReducedMotion()
        ? "auto"
        : "smooth",
    });
  };

  /* =======================================================
     ACTIVE NAV
  ======================================================= */

  const sectionLinks = $$(
    ".nav-link[data-section], .mobile-menu a[data-section]"
  );

  const observedSections = [
    $("#about"),
    $("#skills"),
    $("#projects"),
    $("#contact"),
  ].filter(Boolean);

  const setActiveSection = (sectionName) => {
    sectionLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.dataset.section === sectionName
      );
    });
  };

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const id = href.slice(1);
      const target = document.getElementById(id);

      if (!target) {
        return;
      }

      event.preventDefault();

      closeMenu();
      scrollToTarget(target);

      const sectionName =
        link.dataset.section;

      if (sectionName) {
        setActiveSection(sectionName);
      }
    });
  });

  /* =======================================================
     SECTION OBSERVER
  ======================================================= */

  let sectionObserver = null;

  if (
    "IntersectionObserver" in window &&
    observedSections.length
  ) {
    sectionObserver = new IntersectionObserver(
      (entries) => {
        let bestEntry = null;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          if (
            !bestEntry ||
            entry.intersectionRatio >
              bestEntry.intersectionRatio
          ) {
            bestEntry = entry;
          }
        }

        if (!bestEntry) return;

        setActiveSection(
          bestEntry.target.id
        );
      },
      {
        root: null,
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0, 0.12, 0.25, 0.4],
      }
    );

    observedSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =======================================================
     REVEAL ANIMATIONS
     -------------------------------------------------------
     Intentionally subtle.
     No repeated animation.
  ======================================================= */

  const revealElements = $$(".reveal");

  if (
    isReducedMotion() ||
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );
          });
        },
        {
          rootMargin: "0px 0px -70px 0px",
          threshold: 0.06,
        }
      );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* =======================================================
     TYPING ROLE
     -------------------------------------------------------
     Slow and restrained.
     No requestAnimationFrame loop while idle.
  ======================================================= */

  const typingElement = $("#typingRole");

  if (
    typingElement &&
    !isReducedMotion()
  ) {
    const roles = [
      "Front-End Experiences",
      "Responsive Interfaces",
      "Interactive Web Experiences",
      "Clean UI Systems",
    ];

    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;
    let timer = null;

    typingElement.textContent =
      roles[0];

    const runTyping = () => {
      if (!typingElement.isConnected) {
        return;
      }

      const currentRole =
        roles[roleIndex];

      if (!deleting) {
        charIndex += 1;

        typingElement.textContent =
          currentRole.slice(
            0,
            charIndex
          );

        if (
          charIndex >=
          currentRole.length
        ) {
          deleting = true;

          timer = window.setTimeout(
            runTyping,
            1700
          );

          return;
        }

        timer = window.setTimeout(
          runTyping,
          72
        );

        return;
      }

      charIndex -= 1;

      typingElement.textContent =
        currentRole.slice(
          0,
          charIndex
        );

      if (charIndex <= 0) {
        deleting = false;

        roleIndex =
          (roleIndex + 1) %
          roles.length;

        timer = window.setTimeout(
          runTyping,
          420
        );

        return;
      }

      timer = window.setTimeout(
        runTyping,
        45
      );
    };

    timer = window.setTimeout(
      runTyping,
      1500
    );

    /*
     * Pause the typing effect when the tab
     * is not visible.
     */
    document.addEventListener(
      "visibilitychange",
      () => {
        if (
          document.hidden &&
          timer
        ) {
          window.clearTimeout(timer);
          timer = null;
        }

        if (
          !document.hidden &&
          !timer
        ) {
          timer = window.setTimeout(
            runTyping,
            900
          );
        }
      }
    );
  } else if (typingElement) {
    /*
     * Reduced-motion users still see
     * useful content.
     */
    typingElement.textContent =
      "Front-End Experiences";
  }

  /* =======================================================
     SUBTLE CURSOR SMEAR
     -------------------------------------------------------
     Very light.
     Smooth follow.
     Only active on real mouse/trackpad.
  ======================================================= */

  const cursorTrail = $("#cursorTrail");

  if (
    cursorTrail &&
    finePointer.matches &&
    !isReducedMotion()
  ) {
    let mouseX = -100;
    let mouseY = -100;

    let currentX = -100;
    let currentY = -100;

    let cursorVisible = false;
    let cursorFrame = 0;

    /*
     * Small amount of smoothing.
     * Not a heavy trailing effect.
     */
    const smoothing = 0.12;

    const renderCursor = () => {
      cursorFrame = 0;

      currentX +=
        (mouseX - currentX) *
        smoothing;

      currentY +=
        (mouseY - currentY) *
        smoothing;

      cursorTrail.style.transform =
        `translate3d(${currentX - 28}px, ${currentY - 2}px, 0)`;

      /*
       * Keep the effect alive only while
       * the pointer is being used.
       */
      const distance =
        Math.abs(mouseX - currentX) +
        Math.abs(mouseY - currentY);

      if (
        cursorVisible &&
        distance > 0.35
      ) {
        cursorFrame =
          window.requestAnimationFrame(
            renderCursor
          );
      }
    };

    const updateCursor = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!cursorVisible) {
        cursorVisible = true;

        cursorTrail.style.opacity =
          "0.48";
      }

      if (!cursorFrame) {
        cursorFrame =
          window.requestAnimationFrame(
            renderCursor
          );
      }
    };

    window.addEventListener(
      "pointermove",
      updateCursor,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "pointerleave",
      () => {
        cursorVisible = false;
        cursorTrail.style.opacity =
          "0";
      },
      {
        passive: true,
      }
    );

    window.addEventListener(
      "blur",
      () => {
        cursorVisible = false;
        cursorTrail.style.opacity =
          "0";
      },
      {
        passive: true,
      }
    );
  } else if (cursorTrail) {
    /*
     * Remove the effect completely on
     * touch / reduced-motion devices.
     */
    cursorTrail.style.opacity = "0";
  }

  /* =======================================================
     LIGHT CARD INTERACTION
     -------------------------------------------------------
     No tilt.
     No 3D rotation.
     Only a very subtle pointer position.
  ======================================================= */

  if (
    finePointer.matches &&
    !isReducedMotion()
  ) {
    const interactiveCards = $$(
      ".profile-card, .featured-project, .project-card, .contact-card"
    );

    interactiveCards.forEach((card) => {
      let frame = 0;
      let lastX = 0;
      let lastY = 0;

      const updateCardPosition = () => {
        frame = 0;

        const rect =
          card.getBoundingClientRect();

        if (
          rect.width <= 0 ||
          rect.height <= 0
        ) {
          return;
        }

        const x =
          (lastX - rect.left) /
          rect.width;

        const y =
          (lastY - rect.top) /
          rect.height;

        /*
         * Clamp values.
         * Prevent strange values when pointer
         * moves quickly out of the card.
         */
        const normalizedX = Math.max(
          -1,
          Math.min(1, (x - 0.5) * 2)
        );

        const normalizedY = Math.max(
          -1,
          Math.min(1, (y - 0.5) * 2)
        );

        card.style.setProperty(
          "--mx",
          normalizedX.toFixed(3)
        );

        card.style.setProperty(
          "--my",
          normalizedY.toFixed(3)
        );
      };

      card.addEventListener(
        "pointermove",
        (event) => {
          lastX = event.clientX;
          lastY = event.clientY;

          if (!frame) {
            frame =
              window.requestAnimationFrame(
                updateCardPosition
              );
          }
        },
        {
          passive: true,
        }
      );

      card.addEventListener(
        "pointerleave",
        () => {
          if (frame) {
            window.cancelAnimationFrame(
              frame
            );

            frame = 0;
          }

          card.style.removeProperty(
            "--mx"
          );

          card.style.removeProperty(
            "--my"
          );
        },
        {
          passive: true,
        }
      );
    });
  }

  /* =======================================================
     EXTERNAL LINKS SAFETY
  ======================================================= */

  $$('a[target="_blank"]').forEach(
    (link) => {
      const rel =
        link.getAttribute("rel") ||
        "";

      const values = new Set(
        rel.split(/\s+/).filter(Boolean)
      );

      values.add("noopener");
      values.add("noreferrer");

      link.setAttribute(
        "rel",
        [...values].join(" ")
      );
    }
  );

  /* =======================================================
     IMAGE OPTIMIZATION
  ======================================================= */

  const images = $$(
    ".gallery-image img, img[data-lazy]"
  );

  images.forEach((image) => {
    /*
     * Don't lazy-load the image if the browser
     * already knows otherwise.
     */
    if (
      !image.hasAttribute("loading")
    ) {
      image.setAttribute(
        "loading",
        "lazy"
      );
    }

    if (
      !image.hasAttribute("decoding")
    ) {
      image.setAttribute(
        "decoding",
        "async"
      );
    }

    image.addEventListener(
      "error",
      () => {
        image.classList.add(
          "image-error"
        );
      },
      {
        once: true,
      }
    );
  });

  /* =======================================================
     PREVENT UNNECESSARY IMAGE LAZY LOADING
     FOR ABOVE-THE-FOLD CONTENT
  ======================================================= */

  const heroImages = $$(
    ".hero img, .profile-image img, img[data-priority]"
  );

  heroImages.forEach((image) => {
    image.setAttribute(
      "loading",
      "eager"
    );

    image.setAttribute(
      "fetchpriority",
      "high"
    );

    image.setAttribute(
      "decoding",
      "async"
    );
  });

  /* =======================================================
     SERVICE WORKER / PWA UPDATE SYSTEM
     -------------------------------------------------------
     Detects a new deployed version and updates the
     current visitor automatically.

     IMPORTANT:
     The service worker itself must support:
       - SKIP_WAITING
       - clientsClaim()
  ======================================================= */

  const registerServiceWorker = async () => {
    if (
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    /*
     * Only register on a real HTTP(S)
     * deployment.
     */
    if (
      location.protocol !== "https:" &&
      location.hostname !== "localhost" &&
      location.hostname !== "127.0.0.1"
    ) {
      return;
    }

    try {
      const registration =
        await navigator.serviceWorker.register(
          "/service-worker.js",
          {
            scope: "/",
            updateViaCache: "none",
          }
        );

      /*
       * Ask the browser to check for a new
       * service worker immediately.
       */
      await registration.update();

      /*
       * New worker already waiting.
       */
      if (registration.waiting) {
        registration.waiting.postMessage({
          type: "SKIP_WAITING",
        });
      }

      /*
       * New worker is installing.
       */
      registration.addEventListener(
        "updatefound",
        () => {
          const newWorker =
            registration.installing;

          if (!newWorker) return;

          newWorker.addEventListener(
            "statechange",
            () => {
              if (
                newWorker.state ===
                "installed"
              ) {
                /*
                 * If an old controller exists,
                 * this is an update rather than
                 * the first installation.
                 */
                if (
                  navigator.serviceWorker
                    .controller
                ) {
                  newWorker.postMessage({
                    type: "SKIP_WAITING",
                  });
                }
              }
            }
          );
        }
      );

      /*
       * Once the new worker takes control,
       * reload once so the visitor gets the
       * latest HTML/CSS/JS immediately.
       */
      let refreshing = false;

      navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => {
          if (refreshing) return;

          refreshing = true;

          window.location.reload();
        }
      );

      /*
       * Check again whenever the visitor
       * returns to the tab.
       */
      document.addEventListener(
        "visibilitychange",
        () => {
          if (
            document.visibilityState ===
            "visible"
          ) {
            registration.update().catch(
              () => {}
            );
          }
        }
      );

      /*
       * A light periodic check.
       * 30 minutes is intentionally long to
       * avoid unnecessary network work.
       */
      window.setInterval(() => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          registration.update().catch(
            () => {}
          );
        }
      }, 30 * 60 * 1000);
    } catch (error) {
      /*
       * PWA failure should NEVER break
       * the portfolio itself.
       */
      console.warn(
        "Service Worker registration failed:",
        error
      );
    }
  };

  /*
   * Register after the page becomes interactive.
   * This keeps the portfolio UI priority higher
   * than PWA initialization.
   */
  if (
    "requestIdleCallback" in window
  ) {
    window.requestIdleCallback(
      registerServiceWorker,
      {
        timeout: 2500,
      }
    );
  } else {
    window.setTimeout(
      registerServiceWorker,
      1200
    );
  }

  /* =======================================================
     PAGE VISIBILITY
     -------------------------------------------------------
     Small performance improvement:
     refresh header state when the user comes back.
  ======================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        updateHeader();
      }
    }
  );

  /* =======================================================
     INITIAL ACTIVE STATE
  ======================================================= */

  if (window.scrollY < 120) {
    setActiveSection("about");
  }

  /* =======================================================
     CLEANUP
     -------------------------------------------------------
     Stop unnecessary effects when page is hidden.
  ======================================================= */

  window.addEventListener(
    "pagehide",
    () => {
      closeMenu();
    },
    {
      passive: true,
    }
  );
})();