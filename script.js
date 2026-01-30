/**
 * SPP – Nettoyage professionnel
 * Modern Script
 */

(function () {
    'use strict';
  
    // --- 1. Gestion du Menu Mobile ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-list a');
  
    if (burger && nav) {
      burger.addEventListener('click', () => {
        nav.classList.toggle('open');
        burger.classList.toggle('active');
      });
  
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('open');
          burger.classList.remove('active');
        });
      });
    }
  
    // --- 2. Animation au Scroll (Reveal) ---
    const revealElements = document.querySelectorAll('.reveal');
  
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // On arrête d'observer une fois animé
        }
      });
    }, {
      root: null,
      threshold: 0.1, // Déclenche quand 10% de l'élément est visible
      rootMargin: "0px 0px -50px 0px"
    });
  
    revealElements.forEach(el => revealObserver.observe(el));
  
    // --- 3. Gestion du Formulaire (Simulation) ---
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        btn.textContent = 'Envoi...';
        btn.style.opacity = '0.7';
        
        setTimeout(() => {
          btn.textContent = 'Message envoyé !';
          btn.style.background = '#00D26A';
          btn.style.color = '#000';
          form.reset();
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style = '';
          }, 3000);
        }, 1500);
      });
    }

    // --- 4. Pastille contact sticky ---
    const contactPill = document.getElementById('contact-pill');
    const contactPillTrigger = document.getElementById('contact-pill-trigger');
    if (contactPill && contactPillTrigger) {
      contactPillTrigger.addEventListener('click', () => {
        contactPill.classList.toggle('open');
        contactPillTrigger.setAttribute('aria-expanded', contactPill.classList.contains('open'));
      });
      document.addEventListener('click', (e) => {
        if (contactPill.classList.contains('open') && !contactPill.contains(e.target)) {
          contactPill.classList.remove('open');
          contactPillTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // --- 5. Effet particules (fond, défilent avec le scroll) ---
    (function initParticles() {
      const canvas = document.getElementById('particles-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      let particles = [];
      const particleCount = 450;
      const colors = ['rgba(255, 255, 255, 0.44)', 'rgba(0, 210, 105, 0.46)', 'rgba(242, 205, 82, 0.34)'];

      function getDocSize() {
        const docH = document.documentElement.scrollHeight;
        const docW = document.documentElement.scrollWidth;
        return {
          w: Math.max(docW, window.innerWidth),
          h: Math.max(docH, window.innerHeight)
        };
      }

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (particles.length === 0) createParticles();
      }

      function createParticles() {
        const { w, h } = getDocSize();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            radius: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            color: colors[Math.floor(Math.random() * colors.length)]
          });
        }
      }

      function draw() {
        if (!ctx || !canvas.width) return;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const { w, h } = getDocSize();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          const screenX = p.x - scrollX;
          const screenY = p.y - scrollY;
          if (screenX < -10 || screenX > canvas.width + 10 || screenY < -10 || screenY > canvas.height + 10) return;

          ctx.beginPath();
          ctx.arc(screenX, screenY, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });

        requestAnimationFrame(draw);
      }

      window.addEventListener('resize', resize);
      resize();
      if (particles.length === 0) createParticles();
      draw();
    })();

  })();