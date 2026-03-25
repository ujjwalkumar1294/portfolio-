// -------------------------------------------
//  UJJWAL KUMAR — PORTFOLIO INTERACTIONS
//  (Vanilla JS: no GSAP, no AOS)
// -------------------------------------------

// Preloader + hero reveal
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const logo = document.querySelector('.preloader-logo');
  const fill = document.querySelector('.preloader-fill');

  if (logo) {
    logo.style.opacity = '1';
    logo.style.transform = 'scale(1)';
    logo.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  }

  if (fill) {
    fill.style.transition = 'width 1.1s ease';
    fill.style.width = '100%';
  }

  setTimeout(() => {
    if (preloader) {
      preloader.style.transition = 'transform 0.75s ease, opacity 0.75s ease';
      preloader.style.transform = 'translateY(-100%)';
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 760);
    }

    initHeroState();
  }, 1500);
});

function initHeroState() {
  document.querySelectorAll('.hero-title .word').forEach((word) => {
    word.style.transform = 'translateY(0)';
  });

  ['.hero-eyebrow', '.hero-p', '.hero-btns', '.hero-tags', '.hero-canvas'].forEach((selector) => {
    const el = document.querySelector(selector);
    if (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
}

// Particle canvas
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w;
  let h;
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;

  function resize() {
    const section = canvas.parentElement;
    w = canvas.width = section.offsetWidth;
    h = canvas.height = section.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        const force = ((120 - dist) / 120) * 0.02;
        this.vx += dx * force;
        this.vy += dy * force;
      }

      this.vx *= 0.99;
      this.vy *= 0.99;

      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(123,92,248,${this.alpha})`;
      ctx.fill();
    }
  }

  const count = Math.min(80, Math.floor((w * h) / 12000));
  for (let i = 0; i < count; i += 1) {
    particles.push(new Particle());
  }

  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function drawLines() {
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(123,92,248,${0.06 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animate);
  }

  animate();
})();

// Custom cursor
const cur = document.getElementById('cursor');
const dot = document.getElementById('cursor-dot');
let mx = 0;
let my = 0;
let cx = 0;
let cy = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  if (dot) {
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;
  }
});

function animateCursor() {
  cx += (mx - cx) * 0.1;
  cy += (my - cy) * 0.1;

  if (cur) {
    cur.style.left = `${cx}px`;
    cur.style.top = `${cy}px`;
  }

  requestAnimationFrame(animateCursor);
}
animateCursor();

document
  .querySelectorAll('a,button,.sk-card,.proj-card,.cert-card-v2,.ach-card,.scard,.cl,.btn-magnetic,.skill-item,.skill-category,.training-card')
  .forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cur) cur.classList.add('hovering');
    });

    el.addEventListener('mouseleave', () => {
      if (cur) cur.classList.remove('hovering');
    });
  });

// Magnetic buttons
document.querySelectorAll('.btn-magnetic').forEach((btn) => {
  const target = btn.querySelector('a, button');
  if (!target) return;

  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    target.style.transition = 'transform 0.2s ease';
    target.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    target.style.transition = 'transform 0.45s ease';
    target.style.transform = 'translate(0, 0)';
  });
});

// Navbar
let lastScroll = 0;
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (!nav) return;

  const current = window.scrollY;
  nav.classList.toggle('scrolled', current > 80);
  nav.classList.toggle('hidden', current > lastScroll && current > 300);
  lastScroll = current;
});

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Number counters with IntersectionObserver
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const text = el.textContent || '';
      const match = text.match(/^(\d+)/);

      if (!match) {
        observer.unobserve(el);
        return;
      }

      const target = parseInt(match[1], 10);
      const suffix = text.replace(match[1], '');
      const duration = 1200;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(target * progress);
        el.textContent = `${value}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.scard .num').forEach((el) => observer.observe(el));

// Project card tilt
document.querySelectorAll('.proj-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transition = 'transform 0.2s ease';
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${(-y) * 10}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.45s ease';
    card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href.length < 2) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Lightbox (global function used by inline onclick)
function openLightbox(wrap) {
  const img = wrap.querySelector('img');
  if (!img) return;

  const lightboxImg = document.getElementById('lightbox-img');
  const lightbox = document.getElementById('lightbox');
  if (!lightboxImg || !lightbox) return;

  lightboxImg.src = img.src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

window.openLightbox = openLightbox;

const lightboxClose = document.getElementById('lightbox-close');
if (lightboxClose) {
  lightboxClose.addEventListener('click', () => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  });
}

const lightbox = document.getElementById('lightbox');
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;

  const box = document.getElementById('lightbox');
  if (!box) return;

  box.classList.remove('open');
  document.body.style.overflow = '';
});
