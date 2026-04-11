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
   HIGHLIGHTS — Mobile swipe carousel
═══════════════════════════════════════════ */
(function () {
  const cards   = document.querySelectorAll('.hl-card');
  const prevBtn = document.getElementById('hlPrev');
  const nextBtn = document.getElementById('hlNext');
  const counter = document.getElementById('hlCurrent');
  const total   = cards.length;
  let current   = 0;

  function hlGoTo(idx) {
    idx = (idx + total) % total;
    cards.forEach(c => c.classList.remove('active'));
    cards[idx].classList.add('active');
    if (counter) counter.textContent = idx + 1;
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === total - 1;
    current = idx;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => hlGoTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => hlGoTo(current + 1));
  hlGoTo(0);

  /* swipe gesture */
  const grid = document.querySelector('.highlights-grid');
  if (grid) {
    let startX = 0, startY = 0;
    grid.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    grid.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
        if (dx < 0) hlGoTo(current + 1);
        else        hlGoTo(current - 1);
      }
    }, { passive: true });
  }
})();  

/* ═══════════════════════════════════════════
   PROJECT SHOWCASE — Tabs + Swipe + Arrows + Lightbox
═══════════════════════════════════════════ */
(function () {
  const tabs       = document.querySelectorAll('.proj-tab');
  const details    = document.querySelectorAll('.proj-detail');
  const prevBtn    = document.getElementById('projPrev');
  const nextBtn    = document.getElementById('projNext');
  const counterEl  = document.getElementById('projCurrent');
  const lightbox      = document.getElementById('proj-lightbox');
  const lightboxImg   = document.getElementById('projLightboxImg');
  const lightboxClose = document.getElementById('projLightboxClose');
  const total = details.length;
  let current = 0;

  function goTo(idx) {
    idx = (idx + total) % total;
    tabs.forEach(t => t.classList.remove('active'));
    details.forEach(d => d.classList.remove('active'));
    const activeTab = document.querySelector(`.proj-tab[data-proj="${idx}"]`);
    if (activeTab) activeTab.classList.add('active');
    document.querySelector(`.proj-detail[data-proj="${idx}"]`).classList.add('active');
    if (counterEl) counterEl.textContent = idx + 1;
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === total - 1;
    current = idx;
  }

  // Desktop: tab click
  tabs.forEach(tab => {
    tab.addEventListener('click', () => goTo(parseInt(tab.dataset.proj)));
  });

  // Mobile: arrow buttons
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  goTo(0); // init state

  // Mobile: swipe gesture
  const panel = document.querySelector('.proj-detail-panel');
  if (panel) {
    let startX = 0, startY = 0;
    panel.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    panel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
        if (dx < 0) goTo(current + 1); // swipe left → next
        else        goTo(current - 1); // swipe right → prev
      }
    }, { passive: true });
  }

  // Open lightbox on image click
  document.querySelectorAll('.proj-detail-img-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('.proj-detail-img');
      if (!img || !img.src || wrap.classList.contains('no-img')) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 350);
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();



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
/* ═══════════════════════════════════════════
   CONTACT FORM — AJAX with success/error
═══════════════════════════════════════════ */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const formMsg     = document.getElementById('formMsg');
  const formMsgText = document.getElementById('formMsgText');
  const submitBtn   = contactForm.querySelector('.submit-btn');

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    formMsg.className = 'form-msg';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending…';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(contactForm)
      });
      const data = await res.json();
      if (data.success) {
        formMsg.classList.add('show', 'success');
        formMsg.querySelector('i').className = 'bi bi-check-circle-fill';
        formMsgText.textContent = "Message sent! I'll get back to you soon. 🙌";
        contactForm.reset();
      } else { throw new Error(); }
    } catch {
      formMsg.classList.add('show', 'error');
      formMsg.querySelector('i').className = 'bi bi-exclamation-circle-fill';
      formMsgText.textContent = 'Something went wrong. Please try emailing directly.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-send-fill"></i> Send Message';
      setTimeout(() => { formMsg.className = 'form-msg'; }, 6000);
    }
  });
}