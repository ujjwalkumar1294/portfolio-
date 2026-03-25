// ═══════════════════════════════════════════
//  POPPER.JS FLOATING WIDGETS — CONTROLLER
// ═══════════════════════════════════════════

(function () {
  'use strict';

  // Wait for DOM and Popper to be available
  if (typeof Popper === 'undefined') {
    console.warn('Popper.js not loaded — floating widgets disabled.');
    return;
  }

  const { createPopper } = Popper;

  // ═══════════════════════════════════════
  // 1. SKILL TOOLTIPS
  // ═══════════════════════════════════════

  const skillData = {
    'C':          { desc: 'Systems-level programming with memory management and pointers.', level: 'Intermediate' },
    'C++':        { desc: 'Object-oriented programming, DSA, and STL for competitive coding.', level: 'Advanced' },
    'Python':     { desc: 'Data analysis, automation, web backends, and scripting.', level: 'Advanced' },
    'Java':       { desc: 'Enterprise OOP concepts and multithreaded applications.', level: 'Intermediate' },
    'DBMS':       { desc: 'Database management, normalization, and query optimization.', level: 'Intermediate' },
    'Django':     { desc: 'Full-stack Python web framework with ORM and admin panel.', level: 'Advanced' },
    'HTML':       { desc: 'Semantic markup, accessibility, and SEO-optimized structure.', level: 'Advanced' },
    'CSS':        { desc: 'Responsive layouts, Flexbox, Grid, animations, and glassmorphism.', level: 'Advanced' },
    'JavaScript': { desc: 'DOM manipulation, ES6+, async programming, and browser APIs.', level: 'Intermediate' },
    'React.js':   { desc: 'Component-based SPAs with hooks and state management.', level: 'Learning' },
    'FastAPI':    { desc: 'High-performance Python REST APIs with async support.', level: 'Intermediate' },
    'MySQL':      { desc: 'Relational database design, complex queries, and joins.', level: 'Advanced' },
    'Excel':      { desc: 'Pivot tables, VLOOKUP, dashboards, and data visualization.', level: 'Advanced' },
    'Power BI':   { desc: 'Interactive dashboards, DAX measures, and business intelligence.', level: 'Advanced' },
    'GitHub':     { desc: 'Version control, branching strategies, and collaboration.', level: 'Intermediate' },
    'Postman':    { desc: 'API testing, collections, environments, and automation.', level: 'Intermediate' }
  };

  function initSkillTooltips() {
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach(item => {
      // Get skill name from text content
      const skillName = item.textContent.trim();
      const data = skillData[skillName];
      if (!data) return;

      // Create tooltip element
      const tooltip = document.createElement('div');
      tooltip.className = 'skill-tooltip';
      tooltip.innerHTML = `
        <div class="tooltip-title">${skillName}</div>
        <div>${data.desc}</div>
        <div class="tooltip-level">⚡ ${data.level}</div>
        <div class="popper-arrow" data-popper-arrow></div>
      `;
      document.body.appendChild(tooltip);

      let popperInstance = null;

      item.addEventListener('mouseenter', () => {
        popperInstance = createPopper(item, tooltip, {
          placement: 'top',
          modifiers: [
            { name: 'offset', options: { offset: [0, 12] } },
            { name: 'flip', options: { fallbackPlacements: ['bottom', 'right', 'left'] } },
            { name: 'preventOverflow', options: { padding: 12 } },
            { name: 'arrow', options: { element: tooltip.querySelector('.popper-arrow') } }
          ]
        });
        tooltip.classList.add('visible');
      });

      item.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
        if (popperInstance) {
          popperInstance.destroy();
          popperInstance = null;
        }
      });
    });
  }


  // ═══════════════════════════════════════
  // 2. NAV "MORE" DROPDOWN
  // ═══════════════════════════════════════

  function initNavDropdown() {
    const trigger = document.getElementById('nav-more-trigger');
    const menu = document.getElementById('nav-more-menu');
    if (!trigger || !menu) return;

    const popperInstance = createPopper(trigger, menu, {
      placement: 'bottom-start',
      modifiers: [
        { name: 'offset', options: { offset: [0, 12] } },
        { name: 'preventOverflow', options: { padding: 16 } },
        { name: 'flip', options: { fallbackPlacements: ['bottom-end', 'top-start'] } }
      ]
    });

    let isOpen = false;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      trigger.classList.toggle('active', isOpen);
      menu.classList.toggle('visible', isOpen);
      popperInstance.update();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !menu.contains(e.target) && !trigger.contains(e.target)) {
        isOpen = false;
        trigger.classList.remove('active');
        menu.classList.remove('visible');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        isOpen = false;
        trigger.classList.remove('active');
        menu.classList.remove('visible');
      }
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        isOpen = false;
        trigger.classList.remove('active');
        menu.classList.remove('visible');
      });
    });
  }


  // ═══════════════════════════════════════
  // 3. PROJECT DETAIL POPOVERS
  // ═══════════════════════════════════════

  const projectData = [
    {
      title: 'LA Crime Insights Dashboard',
      highlights: ['18K+ records cleaned & analyzed', 'Dynamic filter system', 'Heatmap visualizations'],
      stats: [{ val: '18K+', label: 'Records' }, { val: '3', label: 'Charts' }, { val: 'A+', label: 'Grade' }]
    },
    {
      title: 'Public Library Dashboard',
      highlights: ['Multi-chart visual reports', 'Slicer-based filtering', 'Decision-maker focused UI'],
      stats: [{ val: '5', label: 'Charts' }, { val: '100%', label: 'Interactive' }, { val: 'Live', label: 'Filters' }]
    },
    {
      title: 'Student Marks Management System',
      highlights: ['Full CRUD operations', 'Binary search optimization', 'Ranking engine built-in'],
      stats: [{ val: 'C++', label: 'Language' }, { val: 'O(log n)', label: 'Search' }, { val: 'OOP', label: 'Design' }]
    },
    {
      title: 'RailConnect',
      highlights: ['Full-stack Django app', 'Admin + User dashboards', 'MySQL relational backend'],
      stats: [{ val: 'Full', label: 'Stack' }, { val: '2', label: 'Panels' }, { val: 'CRUD', label: 'Ops' }]
    }
  ];

  function initProjectPopovers() {
    const projCards = document.querySelectorAll('.proj-card');

    projCards.forEach((card, index) => {
      const data = projectData[index];
      if (!data) return;

      const titleEl = card.querySelector('.proj-title');
      if (!titleEl) return;

      // Create popover
      const popover = document.createElement('div');
      popover.className = 'proj-popover';
      popover.innerHTML = `
        <div class="proj-popover-title">${data.title}</div>
        <ul class="proj-popover-highlights">
          ${data.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
        <div class="proj-popover-stats">
          ${data.stats.map(s => `
            <div class="proj-popover-stat">
              <div class="stat-val">${s.val}</div>
              <div class="stat-label">${s.label}</div>
            </div>
          `).join('')}
        </div>
      `;
      document.body.appendChild(popover);

      let popperInstance = null;
      let showTimeout, hideTimeout;

      titleEl.style.cursor = 'pointer';

      titleEl.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        showTimeout = setTimeout(() => {
          popperInstance = createPopper(titleEl, popover, {
            placement: 'right',
            modifiers: [
              { name: 'offset', options: { offset: [0, 16] } },
              { name: 'flip', options: { fallbackPlacements: ['left', 'top', 'bottom'] } },
              { name: 'preventOverflow', options: { padding: 16 } }
            ]
          });
          popover.classList.add('visible');
        }, 300);
      });

      titleEl.addEventListener('mouseleave', () => {
        clearTimeout(showTimeout);
        hideTimeout = setTimeout(() => {
          popover.classList.remove('visible');
          if (popperInstance) {
            popperInstance.destroy();
            popperInstance = null;
          }
        }, 150);
      });
    });
  }


  // ═══════════════════════════════════════
  // 4. BACK TO TOP + TOOLTIP
  // ═══════════════════════════════════════

  function initBackToTop() {
    const wrap = document.querySelector('.back-to-top-wrap');
    const btn = document.querySelector('.back-to-top-btn');
    const tooltip = document.querySelector('.btt-tooltip');
    if (!wrap || !btn || !tooltip) return;

    const popperInstance = createPopper(btn, tooltip, {
      placement: 'left',
      modifiers: [
        { name: 'offset', options: { offset: [0, 12] } },
        { name: 'preventOverflow', options: { padding: 12 } }
      ]
    });

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
      wrap.classList.toggle('visible', window.scrollY > 500);
    });

    // Tooltip on hover
    btn.addEventListener('mouseenter', () => {
      tooltip.classList.add('visible');
      popperInstance.update();
    });

    btn.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });

    // Scroll to top on click
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ═══════════════════════════════════════
  // 5. CONTACT FAB MENU
  // ═══════════════════════════════════════

  function initContactFAB() {
    const fabBtn = document.querySelector('.contact-fab-btn');
    const fabItems = document.querySelectorAll('.contact-fab-item');
    if (!fabBtn || !fabItems.length) return;

    let isOpen = false;

    fabBtn.addEventListener('click', () => {
      isOpen = !isOpen;
      fabBtn.classList.toggle('active', isOpen);

      fabItems.forEach((item, i) => {
        if (isOpen) {
          setTimeout(() => {
            item.classList.add('visible');
            item.style.transform = `scale(1) translateY(0)`;
          }, i * 80);
        } else {
          item.classList.remove('visible');
          item.style.transform = `scale(0.5) translateY(20px)`;
        }
      });
    });

    // Tooltips for each FAB item
    fabItems.forEach(item => {
      const label = item.getAttribute('data-label');
      if (!label) return;

      const tooltip = document.createElement('div');
      tooltip.className = 'fab-item-tooltip';
      tooltip.textContent = label;
      document.body.appendChild(tooltip);

      let popperInstance = null;

      item.addEventListener('mouseenter', () => {
        popperInstance = createPopper(item, tooltip, {
          placement: 'left',
          modifiers: [
            { name: 'offset', options: { offset: [0, 10] } },
            { name: 'preventOverflow', options: { padding: 8 } }
          ]
        });
        tooltip.classList.add('visible');
      });

      item.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
        if (popperInstance) {
          popperInstance.destroy();
          popperInstance = null;
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !fabBtn.contains(e.target) && !e.target.closest('.contact-fab-item')) {
        isOpen = false;
        fabBtn.classList.remove('active');
        fabItems.forEach(item => {
          item.classList.remove('visible');
          item.style.transform = 'scale(0.5) translateY(20px)';
        });
      }
    });
  }


  // ═══════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════

  document.addEventListener('DOMContentLoaded', () => {
    initSkillTooltips();
    initNavDropdown();
    initProjectPopovers();
    initBackToTop();
    initContactFAB();
  });

})();
