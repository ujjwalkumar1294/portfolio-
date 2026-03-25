// ═══════════════════════════════════════════════════
//  PREMIUM ANIMATIONS ENGINE — Purple Nebula Theme
//  GSAP ScrollTrigger + Vanilla JS Enhancements
// ═══════════════════════════════════════════════════

(function () {
  'use strict';

  // Guard: wait for GSAP
  if (typeof gsap === 'undefined') {
    console.warn('[premium-animations] GSAP not found — animations disabled.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ─── UTILITY ───────────────────────────────────
  const qs = (s, p) => (p || document).querySelector(s);
  const qa = (s, p) => [...(p || document).querySelectorAll(s)];


  // ═══════════════════════════════════════════════
  // 1. HERO — TYPING EFFECT
  // ═══════════════════════════════════════════════

  function initTypingEffect() {
    const heroP = qs('.hero-p');
    if (!heroP) return;

    const roles = [
      'Data Analyst',
      'Software Developer',
      'Problem Solver',
      'Dashboard Designer',
      'Python Enthusiast'
    ];

    // Create dynamic typing element
    const typingSpan = document.createElement('span');
    typingSpan.className = 'typing-role';
    typingSpan.textContent = roles[0];

    // Replace static text with dynamic version
    heroP.innerHTML = '';
    const staticPart = document.createElement('span');
    staticPart.textContent = 'Turning raw datasets into powerful insights — ';
    heroP.appendChild(staticPart);
    heroP.appendChild(typingSpan);

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    heroP.appendChild(cursor);

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
      const current = roles[roleIndex];

      if (isPaused) {
        isPaused = false;
        isDeleting = true;
        setTimeout(type, 800);
        return;
      }

      if (!isDeleting) {
        typingSpan.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          isPaused = true;
          setTimeout(type, 2200);
          return;
        }
        setTimeout(type, 70 + Math.random() * 50);
      } else {
        typingSpan.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 35);
      }
    }

    // Start after preloader (~2.5s)
    setTimeout(type, 2800);
  }


  // ═══════════════════════════════════════════════
  // 2. HERO — GSAP ENTRANCE ANIMATION
  // ═══════════════════════════════════════════════

  function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 2.2 });

    // Eyebrow
    tl.fromTo('.hero-eyebrow',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    // Title words stagger
    tl.fromTo('.hero-title .word',
      { opacity: 0, y: 60, rotateX: -15 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.15, ease: 'power4.out' },
      '-=0.3'
    );

    // Description
    tl.fromTo('.hero-p',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.4'
    );

    // Buttons
    tl.fromTo('.hero-btns',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );

    // Tags stagger
    tl.fromTo('.hero-tags .tag',
      { opacity: 0, scale: 0.8, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(1.5)' },
      '-=0.3'
    );

    // Hero canvas (orbital visual)
    tl.fromTo('.hero-canvas',
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
      '-=1'
    );

    // Float cards stagger
    tl.fromTo('.float-card',
      { opacity: 0, scale: 0.7, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(2)' },
      '-=0.8'
    );
  }


  // ═══════════════════════════════════════════════
  // 3. SCROLL-REVEAL SYSTEM
  // ═══════════════════════════════════════════════

  function initScrollReveals() {
    // Section headers: label → title → line → description
    qa('section, #achievements').forEach(section => {
      const label = qs('.s-label', section);
      const title = qs('.s-title', section);
      const line = qs('.grad-line', section);
      const desc = qs('.s-desc', section);

      const els = [label, title, line, desc].filter(Boolean);
      if (!els.length) return;

      gsap.fromTo(els,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // About stats stagger
    gsap.fromTo('.scard',
      { opacity: 0, y: 40, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6, stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-stats',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    // About big card
    const bigCard = qs('.about-big-card');
    if (bigCard) {
      gsap.fromTo(bigCard,
        { opacity: 0, x: 60, scale: 0.95 },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: bigCard,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Skill categories stagger
    gsap.fromTo('.skill-category',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.7, stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-categories',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Project cards stagger
    gsap.fromTo('.proj-card',
      { opacity: 0, y: 60, rotateX: -8 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.8, stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.proj-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Training card
    const trainingCard = qs('.training-card');
    if (trainingCard) {
      gsap.fromTo(trainingCard,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: trainingCard,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Cert cards stagger
    gsap.fromTo('.cert-card-v2',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.6, stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cert-section-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Achievement cards
    gsap.fromTo('.ach-card',
      { opacity: 0, scale: 0.85, y: 40 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 0.7, stagger: 0.15,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.ach-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Contact section
    const contactInner = qs('.contact-inner');
    if (contactInner) {
      gsap.fromTo('.contact-links',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.7, ease: 'power3.out',
          scrollTrigger: {
            trigger: contactInner,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Footer
    gsap.fromTo('footer',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.6, ease: 'power3.out',
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Marquee
    gsap.fromTo('.marquee-wrap',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.marquee-wrap',
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      }
    );
  }


  // ═══════════════════════════════════════════════
  // 4. HERO PARALLAX — FLOATING CARDS
  // ═══════════════════════════════════════════════

  function initHeroParallax() {
    const cards = qa('.float-card');
    if (!cards.length) return;

    const speeds = [0.15, -0.1, 0.12, -0.08];

    cards.forEach((card, i) => {
      gsap.to(card, {
        y: () => speeds[i % speeds.length] * 200,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    });

    // Orbit rings parallax
    qa('.orbit-ring').forEach((ring, i) => {
      gsap.to(ring, {
        y: (i + 1) * -30,
        rotation: (i + 1) * 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 2
        }
      });
    });
  }


  // ═══════════════════════════════════════════════
  // 5. SKILL PROGRESS BARS
  // ═══════════════════════════════════════════════

  function initSkillBars() {
    const items = qa('.skill-item[data-level]');
    if (!items.length) return;

    items.forEach(item => {
      const level = parseInt(item.getAttribute('data-level'), 10) || 0;

      // Create progress bar container
      const bar = document.createElement('div');
      bar.className = 'skill-progress-bar';

      const fill = document.createElement('div');
      fill.className = 'skill-progress-fill';
      fill.style.setProperty('--level', level + '%');

      bar.appendChild(fill);
      item.appendChild(bar);
    });

    // Animate on scroll
    qa('.skill-category').forEach(cat => {
      const fills = qa('.skill-progress-fill', cat);
      if (!fills.length) return;

      ScrollTrigger.create({
        trigger: cat,
        start: 'top 80%',
        onEnter: () => {
          fills.forEach((fill, i) => {
            gsap.to(fill, {
              width: fill.style.getPropertyValue('--level'),
              duration: 1,
              delay: i * 0.08,
              ease: 'power2.out'
            });
          });
        },
        once: true
      });
    });
  }


  // ═══════════════════════════════════════════════
  // 6. ANIMATED GRADIENT ORBS (BACKGROUND)
  // ═══════════════════════════════════════════════

  function initAmbientOrbs() {
    const sections = qa('#about, #skills, #projects, #contact');
    sections.forEach(section => {
      if (qs('.ambient-orb', section)) return; // already exists

      const orb1 = document.createElement('div');
      orb1.className = 'ambient-orb orb-purple';
      const orb2 = document.createElement('div');
      orb2.className = 'ambient-orb orb-cyan';

      section.style.position = 'relative';
      section.style.overflow = 'hidden';
      section.appendChild(orb1);
      section.appendChild(orb2);
    });
  }


  // ═══════════════════════════════════════════════
  // 7. ENHANCED SMOOTH SCROLL
  // ═══════════════════════════════════════════════

  function initSmoothScroll() {
    qa('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href.length < 2) return;

        const target = qs(href);
        if (!target) return;

        e.preventDefault();

        // Use GSAP ScrollTo if plugin loaded, else native
        if (gsap.plugins && gsap.plugins.scrollTo) {
          gsap.to(window, {
            scrollTo: { y: target, offsetY: 80 },
            duration: 1,
            ease: 'power3.inOut'
          });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }


  // ═══════════════════════════════════════════════
  // 8. PROJECT CARD GLOW EFFECT
  // ═══════════════════════════════════════════════

  function initCardGlow() {
    qa('.proj-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--glow-x', x + 'px');
        card.style.setProperty('--glow-y', y + 'px');
      });
    });
  }


  // ═══════════════════════════════════════════════
  // 9. SECTION PROGRESS INDICATOR
  // ═══════════════════════════════════════════════

  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    document.body.appendChild(bar);

    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
  }


  // ═══════════════════════════════════════════════
  // SET INITIAL STATES (BEFORE ANIMATION)
  // ═══════════════════════════════════════════════

  function setInitialStates() {
    // Hero elements start invisible (animated by GSAP timeline)
    gsap.set([
      '.hero-eyebrow', '.hero-title .word',
      '.hero-p', '.hero-btns', '.hero-tags .tag',
      '.hero-canvas', '.float-card'
    ], { opacity: 0 });

    // Scroll-revealed elements start invisible
    gsap.set([
      '.scard', '.about-big-card',
      '.skill-category', '.proj-card',
      '.training-card', '.cert-card-v2',
      '.ach-card', '.contact-links',
      'footer', '.marquee-wrap'
    ], { opacity: 0 });
  }


  // ═══════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════

  // Set states immediately (before paint)
  setInitialStates();

  // Initialize everything after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initTypingEffect();
    initScrollReveals();
    initHeroParallax();
    initSkillBars();
    initAmbientOrbs();
    initCardGlow();
    initScrollProgress();
    // initSmoothScroll(); // disabled — portfolio.js already handles this
  });

})();
