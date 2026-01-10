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

  // Toggle sidebar
  hamburgerBtn.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });

  // Close on nav link click
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });
}

// ===== MOVE SIDEBAR TO BODY =====
function moveSidebarToBody() {
  const wrapper = document.querySelector('.sidebar-elements');
  if (!wrapper) return;

  const sidebar = wrapper.querySelector('.sidebar');
  if (sidebar) document.body.appendChild(sidebar);

  wrapper.remove();
}

// ===== INIT ON DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', () => {
  moveSidebarToBody();
  initSidebar();
});
