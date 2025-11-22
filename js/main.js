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
  const currentUrl = window.location.href.replace(/\/+$/, '');
  const navLinks = document.querySelectorAll('.site-nav a, .sidebar-nav a');

  // Explicit home page detection (as requested)
  const isHomePage = currentPath === '' || currentPath === '/' ||
                     currentUrl === 'https://periandevelopment.github.io' ||
                     currentUrl === 'https://periandevelopment.github.io/';

  navLinks.forEach(link => {
    let href = link.getAttribute('href');
    if (!href) return;

    // ===== HOME PAGE LOGIC (runs first) =====
    if (isHomePage) {
      // Check for exact home URL match in multiple formats
      if (href === '/' || 
          href === 'https://periandevelopment.github.io' || 
          href === 'https://periandevelopment.github.io/' ||
          href === '') {
        link.classList.add('active');
      }
      return; // Skip subpage checks on home page
    }

    // ===== SUBPAGE LOGIC =====
    // Normalize absolute URLs to paths
    if (href.startsWith('http')) {
      try { href = new URL(href).pathname; } 
      catch { return; } // Skip invalid URLs
    }
    
    href = href.replace(/\/+$/, '');

    // Ignore non-internal links
    if (!href.startsWith('/')) return;

    // Activate parent links for subpages
    if (currentPath.startsWith(href) && href !== '/') {
      link.classList.add('active');
    }
  });
}