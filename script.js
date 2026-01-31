/**
 * SPP – Nettoyage professionnel
 * Modern Script
 */

(function () {
  "use strict";

  // --- NOUVEAU : 0. Gestion du Preloader ---

  const isLegalPage = document.body.classList.contains("legal-page");
  if (!isLegalPage) document.body.classList.add("is-loading");

  const preloader = document.querySelector(".preloader");
  const header = document.querySelector(".header");
  const contactPill = document.getElementById("contact-pill");

  if (isLegalPage) {
    document.body.classList.remove("is-loading");
    if (header) header.classList.add("header-visible");
  }

  // window.addEventListener('load') attend que TOUT soit chargé (images, CSS...)
  window.addEventListener("load", () => {
    if (isLegalPage) return;
    // On attend un peu pour être sûr que la barre de chargement est visuellement finie (timing esthétique)
    setTimeout(() => {
      // 1. On fait monter le rideau
      if (preloader) preloader.classList.add("finish");
      // 2. Le header descend après un délai pour laisser le preloader remonter
      setTimeout(() => {
        if (header) header.classList.add("header-visible");
      }, 800);
      // 2b. La pastille contact arrive en bas à droite avec un délai
      setTimeout(() => {
        if (contactPill) contactPill.classList.add("pill-visible");
      }, 1200);

      // 3. On débloque le scroll et on lance l'animation du contenu principal
      // On attend un petit délai pour que le rideau commence à monter avant de révéler le contenu
      setTimeout(() => {
        document.body.classList.remove("is-loading");

        // Optionnel : On supprime le preloader du DOM après l'animation pour nettoyer
        setTimeout(() => {
          if (preloader) preloader.remove();
        }, 1500); // Attendre la fin de la transition CSS (1.2s)
      }, 300);
    }, 2500); // Ce délai de 2.5s correspond à la durée totale des animations CSS (fillBar + délais)
  });

  // --- 1. Gestion du Menu Mobile ---
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav-list a");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("open");
      burger.classList.toggle("active");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.classList.remove("active");
      });
    });
  }

  // --- 2. Animation au Scroll (Reveal) ---
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // On arrête d'observer une fois animé
        }
      });
    },
    {
      root: null,
      threshold: 0.1, // Déclenche quand 10% de l'élément est visible
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

// --- 3. Gestion du Formulaire (Loading + Notif Récap) ---
const form = document.querySelector('form');
const toast = document.getElementById('toast-notification');
const toastSummary = document.getElementById('toast-summary');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML; // On sauvegarde le texte initial
    
    // 1. DÉBUT DU CHARGEMENT
    // On ajoute la classe CSS qui fait tourner le petit rond
    btn.classList.add('loading');
    btn.disabled = true;

    // On récupère les données pour le récapitulatif AVANT l'envoi
    const formData = new FormData(form);
    const messageValue = formData.get('message');
    if (!messageValue || !String(messageValue).trim()) {
      formData.set('message', 'Aucune description renseignée');
    }
    const clientName = formData.get('Client');     // Correspond au name="Client" du HTML
    const clientPhone = formData.get('Telephone'); // Correspond au name="Telephone"
    
    try {
      // 2. ENVOI VERS FORMSPREE
      const response = await fetch("https://formspree.io/f/xdazyyee", { 
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // 3. SUCCÈS
        
        // A. On arrête le loading et on change le bouton
        btn.classList.remove('loading');
        btn.textContent = 'Demande envoyée !';
        btn.style.background = '#00D26A';
        btn.style.color = '#000';
        
        // B. On construit le petit résumé HTML
        toastSummary.innerHTML = `
          <div class="toast-recap">
            <strong>Nom :</strong> ${clientName}<br>
            <strong>Tél :</strong> ${clientPhone}<br>
            <em>Nous vous recontacterons sous 24h.</em>
          </div>
        `;

        // C. On affiche la notification (Toast)
        if (toast) toast.classList.add('show');

        // D. Reset du formulaire
        form.reset();

        // E. On cache tout après quelques secondes
        setTimeout(() => {
          // Cacher la notif après 6 secondes
          if (toast) toast.classList.remove('show');
          
          // Remettre le bouton normal après 4 secondes
          btn.innerHTML = originalText;
          btn.style = '';
          btn.disabled = false;
        }, 6000);

      } else {
        throw new Error('Erreur Formspree');
      }

    } catch (error) {
      // 4. ERREUR
      console.error(error);
      btn.classList.remove('loading');
      btn.textContent = 'Erreur... Réessayez.';
      btn.style.background = '#ff4444';
      btn.style.color = '#fff';
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}
  // --- 4. Pastille contact sticky ---
  const contactPillTrigger = document.getElementById("contact-pill-trigger");
  if (contactPill && contactPillTrigger) {
    contactPillTrigger.addEventListener("click", () => {
      contactPill.classList.toggle("open");
      contactPillTrigger.setAttribute(
        "aria-expanded",
        contactPill.classList.contains("open"),
      );
    });
    document.addEventListener("click", (e) => {
      if (
        contactPill.classList.contains("open") &&
        !contactPill.contains(e.target)
      ) {
        contactPill.classList.remove("open");
        contactPillTrigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --- 5. Effet particules (fond, défilent avec le scroll) ---
  (function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 450;
    const colors = [
      "rgba(255, 255, 255, 0.44)",
      "rgba(0, 210, 105, 0.46)",
      "rgba(242, 205, 82, 0.34)",
    ];

    function getDocSize() {
      const docH = document.documentElement.scrollHeight;
      const docW = document.documentElement.scrollWidth;
      return {
        w: Math.max(docW, window.innerWidth),
        h: Math.max(docH, window.innerHeight),
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
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function draw() {
      if (!ctx || !canvas.width) return;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const { w, h } = getDocSize();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const screenX = p.x - scrollX;
        const screenY = p.y - scrollY;
        if (
          screenX < -10 ||
          screenX > canvas.width + 10 ||
          screenY < -10 ||
          screenY > canvas.height + 10
        )
          return;

        ctx.beginPath();
        ctx.arc(screenX, screenY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    if (particles.length === 0) createParticles();
    draw();
  })();

  // --- 6. Curseur personnalisé (petit rond vert) ---
  (function initCustomCursor() {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = document.getElementById("custom-cursor");
    if (!cursor) return;

    const pointerSelector =
      "a, button, [role='button'], input[type='submit'], input[type='button'], .btn, .contact-item, .burger, .contact-map-link, [onclick]";

    let visible = false;
    let x = 0;
    let y = 0;

    function move(e) {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        cursor.classList.remove("is-hidden");
      }
      cursor.style.left = x + "px";
      cursor.style.top = y + "px";

      const target = e.target;
      const isPointer =
        target.closest(pointerSelector) ||
        getComputedStyle(target).cursor === "pointer";
      cursor.classList.toggle("is-pointer", !!isPointer);
    }

    function leave() {
      visible = false;
      cursor.classList.add("is-hidden");
      cursor.classList.remove("is-pointer");
    }

    function enter() {
      visible = true;
      cursor.classList.remove("is-hidden");
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    cursor.style.left = "0px";
    cursor.style.top = "0px";
  })();

  // --- 7. Modal lightbox pour les images de la galerie ---
  (function initImageModal() {
    const modal = document.getElementById("image-modal");
    const modalImg = modal?.querySelector(".image-modal-img");
    const imgWrap = document.getElementById("modal-img-wrap");
    const magnifier = document.getElementById("modal-magnifier");
    const modalTitle = modal?.querySelector(".image-modal-title");
    const modalDesc = modal?.querySelector(".image-modal-desc");
    const overlay = modal?.querySelector(".image-modal-overlay");
    const closeBtn = modal?.querySelector(".image-modal-close");
    const galleryImages = document.querySelectorAll(".expand-gallery .expand-card img");

    const ZOOM = 2.5;
    const MAGNIFIER_SIZE = 140;

    if (!modal || !modalImg) return;

    function openModal(src, alt, title, desc) {
      modalImg.src = src;
      modalImg.alt = alt || "";
      if (modalTitle) modalTitle.textContent = title || "";
      if (modalDesc) modalDesc.textContent = desc || "";
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      if (magnifier) magnifier.classList.remove("visible");
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      document.body.classList.remove("modal-magnifier-active");
      if (magnifier) magnifier.classList.remove("visible");
    }

    function updateMagnifier(e) {
      if (!magnifier || !imgWrap || !modal.classList.contains("open")) return;
      const rect = modalImg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        magnifier.classList.remove("visible");
        document.body.classList.remove("modal-magnifier-active");
        return;
      }
      magnifier.classList.add("visible");
      document.body.classList.add("modal-magnifier-active");
      magnifier.style.left = e.clientX + "px";
      magnifier.style.top = e.clientY + "px";
      magnifier.style.backgroundImage = `url(${modalImg.src})`;
      magnifier.style.backgroundSize = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`;
      const bgX = (x / rect.width) * (rect.width * ZOOM) - MAGNIFIER_SIZE / 2;
      const bgY = (y / rect.height) * (rect.height * ZOOM) - MAGNIFIER_SIZE / 2;
      magnifier.style.backgroundPosition = `${-bgX}px ${-bgY}px`;
    }

    if (imgWrap && magnifier) {
      imgWrap.addEventListener("mousemove", updateMagnifier);
      imgWrap.addEventListener("mouseleave", () => {
        magnifier?.classList.remove("visible");
        document.body.classList.remove("modal-magnifier-active");
      });
    }

    galleryImages.forEach((img) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = img.closest(".expand-card");
        const titleEl = card?.querySelector(".expand-text h3");
        const descEl = card?.querySelector(".expand-text p");
        openModal(
          img.src,
          img.alt,
          titleEl?.textContent?.trim() || "",
          descEl?.textContent?.trim() || ""
        );
      });
    });

    if (overlay) overlay.addEventListener("click", closeModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  })();
  
})();
