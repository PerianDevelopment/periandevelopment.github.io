// ===== HTML INCLUDES (Header & Footer Loader) =====
function loadHTML(selector, file, callback) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      return response.text();
    })
    .then(data => {
      document.querySelector(selector).innerHTML = data;
      if (callback) callback();
    })
    .catch(error => console.error(error));
}

// ===== SIDEBAR FUNCTIONALITY =====
function initSidebar() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const sidebar = document.querySelector('.sidebar');
  const sidebarClose = document.querySelector('.sidebar-close');
  const body = document.body;

  if (!hamburgerBtn || !sidebar || !sidebarClose) {
    console.warn('Sidebar elements not found - skipping initialization');
    return;
  }

  function openSidebar() {
    sidebar.classList.add('active');
    body.classList.add('sidebar-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    body.classList.remove('sidebar-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  // Event Listeners
  hamburgerBtn.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });

  // Close on navigation click
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeSidebar);
  });
}

// ===== MOVE SIDEBAR TO BODY =====
function moveSidebarToBody() {
  const sidebarElements = document.querySelector('.sidebar-elements');
  if (sidebarElements) {
    const sidebar = sidebarElements.querySelector('.sidebar');
    
    // Move elements to body
    if (sidebar) document.body.appendChild(sidebar);
    
    // Remove the wrapper
    sidebarElements.remove();
  }
}

// ===== NAVIGATION HIGHLIGHT =====
function initNavHighlight() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.site-nav a, .sidebar-nav a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath && currentPath.includes(linkPath.replace(/^\/+/, ''))) {
      link.classList.add('active');
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const pathParts = window.location.pathname.split('/');
  const repoName = pathParts[1] ? `/${pathParts[1]}/` : '/';

  loadHTML("header.site-header", `${repoName}header.html`, () => {
    initNavHighlight();
    moveSidebarToBody(); // Move sidebar elements to body
    initSidebar(); // Initialize after moving
  });
  
  loadHTML("footer.site-footer", `${repoName}footer.html`);
});
