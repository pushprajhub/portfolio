/* ============================================================
   PUSHPRAJ PORTFOLIO — script.js
   ============================================================ */

// ---- 1. ANIMATED CANVAS BACKGROUND ----
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle class
  function Particle() {
    this.reset = function() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.r    = Math.random() * 1.5 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.25;
      this.vy   = (Math.random() - 0.5) * 0.25;
      this.alpha= Math.random() * 0.5 + 0.1;
    };
    this.reset();

    this.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    };

    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74,159,255,${this.alpha})`;
      ctx.fill();
    };
  }

  // Create particles
  const COUNT = 120;
  for (let i = 0; i < COUNT; i++) {
    particles.push(new Particle());
  }

  // Draw connections
  function drawLines() {
    const MAX_DIST = 110;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(30,111,224,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Radial gradient overlay
    const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.7);
    grad.addColorStop(0, 'rgba(14,34,68,0.15)');
    grad.addColorStop(1, 'rgba(5,13,26,0.3)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    animId = requestAnimationFrame(loop);
  }
  loop();
})();


// ---- 2. CURSOR GLOW ----
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
  });

  function animate() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();


// ---- 3. NAVBAR SCROLL STYLE ----
(function initNavbar() {
  const header = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.style.background = 'rgba(5,13,26,0.95)';
    } else {
      header.style.background = 'rgba(5,13,26,0.75)';
    }
  });
})();


// ---- 4. MOBILE MENU ----
(function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('mobileNav');

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
})();


// ---- 5. SCROLL REVEAL ----
(function initReveal() {
  const items = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve – once visible, keep
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();


// ---- 6. COUNTER ANIMATION ----
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const isDecimal = target % 1 !== 0;
    const duration = 1500;
    const step = 16;
    const steps = duration / step;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
    }, step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


// ---- 7. SKILL BARS ----
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width || 70;
        // Slight delay so reveal animation lands first
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 300);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
})();


// ---- 8. ACTIVE NAV HIGHLIGHT ----
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.style.color = 'var(--cyan)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


// ---- 9. CONTACT FORM ----
(function initContactForm() {
  const btn  = document.getElementById('sendBtn');
  const msg  = document.getElementById('formMsg');

  if (!btn) return;

  btn.addEventListener('click', () => {
    const name  = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const text  = document.getElementById('cMsg').value.trim();

    if (!name || !email || !text) {
      msg.textContent = '⚠️ Please fill in all fields.';
      msg.style.color = '#ff7b7b';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = '⚠️ Please enter a valid email address.';
      msg.style.color = '#ff7b7b';
      return;
    }

    btn.textContent  = 'Sending…';
    btn.disabled     = true;

    // Simulate send (replace with real EmailJS / Formspree / backend call)
    setTimeout(() => {
      msg.textContent  = '✅ Message sent! I will get back to you soon.';
      msg.style.color  = 'var(--cyan)';
      btn.textContent  = 'Send Message ✉️';
      btn.disabled     = false;
      document.getElementById('cName').value  = '';
      document.getElementById('cEmail').value = '';
      document.getElementById('cMsg').value   = '';
    }, 1200);
  });
})();


// ---- 10. SMOOTH ANCHOR SCROLL ----
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
