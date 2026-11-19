/**
 * VIT STUDENT PORTAL - Advanced Animation Engine (GSAP + Lenis + Canvas)
 * Implements 20 advanced animation types with reduced-motion accessibility.
 */

(function () {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize Lenis Smooth Scroll
  let lenisInstance = null;
  function initLenis() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;

    try {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true
      });

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Connect with GSAP ScrollTrigger if available
      if (typeof ScrollTrigger !== 'undefined') {
        lenisInstance.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenisInstance.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    } catch (e) {
      console.warn('Lenis initialization notice:', e);
    }
  }

  // 1. Page Loading Animation
  function initPageLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              loader.classList.add('hidden');
              animateEntrance();
            }
          });
        } else {
          loader.classList.add('hidden');
        }
      }, 500);
    });

    // Fallback timer if load event takes too long
    setTimeout(() => {
      if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
      }
    }, 2500);
  }

  // 2. Navbar Entrance Animation
  function animateEntrance() {
    if (typeof gsap === 'undefined' || prefersReducedMotion) return;

    // Navbar Entrance
    gsap.from('.site-header', {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.2)'
    });

    // Hero Text Stagger Reveal
    gsap.from('.hero-badge-wrap, .hero-heading, .hero-desc, .hero-cta-group, .hero-tags', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.2
    });

    // Hero Card Entrance
    gsap.from('.quick-verify-card, .auth-wrapper, .dashboard-grid, .admin-metrics-grid', {
      scale: 0.95,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      delay: 0.3
    });
  }

  // 3. Animated Background (Constellation Canvas)
  function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 75;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 0.8;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      if (prefersReducedMotion) return;
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 4. Custom Cursor & Follower (Desktop Only)
  function initCustomCursor() {
    if (prefersReducedMotion || window.innerWidth < 992) return;

    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function renderFollower() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(renderFollower);
    }
    renderFollower();

    // Hover interactive effects
    const interactiveElements = document.querySelectorAll('a, button, input, select, .sample-roll-chip, .feature-card, .faq-question');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });
  }

  // 5. 3D Card Hover / Tilt Effect
  function init3DTiltCards() {
    if (prefersReducedMotion) return;

    const tiltCards = document.querySelectorAll('.tilt-card, .digital-id-card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        // Holographic sheen adjustment
        const sheen = card.querySelector('.id-card-sheen');
        if (sheen) {
          const moveX = (x / rect.width) * 100;
          const moveY = (y / rect.height) * 100;
          sheen.style.background = `radial-gradient(circle at ${moveX}% ${moveY}%, rgba(255,255,255,0.2) 0%, rgba(6,182,212,0.15) 30%, transparent 70%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        const sheen = card.querySelector('.id-card-sheen');
        if (sheen) {
          sheen.style.background = '';
        }
      });
    });
  }

  // 6. Magnetic Buttons
  function initMagneticButtons() {
    if (prefersReducedMotion || window.innerWidth < 992) return;

    const magneticBtns = document.querySelectorAll('.btn-magnetic, .btn-primary, .btn-secondary');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // 7. Scroll Reveal & Stagger Animation with GSAP
  function initScrollTriggers() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    // Feature Cards Stagger
    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: '.features-grid',
        start: 'top 85%'
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out'
    });

    // Workflow Cards Stagger
    gsap.from('.workflow-card', {
      scrollTrigger: {
        trigger: '.workflow-grid',
        start: 'top 85%'
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // Campus Cards Stagger
    gsap.from('.campus-card', {
      scrollTrigger: {
        trigger: '.campus-grid',
        start: 'top 85%'
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out'
    });
  }

  // 8. Animated Counters
  function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('.stat-number');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetVal = parseInt(el.getAttribute('data-target') || el.innerText, 10);
            if (isNaN(targetVal)) return;

            let currentVal = 0;
            const duration = 1500;
            const stepTime = 25;
            const steps = duration / stepTime;
            const increment = targetVal / steps;

            const timer = setInterval(() => {
              currentVal += increment;
              if (currentVal >= targetVal) {
                el.innerText = targetVal.toLocaleString();
                clearInterval(timer);
              } else {
                el.innerText = Math.floor(currentVal).toLocaleString();
              }
            }, stepTime);

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    counterElements.forEach((el) => observer.observe(el));
  }

  // 9. FAQ Accordion Interaction
  function initFaqAccordion() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach((q) => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close other items
        document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // 10. Success Confetti Blast
  window.triggerSuccessCelebration = function () {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#06b6d4', '#f59e0b', '#10b981', '#ffffff']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b82f6', '#06b6d4', '#10b981']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#3b82f6', '#10b981']
        });
      }, 250);
    }
  };

  // Toast Notification Helper
  window.showToast = function (message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon =
      type === 'success'
        ? '<i class="fa-solid fa-circle-check" style="color:var(--status-success);"></i>'
        : type === 'danger'
        ? '<i class="fa-solid fa-triangle-exclamation" style="color:var(--status-danger);"></i>'
        : '<i class="fa-solid fa-circle-info" style="color:var(--accent-cyan);"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(60px)';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(() => toast.remove(), 350);
    }, 3800);
  };

  // Mobile Drawer Toggle
  function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close-btn');

    if (!toggleBtn || !drawer) return;

    function openDrawer() {
      drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
  }

  // DOM Content Loaded Initializer
  document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initPageLoader();
    initAmbientCanvas();
    initCustomCursor();
    init3DTiltCards();
    initMagneticButtons();
    initScrollTriggers();
    initAnimatedCounters();
    initFaqAccordion();
    initMobileDrawer();
  });
})();
