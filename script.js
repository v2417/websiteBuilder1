/**
 * script.js — WebCraft AI
 * Linked from: index.html via <script src="script.js"></script>
 * Reads styles defined in: style.css
 *
 * Responsibilities:
 *  1. Cursor glow that follows the mouse
 *  2. Navbar scroll behaviour (shrink + background)
 *  3. Hamburger mobile menu toggle
 *  4. Scroll-reveal animations using IntersectionObserver
 *  5. Marquee pause-on-hover
 *  6. CTA prompt tags — clicking fills the input
 *  7. CTA button — opens website-builder.html with the prompt pre-filled
 *  8. Smooth active-section highlight in nav
 */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   1. CURSOR GLOW
   Tracks mouse position and moves a soft
   radial-gradient blob behind the cursor.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return; // skip on touch devices

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   2. NAVBAR — shrink & background on scroll
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   3. HAMBURGER MENU
   Toggles .open class on both the button
   and the mobile-menu drawer. Closes when
   any menu link is clicked.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
    }
  });
})();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   4. SCROLL-REVEAL ANIMATION
   Uses IntersectionObserver to watch every
   [data-reveal] element defined in index.html.
   The CSS in style.css handles the actual
   animation (opacity + translateY transition).
   data-delay attribute staggers the reveal.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);

      // Apply delay from HTML attribute → inline style
      if (delay) el.style.transitionDelay = delay + 's';

      // Adding .visible triggers the CSS transition in style.css
      requestAnimationFrame(() => el.classList.add('visible'));

      observer.unobserve(el); // animate once only
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   5. MARQUEE — pause on hover
   The animation is defined in style.css as
   @keyframes marquee. We pause it when the
   user hovers so they can read the text.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  const wrap = track.closest('.marquee-wrap');
  wrap.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  wrap.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   6. CTA PROMPT TAGS
   Each .cta-tag has a data-prompt attribute
   set in index.html. Clicking it fills the
   main input with that example prompt and
   focuses it so the user can edit or submit.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initPromptTags() {
  const input = document.getElementById('ctaInput');
  const tags  = document.querySelectorAll('.cta-tag');
  if (!input || !tags.length) return;

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      // Fill the input
      input.value = tag.dataset.prompt || '';
      input.focus();

      // Briefly highlight the active tag
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      // Smooth-scroll to the CTA section
      document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
})();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   7. CTA BUTTON — launch the builder
   Reads the prompt from the input field and
   passes it to website-builder.html via
   URL query param so the builder can pre-fill.
   Falls back to just opening the builder if
   the input is empty.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initCtaButton() {
  const btn   = document.getElementById('ctaBtn');
  const input = document.getElementById('ctaInput');
  if (!btn || !input) return;

  function launch() {
    const prompt = input.value.trim();
    if (prompt) {
      // Pass prompt to builder via URL param
      const url = 'website-builder.html?prompt=' + encodeURIComponent(prompt);
      window.location.href = url;
    } else {
      // No prompt — just open the builder
      window.location.href = 'website-builder.html';
    }
  }

  btn.addEventListener('click', launch);

  // Allow Enter key to submit
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') launch();
  });

  // Animate button on input focus
  input.addEventListener('focus',  () => btn.classList.add('ready'));
  input.addEventListener('blur',   () => btn.classList.remove('ready'));
})();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   8. ACTIVE SECTION HIGHLIGHT IN NAV
   Uses IntersectionObserver to track which
   section is most visible and adds an
   .active class to the matching nav link.
   The CSS underline in style.css makes it visible.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach(link => {
      const matches = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', matches);
      // Sync the underline by toggling the CSS forced style
      if (matches) {
        link.style.color = 'var(--text)';
      } else {
        link.style.color = '';
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => observer.observe(sec));
})();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UTILITY — Log confirmation that JS loaded
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
console.log('%c WebCraft AI ✦ script.js loaded ', 'background:#7c6fff;color:#fff;padding:4px 10px;border-radius:4px;font-weight:bold;');
