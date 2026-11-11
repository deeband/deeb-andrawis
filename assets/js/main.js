document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');
navToggle.addEventListener('click', () => primaryNav.classList.toggle('open'));
primaryNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => primaryNav.classList.remove('open')));

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
document.querySelectorAll('.role-head').forEach(head => {
  head.addEventListener('click', () => {
    head.closest('.role').classList.toggle('open');
  });
});

// Journey: filter tabs
const filterTabs = document.querySelectorAll('.filter-tab');
const roles = document.querySelectorAll('.role');
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    roles.forEach(role => {
      const tags = role.dataset.tags || '';
      const matches = filter === 'all' || tags.split(' ').includes(filter);
      role.style.display = matches ? '' : 'none';
    });
  });
});

// Journey: show earlier roles
const showEarlyBtn = document.getElementById('show-early');
let earlyShown = false;
showEarlyBtn.addEventListener('click', () => {
  earlyShown = !earlyShown;
  document.querySelectorAll('.role.hidden-early').forEach(r => {
    r.style.display = earlyShown ? '' : 'none';
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

// Contact: form -> mailto
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value;
  const message = document.getElementById('cf-message').value.trim();
  const body = `From: ${name} (${email})\n\n${message}`;
  const mailto = `mailto:deeb.andrawis@gmail.com?subject=${encodeURIComponent('Portfolio contact: ' + subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
});

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));
