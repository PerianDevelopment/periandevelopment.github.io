// ===== HEADER SHRINK ON SCROLL =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (header) {
    header.classList.toggle('shrink', window.scrollY > 50);
  }
});

// ===== REVEAL ANIMATION =====
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// ===== SMART ACTIVE NAV LINK (Desktop & Mobile Sidebar) =====
function initNavHighlight() {
  const currentPath = window.location.pathname.replace(/\/+$/, '');
  const navLinks = document.querySelectorAll('.site-nav a, .sidebar-nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace(/\/+$/, '');

    // Ignore external links
    if (!href.startsWith('/')) return;

    // ------ HOME RULE ------
    // If href is "/" -> Only activate when EXACT root "/"
    if (href === '/' && (currentPath === '' || currentPath === '/')) {
      link.classList.add('active');
      return;
    }

    // ------ DEFAULT BEHAVIOR FOR SUBPAGES ------
    if (currentPath.startsWith(href) && href !== '/') {
      link.classList.add('active');
    }
  });
}
