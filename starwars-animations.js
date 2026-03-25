// ═══════════════════════════════════════════════════
//  STAR WARS HOLOGRAPHIC ANIMATIONS ENGINE
//  GSAP ScrollTrigger + Custom Canvas Starfield
// ═══════════════════════════════════════════════════

(function () {
  'use strict';

  // Guard: wait for GSAP
  if (typeof gsap === 'undefined') {
    console.warn('[starwars-animations] GSAP not found — animations disabled.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const qs = (s, p) => (p || document).querySelector(s);
  const qa = (s, p) => [...(p || document).querySelectorAll(s)];


  // ═══════════════════════════════════════════════
  // 1. STARFIELD BACKGROUND (Replaces Particles)
  // ═══════════════════════════════════════════════
  function initStarfield() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h;
    let stars = [];
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
      const section = canvas.parentElement;
      w = canvas.width = section.offsetWidth;
      h = canvas.height = section.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Star {
      constructor() {
        this.reset(true);
      }

      reset(randomizeZ = false) {
        this.x = (Math.random() - 0.5) * w;
        this.y = (Math.random() - 0.5) * h;
        this.z = randomizeZ ? Math.random() * w : w;
        this.vx = 0;
        this.vy = 0;
      }

      update() {
        // Move towards the viewer (hyperspace drift)
        this.z -= 0.5;

        // Parallax based on mouse
        const targetVx = (mouseX - w / 2) * 0.0005;
        const targetVy = (mouseY - h / 2) * 0.0005;

        this.vx += (targetVx - this.vx) * 0.1;
        this.vy += (targetVy - this.vy) * 0.1;

        this.x -= this.vx * this.z * 0.01;
        this.y -= this.vy * this.z * 0.01;

        if (this.z <= 0 || Math.abs(this.x) > w || Math.abs(this.y) > h) {
          this.reset();
        }
      }

      draw() {
        const px = (this.x / this.z) * w + w / 2;
        const py = (this.y / this.z) * h + h / 2;

        const radius = Math.max(0.1, (1 - this.z / w) * 1.5);
        const alpha = Math.max(0.1, 1 - this.z / w);

        // Rare red/blue stars for theme
        let color = `rgba(255, 255, 255, ${alpha})`;
        if (Math.random() > 0.98) color = `rgba(56, 189, 248, ${alpha})`; // Holo blue
        if (Math.random() > 0.99) color = `rgba(239, 68, 68, ${alpha})`;  // Sith red

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (radius > 1) {
          ctx.shadowBlur = radius > 1.2 ? 5 : 0;
          ctx.shadowColor = `rgba(56, 189, 248, ${alpha * 0.5})`;
        } else {
          ctx.shadowBlur = 0;
        }
      }
    }

    const count = Math.min(400, Math.floor((w * h) / 4000));
    for (let i = 0; i < count; i++) {
      stars.push(new Star());
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      // Deep space trail effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.4)';
      ctx.fillRect(0, 0, w, h);
      ctx.shadowBlur = 0;

      stars.forEach(s => {
        s.update();
        s.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }


  // ═══════════════════════════════════════════════
  // 2. TERMINAL TYPING EFFECT
  // ═══════════════════════════════════════════════
  function initTerminalTyping() {
    const heroP = qs('.hero-p');
    if (!heroP) return;

    heroP.classList.add('terminal-text');
    const roles = ['Data Analyst', 'Software Developer', 'Problem Solver'];
    
    const typingSpan = document.createElement('span');
    typingSpan.className = 'typing-role';
    typingSpan.textContent = roles[0];

    heroP.innerHTML = 'System.out.print("<span class="sith-text">Status: </span>");<br/>> ';
    heroP.appendChild(typingSpan);

    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    cursor.innerHTML = '&nbsp;';
    heroP.appendChild(cursor);

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
      const current = roles[roleIdx];

      if (isPaused) {
        isPaused = false;
        isDeleting = true;
        setTimeout(type, 1000);
        return;
      }

      if (!isDeleting) {
        typingSpan.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          isPaused = true;
          setTimeout(type, 2000);
          return;
        }
        setTimeout(type, 60 + Math.random() * 50);
      } else {
        typingSpan.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 30);
      }
    }
    setTimeout(type, 2800);
  }


  // ═══════════════════════════════════════════════
  // 3. SCI-FI ENTRANCE & SCROLL REVEALS
  // ═══════════════════════════════════════════════
  function initSciFiReveals() {
    // Hero HUD Entrance
    const tl = gsap.timeline({ delay: 2.2 });

    tl.fromTo('.hud-container',
      { opacity: 0, scale: 0.5, rotation: -90 },
      { opacity: 1, scale: 1, rotation: 0, duration: 1.5, ease: 'power4.out' }
    );

    tl.fromTo('.hero-title .word',
      { opacity: 0, y: 30, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.15, ease: 'power3.out' },
      '-=1'
    );

    tl.fromTo('.hero-p',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.5'
    );

    tl.fromTo('.hero-btns',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' },
      '-=0.4'
    );

    // Section Scroll Reveals (Hologram flicker in)
    qa('section, #achievements').forEach(section => {
      const els = [qs('.holo-label', section), qs('.holo-heading', section), qs('.grad-line', section), qs('.s-desc', section)].filter(Boolean);
      if (!els.length) return;

      gsap.fromTo(els,
        { opacity: 0, y: 20, filter: 'blur(5px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Cards / Panels (Slide up with glitch-like ease)
    const cardSelectors = ['.holo-panel', '.skill-hud', '.scard'];
    cardSelectors.forEach(sel => {
      qa(sel).forEach(card => {
        gsap.fromTo(card,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7, ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    });
  }


  // ═══════════════════════════════════════════════
  // 4. JEDI DATA CONSOLE ANIMATIONS
  // ═══════════════════════════════════════════════
  function initJediConsole() {
    // Energy line expansion
    gsap.fromTo('.jedi-energy-line',
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.jedi-energy-line',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Number counters
    qa('.jedi-stat-card .num').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      
      gsap.fromTo(el, 
        { innerText: 0 }, 
        {
          innerText: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function() {
            const val = Math.round(this.targets()[0].innerText);
            if(target >= 1000) {
              el.textContent = Math.round(val/1000) + 'K+';
              if(val < 1000) el.textContent = val;
            } else {
              el.textContent = val + '+';
            }
          },
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
    
    // Jedi elements entrance
    gsap.fromTo(['.jedi-stat-card', '.jedi-profile-wrapper'],
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // ═══════════════════════════════════════════════
  // 5. INITIALIZATION
  // ═══════════════════════════════════════════════

  function setInitialStates() {
    gsap.set(['.hud-container', '.hero-title .word', '.hero-p', '.hero-btns', '.holo-panel', '.skill-hud', '.scard', '.holo-label', '.holo-heading', '.grad-line', '.s-desc', '.jedi-energy-line', '.jedi-stat-card', '.jedi-profile-wrapper'], { opacity: 0 });
  }

  setInitialStates();

  document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initSciFiReveals();
    initTerminalTyping();
    initJediConsole();
  });

})();
