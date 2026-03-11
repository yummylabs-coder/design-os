/* ============================================
   YUMMY LABS — DESIGN OS INTERACTIONS
   ============================================ */

(function () {
  'use strict';

  // Scroll-triggered fade-in animations
  const animatedElements = document.querySelectorAll('.animate-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  }

  // Hero text stagger animation
  const heroLines = document.querySelectorAll('.hero__line');
  if (heroLines.length) {
    heroLines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('is-visible');
      }, 300 + i * 200);
    });
  }

  // Pillar number count-up
  const pillarNumbers = document.querySelectorAll('.pillar__number');
  if (pillarNumbers.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.textContent, 10);
            if (isNaN(target)) return;

            let current = 0;
            const duration = 600;
            const start = performance.now();

            function tick(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              current = Math.round(eased * target);
              el.textContent = String(current).padStart(2, '0');
              if (progress < 1) {
                requestAnimationFrame(tick);
              }
            }

            el.textContent = '00';
            requestAnimationFrame(tick);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    pillarNumbers.forEach((el) => countObserver.observe(el));
  }

  // Demo: typing animation + checklist + panel reveals
  const demoPromptEl = document.getElementById('demoPrompt');
  const demoCursor = document.getElementById('demoCursor');
  const demoChecklist = document.getElementById('demoChecklist');
  const demoResponse = document.getElementById('demoResponse');
  const demoArtifact = document.getElementById('demoArtifact');

  if (demoPromptEl && demoResponse) {
    const promptText = 'I have this idea for a pricing page for our enterprise clients. Two plans with a feature comparison. Highlight the recommended one. Keep it on brand.';
    let demoStarted = false;

    function runChecklist(onComplete) {
      if (!demoChecklist) { onComplete(); return; }

      const items = demoChecklist.querySelectorAll('.demo__check-item');
      demoChecklist.classList.add('is-visible');

      let step = 0;
      function showNext() {
        if (step >= items.length) {
          setTimeout(onComplete, 250);
          return;
        }
        const item = items[step];
        item.classList.add('is-visible');
        setTimeout(() => {
          item.classList.add('is-checked');
          step++;
          setTimeout(showNext, 200);
        }, 300);
      }
      setTimeout(showNext, 100);
    }

    function runDemo() {
      demoPromptEl.textContent = '';
      if (demoCursor) demoCursor.style.display = 'inline';

      let i = 0;
      function type() {
        if (i < promptText.length) {
          demoPromptEl.textContent += promptText[i];
          i++;
          setTimeout(type, 14 + Math.random() * 12);
        } else {
          if (demoCursor) demoCursor.style.display = 'none';
          // Run checklist, then show response + artifact
          setTimeout(() => {
            runChecklist(() => {
              demoResponse.classList.add('is-visible');
              setTimeout(() => {
                if (demoArtifact) demoArtifact.classList.add('is-visible');
              }, 150);
            });
          }, 250);
        }
      }
      setTimeout(type, 400);
    }

    const demoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !demoStarted) {
            demoStarted = true;
            runDemo();
            demoObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe the prompt element directly so animation starts when it's in view
    demoObserver.observe(demoPromptEl);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });

  // Nav background on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 100) {
            nav.style.background = 'rgba(50, 1, 1, 0.95)';
          } else {
            nav.style.background = 'rgba(50, 1, 1, 0.85)';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
})();
