/* =============================================
   ATREYA SOFTTECH — script.js
   ============================================= */

(function () {
  'use strict';

  /* ---- NAV ---- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ---- SCROLL-TO-TOP FAB ---- */
  const fabTop = document.getElementById('fabTop');
  if (fabTop) {
    window.addEventListener('scroll', () => {
      fabTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  navToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
  });

  document.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => navMobile.classList.remove('open'));
  });

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---- SCROLL REVEAL ---- */
  const revealTargets = document.querySelectorAll(
    '.service-card, .portfolio-card, .stat-block, .pillar, .tech-category, .career-item, .section-header, .about-card, .contact-left, .contact-right, .why-left, .why-right, .about-left, .careers-header'
  );

  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---- COUNTER ANIMATION ---- */
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target, 1800);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

  /* ---- CONTACT FORM (Web3Forms) ---- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const note = document.getElementById('formNote');
      const originalHTML = btn.innerHTML;

      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const data = await res.json();

        if (data.success) {
          btn.textContent = 'Message Sent!';
          btn.style.background = 'var(--teal-deep)';
          note.textContent = 'Thank you! We\'ll be in touch within one business day.';
          note.style.color = 'var(--teal)';
          form.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        btn.textContent = 'Failed — Try Again';
        btn.style.background = '#c0392b';
        note.textContent = 'Something went wrong. Please email us directly.';
      } finally {
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          note.textContent = 'We typically respond within one business day.';
          note.style.color = '';
        }, 4000);
      }
    });
  }

  /* =============================================
     THREE.JS TECH CANVAS (hero 3D removed)
     ============================================= */
  if (typeof THREE === 'undefined') return;

  /* =============================================
     THREE.JS TECH CANVAS
     ============================================= */
  (function initTech() {
    const canvas = document.getElementById('techCanvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const W = rect.width || 560;
    const H = 400;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x1E1E1E, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 5.5;

    /* Soft lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const ptA = new THREE.PointLight(0xFF2D2D, 3, 12);
    ptA.position.set(3, 2, 3);
    scene.add(ptA);
    const ptB = new THREE.PointLight(0xFF9999, 1.5, 10);
    ptB.position.set(-3, -1, 2);
    scene.add(ptB);

    /* Tech node labels */
    const techs = [
      { name: 'Python',     color: 0xFF2D2D, pos: [0, 0, 0],        size: 0.22 },
      { name: 'React',      color: 0xFF6B6B, pos: [-1.6, 1.0, 0.3],  size: 0.16 },
      { name: 'Node.js',    color: 0xD92020, pos: [1.7, 0.8, -0.2],  size: 0.16 },
      { name: 'AWS',        color: 0xFFBCBC, pos: [1.5, -1.2, 0.5],  size: 0.15 },
      { name: 'Angular',    color: 0xA01818, pos: [-1.8, -0.8, 0],   size: 0.14 },
      { name: 'Docker',     color: 0xFF4F4F, pos: [0.5, 1.9, -0.3],  size: 0.13 },
      { name: 'Kubernetes', color: 0xCC2222, pos: [-0.6, -1.8, 0.4], size: 0.12 },
      { name: 'PostgreSQL', color: 0xFF8888, pos: [2.2, 0.1, 0.6],   size: 0.12 },
      { name: 'Azure',      color: 0xE03535, pos: [-2.2, 0.2, -0.4], size: 0.12 },
      { name: 'OpenAI',     color: 0xFFAAAA, pos: [0, -2.1, 0.3],    size: 0.13 },
    ];

    const group = new THREE.Group();
    scene.add(group);

    const sphereGeos = {};
    const meshes = techs.map(t => {
      const r = t.size;
      if (!sphereGeos[r]) sphereGeos[r] = new THREE.SphereGeometry(r, 16, 16);
      const mat = new THREE.MeshPhongMaterial({
        color: t.color,
        shininess: 120,
        emissive: t.color,
        emissiveIntensity: 0.12,
      });
      const mesh = new THREE.Mesh(sphereGeos[r], mat);
      mesh.position.set(...t.pos);
      group.add(mesh);
      return { mesh, data: t };
    });

    /* Connection lines from center */
    const center = new THREE.Vector3(0, 0, 0);
    techs.slice(1).forEach(t => {
      const points = [center, new THREE.Vector3(...t.pos)];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
        color: 0x4A1A1A,
        transparent: true,
        opacity: 0.5,
      }));
      group.add(line);
    });

    /* Orbit rings */
    for (let i = 0; i < 3; i++) {
      const radius = 1.0 + i * 0.7;
      const tor = new THREE.TorusGeometry(radius, 0.008, 6, 80);
      const torMesh = new THREE.Mesh(tor, new THREE.MeshBasicMaterial({
        color: 0x4A1A1A,
        transparent: true,
        opacity: 0.3,
      }));
      torMesh.rotation.x = Math.PI / 2 + (i * 0.3);
      torMesh.rotation.y = i * 0.5;
      group.add(torMesh);
    }

    /* Tech item hover interaction */
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        techItems.forEach(t => t.classList.remove('active'));
        item.classList.add('active');
        /* Highlight matching sphere */
        if (index < meshes.length) {
          const targetMesh = meshes[index].mesh;
          targetMesh.material.emissiveIntensity = 0.5;
        }
      });
      item.addEventListener('mouseleave', () => {
        item.classList.remove('active');
        if (index < meshes.length) {
          meshes[index].mesh.material.emissiveIntensity = 0.12;
        }
      });
    });

    let t = 0;
    function techAnimate() {
      requestAnimationFrame(techAnimate);
      t += 0.004;

      group.rotation.y = t * 0.18;
      group.rotation.x = Math.sin(t * 0.2) * 0.1;

      /* Each node gently pulses */
      meshes.forEach(({ mesh }, i) => {
        const s = 1 + Math.sin(t * 1.2 + i * 0.8) * 0.06;
        mesh.scale.setScalar(s);
        mesh.position.y = mesh.position.y + Math.sin(t * 0.6 + i) * 0.0008;
      });

      ptA.position.x = Math.sin(t * 0.5) * 4;
      ptA.position.z = Math.cos(t * 0.5) * 3;

      renderer.render(scene, camera);
    }

    techAnimate();

    /* Resize */
    window.addEventListener('resize', () => {
      const r = canvas.getBoundingClientRect();
      const w = r.width || W;
      renderer.setSize(w, H);
      camera.aspect = w / H;
      camera.updateProjectionMatrix();
    });
  })();

})();
