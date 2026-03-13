/* ═══════════════════════════════════════════
   CURSOR — ambient spotlight only
═══════════════════════════════════════════ */
const spotlight = document.getElementById('cursor-spotlight');
if (spotlight) {
  document.addEventListener('mousemove', e => {
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top  = e.clientY + 'px';
  });
}

/* ═══════════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════════ */
document.getElementById('menuBtn').addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('navMenu').classList.toggle('open');
});

/* ═══════════════════════════════════════════
   ACTIVE NAV + SCROLL EFFECTS
═══════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav ul li a');
const btt       = document.getElementById('btt');
const header    = document.getElementById('header');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  let current = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
  header.classList.toggle('scrolled', scrollY > 50);
  btt.classList.toggle('btt-show', scrollY > 400);
});

btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ═══════════════════════════════════════════
   TABS — with stagger animation on switch
═══════════════════════════════════════════ */
function opentab(tabname, e) {
  document.querySelectorAll('.tab-contents').forEach(t => t.classList.remove('active-tab'));
  document.querySelectorAll('.tab-links').forEach(t => t.classList.remove('active-link'));
  const tab = document.getElementById(tabname);
  tab.classList.add('active-tab');
  e.currentTarget.classList.add('active-link');

  const items = tab.querySelectorAll('.skill-chip, .exp-item-body, .edu-item, .qf-item');
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = `opacity .38s ${i * 0.055}s ease, transform .38s ${i * 0.055}s ease`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 20);
  });
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObs.observe(el));

/* ═══════════════════════════════════════════
   STAGGERED CARD REVEALS
═══════════════════════════════════════════ */
const cardObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const cards = e.target.querySelectorAll('.hl-card, .proj-card');
      cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `opacity .5s ${i * 0.08}s ease, transform .5s ${i * 0.08}s ease`;
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 60);
      });
      cardObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.highlights-grid, .projects-grid')
  .forEach(el => cardObs.observe(el));

/* ═══════════════════════════════════════════
   HIGHLIGHT CARD TILT + GLOW
═══════════════════════════════════════════ */
document.querySelectorAll('.hl-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -4;
    const rotY = ((x - cx) / cx) *  4;
    card.style.transform = `translateY(-7px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.transition = 'transform .05s';
    card.style.setProperty('--glow-x', x + 'px');
    card.style.setProperty('--glow-y', y + 'px');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s ease';
  });
});

/* ═══════════════════════════════════════════
   PROJECT CARD TILT — no glow
═══════════════════════════════════════════ */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -4;
    const rotY = ((x - cx) / cx) *  4;
    card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.transition = 'transform .05s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .45s ease';
  });
});

/* ═══════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════ */
function animateCount(el, target, suffix = '') {
  let count = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + suffix;
    if (count >= target) clearInterval(timer);
  }, 35);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.hstat-n, .hsb-num').forEach(el => {
        const raw = el.textContent.trim();
        const num = parseInt(raw);
        const suffix = raw.replace(String(num), '');
        animateCount(el, num, suffix);
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.home-stats-bar');
if (statsEl) statsObs.observe(statsEl);