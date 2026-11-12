document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero name: split into per-letter spans for a staggered rise-in
const heroName = document.querySelector('.hero h1');
if (heroName && !reduceMotion) {
  const text = heroName.textContent;
  heroName.textContent = '';
  let i = 0;
  text.split(' ').forEach((word, wi) => {
    if (wi > 0) heroName.appendChild(document.createTextNode(' '));
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';
    word.split('').forEach(letter => {
      const ch = document.createElement('span');
      ch.className = 'ch';
      ch.textContent = letter;
      ch.style.animationDelay = (i * 38) + 'ms';
      wordSpan.appendChild(ch);
      i++;
    });
    heroName.appendChild(wordSpan);
  });
}

// Header: solid background once scrolled
const siteHeader = document.querySelector('.site-header');
function updateHeaderScroll() {
  siteHeader.classList.toggle('scrolled', window.scrollY > 8);
}
updateHeaderScroll();
window.addEventListener('scroll', updateHeaderScroll, { passive: true });

// Nav: scroll-spy active link
const navLinks = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
const spySections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
if (spySections.length) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const link = navLinks.find(l => l.getAttribute('href') === '#' + entry.target.id);
      if (!link) return;
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  spySections.forEach(sec => spyObserver.observe(sec));
}

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');
function setNavOpen(open) {
  primaryNav.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
}
navToggle.addEventListener('click', () => setNavOpen(!primaryNav.classList.contains('open')));
primaryNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNavOpen(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
    setNavOpen(false);
    navToggle.focus();
  }
});
document.addEventListener('click', (e) => {
  if (primaryNav.classList.contains('open') && !primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
    setNavOpen(false);
  }
});

// Theme toggle (light / dark / system)
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(theme) {
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}
let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
applyTheme(savedTheme);
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentlyDark = current === 'dark' || (!current && prefersDark);
  const next = currentlyDark ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Journey: accordion
function toggleRole(head) {
  const role = head.closest('.role');
  const open = role.classList.toggle('open');
  head.setAttribute('aria-expanded', String(open));
}
document.querySelectorAll('.role-head').forEach(head => {
  head.addEventListener('click', () => toggleRole(head));
  head.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleRole(head);
    }
  });
});

// Journey: show earlier roles
const showEarlyBtn = document.getElementById('show-early');
let earlyShown = false;
showEarlyBtn.addEventListener('click', () => {
  earlyShown = !earlyShown;
  document.querySelectorAll('.tl-row.hidden-early').forEach(r => {
    r.style.display = earlyShown ? 'flex' : 'none';
  });
  showEarlyBtn.textContent = earlyShown ? 'Hide earlier roles ↑' : 'Show earlier roles ↓';
});

// Contact: copy buttons
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const value = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      const original = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = original; }, 1500);
    } catch (e) {
      /* clipboard unavailable, no-op */
    }
  });
});

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('in'));
} else {
  revealEls.forEach(el => el.classList.add('pre'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        entry.target.classList.remove('pre');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
}

// Skills: staggered pop-in for chips once the section is visible
const skillSection = document.getElementById('skills');
if (skillSection) {
  const chips = skillSection.querySelectorAll('.chip');
  if (reduceMotion) {
    chips.forEach(chip => chip.classList.add('in'));
  } else {
    chips.forEach(chip => chip.classList.add('pre'));
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        chips.forEach((chip, i) => {
          chip.style.setProperty('--k', (i * 35) + 'ms');
          chip.classList.add('in');
          chip.classList.remove('pre');
        });
        skillObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -15% 0px' });
    skillObserver.observe(skillSection);
  }
}
