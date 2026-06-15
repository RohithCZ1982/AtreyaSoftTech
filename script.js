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

  /* ---- CONTACT FORM ---- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Message Sent!';
      btn.style.background = '#7A9277';
      setTimeout(() => {
        btn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        btn.style.background = '';
        form.reset();
      }, 3000);
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
    renderer.setClearColor(0x1A2133, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 5.5;

    /* Soft lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const ptA = new THREE.PointLight(0x0ABFBF, 3, 12);
    ptA.position.set(3, 2, 3);
    scene.add(ptA);
    const ptB = new THREE.PointLight(0xB2EDED, 2, 10);
    ptB.position.set(-3, -1, 2);
    scene.add(ptB);

    /* Tech node labels */
    const techs = [
      { name: 'Python',     color: 0x0ABFBF, pos: [0, 0, 0],        size: 0.22 },
      { name: 'React',      color: 0x4DD9D9, pos: [-1.6, 1.0, 0.3],  size: 0.16 },
      { name: 'Node.js',    color: 0x078A8A, pos: [1.7, 0.8, -0.2],  size: 0.16 },
      { name: 'AWS',        color: 0xB2EDED, pos: [1.5, -1.2, 0.5],  size: 0.15 },
      { name: 'Angular',    color: 0x056060, pos: [-1.8, -0.8, 0],   size: 0.14 },
      { name: 'Docker',     color: 0x2EC9C9, pos: [0.5, 1.9, -0.3],  size: 0.13 },
      { name: 'Kubernetes', color: 0x17A0A0, pos: [-0.6, -1.8, 0.4], size: 0.12 },
      { name: 'PostgreSQL', color: 0x5EDEDE, pos: [2.2, 0.1, 0.6],   size: 0.12 },
      { name: 'Azure',      color: 0x3DCFCF, pos: [-2.2, 0.2, -0.4], size: 0.12 },
      { name: 'OpenAI',     color: 0x90E8E8, pos: [0, -2.1, 0.3],    size: 0.13 },
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
        color: 0x0D4040,
        transparent: true,
        opacity: 0.4,
      }));
      group.add(line);
    });

    /* Orbit rings */
    for (let i = 0; i < 3; i++) {
      const radius = 1.0 + i * 0.7;
      const tor = new THREE.TorusGeometry(radius, 0.008, 6, 80);
      const torMesh = new THREE.Mesh(tor, new THREE.MeshBasicMaterial({
        color: 0x0D4040,
        transparent: true,
        opacity: 0.25,
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
